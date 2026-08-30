/* ==========================================================================
   OJCP OUR VISION PAGE - INTERSECTION OBSERVER & SMOOTH SCROLL NAVIGATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('[data-pledge-id]');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');
  const counterCurrent = document.getElementById('current-pledge-num');
  const mobileBarCounter = document.getElementById('mobile-pledge-num');
  const mobileBarTitle = document.getElementById('mobile-pledge-title');

  if (!sections.length) return;

  // Fixed Header Offset for smooth scrolling
  const HEADER_OFFSET = 85;
  let isClickScrolling = false;
  let clickTimeout = null;

  // Helper to activate pledge number in sidebar and mobile bar
  function setActivePledge(pledgeId) {
    const pledgeNum = String(pledgeId).padStart(2, '0');

    sidebarLinks.forEach(link => {
      if (link.getAttribute('data-pledge-ref') === String(pledgeId)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const targetSection = document.querySelector(`[data-pledge-id="${pledgeId}"]`);
    const pledgeTitle = targetSection ? targetSection.getAttribute('data-pledge-title') || '' : '';

    if (counterCurrent) counterCurrent.textContent = pledgeNum;
    if (mobileBarCounter) mobileBarCounter.textContent = pledgeNum;
    if (mobileBarTitle) mobileBarTitle.textContent = pledgeTitle;
  }

  // Smooth Scroll on Click with Header Offset
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pledgeId = link.getAttribute('data-pledge-ref');
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Lock observer while smooth scrolling so intermediate sections don't override active pledge
        isClickScrolling = true;
        if (clickTimeout) clearTimeout(clickTimeout);

        // Instantly highlight clicked button and update sidebar/mobile ribbon
        setActivePledge(pledgeId);

        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Re-enable IntersectionObserver after smooth scroll finishes
        clickTimeout = setTimeout(() => {
          isClickScrolling = false;
        }, 850);
      }
    });
  });

  // ScrollSpy with IntersectionObserver for manual scrolling
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -50% 0px',
    threshold: [0, 0.15, 0.4]
  };

  const observer = new IntersectionObserver((entries) => {
    if (isClickScrolling) return; // Skip observer updates during click scroll animation

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pledgeId = entry.target.getAttribute('data-pledge-id');
        setActivePledge(pledgeId);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Pop-Up Scroll Reveal Observer for Vision Sections & Cards
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vision-pop-up-active');
      }
    });
  }, revealOptions);

  // Observe all feature sections, manifesto cards, and climax cards
  const popUpTargets = document.querySelectorAll('.feature-section, .alternating-row, .index-card, .climax-card');
  popUpTargets.forEach(target => revealObserver.observe(target));
});
