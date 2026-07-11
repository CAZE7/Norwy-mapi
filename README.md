# Norwegen Entdecker – funktionierende GitHub-Pages-Version

## Gefundener Fehler auf der veröffentlichten Seite

Die live veröffentlichte Datei

`https://caze7.github.io/Norwy-mapi/index.html`

liefert zwar HTTP 200, ist aber **0 Byte groß**. Auch die Datei im Repository hat laut GitHub-API die Größe 0. Deshalb zeigt der Browser eine komplett weiße Seite. Das Problem liegt nicht an der Karte, sondern daran, dass eine leere `index.html` veröffentlicht wurde.

## Installation

1. Im Repository `Norwy-mapi` die bisherigen Dateien löschen oder vollständig ersetzen.
2. Den Inhalt dieses ZIP-Pakets direkt in das Hauptverzeichnis des Repositorys hochladen.
3. Besonders kontrollieren, dass GitHub bei `index.html` ungefähr **2,5 KB** anzeigt – nicht 0 Byte.
4. `places-data.js` muss ungefähr **1 MB** groß sein.
5. GitHub Pages auf Branch `main` und `/(root)` einstellen.
6. Nach dem Deployment diese Adresse öffnen:

`https://caze7.github.io/Norwy-mapi/?v=4`

## Erwartete Dateien im Repository

```text
index.html
app.css
app.js
places-data.js
leaflet.css
leaflet.js
leaflet.markercluster.js
MarkerCluster.css
MarkerCluster.Default.css
manifest.webmanifest
service-worker.js
icon-192.png
icon-512.png
.nojekyll
README.md
```

Es gibt in dieser Version absichtlich keinen `assets`-Unterordner. Alle Verweise sind flach und relativ, damit GitHub Pages sie zuverlässig findet.

## Alten Cache entfernen

Wenn nach dem Austausch noch die alte Seite erscheint:

1. Installierte alte App vom Android-Handy entfernen.
2. Chrome → Website-Einstellungen → Daten der Seite `caze7.github.io` löschen.
3. `https://caze7.github.io/Norwy-mapi/?v=4` öffnen.
4. Zweimal neu laden.
5. Erst danach die App erneut installieren.

## Durchgeführte Tests

- Alle lokalen Dateiverweise geprüft: keine Datei fehlt.
- Manifest als gültiges JSON geprüft.
- Service Worker und alle JavaScript-Dateien syntaktisch geprüft.
- Lokaler HTTP-Test: alle benötigten Dateien erreichbar.
- Echter Chromium-Browsertest: 1.100 Orte geladen, Marker angezeigt, keine JavaScript-Fehler.
- Android-Test mit Pixel-7-Viewport 412 × 839 Pixel: erfolgreich, keine JavaScript-Fehler.
- Desktop-Test 1280 × 720 Pixel: erfolgreich.
