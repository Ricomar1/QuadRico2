const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const imageInput = document.getElementById("imageInput");
const loadImageBtn = document.getElementById("loadImageBtn");
const exportBtn = document.getElementById("exportBtn");
const resetGridBtn = document.getElementById("resetGridBtn");
const generateGridBtn = document.getElementById("generateGridBtn");

let bgImage = null;
let grid = [];
let rows = 10;
let cols = 10;

let opacityImage = 100;
let opacityGrid = 100;
let opacityCode = 100;
let opacityZone = 100;

// Créer la grille initiale
function createGrid(r, c) {
  rows = r;
  cols = c;
  grid = [];

  const cellWidth = canvas.width / cols;
  const cellHeight = canvas.height / rows;

  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      row.push({
        x: x * cellWidth,
        y: y * cellHeight,
        w: cellWidth,
        h: cellHeight,
        selected: false,
        codeType: "none",
        fillColor: "",
        borderColor: "",
        thickness: "normal",
        text: "",
        textColor: "black"
      });
    }
    grid.push(row);
  }

  drawAll();
}

// Dessine tout sur le canvas
function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImage) {
    ctx.globalAlpha = opacityImage / 100;
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  }

  ctx.globalAlpha = opacityZone / 100;
  grid.flat().forEach(cell => {
    if (cell.fillColor) {
      ctx.fillStyle = cell.fillColor;
      ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
    }
  });

  ctx.globalAlpha = opacityGrid / 100;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;

  for (let y = 0; y <= rows; y++) {
    let yPos = (canvas.height / rows) * y;
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(canvas.width, yPos);
    ctx.stroke();
  }

  for (let x = 0; x <= cols; x++) {
    let xPos = (canvas.width / cols) * x;
    ctx.beginPath();
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, canvas.height);
    ctx.stroke();
  }

  ctx.globalAlpha = opacityCode / 100;

  grid.flat().forEach(cell => {
    const cx = cell.x + cell.w / 2;
    const cy = cell.y + cell.h / 2;

    ctx.lineWidth =
      cell.thickness === "bold"
        ? 2
        : cell.thickness === "extra-bold"
        ? 4
        : 1;

    ctx.strokeStyle = cell.borderColor || "#000";

    if (cell.codeType === "diagonal") {
      ctx.beginPath();
      ctx.moveTo(cell.x, cell.y);
      ctx.lineTo(cell.x + cell.w, cell.y + cell.h);
      ctx.stroke();
    } else if (cell.codeType === "dots") {
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cell.x, cell.y);
      ctx.lineTo(cell.x + cell.w, cell.y + cell.h);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (cell.codeType.startsWith("cross")) {
      let color = "black";
      if (cell.codeType === "cross-red") color = "red";
      if (cell.codeType === "cross-fsi") color = cell.fillColor || "black";
      ctx.strokeStyle = color;

      ctx.beginPath();
      ctx.moveTo(cell.x + 4, cell.y + 4);
      ctx.lineTo(cell.x + cell.w - 4, cell.y + cell.h - 4);
      ctx.moveTo(cell.x + cell.w - 4, cell.y + 4);
      ctx.lineTo(cell.x + 4, cell.y + cell.h - 4);
      ctx.stroke();
    }
  });

  grid.flat().forEach(cell => {
    if (cell.text) {
      ctx.fillStyle =
        cell.textColor === "same"
          ? cell.borderColor || "black"
          : cell.textColor || "black";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        cell.text,
        cell.x + cell.w / 2,
        cell.y + cell.
// Clic sur le canvas pour sélectionner les cases
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  grid.flat().forEach(cell => {
    if (
      mouseX > cell.x &&
      mouseX < cell.x + cell.w &&
      mouseY > cell.y &&
      mouseY < cell.y + cell.h
    ) {
      cell.selected = !cell.selected;
    }
  });

  drawAll();
});

// Image de fond
loadImageBtn.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    bgImage = img;
    drawAll();
  };
  img.src = URL.createObjectURL(file);
});

// Générer une nouvelle grille
generateGridBtn.addEventListener("click", () => {
  const r = parseInt(document.getElementById("rowsInput").value);
  const c = parseInt(document.getElementById("colsInput").value);
  createGrid(r, c);
});

// Réinitialiser la grille
resetGridBtn.addEventListener("click", () => {
  createGrid(rows, cols);
});

// Export PNG
exportBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "quadrico_export.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// Appliquer les modifications aux cases sélectionnées
document.getElementById("applyBtn").addEventListener("click", () => {
  const code = document.getElementById("codeType").value;
  const borderColor = document.getElementById("borderColorSelect").value;
  const fillColor = document.getElementById("zoneColorSelect").value;
  const thickness = document.getElementById("lineThickness").value;
  const text = document.getElementById("cellTextInput").value;
  const sameColor = document.getElementById("sameTextColor").checked;
  const textColor = sameColor
    ? "same"
    : document.getElementById("textColorSelect").value;

  grid.flat().forEach(cell => {
    if (cell.selected) {
      cell.codeType = code;
      cell.borderColor = borderColor;
      cell.fillColor = fillColor;
      cell.thickness = thickness;
      cell.text = text;
      cell.textColor = textColor;
    }
  });

  drawAll();
});

// Effacer bordure
document.getElementById("clearBorderBtn").addEventListener("click", () => {
  grid.flat().forEach(cell => {
    if (cell.selected) {
      cell.borderColor = "";
    }
  });
  drawAll();
});

// Effacer texte/code
document.getElementById("clearTextBtn").addEventListener("click", () => {
  grid.flat().forEach(cell => {
    if (cell.selected) {
      cell.codeType = "none";
      cell.text = "";
    }
  });
  drawAll();
});

// Sliders d’opacité
function setupOpacitySlider(id, varName) {
  const slider = document.getElementById(id);
  const valueLabel = document.getElementById(id + "Value");

  slider.addEventListener("input", () => {
    window[varName] = parseInt(slider.value);
    valueLabel.textContent = slider.value + "%";
    drawAll();
  });
}

setupOpacitySlider("opacityImage", "opacityImage");
setupOpacitySlider("opacityGrid", "opacityGrid");
setupOpacitySlider("opacityCode", "opacityCode");
setupOpacitySlider("opacityZone", "opacityZone");

// Préparer l’email
document.getElementById("sendEmailBtn").addEventListener("click", () => {
  const to = document.getElementById("emailTo").value;
  const subject = document.getElementById("emailSubject").value;
  const body = document.getElementById("emailBody").value;

  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  } else {
    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(gmailURL, "_blank");
  }
});

// Initialisation
createGrid(rows, cols);
