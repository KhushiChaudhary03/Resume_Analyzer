SKILL_ALIASES = {
    "python": ["py"],
    "javascript": ["js", "ecmascript"],
    "typescript": ["ts"],
    "java": [],
    "c++": ["cpp", "c plus plus"],
    "c#": ["csharp", "c sharp"],
    "go": ["golang"],
    "sql": ["postgresql", "mysql", "sqlite", "t-sql", "pl/sql"],
    "react": ["react.js", "reactjs"],
    "node.js": ["node", "nodejs", "node js"],
    "express": ["express.js", "expressjs"],
    "django": [],
    "flask": [],
    "fastapi": [],
    "spring": ["spring boot", "springboot"],
    "aws": ["amazon web services"],
    "azure": ["microsoft azure"],
    "gcp": ["google cloud", "google cloud platform"],
    "docker": [],
    "kubernetes": ["k8s"],
    "git": ["github", "gitlab", "bitbucket"],
    "linux": [],
    "machine learning": ["ml", "ai", "artificial intelligence"],
    "data science": ["data analyst", "data analytics"],
    "nlp": ["natural language processing"],
    "computer vision": ["cv"],
    "pandas": [],
    "numpy": [],
    "scikit-learn": ["sklearn"],
    "tensorflow": ["tf"],
    "pytorch": ["torch"],
    "rest api": ["rest", "restful api", "restful"],
    "graphql": [],
    "ci/cd": [
        "cicd",
        "ci cd",
        "ci-cd",
        "continuous integration",
        "continuous delivery",
    ],
    "agile": ["scrum", "kanban"],
}

ROLE_SKILL_PACKS = {
    "general": [
        "python", "javascript", "typescript", "java", "c++", "c#", "go", "sql",
        "react", "node.js", "django", "flask", "fastapi", "spring",
        "aws", "azure", "gcp", "docker", "kubernetes", "git", "linux",
        "rest api", "graphql", "ci/cd", "agile",
    ],
    "backend": [
        "python", "java", "go", "c#", "sql", "node.js", "express",
        "django", "flask", "fastapi", "spring",
        "aws", "azure", "gcp", "docker", "kubernetes",
        "rest api", "graphql", "ci/cd", "linux", "git",
    ],
    "frontend": [
        "javascript", "typescript", "react", "graphql",
        "rest api", "ci/cd", "git", "agile",
    ],
    "data_science": [
        "python", "sql", "machine learning", "data science",
        "nlp", "computer vision", "pandas", "numpy",
        "scikit-learn", "tensorflow", "pytorch",
        "aws", "gcp", "docker", "git", "linux",
    ],
    "devops": [
        "aws", "azure", "gcp", "docker", "kubernetes",
        "ci/cd", "linux", "git", "python", "go",
    ],
}

ROLE_KEYWORDS = {
    "backend": ["backend", "back-end", "api", "microservices", "server-side"],
    "frontend": ["frontend", "front-end", "ui", "ux", "web", "spa"],
    "data_science": [
        "data scientist", "data science", "machine learning", "ml",
        "ai", "analytics", "nlp", "computer vision",
    ],
    "devops": ["devops", "site reliability", "sre", "infrastructure"],
}


def detect_role(text):
    lowered = text.lower()
    for role, keywords in ROLE_KEYWORDS.items():
        for kw in keywords:
            if kw in lowered:
                return role
    return "general"


def get_skill_aliases_for_role(role):
    pack = ROLE_SKILL_PACKS.get(role, ROLE_SKILL_PACKS["general"])
    return {skill: SKILL_ALIASES.get(skill, []) for skill in pack}
