(function () {
  const client = window.troveSupabase;
  if (!client) return;

  document.querySelectorAll('.plan-action').forEach((link) => {
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      const plan = new URL(link.href, window.location.href).searchParams.get('plan');
      const { data } = await client.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        document.querySelector('.signin-trigger')?.click();
        return;
      }

      link.setAttribute('aria-busy', 'true');
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ plan }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.checkout_url) throw new Error(payload.error || 'Unable to start checkout');
        window.location.href = payload.checkout_url;
      } catch (error) {
        link.removeAttribute('aria-busy');
        window.alert(error.message);
      }
    });
  });
}());
