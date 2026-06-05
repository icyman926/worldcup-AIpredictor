#!/bin/bash
echo "Starting World Cup AI Predictor..."
cd backend && pip install -r requirements.txt
cd backend && uvicorn app.main:app --reload --port 8000 &
cd website && npm install && npm run dev
