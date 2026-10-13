(function () {
  const client = window.troveSupabase;
  const tagList = document.querySelector('#sidebar-tag-list');
  const latestList = document.querySelector('#latest-drops-list');
  if (!client || (!tagList && !latestList)) return;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const normalizeTag = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const formatTag = (value) => String(value || '').trim().replace(/(^|[-\s])([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`).replace(/-/g, ' ');
  const libraryUrl = new URL('../index.html', window.location.href);
  const videoUrl = (value) => /\/video\/upload\/|\.(mp4|webm|mov|m3u8|mpd)(?:[?#]|$)/i.test(value || '');

  const searchInput = document.querySelector('#sidebar-library-search');
  if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || !searchInput.value.trim()) return;
      libraryUrl.searchParams.set('q', searchInput.value.trim());
      libraryUrl.hash = 'portfolio';
      window.location.assign(libraryUrl.href);
    });
  }

  document.querySelectorAll('[data-sidebar-quick]').forEach((button) => {
    button.addEventListener('click', () => {
      libraryUrl.searchParams.set('quick', button.dataset.sidebarQuick);
      libraryUrl.hash = 'portfolio';
      window.location.assign(libraryUrl.href);
    });
  });

  client.from('cms_projects')
    .select('id,name,slug,category,tags,image_url,updated_at')
    .eq('status', 'live')
    .not('image_url', 'is', null)
    .order('updated_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) throw error;
      const projects = data || [];

      if (tagList) {
        const counts = new Map();
        projects.forEach((project) => {
          (Array.isArray(project.tags) ? project.tags : []).map(normalizeTag).filter(Boolean)
            .forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
        });
        const tags = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 10);
        const section = tagList.closest('#sidebar-tag-section');
        if (section) section.hidden = tags.length === 0;
        tagList.innerHTML = tags.map(([tag]) => `<button type="button" data-sidebar-tag="${escapeHtml(tag)}">${escapeHtml(formatTag(tag).toUpperCase())}</button>`).join('');
        tagList.querySelectorAll('[data-sidebar-tag]').forEach((button) => button.addEventListener('click', () => {
          libraryUrl.searchParams.set('tag', button.dataset.sidebarTag);
          libraryUrl.hash = 'portfolio';
          window.location.assign(libraryUrl.href);
        }));
      }

      if (latestList) {
        const latest = projects.slice(0, 3);
        latestList.innerHTML = latest.map((project) => {
          const date = project.updated_at ? new Date(project.updated_at) : null;
          const dateText = date && !Number.isNaN(date.valueOf()) ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
          const mediaUrl = escapeHtml(project.image_url);
          const media = videoUrl(project.image_url)
            ? `<video src="${mediaUrl}" autoplay loop muted playsinline preload="metadata" aria-label="${escapeHtml(project.name)} preview"></video>`
            : `<img src="${mediaUrl}" alt="${escapeHtml(project.name)} preview" loading="lazy">`;
          const destination = new URL(libraryUrl.href);
          if (project.slug) destination.searchParams.set('project', project.slug);
          else destination.searchParams.set('category', normalizeTag(project.category));
          destination.hash = 'project-detail';
          return `<a class="latest-drop" href="${escapeHtml(destination.href)}">${media}<span><strong>${escapeHtml(project.name)}</strong><small>${escapeHtml(dateText)}</small></span></a>`;
        }).join('');
        const section = latestList.closest('.latest-drops');
        if (section) section.hidden = latest.length === 0;
      }
    })
    .catch((error) => {
      console.warn('Unable to load shared library sidebar:', error.message);
      const tagSection = tagList?.closest('#sidebar-tag-section');
      const latestSection = latestList?.closest('.latest-drops');
      if (tagSection) tagSection.hidden = true;
      if (latestSection) latestSection.hidden = true;
    });
}());
