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
});
