// Cấu hình mật khẩu và thời gian mốc
const CORRECT_PASS = "13092026";
const START_DATE = new Date(2026, 8, 13, 0, 0, 0);

// DOM Elements
const lockScreen = document.getElementById("lockScreen");
const passInput = document.getElementById("passInput");
const btnLogin = document.getElementById("btnLogin");
const errorMsg = document.getElementById("errorMsg");

const mainContent = document.getElementById("mainContent");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

const lightbox = document.getElementById("imageLightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");

const btnAgree = document.getElementById("btnAgree");
const confessionModal = document.getElementById("confessionLetterModal");
const flashOverlay = document.getElementById("flashOverlay");
const btnCloseConfession = document.getElementById("btnCloseConfession");

/* ================= 1. XỬ LÝ ĐĂNG NHẬP ================= */
function attemptUnlock() {
  const entered = passInput.value.trim();

  if (entered === CORRECT_PASS) {
    errorMsg.textContent = "";
    lockScreen.style.opacity = "0";
    lockScreen.style.transform = "scale(1.08)";
    
    setTimeout(() => {
      lockScreen.classList.add("hide");
      mainContent.classList.remove("hide");
      musicToggle.classList.remove("hide");

      playMusicSafely();
      startLoveTimer();
      triggerGrandConfetti();
    }, 850);
  } else {
    errorMsg.textContent = "Hỏng gòi, Linh thử nhớ lại ngày tụi mình bắt đầu nói chuyện xem! 🥺";
    const vault = lockScreen.querySelector(".crystal-vault");
    vault.classList.add("shake-box");
    setTimeout(() => vault.classList.remove("shake-box"), 500);
  }
}

btnLogin.addEventListener("click", attemptUnlock);
passInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") attemptUnlock();
});

/* ================= 2. NÚT NHẠC ================= */
function playMusicSafely() {
  if (bgMusic.src && bgMusic.src !== window.location.href) {
    bgMusic.play().then(() => {
      musicToggle.classList.add("playing");
    }).catch(() => {
      musicToggle.classList.remove("playing");
    });
  }
}

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.classList.add("playing");
  } else {
    bgMusic.pause();
    musicToggle.classList.remove("playing");
  }
});

/* ================= 3. ĐỒNG HỒ ĐẾM THỜI GIAN ================= */
function startLoveTimer() {
  function update() {
    const now = new Date();
    const diff = Math.max(0, now - START_DATE);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = d < 10 ? "0" + d : d;
    document.getElementById("hours").textContent = h < 10 ? "0" + h : h;
    document.getElementById("minutes").textContent = m < 10 ? "0" + m : m;
    document.getElementById("seconds").textContent = s < 10 ? "0" + s : s;
  }
  update();
  setInterval(update, 1000);
}

/* ================= 4. GÁN SỰ KIỆN CLICK XEM 20 ẢNH TRÊN DẢI LỤA ================= */
function bindRibbonCards() {
  const cards = document.querySelectorAll(".ribbon-card");
  cards.forEach(card => {
    card.onclick = () => {
      const full = card.getAttribute("data-full");
      const caption = card.getAttribute("data-caption");
      lightboxImg.src = full;
      lightboxCaption.textContent = caption;
      lightbox.classList.remove("hide");
    };
  });
}
bindRibbonCards();

function dismissLightbox() {
  lightbox.classList.add("hide");
  lightboxImg.src = "";
}

closeLightbox.addEventListener("click", dismissLightbox);
lightbox.querySelector(".lightbox-blur-bg").addEventListener("click", dismissLightbox);

/* ================= 5. HIỆU ỨNG TỎ TÌNH & CHỚP SÁNG ================= */
function triggerGrandConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}

btnAgree.addEventListener("click", () => {
  flashOverlay.classList.add("active");
  
  setTimeout(() => {
    flashOverlay.classList.remove("active");
    confessionModal.classList.remove("hide");
  }, 400);

  if (typeof confetti === "function") {
    const end = Date.now() + 5000;
    const colors = ['#ff2a70', '#ff85a2', '#f9d423', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
});

btnCloseConfession.addEventListener("click", () => {
  confessionModal.classList.add("hide");
});

/* ================= 6. NỀN SAO BĂNG ================= */
const canvas = document.getElementById("starfieldCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
let shootingStars = [];

function initCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", initCanvasSize);
initCanvasSize();

class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.8 + 0.5;
    this.alpha = Math.random() * 0.8 + 0.2;
    this.speed = Math.random() * 0.02 + 0.005;
  }
  draw() {
    this.alpha += this.speed;
    if (this.alpha > 1 || this.alpha < 0.2) this.speed = -this.speed;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(this.alpha)})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ShootingStar {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.len = Math.random() * 80 + 40;
    this.speed = Math.random() * 8 + 6;
    this.size = Math.random() * 1.5 + 1;
    this.active = false;
  }
  trigger() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * (canvas.height * 0.4);
    this.active = true;
  }
  update() {
    if (!this.active) return;
    this.x += this.speed;
    this.y += this.speed * 0.6;
    if (this.x > canvas.width || this.y > canvas.height) {
      this.active = false;
    }
  }
  draw() {
    if (!this.active) return;
    ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
    ctx.lineWidth = this.size;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.len, this.y - this.len * 0.6);
    ctx.stroke();
  }
}

for (let i = 0; i < 70; i++) stars.push(new Star());
for (let i = 0; i < 2; i++) shootingStars.push(new ShootingStar());

setInterval(() => {
  const randomStar = shootingStars[Math.floor(Math.random() * shootingStars.length)];
  if (randomStar && !randomStar.active) randomStar.trigger();
}, 3000);

function renderSky() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => s.draw());
  shootingStars.forEach(s => {
    s.update();
    s.draw();
  });
  requestAnimationFrame(renderSky);
}
renderSky();
/* ================= XỬ LÝ MỞ / ĐÓNG PHONG THƯ ================= */
const envelopeCard = document.getElementById("envelopeCard");
const letterContentBox = document.getElementById("letterContentBox");
const btnCloseLetter = document.getElementById("btnCloseLetter");

if (envelopeCard && letterContentBox) {
  envelopeCard.addEventListener("click", () => {
    envelopeCard.classList.add("hide");
    letterContentBox.classList.remove("hide");
  });

  btnCloseLetter.addEventListener("click", () => {
    letterContentBox.classList.add("hide");
    envelopeCard.classList.remove("hide");
  });
}