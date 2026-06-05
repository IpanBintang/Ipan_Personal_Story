/* =============================================================
   script.js — Shared JavaScript for My Personal Website
   IML254 | UiTM
   ============================================================= */

/* ── CLICK SOUND EFFECT ── */
var clickSound = new Audio("audio/00018.mp3");
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


/* ── BACK TO TOP SOUND EFFECT ── */
/* Plays wow.mp3 ONLY when clicking a "Back to Top" link */
var backTopSound = new Audio("audio/wow.mp3");
backTopSound.volume = 0.7;

document.addEventListener("click", function (e) {
  var target = e.target;

  /* Walk up to find the closest <a> that was clicked */
  var clickedLink = (target.tagName === "A") ? target : (target.closest && target.closest("a"));
  if (!clickedLink) return;

  /* Match by class "back-top" OR href="#top" — covers all Back to Top buttons */
  var isBackToTop =
    clickedLink.classList.contains("back-top") ||
    clickedLink.getAttribute("href") === "#top";

  if (isBackToTop) {
    backTopSound.currentTime = 0;
    backTopSound.play().catch(function () {
      /* Silently ignore if browser blocks autoplay */
    });
  }
});


/* ── DARK MODE ── */

/* Image paths for the dark-mode toggle button
   Replace these filenames with your actual image filenames */
var DARK_ICON  = "images/moon.png";   /* shown in light mode → click to go dark */
var LIGHT_ICON = "images/sun.png";    /* shown in dark mode  → click to go light */

var darkBtn  = document.getElementById("dark-toggle");
var darkIcon = document.getElementById("dark-icon");

function toggleDark() {
  var isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "1" : "0");

  /* Swap the button image instead of setting textContent */
  darkIcon.src = isDark ? LIGHT_ICON : DARK_ICON;
  darkIcon.alt = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (isDark) { startRain(); } else { stopRain(); }
}

/* Apply saved dark mode on page load */
if (localStorage.getItem("darkMode") === "1") {
  document.body.classList.add("dark-mode");
  darkIcon.src = LIGHT_ICON;
  darkIcon.alt = "Switch to light mode";
  /* Rain will be started below after the rain setup */
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

/* Image paths for the music toggle button
   Replace these filenames with your actual image filenames */
var MUSIC_ON_ICON  = "images/sound.tif";      /* playing  */
var MUSIC_OFF_ICON = "images/sound-off.png";  /* paused — use same file if you only have one */

var music     = document.getElementById("bg-music");
var musicBtn  = document.getElementById("music-toggle");
var musicIcon = document.getElementById("music-icon");
music.volume  = 0.4;

function setMusicIcon(isPlaying) {
  /* Swap the button image instead of setting textContent */
  musicIcon.src = isPlaying ? MUSIC_ON_ICON : MUSIC_OFF_ICON;
  musicIcon.alt = isPlaying ? "Pause music" : "Play music";
}

music.addEventListener("canplay", function () {
  var savedTime = parseFloat(localStorage.getItem("musicTime") || "0");
  if (savedTime > 0) { music.currentTime = savedTime; }

  if (localStorage.getItem("musicOn") === "1") {
    music.play().then(function () {
      setMusicIcon(true);
    }).catch(function () {
      setMusicIcon(false);
    });
  } else {
    setMusicIcon(false);
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
    setMusicIcon(true);
    localStorage.setItem("musicOn", "1");
  } else {
    music.pause();
    setMusicIcon(false);
    localStorage.setItem("musicOn", "0");
  }
}
