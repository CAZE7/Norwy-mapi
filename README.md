# Steder i Norge

Statische, mobile-first GitHub-Pages-App für Norwegen-POIs, Naturorte und Camper-Infrastruktur. Die Anwendung bleibt bewusst bei Plain HTML, CSS, JavaScript und Leaflet.

---

## ⚠️ WICHTIG: Daten-Wiederherstellung erforderlich!

**Die Datendateien wurden mit Platzhaltern überschrieben und müssen aus der Git-Historie wiederhergestellt werden.**

**Siehe Anleitung:** [`DATEN_WIEDERHERSTELLEN.md`](DATEN_WIEDERHERSTELLEN.md)

**Schnell-Fix:**
```bash
git log --oneline -- data/places-data.js
git checkout <letzter-guter-commit> -- data/places-data.js
git checkout <letzter-guter-commit> -- data/camper_layers.js
```

---

## 🎯 Funktionsumfang

- 1.393 eindeutige Hauptorte und Koordinaten
- 1.500 optionale Camper- und Versorgungspunkte
- kombinierte Suche über Namen, Aliasse, Region, Kategorie und Beschreibung
- gewichtete Relevanzsortierung
- Kategorien- und Sekundärfilter
- aktive, einzeln entfernbare Filterchips
- Favoriten und persönliche Route im Browser
- Stopps entlang einer Strecke
- Kartverket-Ebenen für Fuß-, Rad- und Skirouten
- frei lizenzierte Commons-Bilder mit vollständigen Credits
- Qualitäts- und Vertrauensanzeige
- installierbare PWA mit Service Worker

## 🔍 Suche

Die Suche normalisiert Groß-/Kleinschreibung, Umlaute, Akzente sowie `ø`, `å` und `æ`. Gewichtet werden:

1. exakter Name
2. Namenspräfix
3. Name enthält Suchtext
4. Alias
5. Region und Kategorie
6. Beschreibung und Hinweise

**Beispiele:**
- `Trolltunga` zeigt den exakten Ort zuerst
- `Uttakleivstranda` findet den kanonischen Ort `Uttakleiv` über dessen Alias
- `Wasserfall Nordland` kombiniert Kategorie und Region

## 🎨 Filter

**Primäre Ortsarten:**
- Wasserfälle
- Aussicht
- Seen
- Berge und Wandern
- Strände und Ufer
- Küste und Leuchttürme
- Geologie und Gletscher
- Nationalparks
- Rast und Roadtrip
- Essen und Einkaufen
- Kultur und Besonderes

**Sekundär:**
- Highlights
- lokale Tipps
- Entdeckungen
- gut dokumentiert
- mit Bild
- in meiner Nähe
- gespeichert

Aktive Filter und Suchbegriffe werden als entfernbare Chips mit Trefferzahl angezeigt.

## 🔐 Datenvertrauen

Die Anzeige beschreibt ausschließlich die Dokumentation, nicht Schönheit oder Sicherheit:

- **Gut dokumentiert** (Qualität ≥ 75)
- **Teilweise geprüft** (Qualität ≥ 55)
- **Vor Ort prüfen** (Qualität < 55)

Pro Ort werden vorhandene Vertrauenssignale wie exakte OSM-Quelle, Recherchelink, Bildlizenz und Zugangshinweis angezeigt.

## 🚀 Lokaler Start

```bash
npm run serve
```

Danach `http://127.0.0.1:8000/` öffnen.

## ✅ Tests

### Schnelltest (Statischer Audit)

```bash
npm test
```

Prüft:
- ✅ Kritische Dateien existieren und sind nicht leer
- ✅ CSS-Dateien enthalten echtes CSS (kein .gitignore, kein Markdown)
- ✅ JavaScript-Dateien sind parsebar (kein CSS, kein Markdown)
- ⚠️ Warnt bei moderner Syntax (`?.`, `.at()`)
- ✅ package.json ist gültiges JSON

### Vollständiger Test (Browser + Accessibility)

```bash
# Einmalig installieren
npm install
npx playwright install chromium

# Server starten (Terminal 1)
npm run serve

# Tests ausführen (Terminal 2)
npm run test:e2e
```

Prüft:
- ✅ Seite lädt ohne JavaScript-Fehler
- ✅ Mindestens 1.000 Orte und Camper-Punkte geladen
- ✅ Suchfunktion funktioniert
- ✅ Navigation funktioniert
- ✅ Keine kritischen Accessibility-Fehler

Weitere Informationen: [`TESTING.md`](TESTING.md)

