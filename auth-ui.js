const profileTrigger = document.querySelector('.header-actions .signin-trigger');
const themeToggleHost = document.querySelector('.header-actions');
const savedTheme = localStorage.getItem('trovesites-theme');
if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;
if (themeToggleHost && !themeToggleHost.querySelector('.theme-toggle')) {
  const themeToggle = document.createElement('button');
  themeToggle.type = 'button';
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('trovesites-theme', nextTheme);
    themeToggle.setAttribute('aria-label', nextTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
  });
  themeToggleHost.insertBefore(themeToggle, profileTrigger || themeToggleHost.firstChild);
}

const getInitials = (user) => {
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User';
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
};

const removeAdminWorkspace = () => document.querySelector('#admin-workspace')?.remove();

const renderAdminWorkspace = (user) => {
  return;
  const workspace = document.createElement('section');
  workspace.id = 'admin-workspace';
  workspace.className = 'admin-workspace';
  workspace.setAttribute('aria-labelledby', 'admin-workspace-title');
  workspace.innerHTML = `
    <div class="admin-workspace-head">
      <div>
        <p class="eyebrow">Private workspace</p>
        <h2 id="admin-workspace-title">Your CMS is ready.</h2>
        <p class="admin-workspace-copy">Your Trovesites session and admin access are verified. Continue here to manage your library and publishing workflow.</p>
      </div>
      <span class="admin-status"><span aria-hidden="true">&#10003;</span> Admin verified</span>
    </div>
    <div class="admin-workspace-grid" id="cms">
      <article><span>Projects</span><strong>—</strong><small>CMS coming next</small></article>
      <article><span>Categories</span><strong>—</strong><small>Ready to organize</small></article>
      <article><span>Published</span><strong>—</strong><small>Nothing published yet</small></article>
    </div>
    <div class="admin-workspace-empty">
      <p class="eyebrow">Content studio</p>
      <h3>Continue to your CMS.</h3>
      <p>Project creation, image management, and publishing controls will appear here.</p>
      <button type="button" disabled>New project · Coming soon</button>
    </div>`;
  document.querySelector('main')?.append(workspace);
};

const renderSignedOut = () => {
  if (!profileTrigger) return;
  profileTrigger.className = 'contact-button signin-trigger';
  profileTrigger.href = '#signin';
  profileTrigger.textContent = 'Sign in';
  profileTrigger.removeAttribute('aria-label');
  profileTrigger.onclick = null;
  document.querySelector('.profile-menu')?.remove();
  removeAdminWorkspace();
};

const renderSignedIn = (user) => {
  if (!profileTrigger) return;
  profileTrigger.className = 'profile-button';
  profileTrigger.href = '#profile';
  profileTrigger.setAttribute('aria-label', 'Open profile menu');
  profileTrigger.innerHTML = '';

  const identityData = user.identities?.find((identity) => identity.provider === 'google')?.identity_data || user.identities?.[0]?.identity_data || {};
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || identityData.avatar_url || identityData.picture || identityData.image;
  if (avatarUrl) {
    const avatar = document.createElement('img');
    avatar.src = avatarUrl;
    avatar.alt = '';
    avatar.referrerPolicy = 'no-referrer';
    avatar.addEventListener('error', () => {
      const initials = document.createElement('span');
      initials.textContent = getInitials(user);
      avatar.replaceWith(initials);
    });
    profileTrigger.append(avatar);
  } else {
    const initials = document.createElement('span');
    initials.textContent = getInitials(user);
    profileTrigger.append(initials);
  }

  document.querySelector('.profile-menu')?.remove();
  const menu = document.createElement('div');
  menu.className = 'profile-menu';
  menu.hidden = true;
  menu.innerHTML = '<strong></strong><small></small><a class="profile-menu-link" href="/bookmarks/">Bookmarks</a><a class="profile-menu-link" href="/billing/">Manage billing</a><button type="button">Sign out</button>';
  menu.querySelector('strong').textContent = user.user_metadata?.full_name || user.user_metadata?.name || 'Signed in';
  menu.querySelector('small').textContent = user.email || '';
  const signOutButton = menu.querySelector('button');
  const removeAdminLink = () => menu.querySelector('.profile-admin-link')?.remove();
  window.troveSupabase
    .from('user_roles')
    .select('role,user_id')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle()
    .then(({ data, error }) => {
      removeAdminLink();
      const isAdmin = !error && data?.role === 'admin' && data?.user_id === user.id;
      if (!isAdmin || !menu.isConnected) return;
      const adminLink = document.createElement('a');
      adminLink.className = 'profile-admin-link';
      adminLink.dataset.adminVerified = 'true';
      adminLink.style.display = 'block';
      adminLink.href = `${window.location.origin}/cms/`;
      adminLink.target = '_blank';
      adminLink.rel = 'noopener';
      adminLink.textContent = 'Open CMS';
      adminLink.addEventListener('click', () => { menu.hidden = true; });
      menu.insertBefore(adminLink, signOutButton);
      renderAdminWorkspace(user);
    });
  signOutButton.addEventListener('click', async () => {
    await window.troveSupabase.auth.signOut();
    menu.hidden = true;
  });
  profileTrigger.parentElement.append(menu);
  profileTrigger.onclick = (event) => {
    event.preventDefault();
    menu.hidden = !menu.hidden;
  };
};

const syncAuthUi = (session) => {
  if (session?.user) renderSignedIn(session.user);
  else renderSignedOut();
};

const returnTo = new URLSearchParams(window.location.search).get('returnTo');
const redirectBackToAdmin = () => {
  if (returnTo === '/cms/') {
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.assign(returnTo);
  }
};

window.troveSupabase.auth.getSession().then(({ data }) => {
  syncAuthUi(data.session);
  if (data.session?.user) redirectBackToAdmin();
});
window.troveSupabase.auth.onAuthStateChange((_event, session) => {
  syncAuthUi(session);
  if (session?.user) redirectBackToAdmin();
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.header-actions')) document.querySelector('.profile-menu')?.setAttribute('hidden', '');
});
