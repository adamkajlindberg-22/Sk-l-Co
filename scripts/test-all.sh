#!/usr/bin/env bash
# Bygger, startar en lokal server, kör alla tester och stänger servern.
# Första gången: npm install && pip install playwright && playwright install chromium
set -uo pipefail
cd "$(dirname "$0")/.."
npm run check || exit 1
# Starta en server bara om ingen redan svarar (till exempel npm run dev)
if ! curl -s -o /dev/null http://localhost:8765/; then
  python3 -m http.server 8765 --directory docs >/dev/null 2>&1 & SRV=$!
  trap 'kill $SRV' EXIT
  sleep 1
fi
npm test && npm run test:a11y
