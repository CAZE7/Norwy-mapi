/* Accessibility Overrides für verbesserte Barrierefreiheit */

/* Fokus-Sichtbarkeit für Tastaturnutzer */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--navy);
  outline-offset: 2px;
}

/* Verstecktes aber screen-reader-zugängliches Element */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Skip-Link für Tastaturnutzer */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--ink);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 10000;
}

.skip-link:focus {
  top: 0;
}

/* Kontrast-Verbesserungen für Text */
.muted,
.meta,
.photoCredit {
  color: #5a6460;
}

/* Größerer Touch-Target für mobile Geräte */
@media (pointer: coarse) {
  button,
  a,
  .place {
    min-height: 44px;
  }
}

/* Präferenzen für reduzierte Bewegung respektieren */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Hochkontrast-Modus Unterstützung */
@media (prefers-contrast: high) {
  :root {
    --ink: #000000;
    --paper: #ffffff;
    --line: #000000;
  }
  
  button,
  a,
  .filterChip {
    border-width: 2px;
  }
}

/* Dark Mode Unterstützung */
@media (prefers-color-scheme: dark) {
  :root {
    --paper: #1d2822;
    --paper-2: #263630;
    --ink: #f4f1ea;
    --muted: #9ca59e;
    --line: #3a4740;
    --white: #0f1311;
  }
  
  body {
    background: #0f1311;
  }
  
  .title,
  .circle,
  .close {
    background: rgba(29, 40, 34, 0.94);
    color: var(--ink);
  }
  
  .appError {
    background: var(--paper);
    color: var(--ink);
  }
}
