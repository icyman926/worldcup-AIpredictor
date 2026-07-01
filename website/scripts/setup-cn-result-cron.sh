#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-/opt/worldcup-predictor/website}"
LOG_DIR="$APP_DIR/logs"
CRON_LINE="0 14 * * * cd $APP_DIR && npm run update:results >> $LOG_DIR/match-results-update.log 2>&1"

mkdir -p "$LOG_DIR"

if ! command -v crontab >/dev/null 2>&1; then
  echo "crontab is not installed. Install cron first: apt install cron -y"
  exit 1
fi

(crontab -l 2>/dev/null | grep -v "npm run update:results" || true; echo "$CRON_LINE") | crontab -

echo "Installed Beijing 14:00 daily match result updater:"
echo "$CRON_LINE"
echo "Log file:"
echo "$LOG_DIR/match-results-update.log"
