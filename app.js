/**
 * The 7-Word Sprint | Kural 619
 * Crossfading Background Video Engine (Slides 1-7) & Grand Finale (Slides 8-9)
 */

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('scrollContainer');
  const progressBar = document.getElementById('progressBar');
  const slides = document.querySelectorAll('.slide-section');
  const replayBtn = document.getElementById('replayBtn');
  const snapVideo = document.getElementById('ironManVideo');
  const slide9 = document.getElementById('slide-9');
  const assemblyCard = document.getElementById('assemblyCard');
  const whiteFlash = document.getElementById('whiteFlashOverlay');

  // Video Time Segments for High-Quality Looping (Start, End in seconds)
  const videoConfig = {
    1: { el: document.getElementById('vid-1'), start: 0, end: 9.3 },
    2: { el: document.getElementById('vid-2'), start: 47.0, end: 54.0 },
    3: { el: document.getElementById('vid-3'), start: 53.0, end: 62.0 },
    4: { el: document.getElementById('vid-4'), start: 33.0, end: 38.0 },
    5: { el: document.getElementById('vid-5'), start: 29.0, end: 33.0 },
    6: { el: document.getElementById('vid-6'), start: 140.0, end: 151.0 },
    7: { el: document.getElementById('vid-7'), start: 44.0, end: 55.0 }
  };

  const allBgVideos = Object.values(videoConfig).map(cfg => cfg.el).filter(Boolean);

  // Setup high-precision seamless looping for active background video
  let activeVideoConfig = videoConfig[1] || null;

  const loopWatcher = () => {
    if (activeVideoConfig && activeVideoConfig.el) {
      const vid = activeVideoConfig.el;
      if (vid.currentTime >= activeVideoConfig.end || vid.currentTime < activeVideoConfig.start) {
        vid.currentTime = activeVideoConfig.start;
        const p = vid.play();
        if (p !== undefined) p.catch(() => {});
      }
    }
    requestAnimationFrame(loopWatcher);
  };
  requestAnimationFrame(loopWatcher);

  // Set up event listeners for robust looping boundaries on each background video
  Object.values(videoConfig).forEach((cfg) => {
    if (!cfg.el) return;

    // Restart when video fires ended event
    cfg.el.addEventListener('ended', () => {
      cfg.el.currentTime = cfg.start;
      if (cfg.el.classList.contains('active-bg')) {
        const p = cfg.el.play();
        if (p !== undefined) p.catch(() => {});
      }
    });

    // Auto-resume if browser pauses active video near end boundary
    cfg.el.addEventListener('pause', () => {
      if (cfg.el.classList.contains('active-bg')) {
        if (cfg.el.currentTime >= cfg.end - 0.2 || cfg.el.currentTime < cfg.start) {
          cfg.el.currentTime = cfg.start;
        }
        const p = cfg.el.play();
        if (p !== undefined) p.catch(() => {});
      }
    });

    // Timeupdate fallback check
    cfg.el.addEventListener('timeupdate', () => {
      if (cfg.el.currentTime >= cfg.end || cfg.el.currentTime < cfg.start) {
        cfg.el.currentTime = cfg.start;
        if (cfg.el.classList.contains('active-bg')) {
          const p = cfg.el.play();
          if (p !== undefined) p.catch(() => {});
        }
      }
    });
  });

  if (!scrollContainer || !slides.length) return;

  // ---------------------------------------------------------------------------
  // 1. Scroll Progress Bar Calculation
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
  // 2. Background Video Crossfade Controller (Slides 1 to 7)
  // ---------------------------------------------------------------------------
  const switchBackgroundVideo = (slideIndex) => {
    const activeCfg = videoConfig[slideIndex];
    activeVideoConfig = activeCfg || null;

    allBgVideos.forEach((vid) => {
      if (activeCfg && vid === activeCfg.el) {
        vid.classList.add('active-bg');
        if (vid.currentTime < activeCfg.start || vid.currentTime >= activeCfg.end) {
          vid.currentTime = activeCfg.start;
        }
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay gracefully handled
          });
        }
      } else {
        vid.classList.remove('active-bg');
        vid.pause();
      }
    });
  };

  const stopAllBackgroundVideos = () => {
    activeVideoConfig = null;
    allBgVideos.forEach((vid) => {
      vid.classList.remove('active-bg');
      vid.pause();
    });
  };

  // Start with Slide 1 active
  switchBackgroundVideo(1);

  // ---------------------------------------------------------------------------
  // 3. Cinematic Slow White-Flash Transition & Assembly
  // ---------------------------------------------------------------------------
  let fallbackTimer = null;
  let hasSnapped = false;

  const triggerCinematicSnapTransition = () => {
    if (hasSnapped) return;
    hasSnapped = true;

    // Smoothly fade in the white glow overlay
    if (whiteFlash) {
      whiteFlash.classList.add('active');
    }

    // Instant jump to Slide 9 while screen is fully white
    setTimeout(() => {
      if (slide9) {
        slide9.scrollIntoView({ behavior: 'auto' });
      }

      if (assemblyCard) {
        assemblyCard.classList.add('assembled');
      }

      // Gracefully fade out the white glow
      setTimeout(() => {
        if (whiteFlash) {
          whiteFlash.classList.remove('active');
        }
      }, 250);
    }, 600);
  };

  // ---------------------------------------------------------------------------
  // 4. Track Slide 8 Snap Video Playback (Trigger Snap at 0:01)
  // ---------------------------------------------------------------------------
  if (snapVideo) {
    snapVideo.addEventListener('timeupdate', () => {
      if (snapVideo.currentTime >= 1.0 && !hasSnapped) {
        triggerCinematicSnapTransition();
      }
    });

    snapVideo.addEventListener('ended', () => {
      if (!hasSnapped) {
        triggerCinematicSnapTransition();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. IntersectionObserver for Slide Visibility & Background Crossfade
  // ---------------------------------------------------------------------------
  const observerOptions = {
    root: scrollContainer,
    threshold: 0.5
  };

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target;
      const isSlide8 = target.id === 'slide-8';
      const isSlide9 = target.id === 'slide-9';
      const slideIndex = parseInt(target.getAttribute('data-slide-index'), 10);

      if (entry.isIntersecting) {
        target.classList.add('is-visible');

        // Slides 1-7: Switch background video crossfade
        if (slideIndex >= 1 && slideIndex <= 7) {
          switchBackgroundVideo(slideIndex);
        }

        // Slide 8: Stop background videos and play Snap Video
        if (isSlide8) {
          stopAllBackgroundVideos();
          if (snapVideo) {
            hasSnapped = false;
            snapVideo.currentTime = 0;
            const playPromise = snapVideo.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                clearTimeout(fallbackTimer);
                fallbackTimer = setTimeout(triggerCinematicSnapTransition, 1500);
              });
            }
          }
        }

        // Slide 9: Stop background videos and show assembly
        if (isSlide9) {
          stopAllBackgroundVideos();
          if (assemblyCard) {
            assemblyCard.classList.add('assembled');
          }
        }
      } else {
        target.classList.remove('is-visible');

        if (isSlide8 && snapVideo) {
          snapVideo.pause();
          snapVideo.currentTime = 0;
          clearTimeout(fallbackTimer);
        }

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
  // 6. Replay Experience (Smooth Scroll back to Slide 1)
  // ---------------------------------------------------------------------------
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      hasSnapped = false;
      const firstSlide = document.getElementById('slide-1');
      if (firstSlide) {
        switchBackgroundVideo(1);
        firstSlide.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 7. Keyboard Navigation Controls
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
