"""Lägger nya översättningar i i18n/en.json och bygger docs/assets/i18n-en.json.
Nya översättningar skrivs i i18n/tr-*.txt som "radnummer<TAB>engelska", där radnumret
är platsen i i18n/nycklar.json (från scripts/i18n-keys.py). i18n/delar.txt har delmeningar
som "svenska<TAB>engelska". Kontrollerar att platshållarna ({n0}, {p0}, {d0}, {m0}) stämmer.
Kör: python3 scripts/i18n-merge.py"""
import glob, json, os, re

PH = re.compile(r"\{[pndm]\d+\}")
en = json.load(open("i18n/en.json")) if os.path.exists("i18n/en.json") else {}
keys = json.load(open("i18n/nycklar.json")) if os.path.exists("i18n/nycklar.json") else []
bad = []

def put(k, v):
    if sorted(PH.findall(k)) != sorted(PH.findall(v)):
        bad.append((k, v)); return
    en[k] = v

for f in sorted(glob.glob("i18n/tr-*.txt")):
    for line in open(f, encoding="utf-8"):
        line = line.rstrip("\n")
        if not line.strip() or "\t" not in line: continue
        i, v = line.split("\t", 1)
        put(keys[int(i)], v)
parts = {}
for line in open("i18n/delar.txt", encoding="utf-8"):
    line = line.rstrip("\n")
    if not line or line.startswith("#") or "\t" not in line: continue
    k, v = line.split("\t", 1)
    if sorted(PH.findall(k)) != sorted(PH.findall(v)): bad.append((k, v)); continue
    parts[k] = v

en = dict(sorted(en.items()))
json.dump(en, open("i18n/en.json", "w"), ensure_ascii=False, indent=0)
json.dump({"full": en, "parts": parts}, open("docs/assets/i18n-en.json", "w"), ensure_ascii=False, separators=(",", ":"))
for k, v in bad: print("PLATSHÅLLARE STÄMMER INTE:", k, "=>", v)
print(len(en), "meningar,", len(parts), "delar,", os.path.getsize("docs/assets/i18n-en.json") // 1024, "kB")
