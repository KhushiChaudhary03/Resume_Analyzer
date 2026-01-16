import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from ml.matcher import analyze_resume

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/analyze", methods=["POST"])
def analyze():
    if "resume" not in request.files:
        return jsonify({"error": "Resume file missing"}), 400

    resume_file = request.files["resume"]
    jd_text = request.form.get("jd")

    if not jd_text:
        return jsonify({"error": "Job description missing"}), 400

    # Save resume PDF
    resume_path = os.path.join(app.config["UPLOAD_FOLDER"], resume_file.filename)
    resume_file.save(resume_path)

    # Analyze resume
    result = analyze_resume(resume_path, jd_text)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