## 📦 GitHub Pages Deployment

Das Repository kann direkt aus Branch `main` und `/(root)` veröffentlicht werden.

### Vor jedem Deployment

```bash
# 1. Tests ausführen
npm test
npm run test:e2e  # optional, aber empfohlen

# 2. Bei strukturellen Änderungen: Cache-Version erhöhen
# In sw.js: CACHE_VERSION = 'norwy-v26.X'

# 3. Commit & Push
git push origin main

# 4. Nach Deployment: Veröffentlichte Seite testen
BASE_URL=https://caze7.github.io/Norwy-mapi/ npm run test:e2e
```

**Live-URL:** `https://caze7.github.io/Norwy-mapi/`

Detaillierte Deployment-Anleitung: [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)

## 🛡️ Fehlerprävention & Qualitätssicherung

Diese Version (26.1) implementiert umfassende Schutzmaßnahmen gegen Boot-Fehler:

### 1. Syntax-Kompatibilität
- ✅ Keine Optional Chaining (`?.`)
- ✅ Keine `Array.at()`
- ✅ Kompatibel mit älteren Browsern und WebViews

### 2. Automatische Checks
- ✅ Statischer Audit prüft Datei-Integrität
- ✅ Browser-Tests prüfen Kernfunktionalität
- ✅ Warnungen bei problematischer Syntax

### 3. Service Worker mit Versionierung
- ✅ Network First für kritische Dateien
- ✅ Automatisches Löschen alter Caches
- ✅ Update-Benachrichtigung für Nutzer

### 4. Umfassende Dokumentation
- [`RELEASE_CHECK.md`](RELEASE_CHECK.md) - Fehlerprävention
- [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md) - Deployment-Workflow
- [`FIXES_SUMMARY.md`](FIXES_SUMMARY.md) - Übersicht der Fixes

## 📚 Dokumentation

- [`CHANGELOG.md`](CHANGELOG.md) - Versionshistorie
- [`TESTING.md`](TESTING.md) - Test-Anleitung
- [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md) - Deployment-Workflow
- [`RELEASE_CHECK.md`](RELEASE_CHECK.md) - Fehlerprävention
- [`FIXES_SUMMARY.md`](FIXES_SUMMARY.md) - Implementierte Fixes
- [`LIZENZEN.md`](LIZENZEN.md) - Lizenz-Informationen
- [`AUDIT_REPORT.md`](AUDIT_REPORT.md) - Audit-Berichte

## 🔧 Technologie-Stack

- **Framework:** Keine (Plain HTML/CSS/JavaScript)
- **Karten:** Leaflet 1.9.4
- **Clustering:** Leaflet.markercluster 1.5.3
- **Kartendaten:** OpenStreetMap
- **Wanderwege:** Kartverket WMS
- **Tests:** Playwright + Axe-Core
- **Deployment:** GitHub Pages
- **PWA:** Service Worker + Web App Manifest

## 🤝 Beitragen

Beiträge sind willkommen! Bitte beachten:

1. **Tests ausführen:** `npm test` vor jedem Commit
2. **Keine modernen Syntax-Features:** Vermeiden Sie `?.`, `.at()`, `replaceAll()`
3. **Browser-Tests:** `npm run test:e2e` vor Pull Request
4. **Dokumentation:** Änderungen dokumentieren

## 📄 Lizenzen

### Projekt
Open Source (siehe LICENSE)

### Datenquellen
- **Kartendaten:** © OpenStreetMap-Mitwirkende, [ODbL](https://www.openstreetmap.org/copyright)
- **Wanderwege & Routen:** © Kartverket (Norwegisches Kartierungsamt)
- **Fotos:** Wikimedia Commons, individuelle Lizenzen siehe Bildunterschriften

### Software
- [Leaflet](https://leafletjs.com/) - BSD-2-Clause License
- [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) - MIT License

## ⚠️ Haftungsausschluss

Alle Angaben ohne Gewähr. Bitte prüfen Sie Zugang, Öffnungszeiten und Sicherheit vor Ort. Die Qualitätsangaben beziehen sich nur auf die Dokumentation, nicht auf Schönheit oder Sicherheit.

## 🔒 Datenschutz

Diese App speichert Ihre Favoriten und Routen nur lokal in Ihrem Browser. Es werden keine personenbezogenen Daten an Server übermittelt.

---

**Version:** 26.1  
**Status:** Production Ready  
**Letzte Aktualisierung:** 2026  
**Live:** https://caze7.github.io/Norwy-mapi/
