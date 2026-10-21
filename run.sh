#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "[AdoptLuck] Node.js not found. Install Node 18+ from https://nodejs.org/"
  exit 1
fi

exec node "$ROOT/scripts/run.mjs" "$@"
