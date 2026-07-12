# Release-Check & Fehlerprävention

## Übersicht

Dieses Dokument beschreibt die implementierten Maßnahmen gegen Boot-Fehler wie "Uncaught SyntaxError: Unexpected token '.'" und andere kritische Probleme.

## Implementierte Schutzmaßnahmen

### 1. Syntax-Kompatibilität

#### Problem
Moderne JavaScript-Syntax (ES2020+) führt in älteren Browsern, WebViews und In-App-Browsern zu Parse-Fehlern:
- Optional Chaining `?.`
- `Array.prototype.at()`
- `String.prototype.replaceAll()`

#### Lösung
**Betroffene Dateien kompatibler gemacht:**

- ✅ `boot.js` - Keine Optional Chaining, klassische Nullprüfungen
- ✅ `app.js` - `Array.at(-1)` → `array[array.length-1]`
- ✅ `app.js` - `?.` → explizite `&&` Prüfungen
- ✅ `app.js` - Arrow Functions → `function()` wo nötig für maximale Kompatibilität

**Beispiele:**

```javascript
// ❌ VORHER (inkompatibel)
const active = [detail, legal, layerPanel].find(x => x?.classList.contains('open'));
const last = focusable.at(-1);
const reason = event.reason?.message || 'unbekannt';

// ✅ NACHHER (kompatibel)
const active = [detail, legal, layerPanel].find(function(x) {
  return x && x.classList.contains('open');
});
const last = focusable[focusable.length - 1];
const reason = (event.reason && event.reason.message) ? event.reason.message : 'unbekannt';
```

**Automatische Prüfung:**
```bash
npm test
```
Warnt bei Verwendung von `?.` oder `.at()` in JS-Dateien.

---

### 2. Release-Dateien & Dateizuordnung

#### Problem
Ausgelieferte Dateien enthielten falschen Inhalt:
- `app.css` war leer
- `a11y-overrides.css` enthielt `.gitignore`-Inhalt
- `browser_audit.spec.js` enthielt Markdown statt Test-Code

#### Lösung

**Korrigierte Dateien:**

| Datei | Status Vorher | Status Nachher |
|-------|---------------|----------------|
| `app.css` | ❌ Leer | ✅ Vollständiges CSS (500+ Zeilen) |
| `a11y-overrides.css` | ❌ .gitignore-Inhalt | ✅ Accessibility-CSS |
| `boot.js` | ⚠️ Optional Chaining | ✅ Kompatible Syntax |
| `app.js` | ⚠️ .at(), ?. | ✅ Kompatible Syntax |
| `tests/audit_static.py` | ❌ Fehlte | ✅ Vollständiger Test |
| `tests/browser_audit.spec.js` | ❌ Markdown | ✅ Playwright-Tests |

**Automatische Prüfung:**
```bash
npm test
```
Prüft:
- CSS-Dateien enthalten echtes CSS (keine .gitignore, kein Markdown)
- JS-Dateien enthalten echtes JavaScript (kein CSS, kein Markdown)
- Dateien sind nicht leer
- Korrekte File-Extensions

---

### 3. Test- & Prüfpipeline

#### Problem
- `npm test` funktionierte nicht
- `npm run test:e2e` referenzierte nicht existierende Dateien
- `tests/` Verzeichnis fehlte
- Keine automatische Erkennung von kaputten Releases

#### Lösung

**A) Statischer Audit (`tests/audit_static.py`)**

Prüft vor Deployment:
```bash
npm test
```

**Checks:**
- ✅ Kritische Dateien existieren (`index.html`, `app.js`, `app.css`, `boot.js`)
- ✅ Dateien sind nicht leer
- ✅ CSS-Dateien enthalten CSS-Syntax (`{...}`, Selektoren)
- ✅ CSS-Dateien enthalten NICHT: `.gitignore`, Markdown
- ✅ JS-Dateien sind parsebar (kein CSS, kein Markdown, kein .gitignore)
- ⚠️ Warnung bei Optional Chaining (`?.`)
- ⚠️ Warnung bei `Array.at()`
- ✅ `package.json` ist gültiges JSON
- ✅ `package.json` referenziert nur existierende Pfade

