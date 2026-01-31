const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const imageInput = document.getElementById("imageInput");
const loadImageBtn = document.getElementById("loadImageBtn");

let bgImage = null;
let grid = [];
let rows = 10;
let cols = 10;

// === FONCTIONS DE BASE ===
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

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImage) {
    ctx.globalAlpha = opacityImage / 100;
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }

  drawZones();
  drawGridLines();
  drawCodes();
  drawTexts();
  drawSelections();
}

function drawGridLines() {
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

  ctx.globalAlpha = 1;
}

function drawZones() {
  ctx.globalAlpha = opacityZone / 100;
  grid.flat().forEach(cell => {
    if (cell.fillColor) {
      ctx.fillStyle = cell.fillColor;
      ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
    }
  });
  ctx.globalAlpha = 1;
}

function drawCodes() {
  ctx.globalAlpha = opacityCode / 100;

  grid.flat().forEach(cell => {
    ctx.lineWidth =
      cell.thickness === "bold"
        ? 2
        : cell.thickness === "extra-bold"
        ? 4
        : 1;

    ctx.strokeStyle = cell.borderColor || "black";

    const cx = cell.x + cell.w / 2;
    const cy = cell.y + cell.h / 2;

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

  ctx.globalAlpha = 1;
}

function drawTexts() {
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
        cell.y + cell.h / 2
      );
    }
  });
}

function drawSelections() {
  grid.flat().forEach(cell => {
    if (cell.selected) {
      ctx.strokeStyle = "cyan";
      ctx.lineWidth = 2;
      ctx.strokeRect(cell.x, cell.y, cell.w, cell.h);
    }
  });
}

// === INTERACTIONS ===
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

// === IMAGE ===
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

// === BOUTONS ===
document.getElementById("applyBtn").addEventListener("click", () => {
  const code = document.querySelector("input[name='codeType']:checked").value;
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

document.getElementById("clearBorderBtn").addEventListener("click", () => {
  grid.flat().forEach(cell => {
    if (cell.selected) {
      cell.borderColor = "";
    }
  });
  drawAll();
});

document.getElementById("clearTextBtn").addEventListener("click", () => {
  grid.flat().forEach(cell => {
    if (cell.selected) {
      cell.text = "";
      cell.codeType = "none";
    }
  });
  drawAll();
});

document.getElementById("resetGridBtn").addEventListener("click", () => {
  const r = +document.getElementById("rowsInput").value;
  const c = +document.getElementById("colsInput").value;
  createGrid(r, c);
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("light-theme");
});

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

// === SLIDERS ===
let opacityImage = 100;
let opacityGrid = 100;
let opacityCode = 100;
let opacityZone = 100;

function setupOpacitySlider(id, targetVar) {
  const slider = document.getElementById(id);
  const label = document.getElementById(id + "Value");

  slider.addEventListener("input", () => {
    window[targetVar] = +slider.value;
    label.textContent = slider.value + "%";
    drawAll();
  });
}

setupOpacitySlider("opacityImage", "opacityImage");
setupOpacitySlider("opacityGrid", "opacityGrid");
setupOpacitySlider("opacityCode", "opacityCode");
setupOpacitySlider("opacityZone", "opacityZone");

// === INITIALISATION ===
createGrid(10, 10);
