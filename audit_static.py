#!/usr/bin/env python3
"""Statischer Release-Audit. Verändert keine Dateien."""
from __future__ import annotations
import csv, hashlib, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
EXPECTED_PLACES = 1393
# Schutz gegen stille Inhaltsänderungen an den drei Haupt-Ortsquellen.
EXPECTED_SHA256 = {
    "places-data.js": "651e09b6cd27de63e626730a4c4d4613539539aaba2d5630f42d7f9fce0e368e",
    "steder_v25_1393.csv": "da051225f20bd7b1945db4792b1228113acd3f9739dc810b7883740cccd4399f",
    "steder_v25_1393.geojson": "d1d8e756fc36c35af93a723cae177713a7ac550372469f1faf1ee3dae7175093",
}
errors: list[str] = []
def check(ok: bool, message: str) -> None:
    print(("✓ " if ok else "✗ ") + message)
    if not ok: errors.append(message)

def run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, cwd=ROOT, text=True, capture_output=True)

required = ["index.html", "boot.js", "app.js", "app.css", "a11y-overrides.css",
            "package.json", "places-data.js", "steder_v25_1393.csv",
            "steder_v25_1393.geojson", "camper_layers.js",
            "tests/browser_audit.spec.js"]
for name in required:
    p = ROOT / name
    check(p.is_file() and p.stat().st_size > 0, f"vorhanden und nicht leer: {name}")

for name in ("boot.js", "app.js", "camper_layers.js", "sw.js", "tests/browser_audit.spec.js"):
    result = run("node", "--check", name)
    check(result.returncode == 0, f"JavaScript parsebar: {name}" + (f" ({result.stderr.strip()})" if result.returncode else ""))

for name in ("app.css", "a11y-overrides.css"):
    text = (ROOT/name).read_text(encoding="utf-8")
    check("{" in text and "}" in text and not text.lstrip().startswith(("# ", "node_modules/")), f"CSS-Inhalt plausibel: {name}")
for name in ("boot.js", "app.js"):
    text = (ROOT/name).read_text(encoding="utf-8")
    check(not re.search(r"(?m)^\s*:[\w-]+\s*\{|^\s*[.#][\w-]+\s*\{", text), f"kein offensichtliches CSS in {name}")

try:
    package = json.loads((ROOT/"package.json").read_text(encoding="utf-8"))
    check(True, "package.json ist gültiges JSON")
except Exception as exc:
    package = {}; check(False, f"package.json ungültig: {exc}")
for script in ("test", "test:e2e"):
    check(script in package.get("scripts", {}), f"package-Script vorhanden: {script}")
for ref in ("audit_static.py", "tests/browser_audit.spec.js"):
    check((ROOT/ref).is_file(), f"Testreferenz existiert: {ref}")

html = (ROOT/"index.html").read_text(encoding="utf-8")
for ref in re.findall(r'''(?:src|href)=["']([^"']+)["']''', html):
    if ref.startswith(("http://", "https://", "#", "data:", "mailto:", "tel:")): continue
    target = ref.split("?",1)[0].split("#",1)[0]
    if target: check((ROOT/target).is_file(), f"lokales Asset existiert: {target}")
check(re.search(r'src=["\']places-data\.js(?:\?[^"\']*)?["\']', html) is not None and
      re.search(r'src=["\']camper_layers\.js(?:\?[^"\']*)?["\']', html) is not None,
      "Ortsdaten werden aus dem Repository-Root geladen")

# JS in isoliertem VM auswerten und nur die Array-Länge ausgeben.
js_count = run("node", "-e", "const f=require('fs'),v=require('vm'),c={window:{}};v.createContext(c);v.runInContext(f.readFileSync('places-data.js','utf8'),c);console.log(c.window.PLACES.length)")
try: places_count = int(js_count.stdout.strip())
except ValueError: places_count = -1
with (ROOT/"steder_v25_1393.csv").open(encoding="utf-8-sig", newline="") as fh:
    csv_count = sum(1 for _ in csv.DictReader(fh))
geo = json.loads((ROOT/"steder_v25_1393.geojson").read_text(encoding="utf-8"))
geo_count = len(geo.get("features", []))
for name, count in (("places-data.js", places_count), ("steder_v25_1393.csv", csv_count), ("steder_v25_1393.geojson", geo_count)):
    check(count == EXPECTED_PLACES, f"{name}: {count} Datensätze (Soll {EXPECTED_PLACES})")
check(places_count == csv_count == geo_count, "Haupt-Ortsquellen haben dieselbe Datensatzanzahl")
for name, expected in EXPECTED_SHA256.items():
    actual = hashlib.sha256((ROOT/name).read_bytes()).hexdigest()
    check(actual == expected, f"Ortsdatei inhaltlich unverändert: {name}")

if errors:
    print(f"\nRelease-Audit fehlgeschlagen: {len(errors)} Fehler.", file=sys.stderr); sys.exit(1)
print("\nRelease-Audit erfolgreich.")
