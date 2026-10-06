/**
 * The 7-Word Sprint | Kural 619
 * Commit 3: IntersectionObserver Scroll Engine & Slide 1-7 Word Animation Triggers
 */

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('scrollContainer');
  const progressBar = document.getElementById('progressBar');
  const slides = document.querySelectorAll('.slide-section');
  const replayBtn = document.getElementById('replayBtn');

  if (!scrollContainer || !slides.length) return;

  // ---------------------------------------------------------------------------
  // 1. Dynamic Scroll Progress Bar
  // ---------------------------------------------------------------------------
  const updateScrollProgress = () => {
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

  scrollContainer.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ---------------------------------------------------------------------------
  // 2. IntersectionObserver for Slide 1-7 Word Reveals
  // ---------------------------------------------------------------------------
  const observerOptions = {
    root: scrollContainer,
    threshold: 0.55 // Triggers when slide is more than half in view
  };

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // Reset when scrolling away to enable continuous replayability
        entry.target.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  slides.forEach((slide) => {
    slideObserver.observe(slide);
  });

  // ---------------------------------------------------------------------------
  // 3. Replay Experience (Smooth Scroll to Slide 1)
  // ---------------------------------------------------------------------------
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      const firstSlide = document.getElementById('slide-1');
      if (firstSlide) {
        firstSlide.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Keyboard Navigation (Arrows / Space / PageUpDown)
  // ---------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
      const currentScroll = scrollContainer.scrollTop;
      const slideHeight = window.innerHeight;
      const nextIndex = Math.floor((currentScroll + 10) / slideHeight) + 1;
      const targetSlide = slides[nextIndex];
      if (targetSlide) {
        e.preventDefault();
        targetSlide.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
      const currentScroll = scrollContainer.scrollTop;
      const slideHeight = window.innerHeight;
      const prevIndex = Math.ceil((currentScroll - 10) / slideHeight) - 1;
      const targetSlide = slides[prevIndex];
      if (targetSlide) {
        e.preventDefault();
        targetSlide.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
