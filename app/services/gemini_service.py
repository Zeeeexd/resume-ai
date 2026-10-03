"""
Gemini AI service — handles resume analysis, bullet rewrites, and skill gap analysis.
Falls back to demo data when GEMINI_API_KEY is not set or DEMO_MODE is true.
"""
import json
import re
from typing import Optional
import google.generativeai as genai
from app.config import settings
from app.schemas.schemas import AnalysisResult
from app.services.demo_data import DEMO_ANALYSIS, DEMO_SKILL_GAP

# Configure Gemini if key is present
_gemini_configured = False
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    _gemini_configured = True


def _is_demo_mode() -> bool:
    return settings.DEMO_MODE or not _gemini_configured


def _call_gemini(prompt: str, temperature: float = 0.2) -> str:
    """Call Gemini and return the raw text response."""
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"temperature": temperature, "max_output_tokens": 4096},
    )
    response = model.generate_content(prompt)
    return response.text


def _extract_json(text: str) -> dict:
    """Extract the first valid JSON object from Gemini response."""
    # Remove markdown code fences
    text = re.sub(r"```(?:json)?", "", text).replace("```", "").strip()
    # Find the outermost { }
    start = text.find("{")
    end = text.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValueError("No JSON object found in response")
    return json.loads(text[start:end])


ANALYSIS_PROMPT = """You are an expert resume evaluator and career coach.

Analyze the provided resume against the target job role and optional job description.

STRICT RULES:
- Analyze ONLY information actually present in the resume.
- Do NOT fabricate work experience, education, certifications, skills, metrics, or achievements.
- If information is missing, explicitly state it is missing.
- When suggesting rewrites, preserve the factual meaning — do not add invented numbers or achievements.
- All scores must be integers between 0 and 100.

Return ONLY a single valid JSON object with EXACTLY this structure (no markdown, no extra text):

{{
  "overall_score": <int 0-100>,
  "ats_score": <int 0-100>,
  "skill_match": <int 0-100>,
  "summary": "<one paragraph summary>",
  "strengths": ["<strength>", ...],
  "weaknesses": ["<weakness>", ...],
  "skills_present": ["<skill>", ...],
  "skills_missing": ["<skill>", ...],
  "recommended_skills": ["<skill>", ...],
  "matching_keywords": ["<keyword>", ...],
  "missing_keywords": ["<keyword>", ...],
  "section_scores": {{
    "contact": <int>,
    "summary": <int>,
    "education": <int>,
    "experience": <int>,
    "projects": <int>,
    "skills": <int>,
    "certifications": <int>,
    "achievements": <int>
  }},
  "experience_feedback": ["<feedback>", ...],
  "project_feedback": ["<feedback>", ...],
  "formatting_feedback": ["<feedback>", ...],
  "grammar_feedback": ["<feedback>", ...],
  "high_priority_actions": ["<action>", ...],
  "medium_priority_actions": ["<action>", ...],
  "low_priority_actions": ["<action>", ...],
  "rewrites": [
    {{"original": "<original bullet>", "improved": "<improved bullet>"}},
    ...
  ]
}}

---
TARGET ROLE: {target_role}

JOB DESCRIPTION:
{job_description}

RESUME TEXT:
{resume_text}
"""

REWRITE_PROMPT = """You are a professional resume writer.

Rewrite the following resume bullet point to be stronger, more impactful, and ATS-friendly.

STRICT RULES:
- Do NOT fabricate metrics, achievements, numbers, or outcomes that are not in the original.
- Preserve the factual meaning of the original bullet.
- Use strong action verbs.
- Make it concise and specific.
- If the original has no metrics, do NOT add invented ones.

Context: {context}

Original bullet: {bullet}

Return ONLY a JSON object:
{{"original": "<original>", "improved": "<improved version>"}}
"""

SKILL_GAP_PROMPT = """You are an expert tech career coach.

Analyze the skill gap for someone targeting the role of: {target_role}

Job Description: {job_description}

Current skills from resume: {current_skills}

Return ONLY a JSON object:
{{
  "current_skills": ["<skill>", ...],
  "missing_skills": ["<skill>", ...],
  "recommended_skills": ["<skill — prioritized by impact>", ...],
  "skill_gap_percentage": <int 0-100>,
  "tips": ["<actionable tip>", ...]
}}
"""


def analyze_resume(
    resume_text: str,
    target_role: str,
    job_description: Optional[str] = None,
) -> dict:
    """Run full resume analysis. Returns raw dict (validated separately)."""
    if _is_demo_mode():
        return DEMO_ANALYSIS.copy()

    jd = job_description or f"Standard requirements for a {target_role} position."
    prompt = ANALYSIS_PROMPT.format(
        target_role=target_role,
        job_description=jd,
        resume_text=resume_text[:8000],  # cap to avoid token overflow
    )

    try:
        raw = _call_gemini(prompt)
        data = _extract_json(raw)
        # Validate with Pydantic
        AnalysisResult(**data)
        return data
    except Exception:
        # Retry once with a correction prompt
        try:
            correction = (
                f"The previous response was not valid JSON. "
                f"Return ONLY the JSON object with no extra text:\n\n{raw}"
            )
            raw2 = _call_gemini(correction)
            data2 = _extract_json(raw2)
            AnalysisResult(**data2)
            return data2
        except Exception:
            # Final fallback — return demo data with a flag
            demo = DEMO_ANALYSIS.copy()
            demo["_demo_fallback"] = True
            return demo


def rewrite_bullet(bullet: str, context: Optional[str] = None) -> dict:
    """Rewrite a single resume bullet point."""
    if _is_demo_mode():
        return {
            "original": bullet,
            "improved": (
                f"Delivered impactful results by {bullet.lower().rstrip('.')} "
                "— demonstrate impact by adding specifics when available."
            ),
        }

    ctx = context or "General professional resume"
    prompt = REWRITE_PROMPT.format(context=ctx, bullet=bullet)
    try:
        raw = _call_gemini(prompt)
        return _extract_json(raw)
    except Exception:
        return {"original": bullet, "improved": bullet}


def analyze_skill_gap(
    target_role: str,
    job_description: Optional[str] = None,
    current_skills: Optional[list] = None,
) -> dict:
    """Analyze skill gap for a target role."""
    if _is_demo_mode():
        return DEMO_SKILL_GAP.copy()

    jd = job_description or f"Standard requirements for a {target_role} position."
    skills_str = ", ".join(current_skills) if current_skills else "Not provided"
    prompt = SKILL_GAP_PROMPT.format(
        target_role=target_role,
        job_description=jd,
        current_skills=skills_str,
    )
    try:
        raw = _call_gemini(prompt)
        return _extract_json(raw)
    except Exception:
        return DEMO_SKILL_GAP.copy()
