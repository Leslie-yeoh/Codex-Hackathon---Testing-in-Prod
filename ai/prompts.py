SYSTEM_PROMPT = """You are an expert medical scribe specializing in deciphering physician handwriting. You have extensive training in:
- Medical terminology, abbreviations, and pharmacology
- Common prescription formats and clinical note structures
- Deciphering illegible handwriting through context clues

Your task: Analyze handwritten medical images and extract text, then convert to clear, natural medical language.

Guidelines:
1. Preserve ALL medical information: drug names, dosages, frequencies, routes, durations
2. Expand standard medical abbreviations (e.g., "bid" → "twice daily", "qid" → "four times daily")
3. Format as professional medical notes with proper structure
4. Flag uncertain readings with [uncertain: "original text"] notation
5. Maintain clinical accuracy over readability when in doubt"""

USER_PROMPT_TEMPLATE = """Analyze this handwritten medical image. Extract all text and convert to clear medical notes.

Required output format:
**Patient Information:** [if present]
**Diagnosis/Assessment:** [clinical findings]
**Medications:** [list each with: drug, dose, route, frequency, duration]
**Instructions:** [patient counseling points]
**Follow-up:** [return visits, labs, referrals]
**Raw Transcription:** [verbatim text for reference]

Be thorough. Preserve exact dosages (mg, mL, units), frequencies (daily, BID, TID, QID, PRN), and durations."""

MEDICAL_ABBREVIATIONS = {
    "qd": "daily",
    "q.d.": "daily",
    "bid": "twice daily",
    "b.i.d.": "twice daily",
    "tid": "three times daily",
    "t.i.d.": "three times daily",
    "qid": "four times daily",
    "q.i.d.": "four times daily",
    "prn": "as needed",
    "p.r.n.": "as needed",
    "qhs": "at bedtime",
    "q.h.s.": "at bedtime",
    "ac": "before meals",
    "a.c.": "before meals",
    "pc": "after meals",
    "p.c.": "after meals",
    "po": "by mouth",
    "p.o.": "by mouth",
    "iv": "intravenous",
    "i.v.": "intravenous",
    "im": "intramuscular",
    "i.m.": "intramuscular",
    "sq": "subcutaneous",
    "s.c.": "subcutaneous",
    "sl": "sublingual",
    "top": "topical",
    "mg": "milligrams",
    "ml": "milliliters",
    "mcg": "micrograms",
    "gm": "grams",
    "tab": "tablet",
    "cap": "capsule",
    "susp": "suspension",
    "sol": "solution",
    "oint": "ointment",
    "cr": "cream",
    "disp": "dispense",
    "sig": "directions",
    "ref": "refills",
    "nr": "no refills",
    "daw": "dispense as written",
    "dx": "diagnosis",
    "hx": "history",
    "sx": "symptoms",
    "tx": "treatment",
    "rx": "prescription",
    "pt": "patient",
    "wk": "week",
    "mo": "month",
    "da": "days",
    "stat": "immediately",
    "asap": "as soon as possible",
}

PRESCRIPTION_EXAMPLES = [
    {
        "raw": "Amoxicillin 500mg 1 tab po tid x 10d",
        "formatted": "Amoxicillin 500 mg: Take 1 tablet by mouth three times daily for 10 days",
    },
    {
        "raw": "Lisinopril 10mg daily",
        "formatted": "Lisinopril 10 mg: Take 1 tablet by mouth once daily",
    },
    {
        "raw": "Prednisone 20mg taper: 40/30/20/10/5",
        "formatted": "Prednisone taper: 40 mg daily x 3 days, then 30 mg daily x 3 days, then 20 mg daily x 3 days, then 10 mg daily x 3 days, then 5 mg daily x 3 days",
    },
]