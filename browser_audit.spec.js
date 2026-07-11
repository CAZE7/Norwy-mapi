# Reproduzierbare Tests

## Statischer Paket- und Datentest

Im Projektordner:

```bash
python tests/audit_static.py
```

Geprüft werden unter anderem vollständige Dateien, eindeutige Koordinaten, Taxonomie, GeoJSON-Anzahl, CSP, Accessibility-Hooks und Service-Worker-Regeln.

## Browser- und Accessibility-Test

```bash
cd tests
npm install
npx playwright install chromium
cd ..
python -m http.server 8000
```

In einem zweiten Terminal:

```bash
cd tests
npm test
```

Der Test verwendet ein Pixel-7-Profil, Axe, Ortssuche, Routenplanung und Dialogsteuerung. Mit `BASE_URL=https://caze7.github.io/Norwy-mapi/ npm test` kann die veröffentlichte Seite geprüft werden.
