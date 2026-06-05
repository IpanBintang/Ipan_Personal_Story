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
  var isMusicBtn = target.id === "music-toggle" || (target.closest && target.closest("#music-toggle"));
  if (isClickable && !isMusicBtn) {
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
  if (isDark) { startRain(); } else { stopRain(); }
}

if (localStorage.getItem("darkMode") === "1") {
  document.body.classList.add("dark-mode");
  darkIcon.src = LIGHT_ICON;
  darkIcon.alt = "Switch to light mode";
} else {
  darkIcon.src = DARK_ICON;
  darkIcon.alt = "Switch to dark mode";
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
  if (!rainInterval) { rainInterval = setInterval(drawRain, 30); }
}

function stopRain() {
  clearInterval(rainInterval);
  rainInterval = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

if (document.body.classList.contains("dark-mode")) { startRain(); }


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

window.addEventListener("beforeunload", function () {
  localStorage.setItem("musicTime", music.currentTime);
  localStorage.setItem("musicOn", music.paused ? "0" : "1");
});

setMusicIcon(false);
