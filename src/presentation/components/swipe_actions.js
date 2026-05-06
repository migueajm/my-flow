export function bindSwipeActions({
  selector = '[data-swipe-id]',
  contentSelector = '.swipe-content',
  threshold = 76,
  maxSwipe = 108,
  onEdit,
  onDelete
}) {
  document.querySelectorAll(selector).forEach(item => {
    const content = item.querySelector(contentSelector);
    if (!content) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let dragging = false;
    let horizontal = false;

    content.addEventListener('pointerdown', event => {
      startX = event.clientX;
      startY = event.clientY;
      currentX = startX;
      dragging = true;
      horizontal = false;
      content.style.transition = 'none';
      content.setPointerCapture?.(event.pointerId);
    });

    content.addEventListener('pointermove', event => {
      if (!dragging) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      if (!horizontal && Math.abs(deltaY) > Math.abs(deltaX)) return;
      horizontal = true;
      currentX = event.clientX;
      const distance = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
      content.style.transform = `translateX(${distance}px)`;
    });

    const reset = () => {
      content.style.transition = 'transform 180ms ease';
      content.style.transform = 'translateX(0)';
    };

    content.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      content.style.transition = 'transform 180ms ease';
      const deltaX = currentX - startX;

      if (deltaX >= threshold) {
        content.style.transform = `translateX(${maxSwipe}px)`;
        window.setTimeout(() => {
          reset();
          onEdit?.(item.dataset.swipeId);
        }, 140);
        return;
      }

      if (deltaX <= -threshold) {
        content.style.transform = `translateX(-${maxSwipe}px)`;
        window.setTimeout(() => {
          reset();
          onDelete?.(item.dataset.swipeId);
        }, 140);
        return;
      }

      reset();
    });

    content.addEventListener('pointercancel', () => {
      dragging = false;
      reset();
    });
  });
}
