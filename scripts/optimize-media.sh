#!/usr/bin/env bash
# Regenerate mobile delivery assets in assets/opt/ (840px JPEG, 756px H.264).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS="$ROOT/assets"
OPT="$ASSETS/opt"
mkdir -p "$OPT"

echo "→ Images (max 840px, JPEG q82)"
for f in "$ASSETS"/enhanced_hero-*.png "$ASSETS"/enhanced_ecosystem-*.png; do
  [[ -f "$f" ]] || continue
  base="$(basename "${f%.png}")"
  sips -Z 840 "$f" --out "$OPT/${base}.jpg" -s format jpeg -s formatOptions 82
done

for f in hero-bg-dubai.jpg hero-bg-cape-town.jpg ecosystem-bg-2.jpg ecosystem-bg-capetown-urban.png \
  days-water.png days-dining.png days-wellness.png beyond-jet.png beyond-yacht.png cta-nature.jpg; do
  [[ -f "$ASSETS/$f" ]] || continue
  base="${f%.*}"
  sips -Z 840 "$ASSETS/$f" --out "$OPT/${base}.jpg" -s format jpeg -s formatOptions 82
done

echo "→ Videos (max 756px wide, H.264 CRF 28)"
for v in kitesurf tropics wellness jet yacht footer; do
  [[ -f "$ASSETS/${v}.mp4" ]] || continue
  ffmpeg -y -i "$ASSETS/${v}.mp4" \
    -vf "scale='min(756,iw)':-2" -c:v libx264 -crf 28 -preset medium \
    -movflags +faststart -an "$OPT/${v}.mp4" 2>/dev/null
done

echo "Done. Bump MEDIA_VERSION in js/lazy-media.js after deploy."
ls -lh "$OPT" | tail -n +2
