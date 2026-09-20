const authClient = window.troveSupabase;
const authPanel = document.querySelector('#auth-panel');
const dashboard = document.querySelector('#dashboard');
const form = document.querySelector('#admin-login-form');
const message = document.querySelector('#form-message');
const enterButton = document.querySelector('#enter-workspace');
const googleButton = document.querySelector('#admin-google');
const sessionPrompt = document.querySelector('#session-prompt');
const isCmsRoute = window.location.pathname === '/cms/' || window.location.pathname.endsWith('/cms/index.html');
const productionCmsUrl = 'https://trovesites.vercel.app/cms/';

const getCmsRedirectUrl = () => {
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  return isLocal ? `${window.location.origin}/cms/` : productionCmsUrl;
};

const renderNotFound = () => {
  document.title = '404 — Trovesites';
  document.body.innerHTML = `
    <main class="admin-shell not-found-page">
      <section class="auth-panel not-found-panel">
        <p class="eyebrow">404</p>
        <h1>Page not found.</h1>
        <p class="intro">The page you’re looking for doesn’t exist.</p>
        <a class="back-link" href="../index.html">← Return to site</a>
      </section>
    </main>`;
};

const showMessage = (text, error = false) => {
  if (!message) return;
  message.textContent = text;
  message.hidden = !text;
  message.dataset.error = String(error);
};

const setBusy = (busy) => form?.querySelectorAll('button').forEach((button) => { button.disabled = busy; });

const clearLoginForm = () => {
  if (!form) return;
  form.reset();
  const emailInput = document.querySelector('#admin-email');
  const passwordInput = document.querySelector('#admin-password');
  if (emailInput) emailInput.value = '';
  if (passwordInput) passwordInput.value = '';
};

const showDashboard = (user) => {
  if (window.renderCmsUi) {
    if (authPanel) authPanel.hidden = true;
    window.renderCmsUi(dashboard, user);
    document.querySelector('#signout-button')?.addEventListener('click', async () => {
      await authClient.auth.signOut();
      showLogin();
    });
    return;
  }
  if (authPanel) authPanel.hidden = true;
  document.querySelector('#cms-shell')?.removeAttribute('hidden');
  document.querySelector('#cms-site-header')?.removeAttribute('hidden');
  dashboard.hidden = false;
  dashboard.className = 'cms-page-content';
  dashboard.innerHTML = `
    <aside class="cms-sidebar" aria-label="Library and CMS navigation">
      <div class="sidebar-label">Library</div>
      <nav class="cms-nav library-nav"><a class="is-active" href="#cms-overview">All projects</a><a href="#cms-projects">Templates</a><a href="#cms-categories">Components</a><a href="#cms-media">Sections</a><a href="#cms-media">Backgrounds</a><a href="#cms-media">Branding</a></nav>
      <div class="sidebar-label">Workspace</div>
      <nav class="cms-nav"><a class="is-active" href="#cms-overview">Overview</a><a href="#cms-projects">Projects</a><a href="#cms-categories">Categories</a><a href="#cms-media">Media</a></nav>
      <div class="sidebar-bottom"><div class="sidebar-user"><span class="status-dot"></span><span id="user-label"></span></div><button class="signout-button" id="signout-button" type="button">Sign out</button></div>
    </aside>
    <div class="cms-main" id="cms-overview">
      <header class="cms-topbar"><div><p class="eyebrow">Trovesites / CMS</p><p class="cms-date">Private content studio</p></div><a class="site-link" href="../index.html">View site ↗</a></header>
      <section class="cms-welcome"><div><span class="verified-pill">✓ Admin verified</span><h1>Good morning.</h1><p>Your session is authenticated. This is your quiet place to shape the Trovesites library.</p></div><div class="welcome-mark">✦</div></section>
      <div class="stats-grid" aria-label="CMS summary"><article><span>Projects</span><strong>—</strong><small>Ready to organize</small></article><article><span>Categories</span><strong>—</strong><small>Ready to organize</small></article><article><span>Published</span><strong>—</strong><small>Nothing published yet</small></article></div>
      <section class="cms-card" id="cms-projects"><div class="card-heading"><div><p class="eyebrow">Content library</p><h2>Projects</h2></div><button class="primary-button" type="button" disabled>New project</button></div><div class="empty-state"><div class="empty-icon">✦</div><h3>Your project library is ready for its first entry.</h3><p>Projects, images, categories, and publishing controls will appear here.</p></div></section>
      <section class="cms-card cms-secondary" id="cms-categories"><p class="eyebrow">Organization</p><h2>Categories</h2><p>Category management will be available here.</p></section>
      <section class="cms-card cms-secondary" id="cms-media"><p class="eyebrow">Assets</p><h2>Media</h2><p>Uploaded images and reusable assets will appear here.</p></section>
    </div>`;
  document.querySelector('#user-label').textContent = user.email || 'Signed-in user';
  const avatar = document.querySelector('#cms-avatar');
  if (avatar) {
    const identity = user.identities?.find((item) => item.provider === 'google')?.identity_data || user.identities?.[0]?.identity_data || {};
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || identity.avatar_url || identity.picture;
    if (avatarUrl) {
      const image = document.createElement('img');
      image.src = avatarUrl;
      image.alt = '';
      image.referrerPolicy = 'no-referrer';
      avatar.append(image);
    } else {
      avatar.textContent = (user.email || 'U').slice(0, 2).toUpperCase();
    }
  }
  document.querySelector('#signout-button').addEventListener('click', async () => {
    await authClient.auth.signOut();
    showLogin();
  });
};

