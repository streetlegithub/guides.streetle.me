// app.js: guides site bootstrapping

document.addEventListener('DOMContentLoaded', () => {
  initCardAnimations();
  initFilters();
});

/* ── Staggered card reveal on scroll ── */

function initCardAnimations() {
  const cards = document.querySelectorAll('.guide-card');
  if (!cards.length) return;

  // Check for reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    cards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const delay = parseFloat(card.dataset.delay || 0);
          card.style.animationDelay = `${delay}s`;
          card.classList.add('visible');
          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  cards.forEach((card, i) => {
    card.dataset.delay = (i * 0.06).toFixed(2);
    observer.observe(card);
  });
}

/* ── Filter buttons ── */

function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.guide-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Toggle active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      let visibleIndex = 0;
      cards.forEach(card => {
        const tags = (card.dataset.tags || '').split(',').map(t => t.trim());
        const show = filter === 'all' || tags.includes(filter);

        if (show) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          card.style.animationDelay = `${visibleIndex * 0.05}s`;
          // Force re-trigger animation
          card.classList.remove('visible');
          void card.offsetWidth; // reflow
          card.classList.add('visible');
          visibleIndex++;
        } else {
          card.style.display = 'none';
          card.classList.remove('visible');
        }
      });

      // Show empty state if nothing matches
      const empty = document.querySelector('.empty-state');
      if (empty) {
        empty.style.display = visibleIndex === 0 ? '' : 'none';
      }
    });
  });
}
