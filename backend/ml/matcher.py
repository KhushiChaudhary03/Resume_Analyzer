import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .pdf_reader import extract_text_from_pdf
from .skills import SKILLS
from .skill_matcher import extract_skills


def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z ]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def analyze_resume(resume_path, jd_text):
    # Extract resume text
    resume_text = extract_text_from_pdf(resume_path)

    # Clean texts
    resume_text = clean_text(resume_text)
    jd_text = clean_text(jd_text)

    #  Text Similarity (TF-IDF + Cosine)
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([resume_text, jd_text])
    text_similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    text_similarity_score = round(text_similarity * 100, 2)

    #  Skill Extraction
    resume_skills = extract_skills(resume_text, SKILLS)
    jd_skills = extract_skills(jd_text, SKILLS)

    matched_skills = list(set(resume_skills) & set(jd_skills))
    missing_skills = list(set(jd_skills) - set(resume_skills))

    # Skill Match Score
    if len(jd_skills) == 0:
        skill_match_score = 0
    else:
        skill_match_score = round(
            (len(matched_skills) / len(jd_skills)) * 100, 2
        )

    # ATS Score (Weighted)
    ats_score = round(
        0.6 * skill_match_score + 0.4 * text_similarity_score, 2
    )

    return {
        "text_similarity_score": text_similarity_score,
        "skill_match_score": skill_match_score,
        "ats_score": ats_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }
