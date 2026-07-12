# Audit Report – Version 23

## Behobene kritische Punkte

- Vollständiges Paket mit allen referenzierten Laufzeitdateien.
- Verständliche Meldungen bei fehlenden Ortsdaten, Camper-Daten, Service Worker und Netzwerkdiensten.
- `unhandledrejection` wird behandelt.
- 589 zusätzliche Datensätze an identischen Koordinaten wurden zusammengeführt.
- 12 weitere offensichtliche Nahdubletten wurden anhand von Name und räumlicher Nähe zusammengeführt.
- Insgesamt wurden 601 Dubletten entfernt.
- Zwei offensichtlich fehlerhafte beziehungsweise falsch klassifizierte Einträge wurden zusätzlich entfernt.
- 1.397 Hauptdatensätze entsprechen jetzt 1.397 eindeutigen Koordinaten und 1.397 eindeutigen Namen.
- Sprachvarianten werden als Aliasse eines Ortes gespeichert.
- Interne Kategorien und Bekanntheitswerte wurden auf stabile Schlüssel vereinheitlicht.
- Wiederkehrende norwegische Standardtexte wurden für die deutsche Oberfläche vereinheitlicht.
- Interne Kategorien und Bekanntheitswerte wurden normalisiert.

## Accessibility

- Zoomsperre entfernt.
- Schriften und Touch-Ziele vergrößert.
- Suchlabel ergänzt.
- Handle ist ein Button.
- Dialogsemantik, Fokusführung, Escape und Fokusfalle ergänzt.
- `aria-expanded` ergänzt.
- externe Links abgesichert.
- Axe-Test: keine Verstöße in Startansicht und Lizenzdialog.

## Netzwerk und PWA

- Timeouts und konkrete Meldungen für Nominatim und OSRM.
- Ortsanfragen werden nur nach Klick ausgeführt und begrenzt lokal zwischengespeichert.
- Kartverket-WMS-Fehler werden angezeigt.
- Offline-Text beschreibt den tatsächlichen Umfang.
- keine eigene Offline-Speicherung externer Kartenkacheln.

## Reproduzierbare Testergebnisse

- statischer Audit: bestanden
- Paketvollständigkeit: bestanden
- JavaScript-Syntax: bestanden
- 1.397 eindeutige Orte: bestanden
- 1.500 Camper-Punkte: bestanden
- fehlende Ortsdaten: verständliche Meldung bestanden
- fehlende Camper-Daten: Hauptkarte bleibt nutzbar
- Android Pixel 7: bestanden
- Desktop 1440 × 900: bestanden
- Axe initial: 0 Verstöße
- Axe Lizenzdialog: 0 Verstöße
- Route Oslo–Bergen: bestanden
- räumlich und kategorisch verteilte Routenstopps: bestanden

## Such- und Filteraudit Version 24

- Name, Alias, Region, Kategorie, Beschreibung und Hinweise werden gemeinsam durchsucht.
- Exakte Namen werden vor Alias-, Regions- und Beschreibungstreffern sortiert.
- Mehrere Suchwörter müssen gemeinsam im kombinierten Suchindex vorkommen.
- Kategorien verwenden ausschließlich stabile `category_id`-Werte.
- Mehrfach-Kategorien, Bildfilter, Bekanntheitsfilter und Qualität A/B wurden geprüft.
- Filterzusammenfassung und Trefferzahl werden live aktualisiert.
- Filterpanel mit Axe geprüft: 0 Verstöße.

Die Tests liegen im Ordner `tests/`.
