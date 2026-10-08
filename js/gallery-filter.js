/**
 * Esparza's Carpet Cleaning - Gallery Filter System
 * Smooth filtering of Before/After cards by category
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
});

function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-card');

  if (!filterButtons.length || !galleryItems.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      galleryItems.forEach(item => {
        const itemCategory = item.dataset.category;

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
