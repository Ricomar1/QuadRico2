window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("welcomeModal");
  modal.showModal();

  window.addEventListener("click", (e) => {
    if (!modal.contains(e.target) && modal.open) {
      modal.close();
    }
  });
});

function closeModal() {
  const modal = document.getElementById("welcomeModal");
  modal.close();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function openContactForm() {
  alert("Module de contact à venir !");
}

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
