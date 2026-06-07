/* =============================================================
   script.js — Shared JavaScript for My Personal Website
   IML254 | UiTM
   ============================================================= */

/* ── CLICK SOUND EFFECT ── */
var clickSound = new Audio("audio/00018.mp3");
clickSound.volume = 0.6;

document.addEventListener("click", function (e) {
  var target = e.target;
  var isClickable =
    target.tagName === "A" ||
    target.tagName === "BUTTON" ||
    target.closest("a") ||
    target.closest("button");
  if (isClickable) {
    clickSound.currentTime = 0;
    clickSound.play().catch(function () {});
  }
});


/* ── BACK TO TOP SOUND EFFECT ── */
var backTopSound = new Audio("audio/wow.mp3");
backTopSound.volume = 0.7;

document.addEventListener("click", function (e) {
  var target = e.target;
  var clickedLink = (target.tagName === "A") ? target : (target.closest && target.closest("a"));
  if (!clickedLink) return;
  var isBackToTop =
    clickedLink.classList.contains("back-top") ||
    clickedLink.getAttribute("href") === "#top";
  if (isBackToTop) {
    backTopSound.currentTime = 0;
    backTopSound.play().catch(function () {});
  }
});


/* ── DARK MODE ── */
var DARK_ICON  = "images/moon.png";
var LIGHT_ICON = "images/sun.png";

var darkBtn  = document.getElementById("dark-toggle");
var darkIcon = document.getElementById("dark-icon");

function toggleDark() {
  var isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "1" : "0");
  darkIcon.src = isDark ? LIGHT_ICON : DARK_ICON;
  darkIcon.alt = isDark ? "Switch to light mode" : "Switch to dark mode";
  if (isDark) {
    startRain();
    stopSunlight();
  } else {
    stopRain();
    startSunlight();
  }
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
window.addEventListener("resize", resizeCanvas);

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
  if (!rainInterval) { rainInterval = setInterval(drawRain, 30); }
}

function stopRain() {
  clearInterval(rainInterval);
  rainInterval = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/* ── SUNLIGHT EFFECT ── */
var sunCanvas = document.createElement("canvas");
sunCanvas.id = "sun-canvas";
sunCanvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;";
document.body.appendChild(sunCanvas);
var sunCtx = sunCanvas.getContext("2d");
var sunInterval = null;

function resizeSunCanvas() {
  sunCanvas.width  = window.innerWidth;
  sunCanvas.height = window.innerHeight;
}
resizeSunCanvas();
window.addEventListener("resize", resizeSunCanvas);

var rays = [];
for (var s = 0; s < 18; s++) {
  rays.push({
    angle:         Math.random() * Math.PI * 0.55 + Math.PI * 0.1,
    length:        window.innerHeight * (0.5 + Math.random() * 0.7),
    width:         18 + Math.random() * 60,
    opacity:       0,
    targetOpacity: 0.04 + Math.random() * 0.07,
    speed:         0.003 + Math.random() * 0.005,
    phase:         Math.random() * Math.PI * 2,
    drift:         (Math.random() - 0.5) * 0.0004
  });
}

function drawSunlight() {
  var originX = sunCanvas.width * 0.92;
  var originY = sunCanvas.height * -0.05;
  sunCtx.clearRect(0, 0, sunCanvas.width, sunCanvas.height);
  var t = Date.now() * 0.001;

  for (var i = 0; i < rays.length; i++) {
    var r = rays[i];
    r.opacity += (r.targetOpacity - r.opacity) * 0.02;
    r.angle += r.drift;
    var pulse = Math.sin(t * r.speed * 6 + r.phase) * 0.015;
    var alpha = Math.max(0, r.opacity + pulse);

    var halfW = r.width * 0.5;
    var endX  = originX + Math.cos(r.angle) * r.length;
    var endY  = originY + Math.sin(r.angle) * r.length;
    var perpX = -Math.sin(r.angle);
    var perpY =  Math.cos(r.angle);

    sunCtx.beginPath();
    sunCtx.moveTo(originX + perpX * 1,  originY + perpY * 1);
    sunCtx.lineTo(originX - perpX * 1,  originY - perpY * 1);
    sunCtx.lineTo(endX - perpX * halfW, endY - perpY * halfW);
    sunCtx.lineTo(endX + perpX * halfW, endY + perpY * halfW);
    sunCtx.closePath();
    sunCtx.fillStyle = "rgba(255, 220, 100, " + alpha + ")";
    sunCtx.fill();
  }

  var glow = sunCtx.createRadialGradient(originX, originY, 0, originX, originY, 220);
  glow.addColorStop(0,   "rgba(255, 240, 160, 0.18)");
  glow.addColorStop(0.4, "rgba(255, 220, 100, 0.06)");
  glow.addColorStop(1,   "rgba(255, 200,  60, 0)");
  sunCtx.beginPath();
  sunCtx.arc(originX, originY, 220, 0, Math.PI * 2);
  sunCtx.fillStyle = glow;
  sunCtx.fill();
}

function startSunlight() {
  if (!sunInterval) { sunInterval = setInterval(drawSunlight, 30); }
}

function stopSunlight() {
  clearInterval(sunInterval);
  sunInterval = null;
  sunCtx.clearRect(0, 0, sunCanvas.width, sunCanvas.height);
}


/* ── BACKGROUND MUSIC ── */
var MUSIC_ON_ICON  = "images/sound.png";
var MUSIC_OFF_ICON = "images/sound-off.png";

var music     = document.getElementById("bg-music");
var musicIcon = document.getElementById("music-icon");
music.volume  = 0.4;

function setMusicIcon(isPlaying) {
  musicIcon.src = isPlaying ? MUSIC_ON_ICON : MUSIC_OFF_ICON;
  musicIcon.alt = isPlaying ? "Pause music" : "Play music";
}

var savedTime  = parseFloat(localStorage.getItem("musicTime") || "0");
var wasPlaying = localStorage.getItem("musicOn") === "1";

music.addEventListener("canplay", function () {
  if (savedTime > 0) { music.currentTime = savedTime; }
  if (wasPlaying) {
    music.play().then(function () {
      setMusicIcon(true);
    }).catch(function () {
      setMusicIcon(false);
    });
  } else {
    setMusicIcon(false);
  }
}, { once: true });

window.addEventListener("beforeunload", function () {
  localStorage.setItem("musicTime", music.currentTime);
  localStorage.setItem("musicOn", music.paused ? "0" : "1");
});

function toggleMusic() {
  if (music.paused) {
    music.play().then(function () {
      setMusicIcon(true);
      localStorage.setItem("musicOn", "1");
    }).catch(function (err) {
      console.log("Music blocked:", err);
    });
  } else {
    music.pause();
    setMusicIcon(false);
    localStorage.setItem("musicOn", "0");
  }
}

setMusicIcon(false);


/* ── INIT: apply saved dark mode preference ── */
if (localStorage.getItem("darkMode") === "1") {
  document.body.classList.add("dark-mode");
  darkIcon.src = LIGHT_ICON;
  darkIcon.alt = "Switch to light mode";
  startRain();
} else {
  darkIcon.src = DARK_ICON;
  darkIcon.alt = "Switch to dark mode";
  startSunlight();
}
