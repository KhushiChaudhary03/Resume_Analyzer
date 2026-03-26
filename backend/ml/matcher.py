import re
import pdfplumber
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ── Skill Packs ─────────────────────────────────────────────

SKILL_PACKS = {
    "ml_engineer": [
        "python", "scikit-learn", "tensorflow", "pytorch", "keras",
        "machine learning", "deep learning", "nlp", "computer vision",
        "model deployment", "mlops", "docker", "kubernetes",
        "aws", "gcp", "feature engineering", "api", "flask", "fastapi"
    ],
    "data_science": [
        "python", "r", "sql", "pandas", "numpy",
        "statistics", "data analysis", "data visualization",
        "matplotlib", "seaborn", "plotly", "tableau",
        "power bi", "hypothesis testing", "regression",
        "classification", "clustering", "time series"
    ],
    "backend": [
        "python", "java", "node.js", "express", "django", "flask", "fastapi",
        "spring", "sql", "postgresql", "mysql", "mongodb",
        "rest api", "graphql", "microservices",
        "docker", "kubernetes", "aws", "git"
    ],
    "frontend": [
        "javascript", "typescript", "react", "vue", "angular",
        "html", "css", "tailwind", "bootstrap",
        "redux", "next.js", "webpack", "vite",
        "responsive design", "figma", "git"
    ],
    "devops": [
        "docker", "kubernetes", "terraform", "ansible",
        "aws", "azure", "gcp", "ci/cd", "jenkins",
        "github actions", "linux", "bash",
        "monitoring", "prometheus", "grafana"
    ],
    "general": [
        "python", "java", "javascript", "c++", "sql",
        "git", "communication", "teamwork"
    ]
}

# ── Role Keywords ───────────────────────────────────────────

ROLE_KEYWORDS = {
    "ml_engineer": [
        "machine learning engineer", "ml engineer", "ai engineer"
    ],
    "data_science": [
        "data scientist", "data analyst", "data science"
    ],
    "backend": [
        "backend", "server-side", "api developer"
    ],
    "frontend": [
        "frontend", "ui developer", "react developer"
    ],
    "devops": [
        "devops", "sre", "cloud engineer", "infrastructure"
    ]
}

# ── Extract Text ─────────────────────────────────────────────

def extract_text(pdf_path: str) -> str:
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
    return text.lower()



def detect_role(jd_text: str) -> str:
    jd_lower = jd_text.lower()

    
    if re.search(r'\b(machine learning engineer|ml engineer|ai engineer)\b', jd_lower):
        return "ml_engineer"

    if re.search(r'\b(data scientist|data analyst|data science)\b', jd_lower):
        return "data_science"

    if re.search(r'\b(frontend|react developer|ui developer)\b', jd_lower):
        return "frontend"

    if re.search(r'\b(backend|server-side|api developer)\b', jd_lower):
        return "backend"

    if re.search(r'\b(devops|sre|cloud engineer)\b', jd_lower):
        return "devops"

   
    role_scores = {}

    for role in SKILL_PACKS.keys():
        score = 0

        # Skill matching
        for skill in SKILL_PACKS[role]:
            if re.search(r'\b' + re.escape(skill) + r'\b', jd_lower):
                score += 2   # STRONG weight

        # Special signals
        if role == "ml_engineer":
            if "machine learning" in jd_lower:
                score += 6
            if "deployment" in jd_lower or "mlops" in jd_lower:
                score += 4

        if role == "data_science":
            if "statistics" in jd_lower or "analysis" in jd_lower:
                score += 5
            if "visualization" in jd_lower:
                score += 3

        role_scores[role] = score

    print("ROLE SCORES:", role_scores)

    best_role = max(role_scores, key=role_scores.get)

    
    if role_scores[best_role] < 5:
        if "machine learning" in jd_lower:
            return "ml_engineer"
        if "data" in jd_lower:
            return "data_science"
        return "general"

    return best_role
    jd_lower = jd_text.lower()
    role_scores = {}

    for role in SKILL_PACKS.keys():
        score = 0

        # 1. Strong keyword match
        for kw in ROLE_KEYWORDS.get(role, []):
            if kw in jd_lower:
                score += 6
        for skill in SKILL_PACKS[role]:
            if re.search(r'\b' + re.escape(skill) + r'\b', jd_lower):
                score += 1

        # 3. Special intelligence (ML vs DS)
        if role == "ml_engineer":
            if "machine learning" in jd_lower:
                score += 5
            if "deployment" in jd_lower or "mlops" in jd_lower:
                score += 4

        if role == "data_science":
            if "statistics" in jd_lower or "analysis" in jd_lower:
                score += 4
            if "visualization" in jd_lower:
                score += 3

        role_scores[role] = score

    
    if role_scores[best_role] < 2:
        if "machine learning" in jd_lower:
            return "ml_engineer"
        return "general"

    return best_role

