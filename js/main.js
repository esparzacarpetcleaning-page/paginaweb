/**
 * Esparza's Carpet Cleaning - Main JavaScript
 * Handles navigation, mobile drawer, scroll animations, counters, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initFooterYear();
  initSmoothScroll();
  initScrollReveal();
  initStatCounters();
  initFacebookReviews();
  initAutoScrollVideos();
});

/* --------------------------------------------------------------------------
   Navbar & Mobile Menu Drawer
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle-btn');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  const navLinks = document.querySelectorAll('.mobile-menu-drawer .nav-link');

  // Sticky header class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen 
        ? `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        document.body.style.overflow = '';
        mobileToggle.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      });
    });
  }

  highlightActiveLink();
}

function highlightActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   Scroll Reveal Animation Engine
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-fade');

  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
}

/* --------------------------------------------------------------------------
   Animated Number Counters (Counting Up)
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');

  if (!counterElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
  } else {
    counterElements.forEach(el => {
      el.textContent = el.dataset.counter + (el.dataset.suffix || '');
    });
  }
}

function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400; // ms
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    // Ease out quad
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(start + (target - start) * easeProgress);

    el.textContent = `${prefix}${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${prefix}${target}${suffix}`;
    }
  }

  requestAnimationFrame(update);
}

/* --------------------------------------------------------------------------
   FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
    });
  });
}

/* --------------------------------------------------------------------------
   Footer Year
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const yearEls = document.querySelectorAll('.current-year');
  const year = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = year;
  });
}

/* --------------------------------------------------------------------------
   Smooth Anchor Scrolling & Hash Handling
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const isIndex = (currentPath === 'index.html' || currentPath === '');

  function setActiveNavLink(targetHash) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === targetHash || href === 'index.html' + targetHash || (targetHash === '' && (href === 'index.html' || href === '#'))) {
        link.classList.add('active');
      } else if (href.includes('#')) {
        link.classList.remove('active');
      }
    });
  }

  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href) return;
      
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      
      const pagePart = href.substring(0, hashIndex);
      const targetId = href.substring(hashIndex);
      if (targetId === '#' || targetId.length <= 1) return;

      // If we are on index.html and link points to index.html#... or #...
      if (isIndex && (pagePart === '' || pagePart === 'index.html')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          setActiveNavLink(targetId);

          const headerOffset = 90;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL without triggering reload
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // Handle direct navigation with hash on page load (e.g. from another page)
  if (window.location.hash) {
    const hash = window.location.hash;
    setTimeout(() => {
      const targetEl = document.querySelector(hash);
      if (targetEl) {
        setActiveNavLink(hash);
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 150);
  }

  // Scrollspy on index.html for #tarifas and #promociones
  if (isIndex) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;
      const secTarifas = document.getElementById('tarifas');
      const secPromo = document.getElementById('promociones');
      
      if (secPromo && scrollPos >= secPromo.offsetTop && scrollPos < secPromo.offsetTop + secPromo.offsetHeight) {
        setActiveNavLink('#promociones');
      } else if (secTarifas && scrollPos >= secTarifas.offsetTop && scrollPos < secTarifas.offsetTop + secTarifas.offsetHeight) {
        setActiveNavLink('#tarifas');
      } else if (window.scrollY < 300) {
        document.querySelectorAll('.nav-link').forEach(link => {
          const href = link.getAttribute('href');
          if (href === 'index.html' || href === '#') {
            link.classList.add('active');
          } else if (href && href.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    }, { passive: true });
  }
}

/* --------------------------------------------------------------------------
   Facebook Reviews Expandable "Leer más / Read more"
   -------------------------------------------------------------------------- */
