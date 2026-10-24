/* ==========================================================================
   Site behaviour shared by every page: mobile navigation and the voice demo.
   Everything here is an enhancement — all content and links work without it.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close after choosing a link (matters for same-page anchors like #contact)
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    // Reset when resizing up to the desktop layout
    window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- Voice demo log (simulation) ---------- */
  // All lines are in the HTML, so the full log is readable without JavaScript
  // or with reduced motion. Otherwise lines are revealed one by one, then replayed.
  const log = document.getElementById('demo-log');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (log && !reduceMotion) {
    const lines = Array.from(log.children);
    let index = 0;

    const step = () => {
      if (index === 0) lines.forEach((li) => li.classList.add('is-pending'));
      const line = lines[index];
      line.classList.remove('is-pending');
      line.classList.add('is-new');
      index = (index + 1) % lines.length;
      // Hold the finished session on screen before replaying it
      setTimeout(step, index === 0 ? 5000 : 1300);
    };

    // Only run while the demo is on screen, to avoid needless work
    let started = false;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        step();
      }
    });
    observer.observe(log);
  }
})();
