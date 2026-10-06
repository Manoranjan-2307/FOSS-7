/**
 * The 7-Word Sprint | Kural 619
 * Commit 3: The Brains - IntersectionObserver Engine & Section 5 Snap Trigger
 */

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('scrollContainer');
  const progressBar = document.getElementById('progressBar');
  const sections = document.querySelectorAll('.screen-section');
  const replayBtn = document.getElementById('replayBtn');
  const assemblyStage = document.getElementById('assemblyStage');

  if (!scrollContainer || !sections.length) return;

  // ---------------------------------------------------------------------------
  // 1. Scroll Progress Bar Calculation
  // ---------------------------------------------------------------------------
  const updateProgressBar = () => {
    const scrollTop = scrollContainer.scrollTop;
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    if (maxScroll > 0) {
      const percentage = (scrollTop / maxScroll) * 100;
      if (progressBar) {
        progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        progressBar.setAttribute('aria-valuenow', Math.round(percentage));
      }
    }
  };

  scrollContainer.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar();

  // ---------------------------------------------------------------------------
  // 2. IntersectionObserver Engine (Narrative Reveals & Section 5 Snap)
  // ---------------------------------------------------------------------------
  const observerOptions = {
    root: scrollContainer,
    threshold: 0.5 // Triggers when half of the full-page section is in view
  };

  const narrativeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target;
      const isSection5 = target.id === 'section-5';

      if (entry.isIntersecting) {
        // Activate standard narrative section reveal
        target.classList.add('is-visible');

        // Special Trigger for Section 5: Iron Man Magnetic Assembly
        if (isSection5 && assemblyStage) {
          assemblyStage.classList.add('is-assembled');
        }
      } else {
        // Remove animation classes when scrolling away to enable replayability
        target.classList.remove('is-visible');
        if (isSection5 && assemblyStage) {
          assemblyStage.classList.remove('is-assembled');
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    narrativeObserver.observe(section);
  });

  // ---------------------------------------------------------------------------
  // 3. Replay Experience Handler
  // ---------------------------------------------------------------------------
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      const hookSection = document.getElementById('section-1');
      if (hookSection) {
        hookSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Keyboard Navigation
  // ---------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
      const currentScroll = scrollContainer.scrollTop;
      const sectionHeight = window.innerHeight;
      const nextIndex = Math.floor((currentScroll + 10) / sectionHeight) + 1;
      const targetSection = sections[nextIndex];
      if (targetSection) {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
      const currentScroll = scrollContainer.scrollTop;
      const sectionHeight = window.innerHeight;
      const prevIndex = Math.ceil((currentScroll - 10) / sectionHeight) - 1;
      const targetSection = sections[prevIndex];
      if (targetSection) {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
