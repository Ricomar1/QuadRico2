// Plein écran
document.getElementById('fullscreenBtn').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
  document.body.dataset.theme =
    document.body.dataset.theme === 'dark' ? 'light' : 'dark';
});

// Aide
document.getElementById('helpBtn').addEventListener('click', () => {
  alert("Bienvenue sur QuadRico !\n\nCliquez sur les boutons pour tester les fonctions.");
});

// Placeholder boutons export
document.getElementById('exportPNG').addEventListener('click', () => alert('Export PNG à venir'));
document.getElementById('exportPDF').addEventListener('click', () => alert('Export PDF à venir'));
document.getElementById('exportGRID').addEventListener('click', () => alert('Grille seule à venir'));
document.getElementById('print').addEventListener('click', () => window.print());
document.getElementById('mailConcepteur').addEventListener('click', () => window.open('mailto:concepteur@quadrico.com'));
document.getElementById('whatsapp').addEventListener('click', () => window.open('https://wa.me/?text=Message%20QuadRico'));
document.getElementById('exportJSON').addEventListener('click', () => alert('Export JSON à venir'));
