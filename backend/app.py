import os
import re
import json
import uuid
import hashlib
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from functools import wraps
from dotenv import load_dotenv
from models import db, User, Analysis
from ml.matcher import analyze_resume

load_dotenv()

# ── App setup ──────────────────────────────────────────────────────

app = Flask(__name__)
CORS(
    app,
    origins=[
        "http://localhost:5173",
        "https://resume-analyzer-five-steel.vercel.app/"
    ]
)

app.config["SECRET_KEY"]                     = os.getenv("SECRET_KEY", "fallback-secret")
app.config["SQLALCHEMY_DATABASE_URI"]        = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"]                  = "uploads"

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

db.init_app(app)

with app.app_context():
    db.create_all()
    print("✅ Database tables ready")

# ── Helpers ────────────────────────────────────────────────────────

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

active_tokens = {}

def generate_token(user_id):
    token = str(uuid.uuid4())
    active_tokens[token] = {
        "user_id": user_id,
        "expires": (datetime.utcnow() + timedelta(days=7)).isoformat()
    }
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token or token not in active_tokens:
            return jsonify({"error": "Unauthorized"}), 401
        data = active_tokens[token]
        if datetime.fromisoformat(data["expires"]) < datetime.utcnow():
            del active_tokens[token]
            return jsonify({"error": "Token expired"}), 401
        g.user_id = data["user_id"]
        return f(*args, **kwargs)
    return decorated

# ── Auth routes ────────────────────────────────────────────────────

@app.route("/api/register", methods=["POST"])
def register():
    data     = request.get_json()
    name     = data.get("name", "").strip()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400
    if len(name.strip()) < 2:
        return jsonify({"error": "Name must be at least 2 characters"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Please enter a valid email address"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    if len(password) > 128:
        return jsonify({"error": "Password is too long"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(name=name, email=email, password=hash_password(password))
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id)
    return jsonify({"token": token, "user": user.to_dict()}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data     = request.get_json()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Please enter a valid email address"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or user.password != hash_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user.id)
    return jsonify({"token": token, "user": user.to_dict()})


@app.route("/api/logout", methods=["POST"])
@token_required
def logout():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if token in active_tokens:
        del active_tokens[token]
    return jsonify({"message": "Logged out"})


@app.route("/api/me", methods=["GET"])
@token_required
def me():
    user = User.query.get(g.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())


# ── Analysis route ─────────────────────────────────────────────────

@app.route("/api/analyze", methods=["POST"])
@token_required
def analyze():
    if "resume" not in request.files:
        return jsonify({"error": "Resume file missing"}), 400

    resume_file = request.files["resume"]
    jd_text     = request.form.get("jd", "").strip()
    job_title   = request.form.get("job_title", "").strip()

    # Validations
    if not resume_file.filename.endswith(".pdf"):
        return jsonify({"error": "Only PDF files are accepted"}), 400
    if len(jd_text) < 50:
        return jsonify({"error": "Job description is too short"}), 400
    if not jd_text:
        return jsonify({"error": "Job description is required"}), 400
    if not job_title:
        return jsonify({"error": "Position title is required"}), 400

    resume_path = os.path.join(
        app.config["UPLOAD_FOLDER"],
        f"{uuid.uuid4()}_{resume_file.filename}"
    )
    resume_file.save(resume_path)

    # Check file size — max 5MB
    if os.path.getsize(resume_path) > 5 * 1024 * 1024:
        os.remove(resume_path)
        return jsonify({"error": "File size must be under 5MB"}), 400

    try:
        result = analyze_resume(resume_path, jd_text)
    except Exception as e:
        os.remove(resume_path)
        return jsonify({"error": str(e)}), 500

    analysis = Analysis(
        user_id               = g.user_id,
        job_title             = job_title or "Untitled Position",
        filename              = resume_file.filename,
        jd_text               = jd_text,
        role                  = result.get("role"),
        strength              = result.get("strength"),
        ats_score             = result.get("ats_score", 0),
        skill_match_score     = result.get("skill_match_score", 0),
        text_similarity_score = result.get("text_similarity_score", 0),
        matched_skills        = json.dumps(result.get("matched_skills", [])),
        missing_skills        = json.dumps(result.get("missing_skills", [])),
        improvement_tips      = json.dumps(result.get("improvement_tips", [])),
    )
    db.session.add(analysis)

    user = User.query.get(g.user_id)
    user.analyses_count += 1
    db.session.commit()

    os.remove(resume_path)
    return jsonify({**result, "history_id": analysis.id})


# ── Stats route ────────────────────────────────────────────────────

@app.route("/api/stats", methods=["GET"])
@token_required
def get_stats():
    analyses = Analysis.query.filter_by(user_id=g.user_id).all()

    if not analyses:
        return jsonify({
            "total_analyses":      0,
            "average_ats_score":   0,
            "best_ats_score":      0,
            "most_common_role":    "N/A",
            "average_skill_match": 0,
        })

    scores       = [a.ats_score for a in analyses]
    skill_scores = [a.skill_match_score for a in analyses]
    roles        = [a.role for a in analyses if a.role]
    most_common  = max(set(roles), key=roles.count) if roles else "N/A"

    role_labels = {
        "general": "General", "backend": "Backend",
        "frontend": "Frontend", "data_science": "Data Science", "devops": "DevOps"
    }

    return jsonify({
        "total_analyses":      len(analyses),
        "average_ats_score":   round(sum(scores) / len(scores), 1),
        "best_ats_score":      round(max(scores), 1),
        "most_common_role":    role_labels.get(most_common, most_common),
        "average_skill_match": round(sum(skill_scores) / len(skill_scores), 1),
    })


# ── History routes ─────────────────────────────────────────────────

@app.route("/api/history", methods=["GET"])
@token_required
def get_history():
    analyses = (
        Analysis.query
        .filter_by(user_id=g.user_id)
        .order_by(Analysis.created_at.desc())
        .limit(20)
        .all()
    )
    return jsonify([a.to_summary() for a in analyses])


@app.route("/api/history/<entry_id>", methods=["GET"])
@token_required
def get_history_entry(entry_id):
    analysis = Analysis.query.filter_by(id=entry_id, user_id=g.user_id).first()
    if not analysis:
        return jsonify({"error": "Not found"}), 404
    return jsonify(analysis.to_dict())


@app.route("/api/history/<entry_id>", methods=["DELETE"])
@token_required
def delete_history_entry(entry_id):
    analysis = Analysis.query.filter_by(id=entry_id, user_id=g.user_id).first()
    if not analysis:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(analysis)
    db.session.commit()
    return jsonify({"message": "Deleted"})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