# ── Skill Extraction ─────────────────────────────────────────

def extract_skills(text: str, skill_list: list) -> list:
    found = []
    for skill in skill_list:
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
            found.append(skill)
    return found

# ── Text Similarity ──────────────────────────────────────────

def compute_text_similarity(resume_text: str, jd_text: str) -> float:
    def clean(text):
        text = re.sub(r'[^\w\s]', ' ', text.lower())
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    resume_clean = clean(resume_text)
    jd_clean = clean(jd_text)

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        sublinear_tf=True
    )

    try:
        tfidf = vectorizer.fit_transform([resume_clean, jd_clean])
        cosine = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]

        resume_words = set(resume_clean.split())
        jd_words = set(jd_clean.split())
        overlap = len(resume_words & jd_words) / max(len(jd_words), 1)

        return round((cosine * 0.6 + overlap * 0.4) * 100, 1)

    except:
        return 0.0

# ── ATS Score ───────────────────────────────────────────────

def compute_ats_score(resume_text, jd_text, skill_match_pct, similarity):
    jd_words = set(re.findall(r'\b\w{4,}\b', jd_text.lower()))
    resume_words = set(re.findall(r'\b\w{4,}\b', resume_text.lower()))

    keyword_overlap = len(jd_words & resume_words) / max(len(jd_words), 1) * 100

    formatting_score = 100
    if len(resume_text) < 300:
        formatting_score -= 20
    if len(resume_text) > 8000:
        formatting_score -= 10

    sections = ["experience", "education", "skills", "projects"]
    section_hits = sum(1 for s in sections if s in resume_text.lower())
    section_score = min(section_hits / 4 * 100, 100)

    ats = (
        skill_match_pct * 0.45 +
        similarity * 0.25 +
        keyword_overlap * 0.20 +
        section_score * 0.10
    )

    return round(min(ats, 100), 1)

# ── Tips ────────────────────────────────────────────────────

def get_improvement_tips(missing_skills, role, ats_score):
    tips = []

    if ats_score < 40:
        tips.append("Low ATS score — add more JD keywords.")

    if ats_score < 60:
        tips.append("Add a strong Skills section.")

    if missing_skills:
        tips.append(f"Add: {', '.join(missing_skills[:3])}")

    tips.append("Use action verbs (Built, Designed, Optimized).")
    tips.append("Add measurable impact (e.g., improved by 30%).")

    return tips[:5]

# ── MAIN ───────────────────────────────────────────────────

def analyze_resume(resume_path: str, jd_text: str) -> dict:
    resume_text = extract_text(resume_path)

    role = detect_role(jd_text)
    skill_pack = SKILL_PACKS[role]

    matched_skills = extract_skills(resume_text, skill_pack)

    # Only show JD-relevant missing skills
    missing_skills = [
        s for s in skill_pack
        if s not in matched_skills and
        re.search(r'\b' + re.escape(s) + r'\b', jd_text, re.IGNORECASE)
    ]

    skill_match_pct = round(len(matched_skills) / len(skill_pack) * 100, 1)

    similarity = compute_text_similarity(resume_text, jd_text)

    ats_score = compute_ats_score(
        resume_text, jd_text, skill_match_pct, similarity
    )

    tips = get_improvement_tips(missing_skills, role, ats_score)

    if ats_score >= 75:
        strength = "Strong Match"
    elif ats_score >= 50:
        strength = "Moderate Match"
    elif ats_score >= 30:
        strength = "Weak Match"
    else:
        strength = "Poor Match"

    return {
        "role": role,
        "strength": strength,
        "text_similarity_score": similarity,
        "skill_match_score": skill_match_pct,
        "ats_score": ats_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "improvement_tips": tips
    }