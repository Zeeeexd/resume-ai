"""Realistic sample analysis data used in Demo Mode."""

DEMO_ANALYSIS = {
    "overall_score": 74,
    "ats_score": 68,
    "skill_match": 62,
    "summary": (
        "Your resume shows a solid foundation in Python and ML fundamentals. "
        "The projects section demonstrates practical experience, and the education "
        "section is well-structured. However, the resume lacks quantified achievements, "
        "cloud/MLOps skills, and modern deployment experience that are critical for "
        "AI/ML Engineer roles. ATS compatibility is moderate — several high-value keywords "
        "are absent, which reduces visibility in automated screening systems."
    ),
    "strengths": [
        "Strong academic foundation with relevant coursework in ML and Statistics",
        "Practical Python experience demonstrated through multiple projects",
        "Good coverage of core ML libraries: Scikit-learn, Pandas, NumPy",
        "Projects section is present and describes meaningful work",
        "Resume length is appropriate (1 page)",
    ],
    "weaknesses": [
        "No quantified achievements — all bullet points are vague (e.g., 'worked on', 'helped with')",
        "Missing cloud skills (AWS, GCP, Azure) which are required in most ML Engineer job postings",
        "No MLOps or model deployment experience mentioned (Docker, MLflow, Kubeflow)",
        "Summary/objective section is generic and does not target AI/ML Engineer roles",
        "Missing deep learning frameworks (PyTorch, TensorFlow) for senior positions",
        "No mention of model evaluation metrics or A/B testing experience",
    ],
    "skills_present": [
        "Python", "Scikit-learn", "Pandas", "NumPy", "SQL",
        "Machine Learning", "Data Analysis", "Jupyter Notebook",
        "Git", "Statistics",
    ],
    "skills_missing": [
        "PyTorch", "TensorFlow", "Docker", "Kubernetes", "MLflow",
        "AWS SageMaker", "Feature Engineering (advanced)", "NLP",
        "Model Deployment", "CI/CD for ML",
    ],
    "recommended_skills": [
        "PyTorch or TensorFlow", "Docker", "MLflow", "FastAPI",
        "AWS/GCP fundamentals", "LangChain (for LLM projects)",
    ],
    "matching_keywords": [
        "Python", "Machine Learning", "SQL", "Data Analysis",
        "Scikit-learn", "Pandas", "NumPy", "Statistical Modeling",
    ],
    "missing_keywords": [
        "deep learning", "neural networks", "model deployment", "cloud",
        "MLOps", "Docker", "scalable", "production", "LLM", "transformer",
    ],
    "section_scores": {
        "contact": 90,
        "summary": 55,
        "education": 85,
        "experience": 60,
        "projects": 72,
        "skills": 65,
        "certifications": 40,
        "achievements": 30,
    },
    "experience_feedback": [
        "Internship bullets use passive language — replace 'worked on' with action verbs (developed, built, optimized)",
        "No metrics present — add numbers: model accuracy %, data size processed, time saved",
        "Missing technology stack details in internship description",
    ],
    "project_feedback": [
        "Projects lack GitHub links — add repository URLs",
        "No mention of results or outcomes for the ML project",
        "Add the tech stack used in each project as a sub-line",
    ],
    "formatting_feedback": [
        "Consistent formatting detected — good",
        "Consider adding a skills bar or skill categorization section",
        "Date formats are inconsistent: mix of MM/YYYY and Month YYYY",
    ],
    "grammar_feedback": [
        "Avoid first-person pronouns ('I developed') — use action verbs directly",
        "Minor comma usage issues in the experience section",
    ],
    "high_priority_actions": [
        "Add quantified results to every bullet point (e.g., 'Improved model accuracy from 78% to 91%')",
        "Include a brief exposure to Docker or cloud deployment — even a personal project counts",
        "Rewrite the summary to specifically target AI/ML Engineer roles with your top 3 skills",
    ],
    "medium_priority_actions": [
        "Add PyTorch or TensorFlow to your skills by completing one small project",
        "Add GitHub links to all projects",
        "List any relevant online certifications (Coursera ML, DeepLearning.AI, etc.)",
    ],
    "low_priority_actions": [
        "Standardize date formats throughout the resume",
        "Add a brief 'Achievements' section for any hackathons, competitions, or awards",
        "Consider a cleaner two-column layout to improve scannability",
    ],
    "rewrites": [
        {
            "original": "Worked on a machine learning model for the project.",
            "improved": "Developed and trained a binary classification model using Scikit-learn, achieving 87% accuracy on the test dataset.",
        },
        {
            "original": "Helped with data analysis tasks during internship.",
            "improved": "Performed exploratory data analysis on 50,000+ customer records using Pandas and NumPy, identifying key trends that informed product decisions.",
        },
        {
            "original": "Made a website for a college project.",
            "improved": "Built a full-stack web application using React and FastAPI with JWT authentication, deployed for peer review as a college capstone project.",
        },
    ],
}

DEMO_SKILL_GAP = {
    "current_skills": ["Python", "Scikit-learn", "Pandas", "NumPy", "SQL", "Machine Learning"],
    "missing_skills": ["PyTorch", "TensorFlow", "Docker", "MLflow", "AWS", "Kubernetes"],
    "recommended_skills": ["PyTorch", "Docker", "MLflow", "FastAPI", "AWS Basics"],
    "skill_gap_percentage": 38,
    "tips": [
        "Start with PyTorch — it's now the dominant deep learning framework in research and industry",
        "Learn Docker basics — even a simple Dockerfile for your ML project significantly boosts hireability",
        "MLflow is quick to learn and directly addresses the 'model tracking' gap in your resume",
    ],
}
