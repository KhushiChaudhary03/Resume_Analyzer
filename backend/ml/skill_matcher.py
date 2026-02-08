import re


def _skill_variants(skill, aliases):
    variants = [skill] + aliases
    normalized = []
    for v in variants:
        v = v.strip().lower()
        if v:
            normalized.append(v)
    return list(dict.fromkeys(normalized))


def _compile_skill_patterns(skill_aliases):
    patterns = {}
    for skill, aliases in skill_aliases.items():
        for variant in _skill_variants(skill, aliases):
            tokens = re.split(r"\s+", variant)
            if len(tokens) == 1:
                token = tokens[0]
                escaped = re.escape(token)
                if re.search(r"[^a-z0-9]", token):
                    pattern = r"(?<![a-z0-9])" + escaped + r"(?![a-z0-9])"
                else:
                    pattern = r"\b" + escaped + r"\b"
            else:
                # Allow flexible separators for multi-word skills (space, hyphen, slash)
                joined = r"[\s\-/\.]+".join(map(re.escape, tokens))
                pattern = r"(?<![a-z0-9])" + joined + r"(?![a-z0-9])"
            patterns.setdefault(skill, []).append(re.compile(pattern))
    return patterns


def extract_skills(text, skill_aliases):
    text = text.lower()
    patterns = _compile_skill_patterns(skill_aliases)
    matched = []
    for skill, pattern_list in patterns.items():
        for pattern in pattern_list:
            if pattern.search(text):
                matched.append(skill)
                break
    return matched
