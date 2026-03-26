from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id             = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name           = db.Column(db.String(100), nullable=False)
    email          = db.Column(db.String(150), unique=True, nullable=False)
    password       = db.Column(db.String(256), nullable=False)
    created_at     = db.Column(db.DateTime, default=datetime.utcnow)
    analyses_count = db.Column(db.Integer, default=0)

    analyses = db.relationship(
        "Analysis", backref="user",
        lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id":              self.id,
            "name":            self.name,
            "email":           self.email,
            "analyses_count":  self.analyses_count,
            "created_at":      self.created_at.isoformat()
        }


class Analysis(db.Model):
    __tablename__ = "analyses"

    id                    = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id               = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    job_title             = db.Column(db.String(200), default="Untitled Position")
    filename              = db.Column(db.String(200))
    jd_text               = db.Column(db.Text)
    role                  = db.Column(db.String(50))
    strength              = db.Column(db.String(50))
    ats_score             = db.Column(db.Float, default=0)
    skill_match_score     = db.Column(db.Float, default=0)
    text_similarity_score = db.Column(db.Float, default=0)
    matched_skills        = db.Column(db.Text)
    missing_skills        = db.Column(db.Text)
    improvement_tips      = db.Column(db.Text)
    created_at            = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id":        self.id,
            "user_id":   self.user_id,
            "job_title": self.job_title,
            "filename":  self.filename,
            "jd_text":   self.jd_text,
            "created_at": self.created_at.isoformat(),
            "result": {
                "role":                   self.role,
                "strength":               self.strength,
                "ats_score":              self.ats_score,
                "skill_match_score":      self.skill_match_score,
                "text_similarity_score":  self.text_similarity_score,
                "matched_skills":         json.loads(self.matched_skills or "[]"),
                "missing_skills":         json.loads(self.missing_skills or "[]"),
                "improvement_tips":       json.loads(self.improvement_tips or "[]"),
            }
        }

    def to_summary(self):
        return {
            "id":               self.id,
            "job_title":        self.job_title,
            "filename":         self.filename,
            "jd_snippet":       (self.jd_text or "")[:120],
            "role":             self.role,
            "ats_score":        self.ats_score,
            "skill_match_score": self.skill_match_score,
            "created_at":       self.created_at.isoformat()
        }