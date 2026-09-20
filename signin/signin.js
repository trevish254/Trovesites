const password = document.querySelector('#password');
const togglePassword = document.querySelector('#toggle-password');
const form = document.querySelector('#signin-form');

togglePassword.addEventListener('click', () => {
  const isHidden = password.type === 'password';
  password.type = isHidden ? 'text' : 'password';
  togglePassword.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const submit = form.querySelector('.primary-button');
  const email = document.querySelector('#email').value.trim();
  if (form.dataset.mode === 'verify') {
    TroveAuth.verifySignupCode(form, form.dataset.verificationEmail || email, form.querySelector('.auth-verification input').value.trim());
    return;
  }
  const action = form.dataset.mode === 'signup' ? TroveAuth.signUp : TroveAuth.signIn;
  action(form, email, password.value);
});

document.querySelector('.join-button').addEventListener('click', () => {
  const isSignup = form.dataset.mode !== 'signup';
  form.dataset.mode = isSignup ? 'signup' : 'signin';
  document.querySelector('.primary-button').textContent = isSignup ? 'Create account' : 'Sign in';
  document.querySelector('.join-button').textContent = isSignup ? 'Back to sign in' : 'Join Now';
  document.querySelector('h1').textContent = isSignup ? 'Create your space.' : 'Step back in!';
  document.querySelector('.subtitle').firstChild.textContent = isSignup ? 'Create an account to save your mindful exercises, calm routines, and wellness ' : 'Log in to continue your mindful exercises, calm routines, and wellness ';
});

document.querySelector('.text-button').addEventListener('click', () => {
  const email = document.querySelector('#email').value.trim();
  if (!email) {
    TroveAuth.setAuthMessage(TroveAuth.getAuthMessage(form), 'Enter your email first.', true);
    document.querySelector('#email').focus();
    return;
  }
  TroveAuth.resetPassword(form, email);
});

document.querySelector('.google-button').addEventListener('click', () => TroveAuth.signInWithGoogle(form));
