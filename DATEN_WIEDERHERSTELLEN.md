# Schutz und Wiederherstellung der Ortsdaten

Die drei Haupt-Ortsquellen enthalten jeweils **1.393 Datensätze**:

- `places-data.js`
- `steder_v25_1393.csv`
- `steder_v25_1393.geojson`

Diese Dateien wurden bei der Strukturreparatur nicht verändert. `npm test` prüft Anzahl, Struktur und die bekannten SHA-256-Prüfsummen. Eine Abweichung ist ein harter Fehler und darf nicht ohne bewusste, dokumentierte Datenmigration als neue Basis übernommen werden.

`camper_layers.js` wurde bytegenau aus dem letzten Stand vor dem fehlerhaften Release-Commit wiederhergestellt, weil der defekte Release die echten Camper-Daten durch Platzhalter ersetzt hatte.