const enterWorkspace = async (user) => {
  if (form) form.hidden = true;
  if (sessionPrompt) sessionPrompt.hidden = true;

  const { data, error } = await authClient
    .from('user_roles')
    .select('role,user_id')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (error) {
    if (isCmsRoute) {
      renderNotFound();
      return;
    }
    showMessage('Admin roles are not installed yet. Run the Supabase SQL migration first.', true);
    return;
  }
  if (!data || data.role !== 'admin' || data.user_id !== user.id) {
    if (isCmsRoute) {
      renderNotFound();
      return;
    }
    showMessage('Your account is signed in, but it has not been granted admin access.', true);
    return;
  }
  showDashboard(user);
};

const showLogin = () => {
  if (isCmsRoute) {
    clearLoginForm();
    window.setTimeout(clearLoginForm, 250);
    if (authPanel) authPanel.hidden = false;
    if (dashboard) dashboard.hidden = true;
    if (form) form.hidden = false;
    if (sessionPrompt) sessionPrompt.hidden = true;
    return;
  }
  if (!authPanel) return;
  authPanel.hidden = false;
  dashboard.hidden = true;
  form.hidden = true;
  sessionPrompt.hidden = false;
};

const handleLogin = async (event) => {
  event.preventDefault();
  event.stopPropagation();
  setBusy(true);
  showMessage('Signing in…');
  try {
    const { data, error } = await authClient.auth.signInWithPassword({
      email: document.querySelector('#admin-email').value.trim(),
      password: document.querySelector('#admin-password').value
    });
    if (error) {
      showMessage(error.message, true);
      return;
    }
    await enterWorkspace(data.user);
  } catch (error) {
    showMessage(error?.message || 'Unable to reach Supabase. Check your connection and try again.', true);
  } finally {
    setBusy(false);
  }
};

window.handleAdminLogin = handleLogin;
form?.addEventListener('submit', handleLogin);

const startAdminGoogle = async (event) => {
  event?.preventDefault();
  setBusy(true);
  showMessage('Opening Google…');
  document.querySelector('#admin-google').textContent = 'Connecting to Google…';
  const redirectTo = getCmsRedirectUrl();
  try {
    const { data, error } = await authClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    if (error) {
      showMessage(`Google sign-in failed: ${error.message}`, true);
      setBusy(false);
      return;
    }
    if (!data?.url) {
      showMessage('Supabase did not return a Google sign-in URL. Enable the Google provider and add its Client ID and Secret.', true);
      setBusy(false);
      return;
    }
    window.location.assign(data.url);
  } catch (error) {
    showMessage(`Google sign-in failed: ${error?.message || 'Unable to start OAuth.'}`, true);
    setBusy(false);
  }
};

window.startAdminGoogle = startAdminGoogle;
googleButton?.addEventListener('click', startAdminGoogle);

let sessionBooted = false;

authClient.auth.getSession().then(({ data }) => {
  sessionBooted = true;
  if (data.session?.user) enterWorkspace(data.session.user);
  else showLogin();
});

authClient.auth.onAuthStateChange((event, session) => {
  if (session?.user) enterWorkspace(session.user);
  else if (sessionBooted && event === 'SIGNED_OUT') showLogin();
});
