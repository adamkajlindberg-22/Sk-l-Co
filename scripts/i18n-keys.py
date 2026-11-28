"""Gör om samlade texter till översättningsnycklar. Siffror blir {n0}, {n1}, glasnamn {p0}, {p1}.
Samma regler finns i src/js/06-i18n.js (keyOf för text). Läser i18n/samlat.json, skriver i18n/nycklar.json
med de nycklar som ännu saknas i i18n/en.json. Kör: python3 scripts/i18n-keys.py"""
import json, re, os, subprocess

core = open("src/js/01-core.js").read()
start = core.index("const P=[")
names = json.loads(subprocess.check_output(["node", "-e",
    "const P=" + core[start + 8:core.index("\n];", start) + 2] + ";console.log(JSON.stringify(P.map(p=>p.name)))"]))
names.sort(key=len, reverse=True)
NUM = re.compile(r"\d+(?:[  ]\d{3})*(?:,\d+)?")

def key(s):
    s = re.sub(r"\s+", " ", s).strip()
    # Siffror först, sedan glasnamn, så att platshållarnas index inte räknas som siffror
    j = 0
    def nn(_):
        nonlocal j
        j += 1
        return "{n%d}" % (j - 1)
    s = NUM.sub(nn, s)
    # Veckodagar och månader blir {d0} och {m0}
    s = re.sub(r"\b(måndag|tisdag|onsdag|torsdag|fredag|lördag|söndag)\b", "{d0}", s)
    s = re.sub(r"\b(januari|februari|mars|april|maj|juni|juli|augusti|september|oktober|november|december)\b", "{m0}", s)
    i = 0
    def pn(_):
        nonlocal i
        i += 1
        return "{p%d}" % (i - 1)
    return re.sub("|".join(re.escape(n) for n in names), pn, s)

texts = json.load(open("i18n/samlat.json"))
keys = sorted({key(t) for t in texts})
# Rena namn och siffror behöver ingen översättning
keys = [k for k in keys if len(k) > 1 and not re.search(r"@keyframes|[{;][a-z-]+:", k)]
keys = [k for k in keys if re.sub(r"\{[pndm]\d+\}|[\s.,:·×=+%()/–-]|kr|cl|cm|st", "", k)]
have = json.load(open("i18n/en.json")) if os.path.exists("i18n/en.json") else {}
todo = [k for k in keys if k not in have]
json.dump(todo, open("i18n/nycklar.json", "w"), ensure_ascii=False, indent=0)
print(len(keys), "nycklar,", len(todo), "saknar översättning,", sum(map(len, todo)), "tecken")