function initFacebookReviews() {
  document.querySelectorAll('.fb-read-more-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.fb-review-card');
      if (!card) return;
      const isExpanded = card.classList.toggle('is-expanded');
      btn.setAttribute('aria-expanded', isExpanded);

      const textSpan = btn.querySelector('.read-more-text');
      const activeLang = sessionStorage.getItem('esparzas_lang') || 'en';
      if (textSpan) {
        if (isExpanded) {
          textSpan.textContent = (activeLang === 'es') ? 'Leer menos' : 'Read less';
          textSpan.setAttribute('data-i18n', 'fb_read_less');
        } else {
          textSpan.textContent = (activeLang === 'es') ? 'Leer más' : 'Read more';
          textSpan.setAttribute('data-i18n', 'fb_read_more');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Autoplay Video Showcase on Scroll (Plays Automatically, No Click Needed)
   -------------------------------------------------------------------------- */
function initAutoScrollVideos() {
  const videos = document.querySelectorAll('.auto-scroll-video');
  if (!videos.length) return;

  videos.forEach(video => {
    // Browsers strictly require muted and playsinline to allow programmatic autoplay without user gestures
    video.muted = true;
    video.setAttribute('playsinline', '');

    const wrapper = video.closest('.video-showcase-wrapper');
    const statusText = wrapper?.querySelector('.video-status-text span');
    const soundBtn = wrapper?.querySelector('.video-sound-toggle-btn');
    const soundMutedIcon = soundBtn?.querySelector('.sound-icon-muted');
    const soundUnmutedIcon = soundBtn?.querySelector('.sound-icon-unmuted');
    const soundText = soundBtn?.querySelector('.sound-toggle-text');

    function updateStatus(isPlaying) {
      const activeLang = sessionStorage.getItem('esparzas_lang') || 'en';
      if (statusText) {
        if (isPlaying) {
          statusText.textContent = (activeLang === 'es') ? 'Reproduciendo automáticamente' : 'Playing Automatically';
          statusText.setAttribute('data-i18n', 'video_status_playing');
        } else {
          statusText.textContent = (activeLang === 'es') ? 'En pausa (Desplaza para ver)' : 'Paused (Scroll to view)';
          statusText.setAttribute('data-i18n', 'video_status_paused');
        }
      }
    }

    // Sound toggle button click
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const activeLang = sessionStorage.getItem('esparzas_lang') || 'en';
        if (video.muted) {
          video.muted = false;
          if (soundMutedIcon) soundMutedIcon.style.display = 'none';
          if (soundUnmutedIcon) soundUnmutedIcon.style.display = 'inline-block';
          if (soundText) {
            soundText.textContent = (activeLang === 'es') ? 'Sonido Activado (Clic para Silenciar)' : 'Sound Active (Click to Mute)';
            soundText.setAttribute('data-i18n', 'video_sound_disable');
          }
        } else {
          video.muted = true;
          if (soundMutedIcon) soundMutedIcon.style.display = 'inline-block';
          if (soundUnmutedIcon) soundUnmutedIcon.style.display = 'none';
          if (soundText) {
            soundText.textContent = (activeLang === 'es') ? 'Sonido Silenciado (Clic para Activar)' : 'Sound Muted (Click to Unmute)';
            soundText.setAttribute('data-i18n', 'video_sound_enable');
          }
        }
      });
    }

    // Toggle play/pause if user explicitly clicks the video frame
    const frame = video.closest('.video-frame-container');
    if (frame) {
      frame.addEventListener('click', () => {
        if (video.paused) {
          video.play().catch(() => {});
          updateStatus(true);
        } else {
          video.pause();
          updateStatus(false);
        }
      });
    }

    // IntersectionObserver: automatically start playback when scrolled to, pause when scrolled away
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  updateStatus(true);
                })
                .catch(() => {
                  // Ensure muted guarantee and retry
                  video.muted = true;
                  video.play().catch(() => {});
                });
            }
          } else {
            if (!video.paused) {
              video.pause();
              updateStatus(false);
            }
          }
        });
      }, {
        threshold: [0, 0.2, 0.5, 0.75]
      });

      observer.observe(video);
    } else {
      // Fallback: standard autoplay
      video.play().catch(() => {});
    }
  });
}
