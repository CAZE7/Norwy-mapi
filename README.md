# Steder i Norge – Audit-Version 23

Diese Version behebt die bei der externen Prüfung genannten Auslieferungs-, Daten- und Barrierefreiheitsprobleme.

## Datenbereinigung

- Ausgangsdaten: 2.000 Datensätze
- zunächst unterschiedliche exakte Koordinaten: 1.411
- zusammengeführte Datensätze an identischen Koordinaten: 589
- zusätzlich zusammengeführte offensichtliche Nahdubletten: 12
- insgesamt entfernte Dubletten: 601
- zusätzlich entfernte offensichtlich fehlerhafte Einträge: 2
- Ergebnis: **1.397 eindeutige Hauptorte und 1.397 eindeutige Koordinaten**
- alte Namen und Sprachvarianten bleiben im Feld `aliases` erhalten
- `merged_records` dokumentiert die Zahl zusammengeführter Datensätze

### Einheitliche Taxonomie

Intern werden ausschließlich stabile Schlüssel verwendet, beispielsweise:

- `waterfall`
- `viewpoint`
- `lake`
- `mountain_hike`
- `beach`
- `lighthouse`
- `glacier`
- `geology`
- `bakery`
- `cafe`

Die deutsche Anzeige steht getrennt in `category_de`. Bekanntheit verwendet nur:

- `highlight`
- `local_tip`
- `discovery`

## Vollständiges Veröffentlichungspaket

Das ZIP enthält sämtliche benötigten Dateien. Die Anwendung prüft fehlende Hauptdaten und Camper-Daten verständlich.

Wichtige Laufzeitdateien:

```text
index.html
app.js
app.css
a11y-overrides.css
leaflet.js
leaflet.markercluster.js
places-data.js
camper_layers.js
manifest.webmanifest
service-worker.js
```

Daten-Downloads:

```text
steder_v23_1397.csv
steder_v23_1397.geojson
camper_layers.geojson
```

## Barrierefreiheit

- `maximum-scale=1` entfernt
- größere Grund- und Metadatenschriften
- mindestens 44 Pixel hohe Touch-Ziele
- sichtbare Fokusmarkierung
- echtes Label für die Suche
- Sheet-Handle als Button
- Dialogrollen und `aria-modal`
- Fokus beim Öffnen und Schließen
- Escape zum Schließen
- Fokus bleibt innerhalb geöffneter Dialoge
- `aria-expanded` an Ebenen- und Quellenbuttons
- reduzierte Animationen bei `prefers-reduced-motion`

## Fehlerbehandlung

- globale Laufzeitfehler
- `unhandledrejection`
- explizite Prüfung der Ortsdaten
- optionale Camper-Ebene fällt kontrolliert aus
- Netzwerk-Timeouts für Nominatim und OSRM
- verständliche Fehlermeldungen für Ortssuche und Routing
- maximal 30 zwischengespeicherte, identische Ortsanfragen
- Kartverket-WMS-Fehler werden als Hinweis angezeigt
- Service-Worker-Fehler werden gemeldet

## Sicherheit und Wartbarkeit

- externe Links mit `rel="noopener noreferrer"`
- Content Security Policy
- dynamische Ortsdaten werden vor HTML-Ausgabe maskiert
- unminifizierte Quelldateien unter `src/`
- SEO-Beschreibung, Canonical URL und Open-Graph-Metadaten
- Apple-Touch-Icon

## Offline-Verhalten

Offline verfügbar:

- App-Oberfläche
- 1.397 Ortsdatensätze
- Favoriten und persönliche Stopps
- Camper-Datensätze

Internet erforderlich:

- Kartenhintergrund
- Bilder, die noch nicht im normalen Browsercache liegen
- Ortssuche
- Routenberechnung
- Kartverket-Routenebenen

Es findet kein eigenes Offline-Caching externer OSM-Kartenkacheln statt.

## Weiterhin enthalten

- 1.500 Camper- und Versorgungspunkte
- Kartverket-Ebenen für Fuß-, Rad- und Skirouten
- Qualitätsstufen A, B und C
- lizenzierte Commons-Bilder mit vollständigen Credits
- Fahrstreckenplanung mit räumlich verteilten Stopps
- ähnliche Orte in der Detailansicht

## Veröffentlichung

Alle Dateien aus dem ZIP direkt ins Hauptverzeichnis des Repositorys laden und vorhandene Dateien ersetzen. Danach öffnen:

`https://caze7.github.io/Norwy-mapi/?v=23`
