(() => {
  const client = window.troveSupabase;
  const message = document.querySelector('#bookmarks-message');
  const grid = document.querySelector('#bookmarks-grid');
  if (!client || !message || !grid) return;

  function showMessage(text, actionLabel = '') {
    message.replaceChildren(document.createTextNode(text));
    if (actionLabel) {
      message.append(document.createTextNode(' '));
      const link = document.createElement('a');
      link.href = actionLabel === 'Sign in' ? '#signin' : '../index.html#portfolio';
      link.textContent = actionLabel;
      if (actionLabel === 'Sign in') link.className = 'signin-trigger';
      message.append(link);
    }
    message.hidden = false;
  }

  function makeProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'bookmark-card';

    const media = document.createElement('div');
    media.className = 'bookmark-media';
    const isVideo = /\/video\/upload\/|\.(mp4|webm|mov|m3u8|mpd)(?:[?#]|$)/i.test(project.image_url || '');
    if (isVideo) {
      const video = document.createElement('video');
      video.src = project.image_url;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      media.append(video);
    } else {
      const image = document.createElement('img');
      image.src = project.image_url;
      image.alt = project.name || 'Bookmarked project';
      image.loading = 'lazy';
      media.append(image);
    }

    const remove = document.createElement('button');
    remove.className = 'bookmark-remove';
    remove.type = 'button';
    remove.dataset.removeBookmark = project.id;
    remove.setAttribute('aria-label', `Remove ${project.name || 'project'} from bookmarks`);
    remove.textContent = '♥';
    media.append(remove);

    const details = document.createElement('div');
    details.className = 'bookmark-card-details';
    const title = document.createElement('h2');
    title.textContent = project.name || 'Untitled project';
    const category = document.createElement('p');
    category.textContent = project.category || 'Project';
    details.append(title, category);
    card.append(media, details);
    return card;
  }

  async function loadBookmarks() {
    message.hidden = false;
    message.textContent = 'Loading your bookmarks…';
    grid.replaceChildren();

    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) {
      showMessage('We could not load your account. Please refresh and try again.');
      return;
    }
    const user = sessionData.session?.user;
    if (!user) {
      showMessage('Sign in to see the projects you have saved.', 'Sign in');
      return;
    }

    const { data: savedRows, error: savedError } = await client
      .from('cms_project_likes')
      .select('project_id,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (savedError) {
      showMessage('We could not load your bookmarks. Please refresh and try again.');
      console.warn('Unable to load project bookmarks:', savedError.message);
      return;
    }

    const ids = (savedRows || []).map((row) => row.project_id);
    if (!ids.length) {
      showMessage('No bookmarks yet. Browse the library and tap the heart on projects you want to save.', 'Browse library');
      return;
    }

    const { data: projects, error: projectsError } = await client
      .from('cms_projects')
      .select('id,name,category,description,image_url')
      .in('id', ids)
      .eq('status', 'live');
    if (projectsError) {
      showMessage('We could not load your saved projects. Please refresh and try again.');
      console.warn('Unable to load bookmarked projects:', projectsError.message);
      return;
    }

    const projectById = new Map((projects || []).map((project) => [project.id, project]));
    ids.forEach((id) => {
      const project = projectById.get(id);
      if (project?.image_url) grid.append(makeProjectCard(project));
    });

    message.hidden = grid.childElementCount > 0;
    if (!grid.childElementCount) showMessage('No published bookmarks yet. Browse the library to save a project.', 'Browse library');
  }

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-remove-bookmark]');
    if (!button) return;
    button.disabled = true;
    const { data: sessionData } = await client.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      button.disabled = false;
      showMessage('Your session expired. Sign in again to manage bookmarks.', 'Sign in');
      return;
    }
    const { error } = await client
      .from('cms_project_likes')
      .delete()
      .eq('project_id', button.dataset.removeBookmark)
      .eq('user_id', userId);
    if (error) {
      button.disabled = false;
      showMessage('We could not remove that bookmark. Please try again.');
      console.warn('Unable to remove project bookmark:', error.message);
      return;
    }
    button.closest('.bookmark-card')?.remove();
    if (!grid.childElementCount) showMessage('No bookmarks yet. Browse the library and tap the heart on projects you want to save.', 'Browse library');
  });

  window.addEventListener('trove-auth-signed-in', loadBookmarks);
  loadBookmarks();
})();
