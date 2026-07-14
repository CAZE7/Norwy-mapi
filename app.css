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
  font: 15px Georgia, serif;
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
  font: 25px Georgia, serif;
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
  font: 15px/1.55 Georgia, "Times New Roman", serif;
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
  font: normal 36px/1.1 Georgia, serif;
  margin: 6px 0 24px;
}
.legalInner h2 {
  font: normal 20px/1.2 Georgia, serif;
  margin: 28px 0 8px;
}
.legalInner p {
  font: 14px/1.6 Georgia, serif;
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
.appError {
  position: fixed;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border: 2px solid var(--rust);
  padding: 24px;
  max-width: 90%;
  text-align: center;
  font-size: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
.appToast {
  position: fixed;
  z-index: 9998;
  bottom: calc(80px + var(--safe));
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: rgba(29, 40, 34, 0.92);
  color: white;
  padding: 12px 18px;
  border-radius: 4px;
  font-size: 13px;
  opacity: 0;
  transition: all 0.3s ease;
  max-width: 90%;
  text-align: center;
}
.appToast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.pin {
  width: 21px;
  height: 21px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.pin-water { background: #4A90E2; }
.pin-view { background: #E85D75; }
.pin-nature { background: #50C878; }
.pin-mountain { background: #8B4513; }
.pin-coast { background: #00CED1; }
.pin-geology { background: #9370DB; }
.pin-roadtrip { background: #FF8C00; }
.pin-food { background: #FFD700; }
.utilityIcon {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  display: grid;
  place-items: center;
  font-size: 9px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}
.utility-motorhome { background: #2E5266; }
.utility-camping { background: #6B8E23; }
.utility-water { background: #4A90E2; }
.utility-toilets { background: #8B4513; }
.utility-ferry { background: #4682B4; }
.utility-dump { background: #696969; }
.utilityPopup {
  font-family: Arial, sans-serif;
  font-size: 13px;
  line-height: 1.5;
}
.utilityPopup h3 {
  margin: 4px 0 8px;
  font-size: 15px;
  font-weight: bold;
}
.utilityPopup .uMeta {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.utilityPopup a {
  color: #263b46;
  text-decoration: underline;
}
.utilityPhones {
  margin: 8px 0;
}
.filterPanel {
  padding: 12px 14px;
  background: var(--paper-2);
  border-bottom: 1px solid var(--line);
}
.filterPanel h3 {
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 8px;
  color: var(--muted);
}
.filterGroup {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}
.filterChip {
  border: 1px solid #bfc4bf;
  border-radius: 12px;
  padding: 4px 10px;
  background: white;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.filterChip.active {
  background: var(--ink);
  color: white;
  border-color: var(--ink);
}
.layerPanel {
  position: fixed;
  z-index: 2050;
  inset: 0;
  background: var(--paper);
  transform: translateY(102%);
  transition: 0.26s;
  overflow: auto;
  padding: 60px 18px 40px;
}
.layerPanel.open {
  transform: none;
}
.layerPanel h2 {
  font: normal 24px/1.2 Georgia, serif;
  margin: 0 0 16px;
}
.layerPanel label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
}
.layerPanel input[type="checkbox"] {
  width: 20px;
  height: 20px;
}
