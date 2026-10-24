const signInModal = document.createElement('div');
signInModal.className = 'signin-modal';
signInModal.setAttribute('aria-hidden', 'true');
signInModal.innerHTML = `
  <div class="signin-modal-backdrop" data-signin-close></div>
  <section class="signin-modal-card" role="dialog" aria-modal="true" aria-labelledby="signin-title">
    <button class="signin-modal-close" type="button" aria-label="Close sign in" data-signin-close>×</button>
    <div class="signin-modal-mark"><img alt="Trovesites"></div>
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

// Reuse the navigation logo's resolved URL so this works from the home page,
// nested pages, and preview environments with a non-root base path.
const navigationLogo = document.querySelector('.identity img');
const modalLogo = signInModal.querySelector('.signin-modal-mark img');
if (navigationLogo && modalLogo) modalLogo.src = navigationLogo.currentSrc || navigationLogo.src;

const closeSignIn = () => { signInModal.classList.remove('is-open'); signInModal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('signin-modal-open'); };
window.addEventListener('trove-auth-signed-in', closeSignIn);
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('.signin-trigger');
  if (!trigger) return;
  event.preventDefault();
  signInModal.classList.add('is-open');
  signInModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('signin-modal-open');
  signInModal.querySelector('input').focus();
});
signInModal.querySelectorAll('[data-signin-close]').forEach((button) => button.addEventListener('click', closeSignIn));
signInModal.querySelector('[data-signin-password]').addEventListener('click', (event) => { const input = document.querySelector('#modal-password'); input.type = input.type === 'password' ? 'text' : 'password'; event.currentTarget.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password'); });
const modalForm = signInModal.querySelector('form');
modalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputs = modalForm.querySelectorAll('input[type="email"], input[type="password"]');
  if (modalForm.dataset.mode === 'verify') {
    TroveAuth.verifySignupCode(modalForm, modalForm.dataset.verificationEmail || inputs[0].value.trim(), modalForm.querySelector('.auth-verification input').value.trim());
    return;
  }
  const action = modalForm.dataset.mode === 'signup' ? TroveAuth.signUp : TroveAuth.signIn;
  action(modalForm, inputs[0].value.trim(), inputs[1].value);
});
modalForm.querySelector('.signin-join button').addEventListener('click', () => {
  const isSignup = modalForm.dataset.mode !== 'signup';
  modalForm.dataset.mode = isSignup ? 'signup' : 'signin';
  signInModal.querySelector('.signin-modal-card h2').textContent = isSignup ? 'Create your space.' : 'Step back in!';
  signInModal.querySelector('.signin-modal-subtitle').textContent = isSignup ? 'Create an account to save your mindful exercises, calm routines, and wellness pathway.' : 'Log in to continue your mindful exercises, calm routines, and wellness pathway';
  modalForm.querySelector('.signin-submit').textContent = isSignup ? 'Create account' : 'Sign in';
  modalForm.querySelector('.signin-join button').textContent = isSignup ? 'Back to sign in' : 'Join Now';
});
modalForm.querySelector('.signin-modal-row button').addEventListener('click', () => {
  const email = modalForm.querySelector('input[type="email"]').value.trim();
  if (!email) {
    TroveAuth.setAuthMessage(TroveAuth.getAuthMessage(modalForm), 'Enter your email first.', true);
    modalForm.querySelector('input[type="email"]').focus();
    return;
  }
  TroveAuth.resetPassword(modalForm, email);
});
modalForm.querySelector('.signin-google').addEventListener('click', () => TroveAuth.signInWithGoogle(modalForm));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSignIn(); });
