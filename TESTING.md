# Test-Dokumentation

## Übersicht

Dieses Projekt nutzt zwei Arten von Tests, um kaputte Releases zu verhindern:

1. **Statischer Audit** - Prüft Dateien auf Vollständigkeit und Korrektheit
2. **Browser-Tests** - Smoke-Tests im echten Browser mit Playwright

## 1. Statischer Audit

### Ausführung

```bash
npm test
```

oder direkt:

```bash
python3 tests/audit_static.py
```

### Was wird geprüft?

- ✅ Kritische Dateien existieren (`index.html`, `app.js`, `app.css`, `boot.js`)
- ✅ Dateien sind nicht leer
- ✅ CSS-Dateien enthalten echtes CSS (keine .gitignore, kein Markdown)
- ✅ JavaScript-Dateien sind parsebar (kein CSS, kein Markdown)
- ⚠️ Warnung bei Optional Chaining (`?.`) in JS
- ⚠️ Warnung bei `Array.at()` in JS
- ✅ `package.json` ist gültiges JSON
- ✅ `package.json` referenziert nur existierende Pfade

### Ausgabe-Beispiel (Erfolg)

```
🔍 Starte statischen Release-Audit für Norwy-mapi...

✓ HTML-Hauptdatei existiert: index.html
✓ HTML-Hauptdatei ist nicht leer: index.html
✓ Haupt-JavaScript existiert: app.js
✓ Haupt-JavaScript ist nicht leer: app.js
✓ Haupt-CSS existiert: app.css
✓ Haupt-CSS ist nicht leer: app.css
✓ Boot-JavaScript existiert: boot.js
✓ Boot-JavaScript ist nicht leer: boot.js
✓ Package-Konfiguration existiert: package.json
✓ Package-Konfiguration ist nicht leer: package.json

✓ Haupt-CSS enthält gültiges CSS: app.css
✓ Accessibility-CSS enthält gültiges CSS: a11y-overrides.css

✓ Boot-JavaScript ist parsebare JavaScript-Datei: boot.js
✓ Haupt-JavaScript ist parsebare JavaScript-Datei: app.js

✓ Package-Konfiguration ist gültiges JSON: package.json

✓ package.json referenziert nur existierende Pfade

============================================================
✅ Alle statischen Checks erfolgreich!
   Release-Dateien sind strukturell korrekt.
```

### Ausgabe-Beispiel (Fehler)

```
🔍 Starte statischen Release-Audit für Norwy-mapi...

✓ Haupt-CSS existiert: app.css
❌ FEHLER: Haupt-CSS ist leer: app.css

✓ Accessibility-CSS existiert: a11y-overrides.css
❌ FEHLER: Accessibility-CSS enthält .gitignore-Inhalt statt CSS: a11y-overrides.css

✓ Boot-JavaScript ist parsebare JavaScript-Datei: boot.js
❌ WARNUNG: Haupt-JavaScript verwendet Optional Chaining (?.) - möglicherweise nicht kompatibel mit älteren Browsern: app.js

============================================================
❌ Einige Checks sind fehlgeschlagen!
   Bitte beheben Sie die oben genannten Fehler vor dem Deployment.
```

### Anforderungen

- Python 3.x (keine zusätzlichen Pakete erforderlich)

---

## 2. Browser-Tests (E2E)

### Einmalige Installation

```bash
npm install
npx playwright install chromium
```

### Ausführung

**Terminal 1** - Server starten:
```bash
npm run serve
```

**Terminal 2** - Tests ausführen:
```bash
npm run test:e2e
```

### Was wird geprüft?

