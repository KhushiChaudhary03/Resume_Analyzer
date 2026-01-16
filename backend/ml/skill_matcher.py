def extract_skills(text, skills):
    text = text.lower()
    return [skill for skill in skills if skill in text]
