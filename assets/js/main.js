/* OJCP — Shared JavaScript */

// ── Header scroll behavior ──────────────────────────────────

document.addEventListener('click', e => {
  const disabledLink = e.target.closest('a[aria-disabled="true"]');
  if (disabledLink) e.preventDefault();
});

const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
      header.classList.remove('hero-mode');
    } else {
      header.classList.remove('scrolled');
      if (document.body.classList.contains('has-hero')) header.classList.add('hero-mode');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile menu ─────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileClose = document.querySelector('.mobile-nav-close');
if (hamburger && mobileNav) {
  const openMenu = () => {
    // prevent layout shift: reserve scrollbar width
    const sb = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = sb + 'px';
    document.body.style.overflow = 'hidden';
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.querySelector('.nav-link')?.focus();
  };
  const closeMenu = () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };
  hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  mobileNav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  // close on backdrop click
  mobileNav.addEventListener('click', e => { if (e.target === mobileNav) closeMenu(); });
}

// ── Active nav link ──────────────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.href === window.location.href) link.classList.add('active');
});

// ── Fade-in on scroll & load ──────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const isMobile = window.innerWidth <= 1024;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, {
    threshold: isMobile ? 0.01 : 0.08,
    rootMargin: isMobile ? '0px 0px 60px 0px' : '0px 0px -40px 0px'
  });
  fadeEls.forEach(el => observer.observe(el));
}

// Guarantee immediate reveal of hero elements visible at page start (mobile/tablet/desktop)
const triggerInitialHeroAnimations = () => {
  document.querySelectorAll('.hero-mobile-only .fade-in, .hero .fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 40) {
      el.classList.add('visible');
    }
  });
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', triggerInitialHeroAnimations);
} else {
  triggerInitialHeroAnimations();
}
window.addEventListener('load', triggerInitialHeroAnimations);

// ── Springy Pop-Out Stagger Animation for ALL Grid Cards across all pages ─────
const popOutGridSelector = [
  '.stats-grid',
  '.personas-grid',
  '.trio-grid',
  '.fights-grid',
  '.vision-grid',
  '.inclusion-grid',
  '.pillars-grid',
  '.pledges-grid',
  '.pledges-grid-ref',
  '.chapters-grid',
  '.reasons-grid',
  '.press-kit-grid',
  '.statements-grid',
  '.about-flag-grid',
  '.contact-cards',
  '.contact-channel-grid',
  '.newsroom-gallery-grid',
  '.org-grid',
  '.about-pillars-grid',
  '.reasons-grid-ref'
].join(', ');

document.querySelectorAll(popOutGridSelector).forEach(grid => {
  const children = Array.from(grid.children);
  children.forEach(child => {
    child.style.opacity = '0';
    child.style.transform = 'scale(0.84) translateY(32px)';
    child.style.transition = 'opacity 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
    child.style.willChange = 'opacity, transform';
  });
  const isMobile = window.innerWidth <= 1024;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        children.forEach((child, i) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'scale(1) translateY(0)';
          }, i * 75); // 75ms responsive stagger delay per item
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: isMobile ? 0.02 : 0.08, rootMargin: '0px 0px 40px 0px' });
  obs.observe(grid);
});

// ── Cookie banner ────────────────────────────────────────────
const cookieBanner = document.querySelector('.cookie-banner');
if (cookieBanner) {
  if (!localStorage.getItem('ojc-cookie-consent')) {
    cookieBanner.classList.remove('hidden');
  }
  document.querySelector('.cookie-btn-accept')?.addEventListener('click', () => {
    localStorage.setItem('ojc-cookie-consent', 'accepted');
    cookieBanner.classList.add('hidden');
    // GA4 consent grant — placeholder
    if (typeof gtag !== 'undefined') gtag('consent', 'update', { analytics_storage: 'granted' });
  });
  document.querySelector('.cookie-btn-reject')?.addEventListener('click', () => {
    localStorage.setItem('ojc-cookie-consent', 'rejected');
    cookieBanner.classList.add('hidden');
  });
}