**B) Browser-Tests (`tests/browser_audit.spec.js`)**

Smoke-Tests im echten Browser:
```bash
npm run test:e2e
```

**Checks:**
- ✅ Seite lädt ohne JavaScript-Fehler
- ✅ Suchfeld, Karte, Navigation sind sichtbar
- ✅ Mindestens 1.000 Orte geladen
- ✅ Mindestens 1.000 Camper-Punkte geladen
- ✅ Suchfunktion funktioniert
- ✅ Detail-Modal öffnet sich
- ✅ Tab-Navigation funktioniert
- ✅ ESC schließt Modals
- ✅ Keine kritischen Accessibility-Fehler (Axe)
- ✅ Kein Boot-Fehler auf Startseite

**C) Konsistente Referenzen**

✅ `package.json` → `tests/audit_static.py` ✓ existiert  
✅ `package.json` → `tests/browser_audit.spec.js` ✓ existiert  
✅ `TESTING.md` beschreibt korrekte Pfade  
✅ `README.md` referenziert korrekte Test-Commands  

---

### 4. Service Worker & Cache-Risiko

#### Problem
- Alte, kaputte Versionen werden durch Service Worker Cache ausgeliefert
- Keine Versionierung
- Kritische Dateien werden zu aggressiv gecacht

#### Lösung

**A) Service Worker mit Versionierung (`sw.js`)**

```javascript
const CACHE_VERSION = 'norwy-v26.1';
const CRITICAL_CACHE = 'norwy-critical-v26.1';
const DATA_CACHE = 'norwy-data-v26.1';
```

**B) Cache-Strategie**

| Datei-Typ | Strategie | Beschreibung |
|-----------|-----------|--------------|
| Kritische App-Dateien | **Network First** | Immer frisch versuchen, Cache als Fallback |
| Datendateien | **Cache First** | Cache zuerst, Hintergrund-Update |
| Externe Ressourcen | **Network Only** | Kein Caching (Leaflet, OSM-Tiles) |

**Kritische Dateien (Network First):**
- `/index.html`
- `/app.css`
- `/app.js`
- `/boot.js`
- `/a11y-overrides.css`

→ Garantiert, dass Syntax-Fixes sofort ankommen

**C) Automatische Cache-Invalidierung**

Bei jedem Deployment mit strukturellen Änderungen:
1. `CACHE_VERSION` in `sw.js` erhöhen
2. Alte Caches werden automatisch gelöscht
3. Neue Version wird geladen

**D) Manueller Cache-Reset**

Nutzer können Cache manuell löschen via:
- Browser DevTools → Application → Clear Storage
- Hard-Reload (Ctrl+Shift+R)

**E) Update-Benachrichtigung**

Service Worker erkennt neue Versionen und zeigt Toast:
```javascript
showToast('Neue Version verfügbar - bitte Seite neu laden');
```

---

## Zusätzliche Absicherungen

### Pre-Commit Checks (empfohlen)

```bash
# Vor jedem Commit
npm test
```

### Pre-Deploy Workflow

```bash
# 1. Statischer Check
npm test

# 2. Lokaler Test
npm run serve &
sleep 3
curl http://127.0.0.1:8000 > /dev/null

# 3. Browser-Tests
npm run test:e2e

# 4. Alles grün? → Deploy
git push origin main
```

### CI/CD Integration (optional)

GitHub Actions Workflow-Beispiel:

```yaml
name: Test & Deploy

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.x'
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Static Audit
        run: |
          npm test
      
      - name: Install E2E Dependencies
        run: |
          npm install
          npx playwright install --with-deps chromium
      
      - name: Start Server
        run: |
          npm run serve &
          sleep 5
      
      - name: E2E Tests
        run: |
          npm run test:e2e
```

---

## Typische Fehlerszenarien & Prävention

