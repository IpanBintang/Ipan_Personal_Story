/* =============================================================
   script.js — Shared JavaScript for My Personal Website
   IML254 | UiTM
   ============================================================= */

/* ── CLICK SOUND EFFECT ── */
var clickSound = new Audio("audio/mambo.mp3");
clickSound.volume = 0.6;

/* Attach click sound to all interactive elements:
   links, buttons, and nav items */
document.addEventListener("click", function (e) {
  var target = e.target;

  /* Check if the clicked element (or its parent) is a link or button */
  var isClickable =
    target.tagName === "A" ||
    target.tagName === "BUTTON" ||
    target.closest("a") ||
    target.closest("button");

  /* Don't play click sound when toggling the music button itself,
     to avoid the sound overlapping with music state change */
  var isMusicBtn = target.id === "music-toggle" || (target.closest && target.closest("#music-toggle"));

  if (isClickable && !isMusicBtn) {
    /* Reset so rapid clicks always play from start */
    clickSound.currentTime = 0;
    clickSound.play().catch(function () {
      /* Silently ignore if browser blocks autoplay */
    });
  }
});


/* ── DARK MODE ── */
function toggleDark() {
  var isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "1" : "0");
  document.getElementById("dark-toggle").textContent = isDark ? "\u2600\uFE0F" : "\uD83C\uDF19";
  if (isDark) { startRain(); } else { stopRain(); }
}

/* Apply saved dark mode on page load */
if (localStorage.getItem("darkMode") === "1") {
  document.body.classList.add("dark-mode");
  document.getElementById("dark-toggle").textContent = "\u2600\uFE0F";
}


/* ── RAIN EFFECT ── */
var rainInterval = null;
var canvas = document.getElementById("rain-canvas");
var ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

var drops = [];
for (var i = 0; i < 120; i++) {
  drops.push({
    x:       Math.random() * window.innerWidth,
    y:       Math.random() * window.innerHeight,
    speed:   4 + Math.random() * 6,
    length:  10 + Math.random() * 20,
    opacity: 0.3 + Math.random() * 0.5
  });
}

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < drops.length; i++) {
    var d = drops[i];
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - 1, d.y + d.length);
    ctx.strokeStyle = "rgba(180, 210, 255, " + d.opacity + ")";
    ctx.lineWidth = 1;
    ctx.stroke();
    d.y += d.speed;
    if (d.y > canvas.height) {
      d.y = -d.length;
      d.x = Math.random() * canvas.width;
    }
  }
}

function startRain() {
  if (!rainInterval) {
    rainInterval = setInterval(drawRain, 30);
  }
}

function stopRain() {
  clearInterval(rainInterval);
  rainInterval = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* Auto-start rain if dark mode is already active */
if (document.body.classList.contains("dark-mode")) { startRain(); }


/* ── BACKGROUND MUSIC ── */
var music    = document.getElementById("bg-music");
var musicBtn = document.getElementById("music-toggle");
music.volume = 0.4;

music.addEventListener("canplay", function () {
  var savedTime = parseFloat(localStorage.getItem("musicTime") || "0");
  if (savedTime > 0) { music.currentTime = savedTime; }

  if (localStorage.getItem("musicOn") === "1") {
    music.play().then(function () {
      musicBtn.textContent = "\uD83C\uDFB5";
    }).catch(function () {
      musicBtn.textContent = "\uD83D\uDD07";
    });
  } else {
    musicBtn.textContent = "\uD83D\uDD07";
  }
}, { once: true });

/* Save music position and state when leaving the page */
window.addEventListener("beforeunload", function () {
  localStorage.setItem("musicTime", music.currentTime);
  localStorage.setItem("musicOn",   music.paused ? "0" : "1");
});

function toggleMusic() {
  if (music.paused) {
    music.play();
    musicBtn.textContent = "\uD83C\uDFB5";
    localStorage.setItem("musicOn", "1");
  } else {
    music.pause();
    musicBtn.textContent = "\uD83D\uDD07";
    localStorage.setItem("musicOn", "0");
  }
}
