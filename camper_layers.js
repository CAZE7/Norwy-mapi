// Norwegen Ortsdaten
// WICHTIG: Diese Datei muss mit den originalen Daten befüllt werden!
// Die Platzhalter-Koordinaten wurden entfernt.

// ANLEITUNG ZUM WIEDERHERSTELLEN DER ORIGINALEN DATEN:
// 
// Option 1: Aus Git-Historie wiederherstellen
//   git log --all --full-history -- data/places-data.js
//   git show <commit-hash>:data/places-data.js > data/places-data.js
//
// Option 2: Von einem Backup kopieren
//   cp /pfad/zum/backup/places-data.js data/places-data.js
//
// Option 3: Von der Live-Seite extrahieren (falls deployed)
//   Öffne https://caze7.github.io/Norwy-mapi/ in Browser
//   DevTools → Console → window.PLACES
//   Kopiere die Daten

// Temporärer Fallback (MUSS ERSETZT WERDEN):
// Damit die App nicht crasht, hier ein minimales Array
// DIES IST NUR EIN PLATZHALTER - KEINE ECHTEN DATEN!

window.PLACES = window.PLACES || [];

if (window.PLACES.length === 0) {
  console.warn('⚠️ WARNUNG: places-data.js enthält keine echten Daten!');
  console.warn('Bitte originale Daten wiederherstellen aus Git-Historie oder Backup.');
  
  // Minimaler Fallback nur damit App nicht crasht
  window.PLACES = [
    {
      id: 1,
      name: "PLATZHALTER - Bitte echte Daten einfügen",
      lat: 60.0,
      lon: 10.0,
      region: "TESTDATEN",
      group: "TESTDATEN",
      description: "Diese Datei muss mit den originalen Norwegen-Daten befüllt werden!",
      quality: 0
    }
  ];
}

console.log('Ortsdaten geladen:', window.PLACES.length, 'Einträge');

// ERWARTETES FORMAT DER ORIGINALEN DATEN:
// 
// window.PLACES = [
//   {
//     id: 1,
//     name: "Trolltunga",
//     lat: 60.124,
//     lon: 6.74,
//     region: "Hardanger",
//     group: "Berge & Abenteuer",
//     description: "...",
//     accessibility: "...",
//     note: "...",
//     photo: "...",
//     photoCredit: "...",
//     highlight: true,
//     local: false,
//     discovery: false,
//     quality: 95,
//     link: "...",
//     aliases: ["..."]
//   },
//   // ... 1392 weitere Einträge
// ];
