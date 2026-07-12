const DATA = Array.isArray(window.PLACES) ? window.PLACES : [];
const CAMPER_DATA = Array.isArray(window.CAMPER_POINTS)
  ? window.CAMPER_POINTS
  : [];
if (!DATA.length) {
  const m = "Ortsdaten konnten nicht geladen werden.";
  if (window.showBootError) showBootError(m);
  throw new Error(m);
}
if (localStorage.getItem("stederDataVersion") !== "25") {
  localStorage.removeItem("norwayFavs");
  localStorage.removeItem("norwayRoute");
  localStorage.setItem("stederDataVersion", "25");
}
const byId = new Map(DATA.map((x) => [x.id, x]));
const $ = (id) => document.getElementById(id),
  content = $("content"),
  sheet = $("sheet"),
  detail = $("detail"),
  search = $("search"),
  filterPanel = $("filterPanel"),
  filterSummary = $("filterSummary");
let favs = new Set(JSON.parse(localStorage.getItem("norwayFavs") || "[]")),
  route = JSON.parse(localStorage.getItem("norwayRoute") || "[]").filter((id) =>
    byId.has(id),
  ),
  mode = "map",
  activeCategoryGroups = new Set(),
  extraFilters = {
    known: false,
    local: false,
    discovery: false,
    photo: false,
    quality: false,
    near: false,
    saved: false,
  },
  user = null,
  userDot = null,
  userCircle = null;
