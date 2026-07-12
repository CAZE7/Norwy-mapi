# GitHub-Pages-Checkliste

## 1. Vollständig hochladen

Nicht nur `index.html` hochladen. Der Inhalt dieses gesamten Pakets muss im Repository-Hauptverzeichnis liegen.

Mindestens erforderlich:

```text
index.html
app.js
app.css
a11y-overrides.css
leaflet.js
leaflet.css
leaflet.markercluster.js
MarkerCluster.css
MarkerCluster.Default.css
places-data.js
camper_layers.js
manifest.webmanifest
service-worker.js
icon-192.png
icon-512.png
steder_v25_1393.csv
steder_v25_1393.geojson
camper_layers.geojson
```

## 2. GitHub kontrollieren

Nach dem Commit prüfen, dass keine dieser Dateien 0 Byte groß ist. `places-data.js` und `camper_layers.js` sind besonders wichtig.

## 3. GitHub Pages

- Quelle: Branch `main`
- Ordner: `/(root)`
- einige Minuten auf das Deployment warten

## 4. Alten Cache entfernen

- alte installierte App entfernen
- Website-Daten für `caze7.github.io` löschen
- `https://caze7.github.io/Norwy-mapi/?v=26` öffnen
- zweimal neu laden
- App erneut installieren

## 5. Live-Test

Im Repository steht ein reproduzierbarer Test unter `tests/`. Alternativ mindestens manuell prüfen:

- Karte sichtbar
- Suche findet Trolltunga
- Ebenenmenü öffnet
- Quellenmenü öffnet
- Route Oslo–Bergen wird berechnet
- CSV- und GeoJSON-Downloads funktionieren
