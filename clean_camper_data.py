#!/usr/bin/env python3
import csv, json, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
required = [
    'index.html','boot.js','app.js','app.css','a11y-overrides.css','leaflet.js',
    'leaflet.markercluster.js','places-data.js','camper_layers.js',
    'manifest.webmanifest','service-worker.js','package.json','TESTING.md','steder_v25_1393.csv',
    'steder_v25_1393.geojson','camper_layers.geojson'
]
missing = [name for name in required if not (ROOT/name).exists()]
assert not missing, f'Missing files: {missing}'
rows = list(csv.DictReader(open(ROOT/'steder_v25_1393.csv', encoding='utf-8-sig')))
assert len(rows) == 1393
coords = {(r['latitude'], r['longitude']) for r in rows}
names = {r['name'].casefold() for r in rows}
assert len(coords) == len(rows), 'Duplicate coordinates remain'
assert len(names) == len(rows), 'Duplicate names remain'
assert all(re.fullmatch(r'[a-z_]+', r['category_id']) for r in rows)
assert all(r['fame_id'] in {'highlight','local_tip','discovery'} for r in rows)
def expected_quality(score):
    score = int(score)
    return 'Gut dokumentiert' if score >= 78 else 'Teilweise geprüft' if score >= 58 else 'Vor Ort prüfen'
assert all(r['quality_label'] == expected_quality(r['quality']) for r in rows)
forbidden_names = {'on lake','waterfall','parking viewpoint mountain segla','viewpoint henrikkafosen','myfallet middle viewpoint (unofficial, best view)'}
assert not {r['name'].casefold() for r in rows} & forbidden_names
raw_aliases = {alias.strip().casefold() for r in rows for alias in r['aliases'].split('|') if alias.strip()}
assert not raw_aliases & {'on lake','viewpoint bergsbotn','parking viewpoint mountain segla','viewpoint henrikkafosen','myfallet middle viewpoint (unofficial, best view)'}
assert 'langfoss – etne' not in names and 'langfoss' in names
assert 'geopark mølen' not in names and 'mølen' in names and 'mølen gravrøyser' in names
assert 'briksdalsbreen (briksdal glacier)' not in names and 'briksdalsbreen' in names
assert {'myfallet – unterer aussichtspunkt','myfallet – mittlerer aussichtspunkt','myfallet – oberer aussichtspunkt'} <= names
assert all('<' not in r['photo_author'] and '\n' not in r['photo_author'] for r in rows)
main_geo = json.load(open(ROOT/'steder_v25_1393.geojson'))
camper_geo = json.load(open(ROOT/'camper_layers.geojson'))
assert len(main_geo['features']) == 1393
assert len(camper_geo['features']) == 1500
camper_props = [f['properties'] for f in camper_geo['features']]
def expected_camper_quality(score):
    score = int(score)
    return 'Gut dokumentiert' if score >= 75 else 'Teilweise geprüft' if score >= 55 else 'Vor Ort prüfen'
assert all(p['qualityLabel'] == expected_camper_quality(p['quality']) for p in camper_props)
assert not any(p['name'].casefold() in {'wohnwagenstellplatz','well','drikkevann'} for p in camper_props)
assert not any(re.fullmatch(r'öffentliche toilette\s*·\s*\d+', p['name'].casefold()) for p in camper_props)
assert all(isinstance(p.get('phones', []), list) for p in camper_props)
html = (ROOT/'index.html').read_text()
assert 'maximum-scale' not in html
assert 'Content-Security-Policy' in html
assert "script-src 'self'" in html
assert "script-src 'self' 'unsafe-inline'" not in html
assert 'onclick=' not in html and 'onkeydown=' not in html
assert 'label class="visuallyHidden" for="search"' in html
assert 'role="dialog"' in html
assert 'unhandledrejection' in (ROOT/'boot.js').read_text()
assert 'steder_v25_1393.geojson' in html
assert 'id="filterPanel"' in html
assert 'data-category-filter="waterfall"' in html
assert 'aria-live="polite"' in html
sw = (ROOT/'service-worker.js').read_text()
assert 'tile.openstreetmap' not in sw
assert 'upload.wikimedia' not in sw
json.load(open(ROOT/'manifest.webmanifest'))
package = json.load(open(ROOT/'package.json'))
assert package['scripts']['test']
app_js = (ROOT/'app.js').read_text()
assert app_js.lstrip().startswith('const DATA=')
assert 'onclick="' not in app_js and 'onkeydown="' not in app_js
assert (ROOT/'app.css').read_text().lstrip().startswith(':root')
assert (ROOT/'a11y-overrides.css').read_text().lstrip().startswith('/* Accessibility')
assert (ROOT/'src/app.source.js').read_text().lstrip().startswith('const DATA')
assert (ROOT/'src/index.source.html').read_text().lstrip().startswith('<!doctype html>')
assert not (ROOT/'tests/browser_audit.spec.js').read_text().lstrip().startswith('#')
print('PASS: structure, 1393 unique places, taxonomy, GeoJSON, search/filter hooks, accessibility and service worker')
