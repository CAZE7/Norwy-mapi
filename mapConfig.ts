@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Custom Leaflet popup styles ──────────────────────────────────────────── */
.norwy-popup .leaflet-popup-content-wrapper {
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(0,0,0,0.06);
}

.norwy-popup .leaflet-popup-content {
  margin: 0;
  line-height: 1.5;
}

.norwy-popup .leaflet-popup-tip-container {
  margin-top: -1px;
}

/* ── Marker cluster overrides ─────────────────────────────────────────────── */
.marker-cluster-small,
.marker-cluster-medium,
.marker-cluster-large {
  background: transparent !important;
}

.marker-cluster-small div,
.marker-cluster-medium div,
.marker-cluster-large div {
  background: transparent !important;
}

/* ── Slide-up animation for detail card ──────────────────────────────────── */
@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.animate-slide-up {
  animation: slide-up 0.25s ease-out forwards;
}

/* ── Scrollbar styling ────────────────────────────────────────────────────── */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #d6d3cd;
  border-radius: 99px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a8a29e;
}

/* ── Line clamp utility ───────────────────────────────────────────────────── */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Map takes full height ────────────────────────────────────────────────── */
.leaflet-container {
  width: 100%;
  height: 100%;
  font-family: system-ui, sans-serif;
}
