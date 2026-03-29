/* ═══════════════════════════════════════════════════
   Veterinaria Mi Maskot · HASVET — script.js
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── 1. SCROLL REVEAL ─────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));


  /* ─── 2. SMOOTH SCROLL (links de navegación) ───── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target   = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  /* ─── 3. NAVBAR: sombra al hacer scroll ─────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 30px rgba(26,79,160,0.15)';
    } else {
      navbar.style.boxShadow = '0 2px 20px rgba(26,79,160,0.08)';
    }
  });


  /* ─── 4. NAVBAR ACTIVO según sección visible ─────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => sectionObserver.observe(section));


  /* ─── 5. CONTADOR ANIMADO (estadísticas del hero) ── */
  function animateCounter(el, target, suffix) {
    let current  = 0;
    const step   = Math.ceil(target / 60);
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, 25);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const raw    = el.dataset.count;
          const suffix = el.dataset.suffix || '';
          animateCounter(el, parseInt(raw, 10), suffix);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));


  /* ─── 6. GALERÍA: lightbox simple ───────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item img');

  // Crear overlay del lightbox
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.88);
    z-index: 9999;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
    backdrop-filter: blur(6px);
  `;

  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = `
    max-width: 90vw;
    max-height: 88vh;
    border-radius: 16px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
    object-fit: contain;
    transition: transform 0.3s;
  `;

  const closebtn = document.createElement('button');
  closebtn.innerHTML = '&times;';
  closebtn.style.cssText = `
    position: fixed;
    top: 20px; right: 28px;
    background: none;
    border: none;
    color: white;
    font-size: 46px;
    cursor: pointer;
    line-height: 1;
    opacity: 0.8;
    transition: opacity 0.2s;
  `;
  closebtn.addEventListener('mouseenter', () => (closebtn.style.opacity = '1'));
  closebtn.addEventListener('mouseleave', () => (closebtn.style.opacity = '0.8'));

  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(closebtn);
  document.body.appendChild(lightbox);

  galleryItems.forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) closeLightbox();
  });
  closebtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });


  /* ─── 7. MENÚ HAMBURGUESA (móvil) ───────────────── */
  const navList = document.querySelector('.nav-links');

  // Crear botón hamburguesa si no existe
  if (!document.getElementById('hamburger')) {
    const hamburger = document.createElement('button');
    hamburger.id = 'hamburger';
    hamburger.setAttribute('aria-label', 'Abrir menú');
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    hamburger.style.cssText = `
      display: none;
      background: none;
      border: none;
      font-size: 22px;
      color: var(--blue);
      cursor: pointer;
      padding: 4px 8px;
    `;

    navbar.insertBefore(hamburger, navbar.querySelector('.nav-badge'));

    hamburger.addEventListener('click', () => {
      const open = navList.classList.toggle('mobile-open');
      hamburger.innerHTML = open
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Cerrar al hacer click en un link
    navList.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navList.classList.remove('mobile-open');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Mostrar hamburguesa en móvil
  const mq = window.matchMedia('(max-width: 900px)');
  function toggleHamburger(e) {
    const btn = document.getElementById('hamburger');
    if (btn) btn.style.display = e.matches ? 'block' : 'none';
  }
  mq.addEventListener('change', toggleHamburger);
  toggleHamburger(mq);

  // Estilos extra para menú móvil
  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = `
    #hamburger { order: 3; }
    @media (max-width: 900px) {
      .nav-links {
        display: none !important;
        position: absolute;
        top: 70px; left: 0; right: 0;
        background: white;
        flex-direction: column;
        padding: 20px 5%;
        gap: 16px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        z-index: 999;
      }
      .nav-links.mobile-open {
        display: flex !important;
      }
      .nav-links a { font-size: 16px; }
      .nav-links .active { color: var(--blue) !important; }
    }
    .nav-links .active { color: var(--blue); }
  `;
  document.head.appendChild(mobileStyle);


  /* ─── 8. BOTÓN "VOLVER ARRIBA" ───────────────────── */
  const backTop = document.createElement('a');
  backTop.href = '#hero';
  backTop.id   = 'back-top';
  backTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backTop.setAttribute('aria-label', 'Volver arriba');
  backTop.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 28px;
    width: 44px; height: 44px;
    background: var(--blue);
    color: white;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    text-decoration: none;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s;
    z-index: 998;
    box-shadow: 0 4px 16px rgba(26,79,160,0.35);
  `;
  document.body.appendChild(backTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backTop.style.opacity = '1';
      backTop.style.transform = 'translateY(0)';
    } else {
      backTop.style.opacity = '0';
      backTop.style.transform = 'translateY(20px)';
    }
  });

  backTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
