const signInModal = document.createElement('div');
signInModal.className = 'signin-modal';
signInModal.setAttribute('aria-hidden', 'true');
signInModal.innerHTML = `
  <div class="signin-modal-backdrop" data-signin-close></div>
  <section class="signin-modal-card" role="dialog" aria-modal="true" aria-labelledby="signin-title">
    <button class="signin-modal-close" type="button" aria-label="Close sign in" data-signin-close>×</button>
    <div class="signin-modal-mark">✦</div>
    <h2 id="signin-title">Step back in!</h2>
    <p class="signin-modal-subtitle">Log in to continue your mindful exercises, calm routines, and wellness pathway</p>
    <form class="signin-modal-form">
      <label>Email<input type="email" placeholder="Your email address" autocomplete="email" required></label>
      <label>Password<div class="signin-modal-password"><input id="modal-password" type="password" placeholder="Type your password" autocomplete="current-password" required><button type="button" data-signin-password aria-label="Show password">◉</button></div></label>
      <div class="signin-modal-row"><label class="signin-check"><input type="checkbox"><span>✓</span>Stay signed in</label><button type="button">Reset password?</button></div>
      <button class="signin-submit" type="submit">Sign in</button>
      <div class="signin-divider"><i></i>Or<i></i></div>
      <button class="signin-google" type="button"><strong>G</strong>Continue with Google</button>
      <p class="signin-join">New to this platform? <button type="button">Join Now</button></p>
    </form>
  </section>`;
document.body.append(signInModal);

const closeSignIn = () => { signInModal.classList.remove('is-open'); signInModal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('signin-modal-open'); };
document.querySelectorAll('.signin-trigger').forEach((trigger) => trigger.addEventListener('click', (event) => { event.preventDefault(); signInModal.classList.add('is-open'); signInModal.setAttribute('aria-hidden', 'false'); document.body.classList.add('signin-modal-open'); signInModal.querySelector('input').focus(); }));
signInModal.querySelectorAll('[data-signin-close]').forEach((button) => button.addEventListener('click', closeSignIn));
signInModal.querySelector('[data-signin-password]').addEventListener('click', (event) => { const input = document.querySelector('#modal-password'); input.type = input.type === 'password' ? 'text' : 'password'; event.currentTarget.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password'); });
signInModal.querySelector('form').addEventListener('submit', (event) => event.preventDefault());
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSignIn(); });
