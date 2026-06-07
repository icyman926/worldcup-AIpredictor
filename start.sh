#!/bin/bash
set -e

echo "Starting World Cup AI Predictor website..."
cd "$(dirname "$0")/website"
npm install
npm run dev
