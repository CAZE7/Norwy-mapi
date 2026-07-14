/* app.js – Steder i Norge v26.2
 * App-Logik: Karte, Suche, Liste, Favoriten, Routen, Detail-Modal
 * Erwartet im globalen Scope: window.PLACES (places-data.js) und window.CAMPER_POINTS (camper_layers.js)
 */
(function () {
  'use strict';

  /* ── Hilfsfunktionen ─────────────────────────────────── */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function showToast(msg) {
    let t = qs('#toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'appToast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  }
  window.showToast = showToast;

  function openModal(el) {
    el.hidden = false;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    el.focus();
  }
  function closeModal(el) {
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    setTimeout(() => { el.hidden = true; }, 280);
  }
  window.closeModal = closeModal;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      qsa('.detail.open, .legal.open, .layerPanel.open').forEach(closeModal);
    }
  });

  /* ── Favoriten (localStorage) ────────────────────────── */
  const FAV_KEY = 'norwy_favs';
  function loadFavs() {
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); }
    catch { return new Set(); }
  }
  function saveFavs(set) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify([...set])); } catch {}
  }
  let favs = loadFavs();

  /* ── Routen (localStorage) ───────────────────────────── */
  const ROUTE_KEY = 'norwy_route';
  function loadRoute() {
    try { return JSON.parse(localStorage.getItem(ROUTE_KEY) || '[]'); }
    catch { return []; }
  }
  function saveRoute(arr) {
    try { localStorage.setItem(ROUTE_KEY, JSON.stringify(arr)); } catch {}
  }
  let routeIds = loadRoute();

  /* ── Karte initialisieren ────────────────────────────── */
  const map = L.map('map', {
    center: [65, 15],
    zoom: 5,
    zoomControl: false,
    attributionControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  /* ── Standort ────────────────────────────────────────── */
  qs('#locateBtn').addEventListener('click', () => {
    map.locate({ setView: true, maxZoom: 13 });
  });
  map.on('locationerror', () => showToast('Standort konnte nicht ermittelt werden.'));

  /* ── Kategorien aus Daten ────────────────────────────── */
  const PLACES = window.PLACES || [];
  const CAMPER_POINTS = window.CAMPER_POINTS || [];

  const categories = [...new Set(PLACES.map(p => p.category).filter(Boolean))].sort();
  const regions    = [...new Set(PLACES.map(p => p.region).filter(Boolean))].sort();

  /* ── Filter-State ────────────────────────────────────── */
  let activeCategories = new Set();
  let showOnlyKnown    = false;
  let showOnlyFavs     = false;
  let currentSearch    = '';

  /* ── Marker-Cluster ──────────────────────────────────── */
  const cluster = L.markerClusterGroup({ chunkedLoading: true });
  map.addLayer(cluster);

  const markerMap = new Map();

  function categoryColor(cat) {
    const map = {
      water: '#4A90E2', view: '#E85D75', nature: '#50C878',
      mountain: '#8B4513', coast: '#00CED1', geology: '#9370DB',
      roadtrip: '#FF8C00', food: '#FFD700',
    };
    return map[(cat || '').toLowerCase()] || '#405b49';
  }

  function makeIcon(place) {
    const color = categoryColor(place.category);
    return L.divIcon({
      className: '',
      html: `<div class="pin pin-${(place.category||'').toLowerCase()}" style="background:${color}"></div>`,
      iconSize: [21, 21],
      iconAnchor: [10, 21],
    });
  }

  function buildMarkers() {
    cluster.clearLayers();
    markerMap.clear();
    const visible = filteredPlaces();
    visible.forEach(p => {
      if (!p.lat || !p.lng) return;
      const m = L.marker([p.lat, p.lng], { icon: makeIcon(p) });
      m.bindPopup(`<b>${p.name}</b><br><small>${p.region || ''}</small>`);
      m.on('click', () => openDetail(p));
      cluster.addLayer(m);
      markerMap.set(p.id || p.name, m);
    });
  }

  /* ── Filter-Logik ────────────────────────────────────── */
  function filteredPlaces() {
    const q = currentSearch.toLowerCase();
    return PLACES.filter(p => {
      if (showOnlyFavs && !favs.has(p.id || p.name)) return false;
      if (showOnlyKnown && !p.visited) return false;
      if (activeCategories.size && !activeCategories.has(p.category)) return false;
      if (q && ![
        p.name, p.region, p.category, p.description, p.why
      ].some(v => (v || '').toLowerCase().includes(q))) return false;
      return true;
    });
  }

  function refresh() {
    buildMarkers();
    renderList();
    renderRoute();
    renderFavs();
    updateFilterSummary();
  }

  /* ── Suchfeld ────────────────────────────────────────── */
  const searchInput = qs('#search');
  searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value.trim();
    refresh();
  });

  /* ── Filter-Panel ────────────────────────────────────── */
  const filterToggle = qs('#filterToggle');
  const filterPanel  = qs('#filterPanel');
  filterToggle.addEventListener('click', () => {
    const open = filterPanel.hidden;
    filterPanel.hidden = !open;
    filterToggle.setAttribute('aria-expanded', String(open));
  });

  const catFilters = qs('#categoryFilters');
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filterChip';
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      if (activeCategories.has(cat)) { activeCategories.delete(cat); btn.classList.remove('active'); }
      else { activeCategories.add(cat); btn.classList.add('active'); }
      refresh();
    });
    catFilters.appendChild(btn);
  });

  const extraFilters = qs('#extraFilters');
  [['Nur Favoriten', () => { showOnlyFavs = !showOnlyFavs; refresh(); return showOnlyFavs; }],
   ['Nur besucht',   () => { showOnlyKnown = !showOnlyKnown; refresh(); return showOnlyKnown; }]
  ].forEach(([label, toggle]) => {
    const btn = document.createElement('button');
    btn.className = 'filterChip';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      const active = toggle();
      btn.classList.toggle('active', active);
    });
    extraFilters.appendChild(btn);
  });

  function updateFilterSummary() {
    const el = qs('#filterSummary');
    if (!el) return;
    const n = filteredPlaces().length;
    el.textContent = n < PLACES.length ? `${n} von ${PLACES.length} Orten` : '';
  }

  /* ── Ortsliste ───────────────────────────────────────── */
  const content = qs('#content');

  function renderList() {
    if (currentTab !== 'list') return;
    content.style.display = '';
    const places = filteredPlaces();
    if (places.length === 0) {
      content.innerHTML = '<p style="text-align:center;padding:32px;color:var(--muted)">Keine Orte gefunden</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    places.slice(0, 200).forEach(p => {
      const div = document.createElement('div');
      div.className = 'place';
      div.setAttribute('role', 'button');
      div.setAttribute('tabindex', '0');
      const isFav = favs.has(p.id || p.name);
      div.innerHTML = `
        <div class="thumb ph" aria-hidden="true"></div>
        <div>
          <h3>${p.name}</h3>
          <small>${[p.region, p.category].filter(Boolean).join(' · ')}</small>
          ${isFav ? '<span class="tag known">★ Favorit</span>' : ''}
        </div>
        <span class="arrow" aria-hidden="true">›</span>`;
      if (p.photo) {
        const img = div.querySelector('.thumb');
        img.classList.remove('ph');
        img.outerHTML = `<img class="thumb" src="${p.photo}" alt="" loading="lazy">`;
      }
      div.addEventListener('click', () => openDetail(p));
      div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openDetail(p); });
      frag.appendChild(div);
    });
    content.innerHTML = '';
    content.appendChild(frag);
  }

  /* ── Routen-Tab ──────────────────────────────────────── */
  function renderRoute() {
    if (currentTab !== 'route') return;
    content.style.display = '';
    if (routeIds.length === 0) {
      content.innerHTML = '<p style="text-align:center;padding:32px;color:var(--muted)">Keine Route geplant.<br>Öffne einen Ort und tippe auf „Route hinzufügen".</p>';
      return;
    }
    const places = routeIds.map(id => PLACES.find(p => (p.id || p.name) === id)).filter(Boolean);
    content.innerHTML = places.map((p, i) => `
      <div class="place" style="cursor:default">
        <div class="thumb ph" aria-hidden="true"></div>
        <div><h3>${i + 1}. ${p.name}</h3><small>${p.region || ''}</small></div>
        <button style="font-size:18px;border:0;background:none;cursor:pointer" 
          aria-label="Aus Route entfernen" 
          data-id="${p.id || p.name}">×</button>
      </div>`).join('');
    qsa('[data-id]', content).forEach(btn => {
      btn.addEventListener('click', () => {
        routeIds = routeIds.filter(id => id !== btn.dataset.id);
        saveRoute(routeIds);
        renderRoute();
      });
    });
  }

  /* ── Favoriten-Tab ───────────────────────────────────── */
  function renderFavs() {
    if (currentTab !== 'favs') return;
    content.style.display = '';
    const places = PLACES.filter(p => favs.has(p.id || p.name));
    if (places.length === 0) {
      content.innerHTML = '<p style="text-align:center;padding:32px;color:var(--muted)">Noch keine Favoriten gespeichert.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    places.forEach(p => {
      const div = document.createElement('div');
      div.className = 'place';
      div.setAttribute('role', 'button');
      div.setAttribute('tabindex', '0');
      div.innerHTML = `
        <div class="thumb ph" aria-hidden="true"></div>
        <div><h3>${p.name}</h3><small>${p.region || ''}</small><span class="tag known">★</span></div>
        <span class="arrow" aria-hidden="true">›</span>`;
      div.addEventListener('click', () => openDetail(p));
      div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openDetail(p); });
      frag.appendChild(div);
    });
    content.innerHTML = '';
    content.appendChild(frag);
  }

  /* ── Tab-Navigation ──────────────────────────────────── */
  let currentTab = 'map';
  const tabs = { map: qs('#mapTab'), list: qs('#listTab'), route: qs('#routeTab'), favs: qs('#favTab') };
  const sheet = qs('#sheet');

  function switchTab(name) {
    currentTab = name;
    Object.entries(tabs).forEach(([k, btn]) => btn.classList.toggle('active', k === name));
    if (name === 'map') {
      sheet.classList.remove('mid', 'full');
      content.style.display = 'none';
    } else {
      sheet.classList.add('mid');
      refresh();
    }
  }

  Object.entries(tabs).forEach(([name, btn]) => {
    btn.addEventListener('click', () => switchTab(name));
  });

  /* ── Sheet-Drag ──────────────────────────────────────── */
  let dragStart = null;
  sheet.querySelector('.handle').addEventListener('pointerdown', e => {
    dragStart = e.clientY;
  });
  document.addEventListener('pointermove', e => {
    if (dragStart === null) return;
    const dy = e.clientY - dragStart;
    if (dy < -60) sheet.classList.add('full');
    else if (dy > 60) sheet.classList.remove('full', 'mid');
  });
  document.addEventListener('pointerup', () => { dragStart = null; });

  /* ── Detail-Modal ────────────────────────────────────── */
  const detail = qs('#detail');

  function openDetail(p) {
    const isFav   = favs.has(p.id || p.name);
    const inRoute = routeIds.includes(p.id || p.name);
    detail.innerHTML = `
      <div class="heroimg">
        ${p.photo
          ? `<img src="${p.photo}" alt="${p.name}" loading="lazy">`
          : '<div class="noimg">STEDER I NORGE</div>'}
        <button class="close" onclick="closeModal(document.getElementById('detail'))" aria-label="Zurück">‹</button>
        ${p.photoTag ? `<div class="photoTag">${p.photoTag}</div>` : ''}
      </div>
      <div class="detailBody">
        <div class="meta">${[p.region, p.category].filter(Boolean).join(' · ')}</div>
        <h1 id="detailTitle">${p.name}</h1>
        ${p.why ? `<p class="why">${p.why}</p>` : ''}
        ${p.access ? `<div class="access">${p.access}</div>` : ''}
        ${p.note ? `<p class="note">${p.note}</p>` : ''}
        <div class="actions">
          <button id="detailFav" class="${isFav ? 'active' : ''}">
            ${isFav ? '★ Gespeichert' : '☆ Favorit'}
          </button>
          <button id="detailRoute" class="${inRoute ? 'active' : ''}">
            ${inRoute ? '✓ In Route' : '⤷ Route'}
          </button>
          ${p.lat && p.lng
            ? `<a class="primary" href="https://maps.google.com/?q=${p.lat},${p.lng}" target="_blank" rel="noopener">Maps</a>`
            : ''}
          ${p.wiki
            ? `<a href="${p.wiki}" target="_blank" rel="noopener">Wikipedia</a>`
            : ''}
        </div>
        ${p.photoCredit ? `<div class="photoCredit">${p.photoCredit}</div>` : ''}
      </div>`;

    qs('#detailFav', detail).addEventListener('click', () => {
      const key = p.id || p.name;
      if (favs.has(key)) { favs.delete(key); } else { favs.add(key); }
      saveFavs(favs);
      openDetail(p);
      if (currentTab === 'favs') renderFavs();
    });
    qs('#detailRoute', detail).addEventListener('click', () => {
      const key = p.id || p.name;
      if (routeIds.includes(key)) {
        routeIds = routeIds.filter(id => id !== key);
      } else {
        routeIds.push(key);
      }
      saveRoute(routeIds);
      openDetail(p);
      if (currentTab === 'route') renderRoute();
    });

    openModal(detail);
    if (p.lat && p.lng) map.setView([p.lat, p.lng], Math.max(map.getZoom(), 11));
  }

  /* ── Ebenen-Panel ────────────────────────────────────── */
  qs('#layersTop').addEventListener('click', () => {
    const panel = qs('#layerPanel');
    openModal(panel);
    panel.setAttribute('aria-expanded', 'true');
  });
  qs('#legalButton').addEventListener('click', () => openModal(qs('#legal')));

  /* ── Camper-Layer ────────────────────────────────────── */
  const camperLayerMap = {};
  if (CAMPER_POINTS.length) {
    const types = [...new Set(CAMPER_POINTS.map(p => p.type).filter(Boolean))];
    types.forEach(type => {
      const pts = CAMPER_POINTS.filter(p => p.type === type);
      const lg = L.layerGroup(pts.map(p => {
        const m = L.circleMarker([p.lat, p.lng], {
          radius: 6,
          fillColor: '#2E5266',
          color: '#fff',
          weight: 1,
          fillOpacity: 0.85,
        });
        m.bindPopup(`<div class="utilityPopup"><div class="uMeta">${type}</div><h3>${p.name || ''}</h3>${p.address || ''}</div>`);
        return m;
      }));
      camperLayerMap[type] = lg;
      const chk = qs(`#camper-${type}`);
      if (chk) {
        chk.addEventListener('change', () => {
          if (chk.checked) map.addLayer(lg); else map.removeLayer(lg);
        });
      }
    });
  }

  /* ── Initiales Rendering ─────────────────────────────── */
  buildMarkers();
  updateFilterSummary();

  if (PLACES.length === 0) {
    window.showBootError && showBootError('Ortsdaten konnten nicht geladen werden.');
  }

  console.log(`Steder i Norge v26.2 – ${PLACES.length} Orte, ${CAMPER_POINTS.length} Camper-Punkte geladen.`);

}());
