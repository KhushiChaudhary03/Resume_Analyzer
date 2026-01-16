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

    # 🔹 CLEAN BOTH TEXTS
    resume_text = clean_text(resume_text)
    jd_text = clean_text(jd_text)

    # TF-IDF + Cosine Similarity
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([resume_text, jd_text])
    score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

    # Skill matching
    resume_skills = extract_skills(resume_text, SKILLS)
    jd_skills = extract_skills(jd_text, SKILLS)
    missing_skills = list(set(jd_skills) - set(resume_skills))
    # Skill-based score 
    matched_jd_skills = list(set(resume_skills).intersection(set(jd_skills)))

    if len(jd_skills) == 0:
        skill_score = 0
    else:
        skill_score = round((len(matched_jd_skills) / len(jd_skills)) * 100, 2)



    return {
    "text_similarity_score": round(score * 100, 2),
    "skill_match_score": skill_score,
    "matched_skills": matched_jd_skills,
    "missing_skills": list(set(jd_skills) - set(matched_jd_skills))
}


