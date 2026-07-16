SPECIALTY_KEYWORDS: dict[str, list[str]] = {
    "general-surgery": ["surgery", "operation", "appendix", "hernia", "gallbladder"],
    "dietitian": ["diet", "nutrition", "weight", "calorie", "meal", "obesity"],
    "dentist": ["tooth", "teeth", "gum", "dental", "cavity", "root canal", "jaw"],
    "physiotherapy": ["physio", "rehab", "stretch", "mobility", "muscle", "back pain"],
    "neurosurgeon": ["brain", "spine", "spinal", "neurolog", "seizure", "herniated disc"],
    "cardiologist": ["heart", "chest pain", "blood pressure", "cholesterol", "palpitation"],
    "dermatologist": ["skin", "rash", "acne", "eczema", "psoriasis", "mole", "hair loss"],
    "pediatrician": ["child", "baby", "infant", "kid", "vaccination", "pediatric"],
    "psychiatrist": ["anxiety", "depression", "panic", "mental", "stress", "insomnia"],
    "orthopedics": ["bone", "joint", "fracture", "sprain", "arthritis", "knee", "hip"],
    "ent": ["ear", "nose", "throat", "sinus", "tonsil", "hearing"],
    "gynecologist": ["period", "pcos", "pregnan", "ovary", "uterus", "menstrual", "hormonal"],
}


def detect_best_specialty(message: str, current_specialty: str | None) -> str:
    text = message.lower()
    requested = (current_specialty or "").strip().lower()

    scores: dict[str, int] = {specialty: 0 for specialty in SPECIALTY_KEYWORDS}

    for specialty, keywords in SPECIALTY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text:
                scores[specialty] += 1

    best_specialty = max(scores, key=scores.get)
    best_score = scores[best_specialty]

    if best_score == 0:
        return requested or "general-surgery"

    if requested and scores.get(requested, 0) >= best_score:
        return requested

    return best_specialty