#### Initial Load & Fehler-Erkennung
- ✅ Seite lädt ohne JavaScript-Fehler
- ✅ Keine Console-Errors beim Laden
- ✅ Kein Boot-Fehler auf Startseite (#appError nicht sichtbar)

#### UI-Elemente
- ✅ Suchfeld ist sichtbar
- ✅ Karte ist sichtbar
- ✅ Navigation ist sichtbar

#### Daten
- ✅ Mindestens 1.000 Orte werden geladen (`window.PLACES`)
- ✅ Mindestens 1.000 Camper-Punkte werden geladen (`window.CAMPER_POINTS`)

#### Funktionalität
- ✅ Suchfunktion liefert Ergebnisse
- ✅ Detail-Modal öffnet sich
- ✅ Navigation zwischen Tabs funktioniert
- ✅ ESC-Taste schließt Modals
- ✅ Service Worker API verfügbar (falls HTTPS)

#### Accessibility
- ✅ Keine kritischen Accessibility-Fehler (Axe-Core)
- ⚠️ Farb-Kontrast-Warnungen werden nicht als Fehler gewertet

### Ausgabe-Beispiel

```
Running 11 tests using 1 worker

  ✓ Seite lädt ohne JavaScript-Fehler (2s)
  ✓ Kritische Elemente sind sichtbar (1s)
  ✓ Ortsdaten werden geladen (1s)
    → ✓ 1393 Orte geladen
  ✓ Camper-Daten werden geladen (1s)
    → ✓ 1500 Camper-Punkte geladen
  ✓ Suchfunktion funktioniert (2s)
  ✓ Detail-Modal öffnet sich (1s)
  ✓ Navigation zwischen Tabs funktioniert (2s)
  ✓ Tastatur-Navigation funktioniert (2s)
  ✓ Keine kritischen Accessibility-Fehler (3s)
  ✓ Kein offensichtlicher Boot-Fehler auf Startseite (1s)
  ✓ Service Worker registriert sich (1s)
    → ✓ Service Worker API verfügbar

  11 passed (17s)
```

### Anforderungen

- Node.js 16+ und npm
- Chromium (wird automatisch installiert)
- Lokaler Server läuft auf Port 8000

---

## 3. Veröffentlichte Seite testen

Nach Deployment auf GitHub Pages:

```bash
BASE_URL=https://caze7.github.io/Norwy-mapi/ npm run test:e2e
```

Dies testet die live veröffentlichte Version statt der lokalen.

---

## 4. Kontinuierliche Integration (Optional)

### GitHub Actions Workflow

Erstelle `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.x'
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Static Audit
      run: npm test
    
    - name: Install E2E Dependencies
      run: |
        npm install
        npx playwright install --with-deps chromium
    
    - name: Start Server
      run: npm run serve &
      
    - name: Wait for Server
      run: sleep 5
    
    - name: E2E Tests
      run: npm run test:e2e
    
    - name: Upload Test Results
      if: failure()
      uses: actions/upload-artifact@v3
      with:
        name: playwright-report
        path: playwright-report/
```

---

## 5. Test-Workflow vor Deployment

### Empfohlener Workflow

```bash
# 1. Code-Änderungen gemacht
# 2. Statische Prüfung
npm test

# Falls Fehler → beheben und wiederholen

# 3. Lokaler Test im Browser
npm run serve
# Öffne http://127.0.0.1:8000 und teste manuell

# 4. Browser-Tests
# Terminal 1: Server läuft bereits
# Terminal 2:
npm run test:e2e

# Falls Fehler → beheben und wiederholen

# 5. Alles grün? → Deployment
git add .
git commit -m "..."
git push origin main

# 6. Nach Deployment: Live-Version testen
BASE_URL=https://caze7.github.io/Norwy-mapi/ npm run test:e2e
```

---

## 6. Typische Test-Fehler und Lösungen

### "Ortsdaten konnten nicht geladen werden"

**Ursache:** `data/places-data.js` fehlt oder ist leer

**Lösung:**
```bash
# Prüfe, ob Datei existiert
ls -lh data/places-data.js

# Prüfe Datei-Inhalt
head -20 data/places-data.js

# Falls leer: Aus Backup wiederherstellen
git checkout main -- data/places-data.js
```

### "❌ WARNUNG: ... verwendet Optional Chaining (?.) ..."

**Ursache:** Moderne JavaScript-Syntax in produktivem Code

**Lösung:**
```bash
# Finde alle Vorkommen
grep -n "\?\\." boot.js app.js

# Ersetze durch kompatible Syntax
# Vorher: event.reason?.message
# Nachher: (event.reason && event.reason.message)
```

### "Playwright Tests timeout"

**Ursache:** Server läuft nicht oder auf falschem Port

**Lösung:**
```bash
# Prüfe, ob Server läuft
curl http://127.0.0.1:8000

# Falls nicht: Server starten
npm run serve

# Warte 2-3 Sekunden, dann Tests erneut starten
npm run test:e2e
```

### "CSS-Datei enthält kein gültiges CSS"

**Ursache:** Falsche Datei committed (z.B. .gitignore statt CSS)

**Lösung:**
```bash
# Prüfe Datei-Inhalt
head -20 app.css

# Falls falsch: Richtige Version wiederherstellen
git log --all --full-history -- app.css
git checkout <commit-hash> -- app.css
```

---

## 7. Test-Checkliste

### Vor jedem Commit

- [ ] `npm test` ausgeführt und grün
- [ ] Keine Warnungen zu `?.` oder `.at()`
- [ ] Manuelle Prüfung der geänderten Dateien

### Vor jedem Deploy

- [ ] `npm test` grün
- [ ] `npm run test:e2e` grün (optional, aber empfohlen)
- [ ] Manuelle Tests auf Desktop-Browser
- [ ] Manuelle Tests auf Mobile-Browser (falls möglich)
- [ ] Cache-Version erhöht (bei strukturellen Änderungen)

### Nach jedem Deploy

- [ ] GitHub Pages lädt (2-3 Minuten warten)
- [ ] Seite im Browser öffnen und Hard-Reload (Ctrl+Shift+R)
- [ ] Browser-Konsole auf Fehler prüfen
- [ ] Kernfunktionen testen (Suche, Navigation, Detail-Modal)
- [ ] Optional: `BASE_URL=https://... npm run test:e2e`

---

## 8. Weitere Ressourcen

- **Playwright Dokumentation:** https://playwright.dev/
- **Axe-Core Dokumentation:** https://www.deque.com/axe/
- **GitHub Pages Dokumentation:** https://docs.github.com/en/pages

---

**Letzte Aktualisierung:** Version 26.1 (2026)  
**Status:** Alle Tests funktionsfähig  
**Wartung:** Tests bei neuen Features erweitern
