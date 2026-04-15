/* ============================================================
   SRI NARAYANA FABRICATORS — JAVASCRIPT
   Animations: Particles, Sparks, Scroll, Stats, Form, etc.
   ============================================================ */

'use strict';

// ─── PARTICLE BACKGROUND ───────────────────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.5 ? '#00e5ff' : '#b026ff',
  };
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 16000));
  for (let i = 0; i < count; i++) particles.push(createParticle());
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw particles
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    const hex = p.color === '#00e5ff' ? [0, 229, 255] : [176, 38, 255];
    ctx.fillStyle = `rgba(${hex[0]}, ${hex[1]}, ${hex[2]}, ${p.alpha})`;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowBlur = 0;

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });

  animFrame = requestAnimationFrame(drawParticles);
}

resizeCanvas();
initParticles();
drawParticles();

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// ─── FLYING SPARKS ─────────────────────────────────────────────────
const sparksContainer = document.getElementById('sparksContainer');

function createSpark() {
  const spark = document.createElement('div');
  spark.className = 'spark';

  const startX = Math.random() * window.innerWidth;
  const startY = window.innerHeight + 10;
  const dx = (Math.random() - 0.5) * 200;
  const dy = -(Math.random() * 300 + 100);
  const duration = Math.random() * 2 + 1.5;
  const size = Math.random() * 4 + 1;
  const isGold = Math.random() > 0.5;

  spark.style.cssText = `
    left: ${startX}px;
    top: ${startY}px;
    width: ${size}px;
    height: ${size}px;
    background: ${isGold ? '#b026ff' : '#00e5ff'};
    box-shadow: 0 0 ${size * 3}px ${isGold ? '#b026ff' : '#00e5ff'};
    --dx: ${dx}px;
    --dy: ${dy}px;
    animation-duration: ${duration}s;
  `;

  sparksContainer.appendChild(spark);
  setTimeout(() => spark.remove(), duration * 1000);
}

setInterval(createSpark, 200);
for (let i = 0; i < 10; i++) setTimeout(createSpark, i * 100);

// ─── NAVBAR ────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 100;
    if (window.scrollY >= top) current = s.getAttribute('id');
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ─── SMOOTH SCROLL ─────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── SCROLL REVEAL ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal').forEach((el, i) => {
  revealObserver.observe(el);
});

// ─── STAT COUNTER ANIMATION ────────────────────────────────────────
function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-number');
        nums.forEach(num => {
          animateCounter(num, parseInt(num.dataset.target));
        });
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statObserver.observe(statsEl);

// ─── WELDING SPARKS ON ABOUT CARD ──────────────────────────────────
const sparkBurst = document.getElementById('sparkBurst');

function burstSpark() {
  if (!sparkBurst) return;
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('div');
    const angle = (Math.PI * 2 / 6) * i + Math.random() * 0.5;
    const dist = Math.random() * 30 + 10;
    const size = Math.random() * 4 + 2;
    s.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: ${Math.random() > 0.5 ? '#b026ff' : '#00e5ff'};
      left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: burstAnim 0.8s ease-out forwards;
      --bx: ${Math.cos(angle) * dist}px;
      --by: ${Math.sin(angle) * dist}px;
    `;
    sparkBurst.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
}

// Inject burstAnim keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes burstAnim {
    0%   { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -50%) translate(var(--bx), var(--by)) scale(0); opacity: 0; }
  }
`;
document.head.appendChild(style);

setInterval(burstSpark, 1200);

// ─── SERVICE CARD TILT EFFECT ──────────────────────────────────────
document.querySelectorAll('.service-card, .about-card-main, .stat-card, .why-card, .feature-item, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * 8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(1000px) rotateX(${-rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'transform 0.1s ease';
    card.style.zIndex = '10';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease, z-index 0.5s ease';
    card.style.zIndex = '1';
  });
});

