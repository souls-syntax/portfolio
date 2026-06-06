#!/bin/bash
set -e

git add weird/garden.html
git commit -m "garden: $(date '+%Y-%m-%d %H:%M')"
git pull origin main
git rebase origin/main
git push origin main
