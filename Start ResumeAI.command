#!/bin/bash

# ResumeAI Launcher
# Double-click this file to start the app

PROJECT="/Users/anasahmed/.kiro/crew/workspace/resume-ai"

# ── Check Python ──────────────────────────────────────────────────────────────
if ! command -v python3 &>/dev/null; then
  osascript -e 'display alert "Python 3 not found" message "Please install Python 3 from https://python.org then try again."'
  exit 1
fi

# ── Check Node ────────────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  osascript -e 'display alert "Node.js not found" message "Please install Node.js from https://nodejs.org then try again."'
  exit 1
fi

# ── Setup backend venv if needed ─────────────────────────────────────────────
if [ ! -d "$PROJECT/backend/venv" ]; then
  osascript -e 'display notification "Setting up backend (first run — takes ~60 seconds)..." with title "ResumeAI"'
  cd "$PROJECT/backend"
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt --quiet
fi

# ── Setup frontend node_modules if needed ─────────────────────────────────────
if [ ! -d "$PROJECT/frontend/node_modules" ]; then
  osascript -e 'display notification "Installing frontend packages (first run — takes ~30 seconds)..." with title "ResumeAI"'
  cd "$PROJECT/frontend"
  npm install --silent
fi

# ── Create .env if missing ────────────────────────────────────────────────────
if [ ! -f "$PROJECT/backend/.env" ]; then
  cp "$PROJECT/backend/.env.example" "$PROJECT/backend/.env"
fi

# ── Start backend ─────────────────────────────────────────────────────────────
osascript -e 'display notification "Starting backend..." with title "ResumeAI"'
osascript <<EOF
tell application "Terminal"
  do script "source '$PROJECT/backend/venv/bin/activate' && cd '$PROJECT/backend' && uvicorn app.main:app --reload"
  delay 2
end tell
EOF

# ── Start frontend ────────────────────────────────────────────────────────────
sleep 3
osascript -e 'display notification "Starting frontend..." with title "ResumeAI"'
osascript <<EOF
tell application "Terminal"
  do script "cd '$PROJECT/frontend' && npm run dev"
  delay 2
end tell
EOF

# ── Wait for backend to be ready, then open browser ──────────────────────────
sleep 6
open "http://localhost:5173"
osascript -e 'display notification "ResumeAI is running at localhost:5173" with title "✅ ResumeAI Ready"'