const esc = (s) =>
  String(s || "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
const hav = (a, b, c, d) => {
  const R = 6371,
    p = Math.PI / 180,
    x = (c - a) * p,
    y = (d - b) * p,
    q =
      Math.sin(x / 2) ** 2 +
      Math.cos(a * p) * Math.cos(c * p) * Math.sin(y / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(q));
};
let lastFocus = null;
function showToast(message) {
  let t = document.getElementById("appToast");
  if (!t) {
    t = document.createElement("div");
    t.id = "appToast";
    t.className = "appToast";
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove("show"), 5000);
}
async function fetchWithTimeout(url, options = {}, ms = 12000) {
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), ms);
  try {
    const r = await fetch(url, { ...options, signal: controller.signal });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r;
  } catch (e) {
    if (e.name === "AbortError")
      throw new Error("Zeitüberschreitung beim Netzwerkdienst");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
function setBackgroundInert(active) {
  [...document.body.children].forEach((el) => {
    if (["SCRIPT"].includes(el.tagName)) return;
    el.inert = active ? el !== active : false;
  });
}
function openModal(el, trigger = document.activeElement) {
  lastFocus = trigger;
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  setBackgroundInert(el);
  requestAnimationFrame(() => el.focus());
}
function closeModal(el) {
  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
  setBackgroundInert(null);
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}
document.addEventListener("keydown", (e) => {
  const active = [detail, $("legal"), $("layerPanel")].find((x) =>
    x?.classList.contains("open"),
  );
  if (!active) {
    if (e.key === "Escape" && !filterPanel.hidden) {
      filterPanel.hidden = true;
      $("filterToggle").setAttribute("aria-expanded", "false");
      $("filterToggle").focus();
    }
    return;
  }
  if (e.key === "Escape") {
    e.preventDefault();
    if (active === $("legal")) {
      $("legalButton").setAttribute("aria-expanded", "false");
      $("legalTop").setAttribute("aria-expanded", "false");
    }
    if (active === $("layerPanel"))
      $("layersTop").setAttribute("aria-expanded", "false");
    closeModal(active);
    return;
  }
  if (e.key === "Tab") {
    const focusable = [
      ...active.querySelectorAll(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
      ),
    ];
    if (!focusable.length) return;
    const first = focusable[0],
      last = focusable.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
const map = L.map("map", { zoomControl: false }).setView([64.4, 15.2], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    'Kartendaten © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap-Mitwirkende</a> · ODbL',
}).addTo(map);
L.control.zoom({ position: "bottomright" }).addTo(map);
const routeWms = "https://wms.geonorge.no/skwms1/wms.friluftsruter2";
const routeLayers = {
  foot: L.tileLayer.wms(routeWms, {
    layers: "Fotrute",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    attribution: "Turruter © Kartverket",
  }),
  bike: L.tileLayer.wms(routeWms, {
    layers: "Sykkelrute",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    attribution: "Turruter © Kartverket",
  }),
  ski: L.tileLayer.wms(routeWms, {
    layers: "Skiloype",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    attribution: "Turruter © Kartverket",
  }),
  info: L.tileLayer.wms(routeWms, {
    layers: "Ruteinfopunkt",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    attribution: "Turruter © Kartverket",
  }),
};
Object.values(routeLayers).forEach((layer) => {
  let warned = false;
  layer.on("tileerror", () => {
    if (!warned) {
      warned = true;
      showToast("Offizielle Turrouten konnten nicht geladen werden.");
    }
  });
});
const camperLetters = {
  motorhome: "P",
  camping: "C",
  water: "W",
  toilets: "WC",
  ferry: "F",
  dump: "D",
};
const camperGroups = {};
const camperMarkers = {};
const camperMarkerById = new Map();
["motorhome", "camping", "water", "toilets", "ferry", "dump"].forEach((t) => {
  camperGroups[t] = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 42,
  });
  camperMarkers[t] = [];
});
function utilityTrustLabel(d) {
  return d.quality >= 75
    ? "Gut dokumentiert"
    : d.quality >= 55
      ? "Teilweise geprüft"
      : "Vor Ort prüfen";
}
function utilityPopup(d) {
  const bits = [
    d.openingHours
      ? `<b>Öffnung:</b> ${esc(d.openingHours)}`
      : "<b>Öffnung:</b> nicht eingetragen",
    d.fee ? `<b>Gebühr:</b> ${esc(d.fee)}` : "",
    d.wheelchair ? `<b>Rollstuhl:</b> ${esc(d.wheelchair)}` : "",
    d.access ? `<b>Zugang:</b> ${esc(d.access)}` : "",
  ]
    .filter(Boolean)
    .join("<br>");
  return `<div class="utilityPopup"><div class="uMeta">${esc(d.label)} · ${utilityTrustLabel(d)}</div><h3>${esc(d.name)}</h3><p>${esc(d.road || d.place)}</p>${bits ? `<p>${bits}</p>` : ""}${d.website ? `<p><a href="${esc(d.website)}" target="_blank" rel="noopener noreferrer">Website</a></p>` : ""}<p><a href="https://www.google.com/maps/search/?api=1&query=${d.lat},${d.lon}" target="_blank" rel="noopener noreferrer">Navigation</a> · <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">Datenquelle</a></p></div>`;
}
CAMPER_DATA.forEach((d) => {
  const ic = L.divIcon({
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<div class="utilityIcon utility-${d.type}" aria-hidden="true">${camperLetters[d.type]}</div>`,
  });
  const m = L.marker([d.lat, d.lon], { icon: ic, title: d.name }).bindPopup(
    () => utilityPopup(d),
    { maxWidth: 280 },
  );
  camperGroups[d.type].addLayer(m);
  camperMarkers[d.type].push(m);
  camperMarkerById.set(d.id, m);
});
const cluster = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 48,
});
map.addLayer(cluster);
const markers = new Map();
const markerClassMap = {
  "Wasser & stille Natur": "water",
  "Vann og landskap": "water",
  "Aussicht & Naturphänomene": "view",
  "Utsikt og fjell": "view",
  "Natur & besondere Orte": "nature",
  "Fjell og tur": "mountain",
  "Berge & Abenteuer": "mountain",
  "Küste & Inseln": "coast",
  "Kyst og øyer": "coast",
  "Fels, Höhlen & Geologie": "geology",
  "Geologi og særpreg": "geology",
  "Rast og avstikker": "roadtrip",
  "Hofladen & Lokalmat": "food",
  "Bäckerei & Café": "food",
  "Geschäfte & Märkte": "food",
};
function icon(g) {
  const c = markerClassMap[g] || "nature";
  return L.divIcon({
    className: "",
    iconSize: [21, 21],
    iconAnchor: [10, 19],
    html: `<div class="pin pin-${c}" aria-hidden="true"></div>`,
  });
}
DATA.forEach((d) => {
  const m = L.marker([d.lat, d.lon], { icon: icon(d.group), title: d.name });
  m.on("click", () => openDetail(d.id));
  markers.set(d.id, m);
  cluster.addLayer(m);
});
function save() {
  localStorage.setItem("norwayFavs", JSON.stringify([...favs]));
  localStorage.setItem("norwayRoute", JSON.stringify(route));
  $("routeCount").textContent = route.length;
}
function normalizeSearch(v) {
  return String(v || "")
    .toLowerCase()
    .replaceAll("ø", "o")
    .replaceAll("å", "a")
    .replaceAll("æ", "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
DATA.forEach((d) => {
  d._sn = normalizeSearch(d.name);
  d._sa = (d.aliases || []).map(normalizeSearch);
  d._sr = normalizeSearch(d.region);
  d._sc = normalizeSearch(d.cat + " " + d.categoryId);
  d._st = normalizeSearch(d.why + " " + d.note + " " + d.access);
  d._all = [d._sn, ...d._sa, d._sr, d._sc, d._st].join(" ");
});
function relevance(d, q) {
  if (!q) return 0;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (!tokens.every((t) => d._all.includes(t))) return -1;
  let s = 0;
  if (d._sn === q) s += 1000;
  else if (d._sn.startsWith(q)) s += 820;
  else if (d._sn.includes(q)) s += 650;
  if (d._sa.some((a) => a === q)) s += 760;
  else if (d._sa.some((a) => a.startsWith(q))) s += 620;
  else if (d._sa.some((a) => a.includes(q))) s += 500;
  if (d._sr === q) s += 430;
  else if (d._sr.startsWith(q)) s += 360;
  else if (d._sr.includes(q)) s += 280;
  if (d._sc === q) s += 400;
  else if (d._sc.includes(q)) s += 300;
  if (d._st.includes(q)) s += 120;
  tokens.forEach((t) => {
    if (d._sn.includes(t)) s += 90;
    if (d._sa.some((a) => a.includes(t))) s += 70;
    if (d._sc.includes(t)) s += 45;
    if (d._sr.includes(t)) s += 35;
    if (d._st.includes(t)) s += 8;
  });
  return s + d.quality / 10 + (d.photo ? 3 : 0);
}
function categoryMatches(d) {
  if (!activeCategoryGroups.size) return true;
  for (const group of activeCategoryGroups)
    if (group.split(",").includes(d.categoryId)) return true;
  return false;
}
function filtered() {
  const q = normalizeSearch(search.value),
    ranked = [];
  for (const d of DATA) {
    if (!categoryMatches(d)) continue;
    const fameFiltered =
      extraFilters.known || extraFilters.local || extraFilters.discovery;
    if (
      fameFiltered &&
      !(
        (extraFilters.known && d.fameId === "highlight") ||
        (extraFilters.local && d.fameId === "local_tip") ||
        (extraFilters.discovery && d.fameId === "discovery")
      )
    )
      continue;
    if (extraFilters.photo && !d.photo) continue;
    if (extraFilters.quality && d.quality < 78) continue;
    if ((mode === "fav" || extraFilters.saved) && !favs.has(d.id)) continue;
    const score = relevance(d, q);
    if (score < 0) continue;
    const distance = user ? hav(user[0], user[1], d.lat, d.lon) : null;
    if ((mode === "near" || extraFilters.near) && user && distance > 50)
      continue;
    ranked.push({ d, score, distance });
  }
  ranked.sort((a, b) => {
    if (q && b.score !== a.score) return b.score - a.score;
    if (
      (mode === "near" || extraFilters.near) &&
      user &&
      a.distance !== b.distance
    )
      return a.distance - b.distance;
    if (b.d.quality !== a.d.quality) return b.d.quality - a.d.quality;
    if (Boolean(b.d.photo) !== Boolean(a.d.photo))
      return Number(Boolean(b.d.photo)) - Number(Boolean(a.d.photo));
    return a.d.name.localeCompare(b.d.name, "de");
  });
  return ranked.map((x) => x.d);
}
function activeFilterLabels() {
  const labels = [...activeCategoryGroups]
    .map((key) => ({
      type: "category",
      key,
      label: document
        .querySelector(`[data-category-filter="${key}"]`)
        ?.textContent.trim(),
    }))
    .filter((x) => x.label);
  if (extraFilters.known)
    labels.push({ type: "extra", key: "known", label: "Highlights" });
  if (extraFilters.local)
    labels.push({ type: "extra", key: "local", label: "Lokale Tipps" });
  if (extraFilters.discovery)
    labels.push({ type: "extra", key: "discovery", label: "Entdeckungen" });
  if (extraFilters.quality)
    labels.push({ type: "extra", key: "quality", label: "Gut dokumentiert" });
  if (extraFilters.photo)
    labels.push({ type: "extra", key: "photo", label: "Mit Bild" });
  if (extraFilters.near)
    labels.push({ type: "extra", key: "near", label: "In meiner Nähe" });
  if (extraFilters.saved)
    labels.push({ type: "extra", key: "saved", label: "Gespeichert" });
  return labels;
}
function updateFilterSummary(count) {
  const labels = activeFilterLabels(),
    q = search.value.trim();
  const chips = [
    ...labels.map(
      (x) =>
        `<button type="button" class="activeFilter" data-remove-type="${x.type}" data-remove-key="${esc(x.key)}" aria-label="Filter ${esc(x.label)} entfernen">${esc(x.label)} ×</button>`,
    ),
    ...(q
      ? [
          `<button type="button" class="activeFilter" data-remove-type="query" aria-label="Suchbegriff entfernen">„${esc(q)}“ ×</button>`,
        ]
      : []),
  ];
  filterSummary.innerHTML = `<span class="resultCount">${count} Treffer</span>${chips.join("")}`;
}
function fameLabel(d) {
  return d.fameId === "highlight"
    ? "Bekannter Ort"
    : d.fameId === "discovery"
      ? "Entdeckung"
      : "Lokaler Tipp";
}
function trustLabel(d) {
  return d.quality >= 78
    ? "Gut dokumentiert"
    : d.quality >= 58
      ? "Teilweise geprüft"
      : "Vor Ort prüfen";
}
function trustClass(d) {
  return d.quality >= 78 ? "qa" : d.quality >= 58 ? "qb" : "qc";
}
function trustSignals(d) {
  const exact = /openstreetmap\.org\/(node|way|relation)\//.test(
    d.source || "",
  );
  const signals = [
    [exact, "Exakte OpenStreetMap-Quelle"],
    [Boolean(d.research), "Zusätzlicher Recherchelink"],
    [Boolean(d.photo && d.licenseUrl), "Frei lizenziertes Bild"],
    [Boolean(d.access), "Zugangs- oder Datenhinweis"],
  ];
  return `<ul class="trustSignals">${signals.map(([ok, label]) => `<li class="${ok ? "ok" : "missing"}"><span aria-hidden="true">${ok ? "✓" : "–"}</span>${label}</li>`).join("")}</ul>`;
}
function card(d) {
  const km = user
    ? ` · ${hav(user[0], user[1], d.lat, d.lon).toFixed(1)} km`
    : "";
  return `<button type="button" class="place" data-action="open-detail" data-id="${d.id}" aria-label="${esc(d.name)} – Details öffnen">${d.photo ? `<img class="thumb" loading="lazy" src="${esc(d.photo)}" alt="${esc(d.name)}">` : `<span class="thumb ph" aria-hidden="true"></span>`}<span class="placeText"><span class="placeBadges"><span class="tag ${d.fameId === "highlight" ? "known" : ""}">${fameLabel(d)}</span><span class="qualityBadge ${trustClass(d)}">${trustLabel(d)}</span></span><span class="placeTitle">${esc(d.name)}</span><span class="placeMeta">${esc(d.cat)} · ${esc(d.region)}${km}</span></span><span class="arrow" aria-hidden="true">›</span></button>`;
}
function render() {
  const a = filtered();
  if (mode === "route") return renderRoute();
  updateFilterSummary(a.length);
  content.innerHTML = a.length
    ? a.slice(0, 120).map(card).join("") +
      (a.length > 120
        ? `<div class="empty">Weitere ${a.length - 120} Orte sind auf der Karte sichtbar.</div>`
        : "")
    : '<div class="empty">Keine Orte mit dieser Suche und diesen Filtern gefunden.</div>';
  cluster.clearLayers();
  a.forEach((d) => cluster.addLayer(markers.get(d.id)));
}
function focusPin(id) {
  const d = byId.get(id);
  map.setView([d.lat, d.lon], 13);
  openDetail(id);
}
window.focusPin = focusPin;
function relatedPlaces(d) {
  return DATA.filter((x) => x.id !== d.id && x.categoryId === d.categoryId)
    .map((x) => ({
      x,
      dist: hav(d.lat, d.lon, x.lat, x.lon),
      rank: x.quality + (x.photo ? 10 : 0),
    }))
    .sort((a, b) => b.rank - a.rank || a.dist - b.dist)
    .slice(0, 3);
}
function relatedHtml(d) {
  const a = relatedPlaces(d);
  return a.length
    ? `<div class="related"><h3>Ähnliche Orte in der Nähe</h3>${a.map(({ x, dist }) => `<button type="button" data-action="open-detail" data-id="${x.id}"><span>${esc(x.name)}</span><small>${dist < 10 ? dist.toFixed(1) : Math.round(dist)} km · ${esc(x.region)} · ${trustLabel(x)}</small></button>`).join("")}</div>`
    : "";
}
function openDetail(id) {
  const d = byId.get(id);
  detail.innerHTML = `<div class="heroimg">${d.photo ? `<img src="${esc(d.photo)}" referrerpolicy="no-referrer" alt="${esc(d.name)}">` : '<div class="noimg">Kein eindeutig zugeordnetes Bild</div>'}${d.nearbyPhoto ? '<span class="photoTag">Umgebungsfoto ≤ 1,2 km</span>' : ""}<button type="button" class="close" aria-label="Details schließen" data-action="close-detail">Schließen</button></div><div class="detailBody"><div class="detailHeader"><div><span class="tag ${d.fameId === "highlight" ? "known" : ""}">${fameLabel(d)}</span><h1>${esc(d.name)}</h1><div class="meta">${esc(d.cat)} · ${esc(d.region)}</div></div><button type="button" class="saveTop ${favs.has(d.id) ? "active" : ""}" data-fav-id="${d.id}" aria-label="${favs.has(d.id) ? "Ort aus gespeicherten entfernen" : "Ort speichern"}" data-action="toggle-fav" data-id="${d.id}">${favs.has(d.id) ? "Gespeichert" : "Speichern"}</button></div><section class="detailSection"><h2>Warum lohnt sich der Ort?</h2><p class="why">${esc(d.why)}</p></section><section class="detailSection"><h2>Wichtige Hinweise</h2>${d.access ? `<div class="access"><b>Zugang:</b> ${esc(d.access)}</div>` : ""}<div class="note">${esc(d.note)}</div></section><section class="trustBox"><div><h2>Datenvertrauen</h2><span class="qualityBadge ${trustClass(d)}">${trustLabel(d)}</span></div><p>Bewertet die Dokumentation, nicht Schönheit, Sicherheit oder aktuelle Befahrbarkeit.</p>${trustSignals(d)}</section><div class="actions"><a class="primary" href="${esc(d.maps)}" target="_blank" rel="noopener noreferrer">Navigation starten</a><button data-action="add-route" data-id="${d.id}">Zur Route hinzufügen</button><a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">Datenquelle</a>${d.research ? `<a href="${esc(d.research)}" target="_blank" rel="noopener noreferrer">Recherche</a>` : ""}<a href="${esc(d.commonsSearch)}" target="_blank" rel="noopener noreferrer">Commons-Bilder</a></div>${d.photo ? `<div class="photoCredit"><strong>Bild:</strong> ${esc(d.caption)}<br>${esc(d.artist)} · <a href="${esc(d.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(d.license)}</a> · <a href="${esc(d.photoPage)}" target="_blank" rel="noopener noreferrer">Originaldatei</a></div>` : ""}${relatedHtml(d)}</div>`;
  openModal(detail);
}
window.closeDetail = () => closeModal(detail);
window.toggleFav = (id, b) => {
  favs.has(id) ? favs.delete(id) : favs.add(id);
  const on = favs.has(id);
  document.querySelectorAll(`[data-fav-id="${id}"]`).forEach((el) => {
    el.classList.toggle("active", on);
    el.textContent = on ? "Gespeichert" : "Speichern";
    el.setAttribute(
      "aria-label",
      on ? "Ort aus gespeicherten entfernen" : "Ort speichern",
    );
  });
  save();
  if (mode === "fav") render();
};
window.addRoute = (id, b) => {
  if (!route.includes(id)) route.push(id);
  save();
  b && (b.textContent = "In Route");
};
let tripFrom = "",
  tripTo = "",
  tripCorridor = 15,
  tripStart = null,
  tripEnd = null,
  tripStatusText = "",
  plannedSuggestions = [];
let roadTripLine = null;
const routeSupport = L.layerGroup().addTo(map);
function nearestRouteInfo(lat, lon, samples) {
  let best = 1e9,
    idx = 0;
  for (let i = 0; i < samples.length; i++) {
    const d = hav(lat, lon, samples[i][1], samples[i][0]);
    if (d < best) {
      best = d;
      idx = i;
    }
  }
  return { distance: best, index: idx };
}
const geocodeCache = new Map(
  JSON.parse(localStorage.getItem("stederGeocodeCache") || "[]"),
);
async function geocodeNorway(q) {
  const key = q.trim().toLowerCase();
  if (geocodeCache.has(key)) return geocodeCache.get(key);
  const u =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=no&q=" +
    encodeURIComponent(q);
  let r;
  try {
    r = await fetchWithTimeout(
      u,
      { headers: { "Accept-Language": "de,no" } },
      12000,
    );
  } catch (e) {
    throw new Error(
      "Ortssuche momentan nicht erreichbar. Bitte später erneut versuchen.",
    );
  }
  let d;
  try {
    d = await r.json();
  } catch {
    throw new Error("Ortssuche hat ungültige Daten geliefert.");
  }
  if (!d.length) throw new Error("Ort nicht gefunden: " + q);
  const v = { lat: +d[0].lat, lon: +d[0].lon, name: d[0].display_name };
  geocodeCache.set(key, v);
  localStorage.setItem(
    "stederGeocodeCache",
    JSON.stringify([...geocodeCache].slice(-30)),
  );
  return v;
}
function renderTripSuggestions() {
  const el = document.getElementById("tripSuggestions");
  if (!el) return;
  el.innerHTML = plannedSuggestions.length
    ? `<h3 class="routeSectionTitle">Empfohlene Stopps entlang der Strecke</h3>${plannedSuggestions.map(card).join("")}`
    : "";
}
window.planRoadTrip = async () => {
  tripFrom = document.getElementById("tripFrom").value.trim();
  tripTo = document.getElementById("tripTo").value.trim();
  tripCorridor = +document.getElementById("tripCorridor").value;
  if (!tripFrom || !tripTo) return;
  const status = document.getElementById("tripStatus");
  status.textContent = "Route wird berechnet …";
  try {
    tripStart = await geocodeNorway(tripFrom);
    tripEnd = await geocodeNorway(tripTo);
    const u = `https://router.project-osrm.org/route/v1/driving/${tripStart.lon},${tripStart.lat};${tripEnd.lon},${tripEnd.lat}?overview=full&geometries=geojson&steps=false`;
    let rr;
    try {
      rr = await fetchWithTimeout(u, {}, 20000);
    } catch (e) {
      throw new Error(
        "Routenserver momentan nicht erreichbar. Bitte später erneut versuchen.",
      );
    }
    let rd;
    try {
      rd = await rr.json();
    } catch {
      throw new Error("Routenserver hat ungültige Daten geliefert.");
    }
    if (!rd.routes?.length) throw new Error("Keine Fahrstrecke gefunden");
    const r = rd.routes[0],
      coords = r.geometry.coordinates,
      step = Math.max(1, Math.floor(coords.length / 260)),
      samples = coords.filter((_, i) => i % step === 0);
    if (samples.at(-1) !== coords.at(-1)) samples.push(coords.at(-1));
    if (roadTripLine) map.removeLayer(roadTripLine);
    roadTripLine = L.geoJSON(r.geometry, {
      style: { color: "#263b46", weight: 4, opacity: 0.8 },
    }).addTo(map);
    routeSupport.clearLayers();
    const allCandidates = DATA.map((x) => {
      const n = nearestRouteInfo(x.lat, x.lon, samples);
      return {
        x,
        n,
        rank:
          x.quality +
          (x.photo ? 12 : 0) +
          (x.fameId === "highlight" ? 5 : 0) -
          n.distance * 1.5,
      };
    }).filter((v) => v.n.distance <= tripCorridor);
    const bins = Array.from({ length: 8 }, () => []);
    allCandidates.forEach((v) =>
      bins[
        Math.min(
          7,
          Math.floor((v.n.index / Math.max(1, samples.length - 1)) * 8),
        )
      ].push(v),
    );
    const candidates = [];
    bins.forEach((bin) => {
      bin.sort((a, b) => b.rank - a.rank);
      const cats = {};
      for (const v of bin) {
        if ((cats[v.x.cat] || 0) >= 1) continue;
        cats[v.x.cat] = (cats[v.x.cat] || 0) + 1;
        candidates.push(v);
        if (Object.values(cats).reduce((a, b) => a + b, 0) >= 5) break;
      }
    });
    candidates.sort((a, b) => a.n.index - b.n.index);
    plannedSuggestions = candidates.map((v) => v.x);
    const facilityCorridor = Math.min(8, tripCorridor),
      fac = CAMPER_DATA.map((x) => ({
        x,
        n: nearestRouteInfo(x.lat, x.lon, samples),
      }))
        .filter(
          (v) =>
            v.n.distance <= facilityCorridor &&
            ["motorhome", "camping", "water", "toilets", "ferry"].includes(
              v.x.type,
            ),
        )
        .sort((a, b) => b.x.quality - a.x.quality)
        .slice(0, 120);
    fac.forEach((v) => routeSupport.addLayer(camperMarkerById.get(v.x.id)));
    const cc = {};
    fac.forEach((v) => (cc[v.x.type] = (cc[v.x.type] || 0) + 1));
    tripStatusText = `${(r.distance / 1000).toFixed(0)} km · ${Math.round((r.duration / 3600) * 10) / 10} Std. · ${plannedSuggestions.length} empfohlene Stopps`;
    status.textContent =
      tripStatusText +
      (fac.length
        ? ` · Versorgung: ${cc.motorhome || 0} Stellplätze, ${cc.water || 0} Wasser, ${cc.toilets || 0} Toiletten`
        : ``);
    renderTripSuggestions();
    map.fitBounds(roadTripLine.getBounds(), { padding: [35, 35] });
  } catch (e) {
    status.textContent = e.message;
  }
};
function renderRoute() {
  const manual = route.length
    ? `<ol class="routeListSemantic">${route
        .map((id, i) => {
          const d = byId.get(id);
          return `<li class="routeRow"><span class="num" aria-hidden="true">${i + 1}</span><button type="button" class="routePlace" data-action="open-detail" data-id="${id}"><strong>${esc(d.name)}</strong><small>${esc(d.region)}</small></button><span class="routeControls"><button type="button" data-action="route-move" data-index="${i}" data-direction="-1" aria-label="${esc(d.name)} nach oben verschieben">↑</button><button type="button" data-action="route-move" data-index="${i}" data-direction="1" aria-label="${esc(d.name)} nach unten verschieben">↓</button><button type="button" data-action="route-remove" data-index="${i}" aria-label="${esc(d.name)} aus Route entfernen">×</button></span></li>`;
        })
        .join("")}</ol>`
    : '<div class="empty compact">Noch keine persönlichen Stopps gespeichert.</div>';
  const limitNote =
    route.length > 8
      ? `<p class="routeLimit warning">Google Maps übernimmt maximal 8 persönliche Zwischenstopps. ${route.length - 8} weitere Stopps bleiben in deiner Liste, werden aber nicht exportiert.</p>`
      : '<p class="routeLimit">Bis zu 8 persönliche Zwischenstopps werden an Google Maps übergeben.</p>';
  content.innerHTML = `<div class="routePlanner"><label>Start<input id="tripFrom" value="${esc(tripFrom)}" placeholder="z. B. Oslo"></label><label>Ziel<input id="tripTo" value="${esc(tripTo)}" placeholder="z. B. Bergen"></label><div class="routePlanRow"><select id="tripCorridor"><option value="5" ${tripCorridor === 5 ? "selected" : ""}>5 km Umweg</option><option value="15" ${tripCorridor === 15 ? "selected" : ""}>15 km Umweg</option><option value="30" ${tripCorridor === 30 ? "selected" : ""}>30 km Umweg</option></select><button type="button" data-action="plan-roadtrip">Stopps finden</button></div><div id="tripStatus" class="tripStatus" role="status">${esc(tripStatusText)}</div></div><div id="tripSuggestions"></div><h3 class="routeSectionTitle">Meine Stopps</h3>${manual}${limitNote}<div class="routeOpen"><button type="button" data-action="open-route">In Google Maps öffnen</button></div>`;
  renderTripSuggestions();
}
window.move = (i, x) => {
  let j = i + x;
  if (j < 0 || j >= route.length) return;
  [route[i], route[j]] = [route[j], route[i]];
  save();
  renderRoute();
};
window.removeStop = (i) => {
  route.splice(i, 1);
  save();
  renderRoute();
};
window.openRoute = () => {
  const stops = route.slice(0, 8).map((id) => byId.get(id));
  if (tripStart && tripEnd) {
    const w = stops.map((x) => `${x.lat},${x.lon}`).join("|");
    return open(
      `https://www.google.com/maps/dir/?api=1&origin=${tripStart.lat},${tripStart.lon}&destination=${tripEnd.lat},${tripEnd.lon}&waypoints=${encodeURIComponent(w)}&travelmode=driving`,
    );
  }
  const a = stops;
  if (!a.length) return;
  if (a.length === 1) return open(a[0].maps);
  const o = a[0],
    z = a.at(-1),
    w = a
      .slice(1, -1)
      .map((x) => `${x.lat},${x.lon}`)
      .join("|");
  open(
    `https://www.google.com/maps/dir/?api=1&origin=${o.lat},${o.lon}&destination=${z.lat},${z.lon}&waypoints=${encodeURIComponent(w)}&travelmode=driving`,
  );
};
function setMode(v) {
  mode = v;
  document
    .querySelectorAll(".nav button")
    .forEach((b) => b.classList.toggle("active", b.dataset.view === v));
  sheet.className = "sheet " + (v === "map" ? "mid" : "full");
  if (v === "near" && !user) locate();
  render();
}
document
  .querySelectorAll(".nav button")
  .forEach((b) => (b.onclick = () => setMode(b.dataset.view)));
filterSummary.onclick = (e) => {
  const b = e.target.closest("[data-remove-type]");
  if (!b) return;
  const type = b.dataset.removeType,
    key = b.dataset.removeKey;
  if (type === "category") {
    activeCategoryGroups.delete(key);
    const el = document.querySelector(`[data-category-filter="${key}"]`);
    if (el) {
      el.classList.remove("active");
      el.setAttribute("aria-pressed", "false");
    }
  } else if (type === "extra") {
    const inputIds = {
      known: "filterKnown",
      local: "filterLocal",
      discovery: "filterDiscovery",
      photo: "filterPhoto",
      quality: "filterQuality",
      near: "filterNear",
      saved: "filterSaved",
    };
    if (inputIds[key]) $(inputIds[key]).checked = false;
    if (key in extraFilters) extraFilters[key] = false;
  } else if (type === "query") search.value = "";
  render();
};
$("filterToggle").onclick = () => {
  const open = filterPanel.hidden;
  filterPanel.hidden = !open;
  $("filterToggle").setAttribute("aria-expanded", String(open));
};
document.querySelectorAll("[data-category-filter]").forEach(
  (b) =>
    (b.onclick = () => {
      const key = b.dataset.categoryFilter;
      activeCategoryGroups.has(key)
        ? activeCategoryGroups.delete(key)
        : activeCategoryGroups.add(key);
      const on = activeCategoryGroups.has(key);
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
      render();
    }),
);
$("filterKnown").onchange = (e) => {
  extraFilters.known = e.target.checked;
  render();
};
$("filterLocal").onchange = (e) => {
  extraFilters.local = e.target.checked;
  render();
};
$("filterDiscovery").onchange = (e) => {
  extraFilters.discovery = e.target.checked;
  render();
};
$("filterPhoto").onchange = (e) => {
  extraFilters.photo = e.target.checked;
  render();
};
$("filterQuality").onchange = (e) => {
  extraFilters.quality = e.target.checked;
  render();
};
$("filterNear").onchange = (e) => {
  extraFilters.near = e.target.checked;
  if (e.target.checked && !user) locate();
  else render();
};
$("filterSaved").onchange = (e) => {
  extraFilters.saved = e.target.checked;
  render();
};
$("resetFilters").onclick = () => {
  activeCategoryGroups.clear();
  extraFilters = {
    known: false,
    local: false,
    discovery: false,
    photo: false,
    quality: false,
    near: false,
    saved: false,
  };
  document.querySelectorAll("[data-category-filter]").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-pressed", "false");
  });
  [
    "filterKnown",
    "filterLocal",
    "filterDiscovery",
    "filterPhoto",
    "filterQuality",
    "filterNear",
    "filterSaved",
  ].forEach((id) => ($(id).checked = false));
  search.value = "";
  render();
};
let searchTimer;
search.oninput = () => {
  sheet.className = "sheet full";
  clearTimeout(searchTimer);
  searchTimer = setTimeout(render, 80);
};
let pos = 1;
$("handle").onclick = () => {
  pos = (pos + 1) % 3;
  sheet.className = "sheet " + (pos === 0 ? "" : pos === 1 ? "mid" : "full");
};
function locate() {
  if (!navigator.geolocation) {
    showToast("Standortfunktion wird von diesem Browser nicht unterstützt.");
    extraFilters.near = false;
    if ($("filterNear")) $("filterNear").checked = false;
    render();
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (p) => {
      user = [p.coords.latitude, p.coords.longitude];
      userDot && map.removeLayer(userDot);
      userCircle && map.removeLayer(userCircle);
      userDot = L.circleMarker(user, {
        radius: 8,
        color: "white",
        weight: 3,
        fillColor: "#1976d2",
        fillOpacity: 1,
      }).addTo(map);
      userCircle = L.circle(user, {
        radius: 50000,
        color: "#1976d2",
        weight: 1,
        fillOpacity: 0.04,
      }).addTo(map);
      map.setView(user, 9);
      if (mode === "near" || extraFilters.near) render();
    },
    () => {
      showToast("Standort konnte nicht bestimmt werden.");
      extraFilters.near = false;
      if ($("filterNear")) $("filterNear").checked = false;
      render();
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
  );
}
$("locate").onclick = locate;
$("random").onclick = () => {
  let a = DATA.filter((d) => d.fameId !== "highlight");
  focusPin(a[Math.floor(Math.random() * a.length)].id);
};
$("layersTop").onclick = (e) => {
  $("layersTop").setAttribute("aria-expanded", "true");
  openModal($("layerPanel"), e.currentTarget);
};
$("layerClose").onclick = () => {
  $("layersTop").setAttribute("aria-expanded", "false");
  closeModal($("layerPanel"));
};
document.querySelectorAll("[data-route-layer]").forEach(
  (cb) =>
    (cb.onchange = () => {
      const l = routeLayers[cb.dataset.routeLayer];
      cb.checked ? l.addTo(map) : map.removeLayer(l);
    }),
);
document.querySelectorAll("[data-camper-layer]").forEach(
  (cb) =>
    (cb.onchange = () => {
      const l = camperGroups[cb.dataset.camperLayer];
      cb.checked ? l.addTo(map) : map.removeLayer(l);
    }),
);
function openLegal(e) {
  $("legalButton").setAttribute("aria-expanded", "true");
  $("legalTop").setAttribute("aria-expanded", "true");
  openModal($("legal"), e.currentTarget);
}
$("legalButton").onclick = openLegal;
$("legalTop").onclick = openLegal;
$("legalClose").onclick = () => {
  $("legalButton").setAttribute("aria-expanded", "false");
  $("legalTop").setAttribute("aria-expanded", "false");
  closeModal($("legal"));
};
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action,
    id = Number(target.dataset.id),
    index = Number(target.dataset.index);
  if (action === "open-detail") focusPin(id);
  else if (action === "close-detail") closeDetail();
  else if (action === "toggle-fav") toggleFav(id, target);
  else if (action === "add-route") addRoute(id, target);
  else if (action === "plan-roadtrip") planRoadTrip();
  else if (action === "open-route") openRoute();
  else if (action === "route-move")
    move(index, Number(target.dataset.direction));
  else if (action === "route-remove") removeStop(index);
});
if (!CAMPER_DATA.length) showToast("Camper-Ebene konnte nicht geladen werden.");
save();
render();
if ("serviceWorker" in navigator && location.protocol.startsWith("http"))
  navigator.serviceWorker
    .register("service-worker.js")
    .catch(() => showToast("Offline-Funktion konnte nicht aktiviert werden."));
function online() {
  $("offline").style.display = navigator.onLine ? "none" : "block";
}
addEventListener("online", online);
addEventListener("offline", online);
online();