// ─── CONTACT FORM ──────────────────────────────────────────────────
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Sending...`;
    btn.disabled = true;

    const spinStyle = document.createElement('style');
    spinStyle.textContent = `.spin { animation: spinAnim 1s linear infinite; } @keyframes spinAnim { to { transform: rotate(360deg); } }`;
    document.head.appendChild(spinStyle);

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      form.reset();
      showToast();
      spinStyle.remove();
    }, 2000);
  });
}

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ─── ANIMATED SCANNING LINE ON HERO ────────────────────────────────
function createHeroScanLine() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const line = document.createElement('div');
  line.style.cssText = `
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,229,255,0.4), transparent);
    pointer-events: none;
    z-index: 1;
    top: 0;
  `;
  hero.appendChild(line);

  let pos = 0;
  let dir = 1;

  function scan() {
    pos += dir * 0.5;
    if (pos >= 100 || pos <= 0) dir *= -1;
    line.style.top = pos + '%';
    requestAnimationFrame(scan);
  }
  scan();
}

createHeroScanLine();

// ─── GLITCH TEXT EFFECT ON LOGO ────────────────────────────────────
function glitchEffect() {
  const logo = document.querySelector('.logo-main');
  if (!logo) return;

  const original = logo.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

  let iterations = 0;
  const interval = setInterval(() => {
    logo.textContent = original
      .split('')
      .map((char, i) => {
        if (i < iterations) return original[i];
        if (char === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    iterations += 0.5;
    if (iterations >= original.length) {
      logo.textContent = original;
      clearInterval(interval);
    }
  }, 40);
}

// Glitch every 8 seconds
glitchEffect();
setInterval(glitchEffect, 8000);

// ─── MAGNETIC BUTTON EFFECT ────────────────────────────────────────
document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ─── DYNAMIC FIRE CURSOR EFFECT ────────────────────────────────────
let lastX = 0, lastY = 0;

document.addEventListener('mousemove', (e) => {
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const speed = Math.sqrt(dx * dx + dy * dy);

  if (speed > 10 && Math.random() > 0.7) {
    const spark = document.createElement('div');
    const size = Math.random() * 5 + 2;
    spark.style.cssText = `
      position: fixed;
      width: ${size}px; height: ${size}px;
      background: radial-gradient(circle, #b026ff, #00e5ff);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      left: ${e.clientX - size / 2}px;
      top: ${e.clientY - size / 2}px;
      box-shadow: 0 0 ${size * 2}px #00e5ff;
      animation: cursorSpark 0.6s ease-out forwards;
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 600);
  }

  lastX = e.clientX;
  lastY = e.clientY;
});

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
  @keyframes cursorSpark {
    0%   { transform: scale(1); opacity: 1; }
    100% { transform: scale(0) translateY(-20px); opacity: 0; }
  }
`;
document.head.appendChild(cursorStyle);

// ─── WHY CARD PARALLAX ─────────────────────────────────────────────
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.why-number').style.opacity = '0.4';
    card.querySelector('.why-number').style.transform = 'scale(1.1)';
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.why-number').style.opacity = '0.15';
    card.querySelector('.why-number').style.transform = 'scale(1)';
  });
});

// ─── PAGE LOAD ANIMATION & PRELOADER ───────────────────────────────
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const video = document.getElementById('preloadVideo');

  // Fade in body initially hidden by CSS (if any) or just let the video play out.
  document.body.style.opacity = '1';

  if (video && preloader) {
    // If video finishes playing, hide preloader
    video.addEventListener('ended', () => {
      preloader.classList.add('fade-out');
      // allow scrolling if locked
      document.body.style.overflowY = 'auto';
    });

    // Timeout safety net just in case video fails or gets stuck
    setTimeout(() => {
      if(!preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
        document.body.style.overflowY = 'auto';
      }
    }, 6000); // adjust based on video length
  } else if (preloader) {
    preloader.classList.add('fade-out');
  }
});

console.log('%c🔥 Sri Narayana Fabricators', 'color: #00e5ff; font-family: monospace; font-size: 20px; font-weight: bold;');
console.log('%cWebsite loaded. Quality Metal Fabrication.', 'color: #b026ff; font-family: monospace;');
