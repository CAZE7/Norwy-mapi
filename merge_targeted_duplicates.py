#!/usr/bin/env python3
"""Normalize camper display names, phone lists and trust labels."""
import json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parents[1]
p = ROOT/'camper_layers.js'
s = p.read_text()
data = json.loads(s[len('window.CAMPER_POINTS='):-2])
def trust(score):
    return 'Gut dokumentiert' if score >= 75 else 'Teilweise geprüft' if score >= 55 else 'Vor Ort prüfen'
def split_phones(value):
    values = [re.sub(r'\s+', ' ', v).strip() for v in re.split(r'\s*[;,/]\s*', value or '')]
    return list(dict.fromkeys(v for v in values if v))
def useful_road(road):
    return bool(road and not re.fullmatch(r'\d+', road.strip()))
def contextual(label, item):
    road, place = item.get('road','').strip(), item.get('place','').strip()
    if useful_road(road) and place:
        return f'{label} · {road}, {place}'
    if place:
        return f'{label} · {place}'
    if useful_road(road):
        return f'{label} · {road}'
    return label
for item in data:
    raw = re.sub(r'\s+', ' ', item.get('name','')).strip()
    item['rawName'] = raw
    lower = raw.casefold()
    if lower in {'wohnwagenstellplatz','wohnmobilstellplatz'} or re.fullmatch(r'wohnmobilstellplatz\s*·\s*\d+', lower):
        item['name'] = contextual('Wohnmobilstellplatz', item)
    elif lower in {'well','drikkevann','fresh cold spring water','drinking water'}:
        item['name'] = contextual('Trinkwasser', item)
    elif lower.startswith('öffentliche toilette'):
        item['name'] = contextual('Öffentliche Toilette', item)
    else:
        item['name'] = raw
    item['phones'] = split_phones(item.get('phone',''))
    item['phone'] = ' | '.join(item['phones'])
    item['qualityLabel'] = trust(item['quality'])
p.write_text('window.CAMPER_POINTS='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
geo = json.loads((ROOT/'camper_layers.geojson').read_text())
by_id = {x['id']:x for x in data}
for feature in geo['features']:
    item = by_id[feature['properties']['id']]
    feature['properties'].update({
        'name': item['name'], 'rawName': item['rawName'], 'phones': item['phones'],
        'phone': item['phone'], 'qualityLabel': item['qualityLabel']
    })
(ROOT/'camper_layers.geojson').write_text(json.dumps(geo,ensure_ascii=False,separators=(',',':')))
print('cleaned camper points:', len(data))
