# Steder i Norge – fokussierte Version 22

Diese Version ergänzt nur wenige, klar abgegrenzte Funktionen und hält die Oberfläche minimalistisch.

## 1. Orte entlang einer Fahrstrecke

Im bestehenden Bereich „Route“ können Start und Ziel eingegeben werden. Die Karte:

- sucht beide Orte in Norwegen,
- berechnet eine Fahrstrecke,
- zeigt Distanz und ungefähre Fahrzeit,
- findet hochwertige Orte in 5, 15 oder 30 Kilometern Entfernung zur Strecke,
- verteilt Empfehlungen über acht Streckenabschnitte,
- begrenzt gleiche Kategorien pro Abschnitt,
- zeigt passende Stellplätze, Campingplätze, Trinkwasser und Toiletten entlang der Route,
- übernimmt persönliche Stopps weiterhin nach Google Maps.

Die Ortssuche verwendet Nominatim, die Routenberechnung OSRM. Die Daten werden direkt vom Browser an diese Dienste gesendet und nicht auf einem eigenen Server gespeichert.

## 2. Camper-Versorgung

Die bestehende Camper-Ebene wurde nicht weiter aufgebläht. Vorhandene Angaben werden klarer angezeigt:

- Öffnungszeiten, falls eingetragen
- Gebühr
- Barrierefreiheit
- Zugang
- Webseite
- Qualitätsstufe

Nicht vorhandene Öffnungszeiten werden ausdrücklich als „nicht eingetragen“ bezeichnet und nicht geschätzt.

## 3. Ähnliche Orte

In jeder Ortsdetailansicht erscheinen drei ähnliche Empfehlungen. Sie basieren ausschließlich auf:

- gleicher Kategorie,
- Datenqualität,
- vorhandenem Bild,
- Entfernung.

Es findet kein Nutzertracking und keine serverseitige Profilbildung statt.

## Weiterhin enthalten

- 2.000 Hauptorte
- 1.500 Camper- und Versorgungspunkte
- Kartverket-Ebenen für Fuß-, Rad- und Skirouten
- Qualitätsstufen A, B und C
- 329 frei lizenzierte Commons-Bilder
- vollständige Lizenzinformationen
- CSV- und GeoJSON-Downloads

## Tests

- Android Pixel 7: bestanden
- Desktop 1440 × 900: bestanden
- Route Oslo–Bergen: bestanden
- Nominatim-Ortssuche: bestanden
- OSRM-Routenberechnung: bestanden
- 31 räumlich verteilte Vorschläge auf der Teststrecke
- 19 verschiedene Kategorien auf der Teststrecke
- Camper-Versorgung im Routenkorridor: bestanden
- ähnliche Orte: bestanden
- Öffnungszeitenanzeige: bestanden
- keine JavaScript-Fehler

## GitHub Pages

Alle Dateien direkt ins Hauptverzeichnis laden und vorhandene Dateien ersetzen. Danach öffnen:

`https://caze7.github.io/Norwy-mapi/?v=22`
