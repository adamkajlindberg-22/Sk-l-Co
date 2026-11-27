#!/usr/bin/env bash
# Gör om alla filer för hjältefilmen från originalen i media/. Kräver ffmpeg och python3 med Pillow.
#   media/hero-4k.mp4     filmen i 3840x2160 (Higgsfield cinematic_studio_3_0, uppskalad med Topaz)
#   media/hero-start.png  startbilden i 2688x1520 (Higgsfield gpt_image_2_6)
# Filmerna scrubbas med scrollen. Därför nyckelbild var sjätte ruta och inga B-rutor (-g 6 -bf 0):
# varje hopp behöver avkoda högst fem rutor. aq-mode=3 skyddar mörka ytor mot ränder.
# Lätt skärpning (unsharp) efter nedskalningen, eftersom originalet är uppskalat och något mjukt.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=media/hero-4k.mp4; IMG=media/hero-start.png; A=docs/assets
E="-c:v libx264 -preset slow -tune film -g 6 -keyint_min 1 -bf 0 -sc_threshold 0 -pix_fmt yuv420p -x264-params aq-mode=3 -movflags +faststart -an"
CROP="crop=1216:2160:1627:0"   # stående utsnitt för mobil, i full upplösning från 4K
ffmpeg -loglevel error -y -i $SRC -vf "scale=2560:1440:flags=lanczos,unsharp=5:5:0.25" -crf 20 $E $A/hero-2560.mp4
ffmpeg -loglevel error -y -i $SRC -vf "scale=1920:1080:flags=lanczos,unsharp=5:5:0.25" -crf 20 $E $A/hero.mp4
ffmpeg -loglevel error -y -i $SRC -vf "scale=1280:720:flags=lanczos,unsharp=5:5:0.25" -crf 21 $E $A/hero-1280.mp4
ffmpeg -loglevel error -y -i $SRC -vf "$CROP,scale=1080:1920:flags=lanczos,setsar=1,unsharp=5:5:0.35" -crf 20 $E $A/hero-m.mp4
ffmpeg -loglevel error -y -i $IMG -vf scale=2688:1512:flags=lanczos -c:v libwebp -quality 82 $A/hero-start.webp
ffmpeg -loglevel error -y -i $IMG -vf scale=1600:900:flags=lanczos -c:v libwebp -quality 84 $A/hero-start-1600.webp
python3 - "$IMG" "$A/hero-start-m.webp" <<'PY'
import sys
from PIL import Image
im=Image.open(sys.argv[1]);W,H=im.size;w=int(H*9/16);x=int(.62*(W-w))
im.crop((x,0,x+w,H)).resize((1080,1920),Image.LANCZOS).save(sys.argv[2],quality=86)
PY
ffmpeg -loglevel error -y -sseof -0.1 -i $SRC -vf scale=2560:1440:flags=lanczos -frames:v 1 -update 1 -c:v libwebp -quality 86 $A/hero-end.webp
ffmpeg -loglevel error -y -sseof -0.1 -i $SRC -vf "$CROP,scale=1080:1920:flags=lanczos,setsar=1" -frames:v 1 -update 1 -c:v libwebp -quality 86 $A/hero-end-m.webp
ffmpeg -loglevel error -y -sseof -0.1 -i $SRC -vf scale=1200:-2 -frames:v 1 -update 1 -q:v 4 $A/hero-end.jpg
echo "Klart. Byt ?v= i index.html och 05-account.js så att webbläsare hämtar de nya filerna."
