/**
 * Esparza's Carpet Cleaning - Before & After Interactive Slider Engine
 * Full support for Mouse, Touch, Pointer events, and keyboard accessibility
 * Includes organic auto-demo animation and interactive hint dismissal
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSliders();
});

function initBeforeAfterSliders() {
  const containers = document.querySelectorAll('.before-after-container');

  containers.forEach((container, index) => {
    const afterImage = container.querySelector('.ba-image-after');
    const handle = container.querySelector('.ba-handle');
    const rangeInput = container.querySelector('.ba-range-input');
    const dragHint = container.querySelector('.ba-drag-hint');

    if (!afterImage || !handle) return;

    let isDragging = false;
    let userInteracted = false;

    function setPosition(percent) {
      // Clamp between 0% and 100%
      const clamped = Math.max(0, Math.min(100, percent));
      
      // Update clip-path of afterImage (revealing after image on the right)
      afterImage.style.clipPath = `polygon(${clamped}% 0, 100% 0, 100% 100%, ${clamped}% 100%)`;
      
      // Update handle position
      handle.style.left = `${clamped}%`;

      // Update range input if exists
      if (rangeInput) {
        rangeInput.value = clamped;
      }
    }

    function dismissHint() {
      userInteracted = true;
      if (dragHint && !dragHint.classList.contains('is-hidden')) {
        dragHint.classList.add('is-hidden');
      }
    }

    function handleMove(clientX) {
      const rect = container.getBoundingClientRect();
      const position = clientX - rect.left;
      const percent = (position / rect.width) * 100;
      setPosition(percent);
    }

    // Pointer events (works seamlessly for mouse and touch)
    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      dismissHint();
      container.setPointerCapture(e.pointerId);
      handleMove(e.clientX);
    });

    container.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    });

    const endDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        try {
          container.releasePointerCapture(e.pointerId);
        } catch (err) {
          // ignore if already released
        }
      }
    };

    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointercancel', endDrag);

    // Range input fallback (if user uses keyboard tab + arrow keys)
    if (rangeInput) {
      rangeInput.addEventListener('input', (e) => {
        dismissHint();
        setPosition(parseFloat(e.target.value));
      });
    }

    // Initial default position: 50%
    setPosition(50);

    // Run graceful auto-demo on Hero slider (index 0) if user hasn't interacted
    if (index === 0 && container.id === 'hero-slider') {
      setTimeout(() => {
        if (userInteracted) return;

        const startTime = performance.now();
        const duration = 2200;

        function animateDemo(now) {
          if (userInteracted) return;
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          
          // Smooth sine oscillation: 50% -> 36% -> 64% -> 50%
          const offset = Math.sin(progress * Math.PI * 2) * 14;
          setPosition(50 - offset);

          if (progress < 1) {
            requestAnimationFrame(animateDemo);
          } else {
            setPosition(50);
          }
        }

        requestAnimationFrame(animateDemo);
      }, 900);
    }
  });
}
