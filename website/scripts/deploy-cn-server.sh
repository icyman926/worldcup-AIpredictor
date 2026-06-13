#!/usr/bin/env bash
set -euo pipefail

cd /opt/worldcup-predictor
git pull
cd website
npm ci
NEXT_PUBLIC_SITE_LOCALE=zh-CN npm run build
pm2 restart worldcup-ai-cn --update-env
pm2 save
