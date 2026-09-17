(() => {
  document.documentElement.classList.add('motion-ready');

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || link.target === '_blank' || event.defaultPrevented) return;
    if (link.origin !== window.location.origin || link.hash && link.pathname === window.location.pathname) return;
    if (!link.pathname.endsWith('.html') && !link.pathname.endsWith('/')) return;
    event.preventDefault();
    document.documentElement.classList.add('is-leaving');
    window.setTimeout(() => { window.location.href = link.href; }, 260);
  });
})();
