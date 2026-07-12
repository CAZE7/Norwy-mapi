function showBootError(message) {
  const box = document.getElementById('appError');
  if (!box) return;
  box.hidden = false;
  box.textContent = message;
}

window.showBootError = showBootError;

window.addEventListener('error', function(event) {
  if (event.target && event.target !== window) {
    const url = event.target.src || event.target.href || '';
    const file = url.split('/').pop() || 'Ressource';
    const message = file.includes('places-data')
      ? 'Ortsdaten konnten nicht geladen werden.'
      : file.includes('camper_layers')
        ? 'Camper-Ebene fehlt. Die Hauptkarte kann weiter genutzt werden.'
        : 'Datei konnte nicht geladen werden: ' + file;
    showBootError(message);
    return;
  }
  const errorMessage = event.message || event.error && event.error.toString() || 'unbekannt';
  showBootError('Startfehler: ' + errorMessage);
}, true);

window.addEventListener('unhandledrejection', function(event) {
  const reason = (event.reason && event.reason.message) ? event.reason.message : (event.reason || 'unbekannter Fehler');
  showBootError('Ein Dienst oder Datensatz konnte nicht geladen werden: ' + reason);
});
