import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .pdf_reader import extract_text_from_pdf
from .skills import detect_role, get_skill_aliases_for_role
from .skill_matcher import extract_skills


ALIAS_MAP = {
    "js": "javascript",
    "react.js": "react",
    "ml": "machine learning",
    "ai": "machine learning",
}


def _apply_aliases(text):
    lowered = text.lower()
    for alias, canonical in ALIAS_MAP.items():
        pattern = r"\b" + re.escape(alias) + r"\b"
        lowered = re.sub(pattern, canonical, lowered)
    return lowered


def clean_text(text):
    text = _apply_aliases(text)
    text = re.sub(r"[^a-zA-Z ]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def clean_text_for_skills(text):
    text = _apply_aliases(text)
    text = text.lower()
    # Keep characters used in common skill names (c++, c#, node.js, ci/cd)
    text = re.sub(r"[^a-z0-9\s\+\#\./-]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def analyze_resume(resume_path, jd_text):
    # Extract resume text
    resume_text = extract_text_from_pdf(resume_path)

    # Clean texts
    resume_text_clean = clean_text(resume_text)
    jd_text_clean = clean_text(jd_text)
    resume_text_skills = clean_text_for_skills(resume_text)
    jd_text_skills = clean_text_for_skills(jd_text)

    #  Text Similarity (TF-IDF + Cosine)
    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        sublinear_tf=True,
    )
    vectors = vectorizer.fit_transform([resume_text_clean, jd_text_clean])
    text_similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    text_similarity_score = round(text_similarity * 100, 2)

    #  Skill Extraction
    role = detect_role(jd_text_skills)
    role_skill_aliases = get_skill_aliases_for_role(role)
    resume_skills = extract_skills(resume_text_skills, role_skill_aliases)
    jd_skills = extract_skills(jd_text_skills, role_skill_aliases)

    matched_skills = list(set(resume_skills) & set(jd_skills))
    missing_skills = list(set(jd_skills) - set(resume_skills))

    # Skill Match Score (F1-style balance of precision and recall)
    if len(jd_skills) == 0:
        skill_match_score = 0
    else:
        recall = len(matched_skills) / len(jd_skills)
        precision = (
            len(matched_skills) / len(resume_skills) if resume_skills else 0
        )
        if precision + recall == 0:
            skill_match_score = 0
        else:
            f1 = 2 * precision * recall / (precision + recall)
            skill_match_score = round(f1 * 100, 2)

    # ATS Score (Weighted)
    if len(jd_skills) >= 6:
        skill_weight = 0.7
    else:
        skill_weight = 0.6
    ats_score = round(
        skill_weight * skill_match_score
        + (1 - skill_weight) * text_similarity_score,
        2,
    )

    return {
        "role": role,
        "text_similarity_score": text_similarity_score,
        "skill_match_score": skill_match_score,
        "ats_score": ats_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }
