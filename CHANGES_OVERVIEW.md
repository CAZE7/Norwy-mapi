# Reparaturübersicht – Version 26.2

Der fehlerhafte Release hatte Dateiinhalte unter falschen Namen abgelegt. Die Zuordnung wurde ohne Änderungen an den drei Haupt-Ortsdateien repariert:

- `boot.js`: Boot- und Ressourcenfehlerbehandlung
- `app.js`: Anwendungslogik (zuvor fälschlich in dieser Markdown-Datei)
- `app.css`: Hauptdesign (zuvor fälschlich in `boot.js`)
- `a11y-overrides.css`: Accessibility-Ergänzungen (zuvor fälschlich in `app.js`)
- `audit_static.py` und `tests/browser_audit.spec.js`: wieder ihrem Dateityp entsprechend eingeordnet
- Daten- und Service-Worker-Pfade: für den Repository-Root und GitHub Pages relativ gemacht

Die Ortsquellen `places-data.js`, `steder_v25_1393.csv` und `steder_v25_1393.geojson` blieben bytegenau unverändert. Der statische Audit erwartet für jede Quelle 1.393 Datensätze und prüft zusätzlich deren SHA-256-Prüfsummen.