// ── Countdown timer ──────────────────────────────────────────
const countdownEl = document.getElementById('countdown-live');
const concludedEl = document.getElementById('countdown-concluded');
if (countdownEl) {
  const target = new Date('2026-04-08T10:00:00+05:30').getTime();
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      countdownEl.hidden = true;
      if (concludedEl) concludedEl.hidden = false;
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const f = n => String(n).padStart(2, '0');
    document.getElementById('cd-days').textContent = f(d);
    document.getElementById('cd-hours').textContent = f(h);
    document.getElementById('cd-minutes').textContent = f(m);
    document.getElementById('cd-seconds').textContent = f(s);
  };
  tick(); setInterval(tick, 1000);
}

// ── Form validation + submit ─────────────────────────────────
function validateField(input) {
  const group = input.closest('.form-group');
  const error = group?.querySelector('.form-error');
  let valid = true;
  if (input.required && !input.value.trim()) { valid = false; }
  if (input.type === 'tel' && input.value && !/^[6-9]\d{9}$/.test(input.value)) { valid = false; }
  if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) { valid = false; }
  if (input.type === 'checkbox' && input.required && !input.checked) { valid = false; }
  input.classList.toggle('error', !valid);
  if (error) error.classList.toggle('show', !valid);
  return valid;
}

function setupForm(formId, successId, endpoint) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form) return;

  // Honeypot
  const hp = form.querySelector('[name="website"]');

  // Real-time validation
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    // Honeypot check
    if (hp && hp.value) return;
    // Validate all
    let allValid = true;
    form.querySelectorAll('input, select, textarea').forEach(field => {
      if (!validateField(field)) allValid = false;
    });
    if (!allValid) return;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting…';
    btn.disabled = true;

    // Analytics event — placeholder
    if (typeof gtag !== 'undefined') {
      const district = form.querySelector('[name="district"]')?.value || '';
      gtag('event', formId === 'join-form' ? 'join_form_submit' : formId + '_submit', { district });
    }

    try {
      // If real endpoint exists, POST there; else simulate success
      if (endpoint && endpoint !== '[POST_ENDPOINT]') {
        const data = new FormData(form);
        await fetch(endpoint, { method: 'POST', body: data });
      } else {
        await new Promise(r => setTimeout(r, 800)); // simulate
      }
      form.classList.add('hidden');
      form.style.display = 'none';
      if (success) {
        success.classList.add('show');
        success.style.display = 'block';
      }
      // Analytics success event
      if (typeof gtag !== 'undefined') {
        gtag('event', formId === 'join-form' ? 'join_form_success' : formId + '_success', {});
      }
    } catch {
      btn.textContent = originalText;
      btn.disabled = false;
      alert('Something went wrong. Please try again or call +91 9777770323.');
    }
  });
}

// Init forms
setupForm('join-form', 'join-success', '[POST_ENDPOINT]');
setupForm('rsvp-form', 'rsvp-success', '[POST_ENDPOINT_RSVP]');
setupForm('contact-form', 'contact-success', '[POST_ENDPOINT_CONTACT]');

// ── Share buttons ────────────────────────────────────────────
document.querySelector('.copy-link-btn')?.addEventListener('click', function () {
  navigator.clipboard.writeText(window.location.origin + '/join.html').then(() => {
    this.textContent = 'Copied!';
    setTimeout(() => this.textContent = 'Copy Link', 2000);
  });
});

// ── Smooth scroll for anchor links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── ShortSlideDown Animation (Ideology 3 Lines Drop-In) ──
(function initIdeologyShortSlideDown() {
  const ideologySection = document.querySelector('.ideology-section');
  if (!ideologySection) return;

  const lines = Array.from(ideologySection.querySelectorAll('.ideology-slide-line'));
  if (!lines.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.classList.add('slide-active');
          }, i * 500); // 500ms interval per line matching ShortSlideDown timing
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  observer.observe(ideologySection);
})();
