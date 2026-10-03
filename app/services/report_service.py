"""Generate a clean PDF analysis report using ReportLab."""
import json
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

PRIMARY = colors.HexColor("#6366f1")
ACCENT = colors.HexColor("#8b5cf6")
LIGHT_BG = colors.HexColor("#f0f0ff")
DARK = colors.HexColor("#1e1b4b")
GREEN = colors.HexColor("#10b981")
RED = colors.HexColor("#ef4444")
AMBER = colors.HexColor("#f59e0b")
GRAY = colors.HexColor("#6b7280")


def _score_color(score: int):
    if score >= 75:
        return GREEN
    if score >= 50:
        return AMBER
    return RED


def generate_report(
    resume_filename: str,
    target_role: str,
    analysis_json: str,
    created_at: datetime,
) -> bytes:
    data = json.loads(analysis_json)
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4,
        rightMargin=2 * cm, leftMargin=2 * cm,
        topMargin=2 * cm, bottomMargin=2 * cm,
        title="Resume Analysis Report",
    )

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("H1", fontSize=20, textColor=PRIMARY, spaceAfter=6,
                         fontName="Helvetica-Bold", alignment=TA_CENTER)
    h2 = ParagraphStyle("H2", fontSize=13, textColor=DARK, spaceAfter=4,
                         fontName="Helvetica-Bold", spaceBefore=12)
    body = ParagraphStyle("Body", fontSize=10, textColor=colors.black,
                           spaceAfter=3, leading=14)
    small = ParagraphStyle("Small", fontSize=9, textColor=GRAY, spaceAfter=2)
    bullet_style = ParagraphStyle("Bullet", fontSize=10, textColor=colors.black,
                                   spaceAfter=2, leftIndent=12, leading=14,
                                   bulletIndent=4)

    story = []

    # Header
    story.append(Paragraph("ResumeAI — Analysis Report", h1))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY))
    story.append(Spacer(1, 0.3 * cm))

    meta = [
        ["Resume:", resume_filename],
        ["Target Role:", target_role],
        ["Generated:", created_at.strftime("%B %d, %Y at %H:%M UTC")],
    ]
    t = Table(meta, colWidths=[4 * cm, 13 * cm])
    t.setStyle(TableStyle([
        ("FONT", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TEXTCOLOR", (0, 0), (0, -1), DARK),
        ("TEXTCOLOR", (1, 0), (1, -1), colors.black),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.5 * cm))

    # Score overview
    story.append(Paragraph("Score Overview", h2))
    scores_data = [
        ["Metric", "Score", "Rating"],
        ["Overall Score", f"{data.get('overall_score', 0)}/100",
         "Good" if data.get('overall_score', 0) >= 75 else "Average" if data.get('overall_score', 0) >= 50 else "Needs Work"],
        ["ATS Compatibility", f"{data.get('ats_score', 0)}/100",
         "Good" if data.get('ats_score', 0) >= 75 else "Average" if data.get('ats_score', 0) >= 50 else "Needs Work"],
        ["Skill Match", f"{data.get('skill_match', 0)}/100",
         "Good" if data.get('skill_match', 0) >= 75 else "Average" if data.get('skill_match', 0) >= 50 else "Needs Work"],
    ]
    st = Table(scores_data, colWidths=[7 * cm, 4 * cm, 6 * cm])
    st.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONT", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT_BG, colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ("ALIGN", (1, 0), (1, -1), "CENTER"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(st)
    story.append(Spacer(1, 0.3 * cm))

    # Summary
    if data.get("summary"):
        story.append(Paragraph("AI Analysis Summary", h2))
        story.append(Paragraph(data["summary"], body))

    def _list_section(title, items, color=colors.black):
        if not items:
            return
        story.append(Paragraph(title, h2))
        for item in items:
            story.append(Paragraph(f"• {item}", bullet_style))

    _list_section("Strengths", data.get("strengths", []))
    _list_section("Weaknesses / Areas to Improve", data.get("weaknesses", []))

    # Skills
    story.append(Paragraph("Skills Analysis", h2))
    skills_table_data = [["Skills Present", "Missing Skills"]]
    present = data.get("skills_present", [])
    missing = data.get("skills_missing", [])
    max_rows = max(len(present), len(missing))
    for i in range(max_rows):
        skills_table_data.append([
            present[i] if i < len(present) else "",
            missing[i] if i < len(missing) else "",
        ])
    skills_t = Table(skills_table_data, colWidths=[8 * cm, 9 * cm])
    skills_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONT", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT_BG, colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(skills_t)

    # Section scores
    ss = data.get("section_scores", {})
    if ss:
        story.append(Paragraph("Section-by-Section Scores", h2))
        ss_data = [["Section", "Score"]]
        for k, v in ss.items():
            ss_data.append([k.capitalize(), f"{v}/100"])
        ss_t = Table(ss_data, colWidths=[9 * cm, 8 * cm])
        ss_t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONT", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT_BG, colors.white]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ("ALIGN", (1, 0), (1, -1), "CENTER"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(ss_t)

    _list_section("🔴 High Priority Actions", data.get("high_priority_actions", []))
    _list_section("🟡 Medium Priority Actions", data.get("medium_priority_actions", []))
    _list_section("🟢 Low Priority Actions", data.get("low_priority_actions", []))

    # Footer
    story.append(Spacer(1, 0.5 * cm))
    story.append(HRFlowable(width="100%", thickness=1, color=GRAY))
    story.append(Paragraph(
        "Generated by ResumeAI — AI Resume Analyzer & Career Assistant",
        ParagraphStyle("Footer", fontSize=8, textColor=GRAY, alignment=TA_CENTER),
    ))

    doc.build(story)
    return buf.getvalue()
