/**
 * (CHEAT SHEET)
 * Accesso al canvas con Javascript
 * const canvas = document.querySelector([Selettore]);
 * const ctx = canvas.getContext("2d");
 * ...
 */

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("slider");
const valore = document.getElementById("valore");

//   VARIABILI DI STATO  
let profondita = 0;
let zoom = 1;
let hue = 0;
let tipo = "fiocco"; // Imposto un default
let x, y, angolo;

//   VARIABILI PER MONTE CARLO  
let puntiTotali = 0;
let puntiCerchio = 0;
let stimaPi = 0;

// FUNZIONI DI SUPPORTO (TARTARUGA)
function linea(distanza) {
    const nx = x + distanza * Math.cos(angolo * Math.PI / 180);
    const ny = y + distanza * Math.sin(angolo * Math.PI / 180);
    ctx.lineTo(nx, ny);
    x = nx; y = ny;
}

// ALGORITMI FRATTALI

// 1. Fiocco di Koch
function disegnaFiocco(l, d) {
    if (d === 0) {
        linea(l);
    } else {
        const terzo = l / 3;
        disegnaFiocco(terzo, d - 1); angolo -= 60;
        disegnaFiocco(terzo, d - 1); angolo += 120;
        disegnaFiocco(terzo, d - 1); angolo -= 60;
        disegnaFiocco(terzo, d - 1);
    }
}

// 2. Albero Binario
function disegnaAlbero(l, d) {
    if (d === 0) {
        linea(l);
        linea(-l);
    } else {
        linea(l);
        angolo -= 35;
        disegnaAlbero(l * 0.75, d - 1);
        angolo += 70;
        disegnaAlbero(l * 0.75, d - 1);
        angolo -= 35;
        linea(-l);
    }
}

// 3. Rettangoli Strani
function disegnaRettangoliStrani(l, d) {
    if (d === 0) {
        linea(l);
        linea(-l);
    } else {
        linea(l);
        angolo -= 90;
        disegnaRettangoliStrani(l * 0.75, d - 1);
        angolo += 180;
        disegnaRettangoliStrani(l * 0.75, d - 1);
        angolo -= 90;
        linea(-l);
    }
}

// 4. Sequenza Numerica (Logica Console)
function numeriInSuccessione() {
    let SOriginal = '01101001';
    let S0 = (SOriginal + SOriginal.split('').reverse().join(''));
    console.log("Sequenza:", S0);
    // Scriviamo anche sul canvas per feedback visivo
    ctx.fillText("Guarda la console per la sequenza", -100, 0);
}

//   ALGORITMO MONTE CARLO  

function disegna_cerchio() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "BLACK";
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
    ctx.stroke();
}

function disegna_sqr() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "BLUE";

    // Reset coordinate per il quadrato esterno
    let oldX = x, oldY = y, oldAng = angolo; // salvo stato precedente
    x = 0; y = 0; angolo = 0;

    ctx.moveTo(x, y);
    for (let i = 0; i < 4; i++) {
        linea(canvas.width);
        angolo += 90;
    }
    ctx.stroke();

    // Ripristino (opzionale, ma buona pratica)
    x = oldX; y = oldY; angolo = oldAng;
}

function randomPixel() {
    let px = Math.random() * canvas.width;
    let py = Math.random() * canvas.height;

    // Distanza dal centro (Teorema Pitagora)
    let r = canvas.width / 2;
    let dx = px - r;
    let dy = py - r;
    let distanza = Math.sqrt(dx * dx + dy * dy);

    puntiTotali++;

    ctx.beginPath();
    if (distanza <= r) {
        puntiCerchio++;
        ctx.fillStyle = "RED";
    } else {
        ctx.fillStyle = "PURPLE";
    }
    ctx.fillRect(px, py, 2, 2);
}

function calcoloPI_MonteCarlo() {
    for (let i = 0; i < 100; i++) {
        randomPixel();
    }

    if (puntiTotali > 0) {
        stimaPi = 4 * (puntiCerchio / puntiTotali);
    }

    // UI Dati
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(5, 5, 200, 80);
    ctx.fillStyle = "black";
    ctx.font = "14px monospace";
    ctx.fillText(`Totali: ${puntiTotali}`, 15, 25);
    ctx.fillText(`Cerchio: ${puntiCerchio}`, 15, 45);
    ctx.font = "bold 16px monospace";
    ctx.fillText(`PI ≈ ${stimaPi.toFixed(5)}`, 15, 70);
}


// metodo dei trapezi per il calcolo del PI




















function render() {
    if (tipo !== "cerchio") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (puntiTotali === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        disegna_cerchio();
        disegna_sqr();
    }

    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.lineWidth = 2 / zoom;

    ctx.save(); // Salva lo stato del contesto

    if (tipo !== "cerchio") {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(zoom, zoom);
        // Centriamo il disegno in base al tipo
        if (tipo === "fiocco") {
            ctx.translate(-canvas.width / 2 + 100, -canvas.height / 2 + 150); // Offset manuale per centrare meglio il fiocco
        } else {
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }
    }

    ctx.beginPath();

    if (tipo === "fiocco") {
        // Coordinate iniziali relative per il fiocco
        x = canvas.width / 2 - 150;
        y = canvas.height / 2 - 100;
        angolo = 0;
        ctx.moveTo(x, y);
        for (let i = 0; i < 3; i++) {
            disegnaFiocco(300, profondita);
            angolo += 120;
        }
        ctx.stroke();

    } else if (tipo === "rettangolo") {
        x = canvas.width / 2;
        y = canvas.height / 2 + 150;
        angolo = -90;
        ctx.moveTo(x, y);
        disegnaAlbero(100, profondita); // Nota: nel tuo codice originale era chiamato "rettangolo" ma disegnava "Albero"
        ctx.stroke();

    } else if (tipo === "albero") {
        x = canvas.width / 2;
        y = canvas.height / 2 + 150;
        angolo = -90;
        ctx.moveTo(x, y);
        disegnaRettangoliStrani(100, profondita); // Nota: inversione nomi originale
        ctx.stroke();

    } else if (tipo === "numeri") {
        ctx.translate(canvas.width / 2, canvas.height / 2); // Centro per il testo
        numeriInSuccessione();

    } else if (tipo === "cerchio") {
        calcoloPI_MonteCarlo();
    }

    ctx.restore(); // Ripristina lo stato (toglie lo zoom per il prossimo frame se cambia tipo)

    if (tipo !== "cerchio") {
        hue = (hue + 1) % 360;
    }

    requestAnimationFrame(render);
}

//   EVENT HANDLERS  

slider.oninput = () => {
    profondita = parseInt(slider.value);
    valore.textContent = profondita;
};

canvas.onwheel = (e) => {
    e.preventDefault();
    zoom *= e.deltaY < 0 ? 1.1 : 0.9;
};

// Pulsanti
window.disegnaFrattale_fiocco = () => { tipo = "fiocco"; };
window.disegnaFrattale_albero = () => { tipo = "albero"; };
window.disegnaFrattale_rettangolo = () => { tipo = "rettangolo"; };
window.sequenzaNumerica = () => { tipo = "numeri"; };

window.cerchio = () => {
    tipo = "cerchio";
    // RESET VARIABILI MONTE CARLO
    puntiTotali = 0;
    puntiCerchio = 0;
    stimaPi = 0;
};

// Avvio
render();