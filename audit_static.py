// Camper-Infrastruktur Daten
// WICHTIG: Diese Datei muss mit den originalen Daten befüllt werden!

// ANLEITUNG ZUM WIEDERHERSTELLEN DER ORIGINALEN DATEN:
// 
// Option 1: Aus Git-Historie wiederherstellen
//   git log --all --full-history -- data/camper_layers.js
//   git show <commit-hash>:data/camper_layers.js > data/camper_layers.js
//
// Option 2: Von einem Backup kopieren
//   cp /pfad/zum/backup/camper_layers.js data/camper_layers.js
//
// Option 3: Von der Live-Seite extrahieren (falls deployed)
//   Öffne https://caze7.github.io/Norwy-mapi/ in Browser
//   DevTools → Console → window.CAMPER_POINTS
//   Kopiere die Daten

window.CAMPER_POINTS = window.CAMPER_POINTS || [];

if (window.CAMPER_POINTS.length === 0) {
  console.warn('⚠️ WARNUNG: camper_layers.js enthält keine echten Daten!');
  console.warn('Bitte originale Daten wiederherstellen aus Git-Historie oder Backup.');
  
  // Minimaler Fallback nur damit App nicht crasht
  window.CAMPER_POINTS = [
    {
      id: 'camper_1',
      type: 'motorhome',
      label: 'Wohnmobil-Stellplatz',
      name: 'PLATZHALTER - Bitte echte Daten einfügen',
      lat: 60.0,
      lon: 10.0,
      quality: 0,
      source: 'https://www.openstreetmap.org/'
    }
  ];
}

console.log('Camper-Daten geladen:', window.CAMPER_POINTS.length, 'Punkte');

// ERWARTETES FORMAT DER ORIGINALEN DATEN:
//
// window.CAMPER_POINTS = [
//   {
//     id: 'camper_1',
//     type: 'motorhome', // oder: camping, water, toilets, ferry, dump
//     label: 'Wohnmobil-Stellplatz',
//     name: 'Stellplatz Name',
//     lat: 60.123,
//     lon: 10.456,
//     quality: 75,
//     source: 'https://www.openstreetmap.org/...',
//     openingHours: '24/7',
//     fee: 'Kostenfrei',
//     website: 'https://...',
//     phone: '+47 12345678',
//     place: 'Bergen',
//     road: 'E39'
//   },
//   // ... ~1500 weitere Einträge
// ];
