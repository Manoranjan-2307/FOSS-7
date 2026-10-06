/**
 * The 7-Word Sprint | Kural 619
 * Grand Finale Engine: Slide 8 Video, White-Flash Seamless Jump & Slide 9 Assembly
 */

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('scrollContainer');
  const progressBar = document.getElementById('progressBar');
  const slides = document.querySelectorAll('.slide-section');
  const replayBtn = document.getElementById('replayBtn');
  const video = document.getElementById('ironManVideo');
  const slide9 = document.getElementById('slide-9');
  const assemblyCard = document.getElementById('assemblyCard');
  const whiteFlash = document.getElementById('whiteFlashOverlay');

  if (!scrollContainer || !slides.length) return;

  // ---------------------------------------------------------------------------
  // 1. Scroll Progress Bar
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
  // 2. Seamless White-Flash Jump & Assembly Execution
  // ---------------------------------------------------------------------------
  let fallbackTimer = null;
  let hasSnapped = false;

  const triggerSeamlessSnapTransition = () => {
    if (hasSnapped) return;
    hasSnapped = true;

    // Step 1: Trigger full white screen flash
    if (whiteFlash) {
      whiteFlash.classList.add('active');
    }

    // Step 2: Instant jump to Slide 9 while screen is fully white
    setTimeout(() => {
      if (slide9) {
        slide9.scrollIntoView({ behavior: 'auto' }); // Instant unnoticed jump
      }

      // Step 3: Trigger Slide 9 magnetic reverse-snap assembly
      if (assemblyCard) {
        assemblyCard.classList.add('assembled');
      }

      // Step 4: Fade white flash back to transparent
      setTimeout(() => {
        if (whiteFlash) {
          whiteFlash.classList.remove('active');
        }
      }, 80);
    }, 120);
  };

  if (video) {
    // Listen for video completion / snap event
    video.addEventListener('ended', () => {
      triggerSeamlessSnapTransition();
    });
  }

  // ---------------------------------------------------------------------------
  // 3. IntersectionObserver for Slide Visibility & Playback
  // ---------------------------------------------------------------------------
  const observerOptions = {
    root: scrollContainer,
    threshold: 0.55
  };

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target;
      const isSlide8 = target.id === 'slide-8';
      const isSlide9 = target.id === 'slide-9';

      if (entry.isIntersecting) {
        target.classList.add('is-visible');

        // Play video ONLY when Slide 8 enters view
        if (isSlide8 && video) {
          hasSnapped = false;
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Fallback transition if autoplay is deferred or file is loading
              clearTimeout(fallbackTimer);
              fallbackTimer = setTimeout(triggerSeamlessSnapTransition, 3500);
            });
          }
        }

        // Direct scroll to Slide 9 manual fallback trigger
        if (isSlide9 && assemblyCard) {
          assemblyCard.classList.add('assembled');
        }
      } else {
        target.classList.remove('is-visible');

        // Reset video when exiting Slide 8
        if (isSlide8 && video) {
          video.pause();
          video.currentTime = 0;
          clearTimeout(fallbackTimer);
        }

        // Reset Slide 9 assembly on exit for replayability
        if (isSlide9 && assemblyCard) {
          assemblyCard.classList.remove('assembled');
        }
      }
    });
  }, observerOptions);

  slides.forEach((slide) => {
    slideObserver.observe(slide);
  });

  // ---------------------------------------------------------------------------
  // 4. Replay Experience (Smooth Scroll back to Slide 1)
  // ---------------------------------------------------------------------------
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      hasSnapped = false;
      const firstSlide = document.getElementById('slide-1');
      if (firstSlide) {
        firstSlide.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Keyboard Navigation
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
