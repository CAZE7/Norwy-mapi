:root {
  --paper: #f4f1ea;
  --paper-2: #ebe7de;
  --ink: #1d2822;
  --muted: #6c746e;
  --line: #d5d1c8;
  --moss: #405b49;
  --navy: #263b46;
  --rust: #9a5b42;
  --white: #fffefa;
  --safe: env(safe-area-inset-bottom, 0px);
}
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
html,
body,
#map {
  height: 100%;
  margin: 0;
}
body {
  overflow: hidden;
  background: #d8dfdc;
  color: var(--ink);
  font-family: Arial, Helvetica, sans-serif;
}
button,
input {
  font: inherit;
}
.top {
  position: fixed;
  z-index: 1200;
  top: calc(12px + env(safe-area-inset-top, 0px));
  left: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  pointer-events: none;
}
.title {
  pointer-events: auto;
  flex: 1;
  min-height: 58px;
  background: rgba(255, 254, 250, 0.94);
  border: 1px solid rgba(29, 40, 34, 0.14);
  padding: 11px 14px;
  box-shadow: 0 4px 18px rgba(29, 40, 34, 0.13);
  backdrop-filter: blur(10px);
}
.title b {
  display: block;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 19px;
  font-weight: normal;
  letter-spacing: 0.01em;
}
.title small {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.circle {
  pointer-events: auto;
  width: 58px;
  height: 58px;
  border: 1px solid rgba(29, 40, 34, 0.14);
  background: var(--white);
  color: var(--ink);
  box-shadow: 0 4px 18px rgba(29, 40, 34, 0.13);
  font-size: 23px;
}
.float {
  position: fixed;
  z-index: 1150;
  right: 14px;
  bottom: calc(180px + var(--safe));
  display: grid;
  gap: 8px;
}
.float button {
  width: 46px;
  height: 46px;
  border: 1px solid rgba(29, 40, 34, 0.15);
  border-radius: 2px;
  background: var(--white);
  color: var(--ink);
  box-shadow: 0 4px 14px rgba(29, 40, 34, 0.15);
  font-size: 17px;
}
.float .secret {
  background: var(--navy);
  color: white;
}
.sheet {
  position: fixed;
  z-index: 1250;
  left: 0;
  right: 0;
  bottom: calc(60px + var(--safe));
  height: 116px;
  background: var(--paper);
  border-radius: 14px 14px 0 0;
  border-top: 1px solid var(--line);
  box-shadow: 0 -8px 26px rgba(29, 40, 34, 0.15);
  transition: height 0.26s ease;
  display: flex;
  flex-direction: column;
}
.sheet.mid {
  height: 54vh;
}
.sheet.full {
  height: calc(100vh - 72px - var(--safe));
}
.handle {
  height: 24px;
  display: grid;
  place-items: center;
  flex: none;
}
.handle:before {
  content: "";
  width: 42px;
  height: 3px;
  background: #aeb2ad;
}
.sheetHead {
  padding: 0 14px 9px;
  display: flex;
  gap: 7px;
  flex: none;
}
.search {
  flex: 1;
  min-width: 0;
  border: 0;
  border-bottom: 1px solid #aeb5af;
  border-radius: 0;
  padding: 10px 2px;
  background: transparent;
  color: var(--ink);
  outline: none;
  font-size: 14px;
}
.search::placeholder {
  color: #818782;
}
.filterBtn {
  min-width: 58px;
  border: 1px solid #bfc4bf;
  border-radius: 2px;
  background: transparent;
  color: var(--ink);
  font-size: 10px;
  padding: 0 7px;
}

.content {
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 10px 18px;
  flex: 1;
}
.place {
  display: grid;
  grid-template-columns: 86px 1fr 16px;
  gap: 12px;
  padding: 11px 4px;
  border-bottom: 1px solid var(--line);
  align-items: center;
  cursor: pointer;
}
.thumb {
  width: 86px;
  height: 66px;
  border-radius: 1px;
  object-fit: cover;
  background: #d9d7d0;
}
.ph {
  display: grid;
  place-items: center;
  color: #68736c;
  font-family: Georgia, serif;
  font-size: 10px;
}
.ph:after {
  content: "NORD";
}
.place h3 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 16px;
  font-weight: normal;
  margin: 4px 0 5px;
  line-height: 1.08;
}
.place small {
  font-size: 9px;
  color: var(--muted);
  display: block;
  line-height: 1.3;
}
.arrow {
  font-family: Georgia, serif;
  font-size: 20px;
  color: #8a918c;
}
.tag {
  display: inline-block;
  color: #59645d;
  font-size: 8px;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.tag.known {
  color: var(--rust);
}
.nav {
  position: fixed;
  z-index: 1300;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(60px + var(--safe));
  padding-bottom: var(--safe);
  background: var(--white);
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.nav button {
  border: 0;
  background: transparent;
  color: #737b75;
  font-size: 8px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 8px 2px;
}
.nav button span {
  display: block;
  font-family: Georgia, serif;
  font-size: 17px;
  margin-bottom: 3px;
}
.nav button.active {
  color: var(--ink);
  box-shadow: inset 0 2px var(--ink);
}
.detail {
  position: fixed;
  z-index: 2000;
  inset: 0;
  background: var(--paper);
  transform: translateY(102%);
  transition: 0.26s;
  overflow-y: auto;
  padding-bottom: calc(24px + var(--safe));
}
.detail.open {
  transform: none;
}
.heroimg {
  height: 36vh;
  min-height: 220px;
  background: #d8d7d1;
  position: relative;
}
.heroimg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.noimg {
  height: 100%;
  display: grid;
  place-items: center;
  color: #68736c;
  font:
    15px Georgia,
    serif;
}
.close {
  position: absolute;
  top: calc(12px + env(safe-area-inset-top, 0px));
  left: 12px;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(29, 40, 34, 0.2);
  border-radius: 0;
  background: rgba(255, 254, 250, 0.94);
  color: var(--ink);
  font:
    25px Georgia,
    serif;
}
.photoTag {
  position: absolute;
  left: 12px;
  bottom: 12px;
  background: rgba(29, 40, 34, 0.85);
  color: white;
  padding: 5px 8px;
  font-size: 8px;
  letter-spacing: 0.05em;
}
.detailBody {
  padding: 21px 18px;
}
.detailBody h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: normal;
  font-size: 30px;
  line-height: 1.08;
  margin: 6px 0 8px;
}
.meta {
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.why {
  font:
    15px/1.55 Georgia,
    "Times New Roman",
    serif;
  margin: 18px 0;
}
.access {
  font-size: 11px;
  line-height: 1.5;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 12px 0;
}
.note {
  font-size: 10px;
  line-height: 1.5;
  color: var(--muted);
  margin-top: 12px;
}
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
  margin-top: 18px;
}
.actions a,
.actions button {
  border: 1px solid #aeb5af;
  border-radius: 1px;
  padding: 12px 6px;
  background: transparent;
  color: var(--ink);
  text-align: center;
  text-decoration: none;
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.actions .primary {
  background: var(--ink);
  color: white;
  border-color: var(--ink);
}
.actions .active {
  background: #ddd7c9;
}
.photoCredit {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
  font-size: 9px;
  line-height: 1.5;
  color: var(--muted);
}
.photoCredit a {
  color: var(--ink);
}
.legal {
  position: fixed;
  z-index: 2100;
  inset: 0;
  background: var(--paper);
  transform: translateY(102%);
  transition: 0.26s;
  overflow: auto;
}
.legal.open {
  transform: none;
}
.legalClose {
  position: fixed;
  z-index: 2;
  right: 14px;
  top: calc(14px + env(safe-area-inset-top, 0px));
  border: 1px solid #aeb5af;
  background: var(--white);
  padding: 10px 12px;
  color: var(--ink);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.legalInner {
  max-width: 720px;
  margin: 0 auto;
  padding: 70px 22px 60px;
}
.legalInner h1 {
  font:
    normal 36px/1.1 Georgia,
    serif;
  margin: 6px 0 24px;
}
.legalInner h2 {
  font:
    normal 20px/1.2 Georgia,
    serif;
  margin: 28px 0 8px;
}
.legalInner p {
  font:
    14px/1.6 Georgia,
    serif;
  color: #38423c;
}
.legalInner a {
  color: #263b46;
}
.legalInner .eyebrow {
  font: 9px Arial;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
}
.legalInner .small {
  font-size: 11px;
  color: var(--muted);
}
.qualityBadge {
  display: inline-block;
  margin-left: 7px;
  padding: 2px 5px;
  border: 1px solid #aeb5af;
  font: 8px Arial;
  letter-spacing: 0.06em;
  color: #4f5b53;
}
.qualityBadge.qa {
  border-color: #55705c;
  color: #35513e;
}
.qualityBadge.qc {
  border-color: #b68a67;
  color: #7a5135;
}
.layerPanel {
  position: fixed;
  z-index: 2050;
  right: 0;
  top: 0;
  bottom: 0;
  width: min(430px, 94vw);
  background: var(--paper);
  transform: translateX(105%);
  transition: 0.24s;
  box-shadow: -10px 0 30px rgba(29, 40, 34, 0.16);
  overflow: auto;
}
.layerPanel.open {
  transform: none;
}
.layerClose {
  position: sticky;
  z-index: 2;
  float: right;
  top: 14px;
  margin: 14px;
  border: 1px solid #aeb5af;
  background: var(--white);
  padding: 10px 12px;
  color: var(--ink);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.layerInner {
  padding: 68px 22px 40px;
}
.layerInner h1 {
  font:
    normal 29px/1.12 Georgia,
    serif;
  margin: 5px 0 12px;
}
.layerInner h2 {
  font:
    normal 17px/1.2 Georgia,
    serif;
  margin: 26px 0 10px;
}
.layerIntro,
.layerNote {
  font:
    12px/1.5 Georgia,
    serif;
  color: var(--muted);
}
.layerInner label {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
}
.layerInner label span {
  margin-left: auto;
  color: var(--muted);
  font-size: 10px;
}
.layerInner input {
  accent-color: var(--ink);
}
.layerInner a {
  color: var(--navy);
}
.utilityIcon {
  width: 18px;
  height: 18px;
  border: 1px solid white;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  font: bold 9px Arial;
  box-shadow: 0 2px 5px #0005;
}
.utilityPopup {
  font: 12px/1.45 Arial;
  color: var(--ink);
}
.utilityPopup h3 {
  font:
    normal 17px Georgia,
    serif;
  margin: 0 0 5px;
}
.utilityPopup .uMeta {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--muted);
}
.utilityPopup a {
  color: var(--navy);
}
.routePlanner {
  padding: 10px 7px 16px;
  border-bottom: 1px solid var(--line);
}
.routePlanner label {
  display: block;
  margin: 0 0 10px;
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.routePlanner input {
  display: block;
  width: 100%;
  margin-top: 4px;
  border: 0;
  border-bottom: 1px solid #aeb5af;
  background: transparent;
  padding: 9px 2px;
  color: var(--ink);
  font-size: 14px;
  outline: none;
}
.routePlanRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
  margin-top: 13px;
}
.routePlanRow select,
.routePlanRow button,
.routeOpen button {
  border: 1px solid #aeb5af;
  border-radius: 1px;
  background: transparent;
  padding: 11px 7px;
  color: var(--ink);
  font-size: 10px;
}
.routePlanRow button,
.routeOpen button {
  background: var(--ink);
  color: white;
  border-color: var(--ink);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.tripStatus {
  margin-top: 11px;
  font-size: 10px;
  line-height: 1.45;
  color: var(--muted);
}
.routeSectionTitle {
  font:
    normal 18px Georgia,
    serif;
  margin: 20px 7px 8px;
}
.routeOpen {
  padding: 12px 7px;
}
.routeOpen button {
  width: 100%;
}
.empty.compact {
  padding: 18px 8px;
  text-align: left;
  font-size: 12px;
}
.related {
  margin-top: 24px;
  padding-top: 15px;
  border-top: 1px solid var(--line);
}
.related h3 {
  font:
    normal 18px Georgia,
    serif;
  margin: 0 0 8px;
}
.related button {
  display: block;
  width: 100%;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  text-align: left;
  padding: 10px 0;
  color: var(--ink);
}
.related button span {
  display: block;
  font:
    15px Georgia,
    serif;
}
.related button small {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 9px;
}
[hidden] {
  display: none !important;
}
.filterSummary {
  padding: 1px 14px 9px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.filterPanel {
  margin: 0 10px 10px;
  padding: 12px;
  background: var(--white);
  border: 1px solid var(--line);
  max-height: 43vh;
  overflow: auto;
}
.filterPanel fieldset {
  border: 0;
  padding: 0;
  margin: 0 0 14px;
}
.filterPanel legend {
  font:
    normal 16px Georgia,
    serif;
  margin-bottom: 9px;
}
.filterGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.filterChoice {
  border: 1px solid #bfc4bf;
  background: transparent;
  color: var(--ink);
  min-height: 42px;
  padding: 7px;
  text-align: left;
  font-size: 11px;
}
.filterChoice.active,
.filterChoice[aria-pressed="true"] {
  background: var(--ink);
  border-color: var(--ink);
  color: white;
}
.filterChecks {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px;
}
.filterChecks label {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
}
.resetFilters {
  width: 100%;
  border: 1px solid #aeb5af;
  background: transparent;
  color: var(--ink);
  min-height: 44px;
  font-size: 11px;
}
.sheetTools {
  display: flex;
  gap: 7px;
  padding: 0 14px 9px;
}
.toolBtn {
  border: 0;
  border-bottom: 1px solid #aeb5af;
  background: transparent;
  color: var(--muted);
  padding: 6px 0;
  font-size: 10px;
  text-align: left;
}
.toolBtn + .toolBtn {
  margin-left: 14px;
}
.toolBtn:focus-visible,
.filterChoice:focus-visible,
.resetFilters:focus-visible {
  outline: 3px solid #315b7d;
  outline-offset: 2px;
}
@media (min-width: 800px) {
  .filterPanel {
    max-height: 50vh;
  }
}
.routeRow {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 9px;
  align-items: center;
  padding: 12px 5px;
  border-bottom: 1px solid var(--line);
}
.num {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  background: var(--ink);
  color: white;
  font-size: 9px;
}
.routeRow button {
  border: 1px solid #bec3be;
  background: transparent;
  margin-left: 3px;
}
.empty {
  text-align: center;
  padding: 34px 22px;
  color: var(--muted);
  font:
    14px/1.5 Georgia,
    serif;
}
.offline {
  position: fixed;
  z-index: 1400;
  top: 78px;
  left: 12px;
  background: #e9dfca;
  color: #604c27;
  padding: 9px 12px;
  font-size: 12px;
  line-height: 1.4;
}
.pin {
  width: 17px;
  height: 17px;
  border: 2px solid var(--white);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
}
.pin i {
  display: none;
}
.leaflet-div-icon {
  border: 0;
  background: none;
}
.marker-cluster-small,
.marker-cluster-medium,
.marker-cluster-large {
  background: rgba(38, 59, 70, 0.28);
}
.marker-cluster div {
  background: var(--white);
  color: var(--navy);
  font-family: Georgia, serif;
  font-weight: normal;
  border: 1px solid rgba(38, 59, 70, 0.25);
}
.leaflet-bottom {
  bottom: 62px;
}
.leaflet-control-zoom a {
  color: var(--ink);
  background: var(--white);
}
@media (min-width: 800px) {
  .top {
    left: 20px;
    right: auto;
    width: 402px;
  }
  .title {
    background: var(--paper);
  }
  .sheet {
    left: 20px;
    right: auto;
    width: 402px;
    bottom: 20px;
    height: calc(100vh - 108px);
    border-radius: 0;
    border: 1px solid var(--line);
    box-shadow: 0 8px 30px rgba(29, 40, 34, 0.16);
  }
  .sheet.mid,
  .sheet.full {
    height: calc(100vh - 108px);
  }
  .nav {
    left: 442px;
    right: auto;
    bottom: 20px;
    width: 420px;
    height: 54px;
    padding: 0;
    border: 1px solid var(--line);
  }
  .float {
    bottom: 90px;
  }
  .detail {
    left: auto;
    width: 470px;
    box-shadow: -10px 0 34px rgba(29, 40, 34, 0.15);
  }
  .leaflet-bottom {
    bottom: 20px;
  }
}
/* Search/filter and detail hierarchy additions. Merged into app.css for deployment. */
.filterSummary {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  white-space: normal;
}
.resultCount {
  font-weight: bold;
  color: var(--ink);
  margin-right: 2px;
}
.activeFilter {
  border: 1px solid #aeb5af;
  background: var(--white);
  color: var(--ink);
  min-height: 44px;
  padding: 5px 8px;
  font-size: 11px;
}
.activeFilter:hover {
  border-color: var(--ink);
}
.detailHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}
.detailHeader > div {
  min-width: 0;
}
.saveTop {
  flex: none;
  border: 1px solid #aeb5af;
  background: transparent;
  color: var(--ink);
  min-height: 44px;
  padding: 8px 10px;
  font-size: 11px;
}
.saveTop.active {
  background: #ddd7c9;
}
.detailSection {
  margin-top: 22px;
}
.detailSection h2,
.trustBox h2 {
  font:
    normal 19px/1.25 Georgia,
    "Times New Roman",
    serif;
  margin: 0 0 8px;
}
.detailSection .why {
  margin: 0;
}
.trustBox {
  margin-top: 24px;
  padding: 15px;
  border: 1px solid var(--line);
  background: var(--white);
}
.trustBox > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.trustBox p {
  font-size: 12px;
  line-height: 1.45;
  color: var(--muted);
}
.trustSignals {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}
.trustSignals li {
  display: flex;
  gap: 8px;
  align-items: center;
  border-top: 1px solid var(--line);
  padding: 8px 0;
  font-size: 12px;
}
.trustSignals .ok span {
  color: #35513e;
  font-weight: bold;
}
.trustSignals .missing {
  color: var(--muted);
}
.actions .primary {
  grid-column: 1/-1;
  font-size: 12px;
}
.related button small {
  font-size: 11px;
}
/* Semantic controls and CSP-safe marker colors. Merged into app.css. */
.appError {
  position: fixed;
  z-index: 9999;
  left: 12px;
  right: 12px;
  top: 82px;
  padding: 14px;
  background: #efe2ca;
  color: #633b22;
  border: 1px solid #c8aa83;
  font:
    14px/1.4 Arial,
    sans-serif;
}
.place {
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  font: inherit;
}
.placeText {
  display: block;
  min-width: 0;
}
.placeBadges {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.placeTitle {
  display: block;
  font:
    normal 18px/1.08 Georgia,
    "Times New Roman",
    serif;
  margin: 4px 0 5px;
}
.placeMeta {
  display: block;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.3;
}
.pin-water {
  background: #365f70;
}
.pin-view {
  background: #435949;
}
.pin-nature {
  background: #405b49;
}
.pin-mountain {
  background: #515a4b;
}
.pin-coast {
  background: #326b73;
}
.pin-geology {
  background: #795c49;
}
.pin-roadtrip {
  background: #6e6756;
}
.pin-food {
  background: #8a5d46;
}
.utility-motorhome {
  background: #3f5e73;
}
.utility-camping {
  background: #526b4f;
}
.utility-water {
  background: #287a92;
}
.utility-toilets {
  background: #6c6575;
}
.utility-ferry {
  background: #9a5b42;
}
.utility-dump {
  background: #73533f;
}
.routeListSemantic {
  list-style: none;
  margin: 0;
  padding: 0;
}
.routePlace {
  min-width: 0;
  border: 0;
  background: transparent;
  text-align: left;
  color: inherit;
  padding: 8px 4px;
}
.routePlace strong,
.routePlace small {
  display: block;
}
.routePlace small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 12px;
}
.routeControls {
  display: flex;
  gap: 4px;
}
.routeControls button {
  min-width: 44px;
  min-height: 44px;
  margin: 0;
}
.routeLimit {
  margin: 8px 7px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
}
.routeLimit.warning {
  color: #7a5135;
  font-weight: bold;
}
.circle {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.float button {
  width: auto;
  min-width: 72px;
  height: 44px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.close {
  width: auto;
  min-width: 44px;
  padding: 0 12px;
  font:
    600 11px Arial,
    sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.routeRow {
  grid-template-columns: 28px minmax(0, 1fr);
}
.routeControls {
  grid-column: 2;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.routeControls button {
  min-width: 44px;
  padding: 7px 9px;
  font-size: 11px;
}
