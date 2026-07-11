# GitHub-Pages-Version – geprüft

Diese Version ist für GitHub Pages vorbereitet. Leaflet und die Marker-Gruppierung sind vollständig in `index.html` eingebettet, sodass keine JavaScript-Dateien fehlen können.

## Wichtig: richtige Ordnerstruktur

Im Stammverzeichnis des GitHub-Repositories müssen direkt diese Dateien liegen:

```text
index.html
manifest.webmanifest
service-worker.js
.nojekyll
assets/
  icon-192.png
  icon-512.png
```

**Nicht korrekt** wäre:

```text
mein-repository/
  github_pages_norwegen_app/
    index.html
```

Wenn `index.html` nur in einem Unterordner liegt, zeigt die Hauptadresse der GitHub Page keine App an.

## Veröffentlichung

1. Neues GitHub-Repository erstellen.
2. Den Inhalt dieses Ordners hochladen – nicht den übergeordneten Ordner selbst.
3. In GitHub **Settings → Pages** öffnen.
4. Unter **Build and deployment** „Deploy from a branch“ auswählen.
5. Branch `main` und Ordner `/(root)` wählen.
6. Speichern und einige Minuten warten.
7. Die von GitHub angezeigte HTTPS-Adresse öffnen.

## Falls weiterhin eine weiße alte Seite erscheint

Wahrscheinlich kontrolliert noch ein alter Service Worker die Seite:

1. Die zuvor installierte Version der App vom Handy entfernen.
2. In Chrome die GitHub-Pages-Adresse öffnen.
3. Chrome → Website-Einstellungen → Gespeicherte Daten löschen.
4. Seite zweimal neu laden oder die Adresse einmal mit `?v=3` öffnen.
5. Anschließend erneut „App installieren“ wählen.

Der neue Service Worker verwendet für Seitenaufrufe bewusst zuerst das Netzwerk, damit fehlerhafte alte Versionen nicht dauerhaft aus dem Cache geladen werden.

## Geprüft

- `index.html`: syntaktisch gültiges JavaScript
- alle lokalen Referenzen vorhanden
- Manifest: gültiges JSON
- Service Worker: gültiges JavaScript
- Testserver: alle fünf benötigten Dateien liefern HTTP 200
- keine externen JavaScript- oder CSS-Abhängigkeiten

Kartenkacheln und Bilder werden weiterhin online von OpenStreetMap beziehungsweise den jeweiligen Bildquellen geladen.
