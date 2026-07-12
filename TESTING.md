# Lokale Tests

## 1. Statischer Audit

Ohne zusätzliche Python-Pakete:

```bash
npm test
```

Alternativ:

```bash
python3 tests/audit_static.py
```

Der Audit kontrolliert Paketvollständigkeit, eindeutige Koordinaten und Namen, stabile Taxonomie, GeoJSON-Anzahl, CSP, Accessibility-Hooks und Service-Worker-Regeln.

## 2. Lokaler Start

```bash
npm run serve
```

Anschließend öffnen:

```text
http://127.0.0.1:8000/
```

## 3. Browser- und Accessibility-Tests

Einmalig:

```bash
npm install
npx playwright install chromium
```

Während `npm run serve` in einem Terminal läuft, in einem zweiten Terminal:

```bash
npm run test:e2e
```

Getestet werden Initial Load, 1.397 eindeutige Orte, 1.500 Camper-Punkte, sichtbare Karte und Suche, kombinierte Suche, Alias-Suche, Kategorienfilter, Qualitätsfilter, Routenplanung, Dialogsteuerung und Axe Accessibility.

Die veröffentlichte Seite kann so geprüft werden:

```bash
BASE_URL=https://caze7.github.io/Norwy-mapi/ npm run test:e2e
```
