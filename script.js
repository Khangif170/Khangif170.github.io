// script.js
// Handles: responsive nav, theme toggle (persisted), smooth scroll, portfolio filter + lightbox, contact form validation
// No external libs. Vanilla JS.

(() => {
  // Elements
  const root = document.documentElement;
  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const themeToggle = document.getElementById('themeToggle');
  const yearEl = document.getElementById('year');
  const portfolioGrid = document.getElementById('portfolioGrid');
  const filterSelect = document.getElementById('filter');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbTitle = document.getElementById('lbTitle');
  const lbDesc = document.getElementById('lbDesc');
  const lbClose = document.getElementById('lbClose');
  const projects = Array.from(document.querySelectorAll('.project'));
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  // Set year
  yearEl.textContent = new Date().getFullYear();

  /* ------------------ Theme (dark/light) ------------------ */
  const THEME_KEY = 'stellar-theme';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light') document.documentElement.classList.add('light');

  function updateThemeAttr() {
    const isLight = document.documentElement.classList.contains('light');
    themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
  }
  updateThemeAttr();

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const isLight = document.documentElement.classList.contains('light');
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    updateThemeAttr();
  });

  /* ------------------ Mobile nav ------------------ */
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  // close nav on link click (mobile)
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.addEventListener('click', (e) => {
      // Smooth scroll to target
      const id = a.getAttribute('href');
      if (id && id.startsWith('#')) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({behavior:'smooth', block:'start'});
      }
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------ Portfolio filter ------------------ */
  function filterProjects(type) {
    projects.forEach(p => {
      const t = p.dataset.type || 'all';
      if (type === 'all' || t === type) {
        p.style.display = '';
      } else {
        p.style.display = 'none';
      }
    });
  }
  filterSelect.addEventListener('change', (e) => filterProjects(e.target.value));
  filterProjects('all');

  /* ------------------ Lightbox ------------------ */
  function openLightbox(imgSrc, title, desc) {
    lbImage.src = imgSrc;
    lbImage.alt = title || 'Project preview';
    lbTitle.textContent = title || '';
    lbDesc.textContent = desc || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // trap focus on close
    lbClose.focus();
  }
  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImage.src = '';
  }

  projects.forEach(p => {
    const img = p.querySelector('img');
    const title = p.querySelector('h3')?.textContent || '';
    const desc = p.querySelector('.muted')?.textContent || '';
    const src = img?.src || '';

    // click or Enter/Space -> open
    p.addEventListener('click', () => openLightbox(src, title, desc));
    p.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(src, title, desc);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ------------------ Smooth reveal on scroll (simple) ------------------ */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('reveal');
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.card, .feature, .project, .hero').forEach(el => observer.observe(el));

  /* ------------------ Contact form (front-end validation + fake send) ------------------ */
  function showError(el, message) {
    const err = document.getElementById('err' + el.id.charAt(0).toUpperCase() + el.id.slice(1));
    if (err) err.textContent = message || '';
    el.setAttribute('aria-invalid', !!message);
  }

  function validateForm() {
    const name = contactForm.name;
    const email = contactForm.email;
    const message = contactForm.message;
    let ok = true;

    // name
    if (!name.value || name.value.trim().length < 2) { showError(name, 'Please enter your name.'); ok = false; } else showError(name, '');

    // email (simple)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) { showError(email, 'Please enter a valid email.'); ok = false; } else showError(email, '');

    // message
    if (!message.value || message.value.trim().length < 10) { showError(message, 'Please describe your project (at least 10 characters).'); ok = false; } else showError(message, '');

    return ok;
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.textContent = '';
    if (!validateForm()) return;

    // Simulate sending (frontend-only)
    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Simulated delay (no background work; completes here)
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
      contactForm.reset();
      formMessage.textContent = 'Thanks — your message was sent (simulated). I will reply within 48 hours.';
    }, 700);
  });

  /* ------------------ small helpers ------------------ */
  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // progressive enhancement: enable smooth scroll for anchor links across the page
  document.documentElement.style.scrollBehavior = 'smooth';

})();