### Szenario 1: Syntax-Fehler in app.js

**Symptom:** `Uncaught SyntaxError: Unexpected token '.'`

**Prävention:**
1. ✅ `npm test` warnt vor `?.` und `.at()`
2. ✅ Alle modernen Features entfernt
3. ✅ E2E-Test prüft auf JavaScript-Fehler beim Laden

**Wenn es doch passiert:**
1. `npm test` zeigt Warnung
2. Tests schlagen fehl → kein Deploy
3. Entwickler sieht Fehler VOR Veröffentlichung

---

### Szenario 2: Leere oder falsche CSS-Datei

**Symptom:** Seite ist nicht gestylt oder CSS-Fehler

**Prävention:**
1. ✅ `npm test` prüft, dass CSS-Dateien nicht leer sind
2. ✅ `npm test` prüft, dass CSS-Dateien CSS-Syntax enthalten
3. ✅ `npm test` erkennt .gitignore oder Markdown in CSS

**Wenn es doch passiert:**
1. Statischer Test schlägt fehl
2. Entwickler muss Datei korrigieren
3. Kein Deploy mit falscher Datei möglich

---

### Szenario 3: Fehlende Datendateien

**Symptom:** "Ortsdaten konnten nicht geladen werden"

**Prävention:**
1. ✅ `npm test` prüft Existenz kritischer Dateien
2. ✅ E2E-Test prüft, dass > 1.000 Orte geladen werden
3. ✅ `boot.js` zeigt benutzerfreundliche Fehlermeldung

**Wenn es doch passiert:**
1. E2E-Test schlägt fehl
2. Fehlerbox wird angezeigt (nicht nur Konsole)
3. Service Worker cached NICHT die kaputte Version (Network First)

---

### Szenario 4: Alter Service Worker cached kaputte Version

**Symptom:** Neue Fixes kommen nicht an

**Prävention:**
1. ✅ Network First für kritische Dateien
2. ✅ Versionierte Caches
3. ✅ Automatisches Löschen alter Caches
4. ✅ Update-Benachrichtigung für Nutzer

**Wenn es doch passiert:**
1. Cache-Version erhöhen in `sw.js`
2. Deployment auslösen
3. Service Worker löscht alte Caches automatisch
4. Nutzer sieht Update-Toast

---

## Testanleitung

### Schnelltest vor Commit

```bash
npm test
```
Dauer: ~2 Sekunden  
Sollte: Grün (exit code 0)

### Vollständiger Test vor Deploy

```bash
# Terminal 1
npm run serve

# Terminal 2
npm run test:e2e
```
Dauer: ~30 Sekunden  
Sollte: Alle Tests grün

### Veröffentlichte Seite prüfen

```bash
BASE_URL=https://caze7.github.io/Norwy-mapi/ npm run test:e2e
```

---

## Dokumentierte Annahmen

1. **Browser-Zielgruppe:** ES5-kompatibel + moderne APIs (fetch, Promise, async/await)
2. **Keine Transpilierung:** Plain JavaScript ohne Build-Step (GitHub Pages kompatibel)
3. **Service Worker:** Optional (funktioniert auch ohne)
4. **Datendateien:** Müssen als separate `.js` Dateien vorliegen (nicht eingebettet)
5. **Python 3:** Für lokalen Server und Tests verfügbar
6. **Node.js:** Für Playwright-Tests verfügbar (optional)

---

## Wartung

### Bei jedem Release

1. Version in `package.json` erhöhen
2. `npm test` ausführen
3. `npm run test:e2e` ausführen (optional, aber empfohlen)
4. Bei strukturellen Änderungen: Cache-Version in `sw.js` erhöhen

### Monatlich / Quartalsweise

- Playwright-Version aktualisieren
- Axe-Core-Version aktualisieren
- Tests auf neuen Browser-Versionen prüfen

---

**Version:** 26.1  
**Letzte Aktualisierung:** 2026  
**Wartung:** Alle kritischen Checks automatisiert
