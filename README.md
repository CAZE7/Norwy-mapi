# Steder i Norge

Statische, mobile-first GitHub-Pages-App für Norwegen-POIs, Naturorte und Camper-Infrastruktur. Die Anwendung bleibt bewusst bei Plain HTML, CSS, JavaScript und Leaflet.

## Funktionsumfang

- 1.396 eindeutige Hauptorte und Koordinaten
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
- installierbare PWA

## Suche

Die Suche normalisiert Groß-/Kleinschreibung, Umlaute, Akzente sowie `ø`, `å` und `æ`. Gewichtet werden:

1. exakter Name
2. Namenspräfix
3. Name enthält Suchtext
4. Alias
5. Region und Kategorie
6. Beschreibung und Hinweise

Beispiele:

- `Trolltunga` zeigt den exakten Ort zuerst.
- `Uttakleivstranda` findet den kanonischen Ort `Uttakleiv` über dessen Alias.
- `Wasserfall Nordland` kombiniert Kategorie und Region.

## Filter

Primäre Ortsarten:

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

Sekundär:

- Highlights
- lokale Tipps
- Entdeckungen
- gut dokumentiert
- mit Bild
- in meiner Nähe
- gespeichert

Aktive Filter und Suchbegriffe werden als entfernbare Chips mit Trefferzahl angezeigt.

## Datenvertrauen

Die Anzeige beschreibt ausschließlich die Dokumentation, nicht Schönheit oder Sicherheit:

- **Gut dokumentiert**
- **Teilweise geprüft**
- **Vor Ort prüfen**

Pro Ort werden vorhandene Vertrauenssignale wie exakte OSM-Quelle, Recherchelink, Bildlizenz und Zugangshinweis angezeigt.

## Lokaler Start

```bash
npm run serve
```

Danach `http://127.0.0.1:8000/` öffnen.

## Tests

```bash
npm test
npm install
npx playwright install chromium
npm run serve
# zweites Terminal
npm run test:e2e
```

Weitere Informationen: [`TESTING.md`](TESTING.md).

## GitHub Pages

Das Repository kann direkt aus Branch `main` und `/(root)` veröffentlicht werden. Nach dem Deployment:

`https://caze7.github.io/Norwy-mapi/?v=25`

## Dokumentation

- [`CHANGELOG.md`](CHANGELOG.md)
- [`AUDIT_REPORT.md`](AUDIT_REPORT.md)
- [`LIZENZEN.md`](LIZENZEN.md)
- [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)
