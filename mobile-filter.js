(() => {
  const trigger = document.querySelector('.mobile-filter-trigger');
  const panel = document.querySelector('.filter-panel');
  if (!trigger || !panel) return;

  const closePanel = () => {
    panel.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('filter-menu-open');
  };

  const setOpen = (open) => {
    panel.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('filter-menu-open', open);
  };

  trigger.setAttribute('aria-controls', panel.id || 'filter-panel');
  trigger.addEventListener('click', () => setOpen(!panel.classList.contains('is-open')));
  panel.addEventListener('click', (event) => {
    if (event.target.closest('a, button[data-filter]')) closePanel();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePanel();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 809) closePanel();
  });
})();
