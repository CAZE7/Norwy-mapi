# Anleitung: Originale Daten wiederherstellen

Die Datendateien wurden mit Platzhaltern überschrieben und müssen wiederhergestellt werden.

## 🔴 Betroffene Dateien

- `data/places-data.js` - Ortsdaten (1393 Einträge)
- `data/camper_layers.js` - Camper-Infrastruktur (1500+ Einträge)

## ✅ Lösung 1: Aus Git-Historie wiederherstellen (EMPFOHLEN)

### Schritt 1: Finde den letzten guten Commit

```bash
# Zeige History der Datei
git log --all --full-history --oneline -- data/places-data.js

# Beispiel-Ausgabe:
# abc123 Update places data
# def456 Add new locations
# ghi789 Initial data import  <- Dieser Commit hat die originalen Daten
```

### Schritt 2: Stelle die Dateien wieder her

```bash
# Ersetze <commit-hash> mit dem Hash des letzten guten Commits

# places-data.js wiederherstellen
git checkout <commit-hash> -- data/places-data.js

# camper_layers.js wiederherstellen
git checkout <commit-hash> -- data/camper_layers.js

# Beispiel:
# git checkout ghi789 -- data/places-data.js
# git checkout ghi789 -- data/camper_layers.js
```

### Schritt 3: Prüfen

```bash
# Prüfe, ob Daten geladen wurden
grep -c "id:" data/places-data.js
# Sollte ca. 1393 anzeigen

grep -c "id:" data/camper_layers.js
# Sollte ca. 1500+ anzeigen

# Dateigröße prüfen
ls -lh data/
# places-data.js sollte mehrere MB groß sein
```

### Schritt 4: Testen

```bash
npm run serve
# Öffne http://127.0.0.1:8000
# Browser-Konsole sollte zeigen:
# "✓ Ortsdaten geladen: 1393 Einträge"
# "✓ Camper-Daten geladen: 1500 Punkte"
```

---

## ✅ Lösung 2: Von der Live-Seite extrahieren

Falls die Seite bereits deployed ist und die Daten enthält:

### Schritt 1: Öffne die Live-Seite

```
https://caze7.github.io/Norwy-mapi/
```

### Schritt 2: Extrahiere die Daten

Öffne Browser DevTools (F12) → Console:

```javascript
// Ortsdaten kopieren
copy(window.PLACES)
```

Füge in eine neue Datei ein:
```javascript
window.PLACES = [
  // ... hier eingefügter Inhalt
];
```

Speichere als `data/places-data.js`

Wiederhole für Camper-Daten:
```javascript
copy(window.CAMPER_POINTS)
```

Speichere als `data/camper_layers.js`

### Schritt 3: Füge Logging hinzu

Am Ende jeder Datei:

**places-data.js:**
```javascript
console.log('✓ Ortsdaten geladen:', window.PLACES.length, 'Einträge');
```

**camper_layers.js:**
```javascript
console.log('✓ Camper-Daten geladen:', window.CAMPER_POINTS.length, 'Punkte');
```

---

## ✅ Lösung 3: Aus Backup wiederherstellen

Falls du ein lokales Backup hast:

```bash
# Ersetze /pfad/zum/backup mit deinem tatsächlichen Pfad
cp /pfad/zum/backup/places-data.js data/
cp /pfad/zum/backup/camper_layers.js data/

# Prüfe die Dateien
head -50 data/places-data.js
```

---

## 🔍 Wie erkenne ich, ob die Daten korrekt sind?

### Richtige Koordinaten für Norwegen

- **Latitude (Breitengrad):** 58° bis 71° (Süd bis Nord)
- **Longitude (Längengrad):** 4° bis 31° (West bis Ost)

### Beispiel korrekter Einträge:

```javascript
{
  id: 1,
  name: "Trolltunga",
  lat: 60.124,  // ✓ Im Norwegen-Bereich
  lon: 6.74,    // ✓ Im Norwegen-Bereich
  region: "Hardanger",
  group: "Berge & Abenteuer",
  // ...
}
```

### Falsche Koordinaten (zu vermeiden):

```javascript
{
  lat: 48.5,  // ❌ Zu südlich (Deutschland/Österreich)
  lon: 2.3    // ❌ Zu westlich (Frankreich)
}
```

---

## 🧪 Nach dem Wiederherstellen: Tests

```bash
# 1. Statischer Check
npm test

# 2. Lokaler Test
npm run serve
# Öffne http://127.0.0.1:8000
# Prüfe Browser-Konsole

# 3. Visuelle Prüfung
# - Karte zeigt Norwegen
# - Marker sind in Norwegen
# - Nicht verstreut in ganz Europa
```

---

## 📋 Checkliste

Nach dem Wiederherstellen:

- [ ] `data/places-data.js` wiederhergestellt
- [ ] `data/camper_layers.js` wiederhergestellt
- [ ] Dateien sind mehrere MB groß (nicht nur KB)
- [ ] `npm test` läuft erfolgreich
- [ ] Lokaler Server zeigt Norwegen-Karte korrekt
- [ ] Browser-Konsole zeigt: "✓ Ortsdaten geladen: 1393 Einträge"
- [ ] Browser-Konsole zeigt: "✓ Camper-Daten geladen: 1500 Punkte"
- [ ] Marker sind in Norwegen (nicht verstreut)
- [ ] Commit der korrekten Daten:
  ```bash
  git add data/
  git commit -m "Restore original data files"
  ```

---

## ⚠️ Wichtig

**Die Platzhalter-Dateien enthalten bewusst nur minimale Test-Daten**, damit die App nicht crasht, aber sie zeigen deutlich an:

```
⚠️ WARNUNG: places-data.js enthält keine echten Daten!
```

Diese Warnung verschwindet, sobald die originalen Daten wiederhergestellt sind.

---

## 🆘 Hilfe bei Problemen

### Problem: "Kann keinen guten Commit finden"

```bash
# Zeige alle Commits mit Datei-Änderungen
git log --all --full-history --stat -- data/places-data.js

# Zeige Datei-Inhalt von einem bestimmten Commit
git show abc123:data/places-data.js | head -100
```

### Problem: "Datei zu groß für git show"

```bash
# Speichere direkt in Datei
git show abc123:data/places-data.js > data/places-data.js.recovered
mv data/places-data.js.recovered data/places-data.js
```

### Problem: "Live-Seite zeigt auch falsche Daten"

Dann muss aus einem älteren Backup oder Git-Commit wiederhergestellt werden.

---

**Zusammenfassung:**

Die sicherste Methode ist **Git-Historie** (Lösung 1). Die Daten sind dort gespeichert und können jederzeit wiederhergestellt werden.

Nach dem Wiederherstellen bitte diese Datei (`DATEN_WIEDERHERSTELLEN.md`) löschen oder als erledigt markieren.
