# Reparaturübersicht – Version 26.2

Der fehlerhafte Release hatte Dateiinhalte unter falschen Namen abgelegt. Die Zuordnung wurde ohne Änderungen an den drei Haupt-Ortsdateien repariert:

## Behobene Vertauschungen

| Datei | War (fehlerhafter Inhalt) | Ist jetzt (korrekt) |
|---|---|---|
| `app.js` | Haupt-CSS der App | App-Logik (JavaScript) |
| `app.css` | Accessibility-CSS | Haupt-CSS der App |
| `a11y-overrides.css` | Playwright-Testcode (JS) | Accessibility-CSS |
| `tests/browser_audit.spec.js` | Datei fehlte | Playwright-Testcode |
| `boot.js` | Boot-JS (korrekt) | Boot-JS (unverändert) |

## Pfade

- `index.html` lädt `places-data.js` und `camper_layers.js` korrekt aus dem Root (kein `data/`-Präfix)
- `package.json` referenziert `tests/browser_audit.spec.js` – Datei jetzt vorhanden
- `audit_static.py` liegt im Root – Pfad in `npm test` korrekt

## Ortsdaten-Schutz

Die Ortsquellen `places-data.js`, `steder_v25_1393.csv` und `steder_v25_1393.geojson` wurden **nicht verändert**.
Erwartete Datensatzanzahl: **1.393** in allen drei Quellen.
Der statische Audit (`npm test`) prüft die Datensatzanzahl und SHA-256-Prüfsummen automatisch.
