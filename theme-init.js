(() => {
  try {
    const theme = localStorage.getItem('trovesites-theme');
    if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
  } catch {}
})();
