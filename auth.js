const authClient = window.troveSupabase;
const productionSiteOrigin = 'https://trovesites.vercel.app';

const getSiteOrigin = () => {
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  return isLocal ? window.location.origin : productionSiteOrigin;
};

const setAuthMessage = (element, message, isError = false) => {
  if (!element) return;
  element.textContent = message;
  element.hidden = !message;
  element.dataset.error = String(isError);
};

const getAuthMessage = (form) => {
  let message = form.querySelector('.auth-message');
  if (!message) {
    message = document.createElement('p');
    message.className = 'auth-message';
    message.setAttribute('role', 'status');
    form.append(message);
  }
  return message;
};

const setFormBusy = (form, busy) => {
  form.querySelectorAll('button').forEach((button) => {
    button.disabled = busy;
  });
};

const signIn = async (form, email, password) => {
  const message = getAuthMessage(form);
  setFormBusy(form, true);
  setAuthMessage(message, 'Signing in…');

  const { error } = await authClient.auth.signInWithPassword({ email, password });
  setFormBusy(form, false);

  if (error) {
    setAuthMessage(message, error.message, true);
    return false;
  }

  setAuthMessage(message, 'Signed in successfully.');
  window.dispatchEvent(new CustomEvent('trove-auth-signed-in'));
  return true;
};

const signUp = async (form, email, password) => {
  const message = getAuthMessage(form);
  setFormBusy(form, true);
  setAuthMessage(message, 'Creating your account…');

  const { data, error } = await authClient.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` }
  });
  setFormBusy(form, false);

  if (error) {
    setAuthMessage(message, error.message, true);
    return false;
  }

  if (data.session) {
    setAuthMessage(message, 'Your account is ready.');
  } else {
    beginVerification(form, email);
    setAuthMessage(message, 'Check your email for your confirmation link or code.');
  }
  return true;
};

const beginVerification = (form, email) => {
  form.dataset.mode = 'verify';
  form.dataset.verificationEmail = email;
  form.querySelector('input[type="password"]')?.closest('.field, label')?.setAttribute('hidden', '');
  form.querySelector('.primary-button, .signin-submit').textContent = 'Confirm email';
  form.querySelector('.signin-join, .join-copy')?.setAttribute('hidden', '');

  if (!form.querySelector('.auth-verification')) {
    const block = document.createElement('div');
    block.className = 'auth-verification';
    block.innerHTML = '<label>Confirmation code<input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="Enter the code from your email" required></label><button type="button" class="auth-resend">Resend code</button>';
    const submit = form.querySelector('.primary-button, .signin-submit');
    submit.parentElement.insertBefore(block, submit);
    block.querySelector('.auth-resend').addEventListener('click', () => resendConfirmation(form, email));
  }
};

const verifySignupCode = async (form, email, token) => {
  const message = getAuthMessage(form);
  setFormBusy(form, true);
  const { error } = await authClient.auth.verifyOtp({ email, token, type: 'email' });
  setFormBusy(form, false);
  setAuthMessage(message, error ? error.message : 'Email confirmed. Your account is ready.', Boolean(error));
  if (!error) window.dispatchEvent(new CustomEvent('trove-auth-signed-in'));
  return !error;
};

const resendConfirmation = async (form, email) => {
  const message = getAuthMessage(form);
  setFormBusy(form, true);
  const { error } = await authClient.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` }
  });
  setFormBusy(form, false);
  setAuthMessage(message, error ? error.message : 'A new confirmation email is on its way.', Boolean(error));
};

const resetPassword = async (form, email) => {
  const message = getAuthMessage(form);
  setFormBusy(form, true);
  const { error } = await authClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteOrigin()}/signin/`
  });
  setFormBusy(form, false);
  setAuthMessage(message, error ? error.message : 'Check your email for a password reset link.', Boolean(error));
};

const signInWithGoogle = async (form) => {
  const message = getAuthMessage(form);
  setFormBusy(form, true);
  const redirectUrl = new URL(`${getSiteOrigin()}${window.location.pathname}`);
  redirectUrl.hash = '';
  redirectUrl.search = '';
  const { error } = await authClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl.toString() }
  });
  if (error) {
    setFormBusy(form, false);
    setAuthMessage(message, error.message, true);
  }
};

window.TroveAuth = { getAuthMessage, setAuthMessage, signIn, signUp, beginVerification, verifySignupCode, resendConfirmation, resetPassword, signInWithGoogle };
