let projects = [
  { title: 'Client: Luxury Stay branding', category: 'branding', tags: ['branding', 'print'], image: 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', count: 6 },
  { title: 'Website design & development — Aterelie', category: 'websites', tags: ['websites', 'template', 'no-code'], image: 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', count: 4 },
  { title: 'Website design & development — Along the Coast', category: 'websites', tags: ['websites', 'no-code'], image: 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024', count: 12 },
  { title: 'App & website design — Reverie', category: 'websites', tags: ['websites', 'ui-kit'], image: 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004', count: 3 },
  { title: 'Digital Art Series', category: 'illustration', tags: ['illustration', 'concept-art'], image: 'https://framerusercontent.com/images/PmMTtBWdns9q73sBmlgu6h7pB0.png?width=1122&height=1402', count: 12 },
  { title: 'Editorial website template', category: 'websites', tags: ['websites', 'template'], image: 'https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004', count: 5 },
  { title: 'Photography preset collection', category: 'photography', tags: ['photography', 'stock-photo'], image: 'https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004', count: 9 }
];

let folders = [
  { name: 'Templates', filter: 'templates', count: 6, images: ['https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024'] },
  { name: 'Components', filter: 'components', count: 4, images: ['https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122'] },
  { name: 'Backgrounds', filter: 'backgrounds', count: 3, images: ['https://framerusercontent.com/images/PmMTtBWdns9q73sBmlgu6h7pB0.png?width=1122&height=1402', 'https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004'] }
];

const grid = document.querySelector('#project-grid');
const folderGrid = document.querySelector('#folder-grid');
const emptyState = document.querySelector('#empty-state');
const search = document.querySelector('#project-search');
const archiveSearch = document.querySelector('#archive-search');
const archiveHeading = document.querySelector('.hero-copy h1');
const libraryParams = new URLSearchParams(window.location.search);
const requestedQuickFilter = ['free', 'premium', 'popular'].includes(libraryParams.get('quick')) ? libraryParams.get('quick') : 'all';
let activeFilter = libraryParams.get('category') || libraryParams.get('tag') || 'all';
let activeQuickFilter = requestedQuickFilter;
search.value = libraryParams.get('q') || '';
if (archiveSearch) archiveSearch.value = search.value;
let currentPlan = 'free';
const planRank = { free: 0, starter: 1, studio: 2, lifetime: 3 };
const planLimits = { free: { prompts: 3, components: 5, visits: 3 }, starter: { prompts: 10, components: 15, visits: 7 }, studio: { prompts: Infinity, components: Infinity, visits: Infinity }, lifetime: { prompts: Infinity, components: Infinity, visits: Infinity } };
const isVideoProject = (project) => /\/video\/upload\/|\.(mp4|webm|mov|m3u8|mpd)(?:[?#]|$)/i.test(project.image || '');
const projectMedia = (project) => isVideoProject(project) ? `<video src="${project.image}" autoplay loop muted playsinline preload="metadata"></video>` : `<img src="${project.image}" alt="${project.title}" loading="lazy">`;
const projectAccessPlan = (project) => project.accessPlan || (project.isPremium ? 'starter' : 'free');
const canAccessProject = (project) => (planRank[currentPlan] || 0) >= (planRank[projectAccessPlan(project)] || 0);
const folderProjectMap = { templates: ['templates'], components: ['components'], sections: ['sections'], backgrounds: ['backgrounds'], branding: ['branding'], automations: ['automations'] };
projects = [];
folders = [];
const categoryNames = { templates: 'Templates', components: 'Components', sections: 'Sections', backgrounds: 'Backgrounds', branding: 'Branding', automations: 'Automations' };
const categoryTags = {
  templates: ['Hero', 'Landing Page', 'SaaS', 'Agency', 'AI', 'Creative', 'Portfolio', 'Technology', 'Travel'],
  components: ['Navigation', 'Cards', 'Forms', 'Buttons', 'Gallery', 'Testimonials', 'Pricing'],
  sections: ['Hero', 'Features', 'About', 'Services', 'Process', 'FAQ', 'Footer'],
  backgrounds: ['Gradient', 'Texture', 'Mesh', 'Pattern', 'Noise', '3D'],
  branding: ['Logos', 'Typography', 'Color', 'Identity', 'Guidelines', 'Social'],
  automations: ['Forms', 'Workflows', 'CMS', 'Email', 'Integrations', 'AI']
};
const categoryTagsElement = document.querySelector('#category-tags');
const projectDetail = document.querySelector('#project-detail');
let lastVisibleProjects = [];

function layoutProjectCards() {
  if (grid.hidden) return;
  const cards = [...grid.querySelectorAll('.project-card')];
  if (!cards.length) return;
  const width = grid.clientWidth;
  const columns = window.innerWidth <= 809 ? 1 : window.innerWidth <= 1100 ? 2 : 3;
  const gap = window.innerWidth <= 809 ? 48 : 34;
  const cardWidth = (width - gap * (columns - 1)) / columns;
  const heights = Array(columns).fill(0);
  cards.forEach((card, index) => {
    const column = index % columns;
    card.style.width = `${cardWidth}px`;
    card.style.left = `${column * (cardWidth + gap)}px`;
    card.style.top = `${heights[column]}px`;
    heights[column] += card.offsetHeight + gap;
  });
  grid.style.height = `${Math.max(...heights) - gap}px`;
}

function renderFolders() {
  folderGrid.innerHTML = folders.map((folder) => `
    <a class="folder-card" href="#portfolio" data-filter="${folder.filter}" aria-label="Open ${folder.name} folder">
      <div class="folder-stack">
        <div class="folder-paper folder-paper-left">${projectMedia({ image: folder.images[0], title: '' })}</div>
        <div class="folder-paper folder-paper-right">${projectMedia({ image: folder.images[1], title: '' })}</div>
        <div class="folder-paper folder-paper-front">${projectMedia({ image: folder.images[0], title: `${folder.name} preview` })}</div>
        <span class="folder-badge">${folder.count}</span>
        <span class="folder-clip" aria-hidden="true"></span>
      </div>
      <h2>${folder.name}</h2>
    </a>
  `).join('');
}

function renderHomeCollections() {
  const container = document.querySelector('#home-collections');
  if (!container) return;
  container.innerHTML = publicFolderConfig.map(([name, filter]) => {
    const categoryProjects = projects.filter((project) => project.category === filter).slice(0, 9);
    if (!categoryProjects.length) return '';
    const cards = categoryProjects.map((project, order) => {
      const projectIndex = projects.indexOf(project);
      const locked = !canAccessProject(project);
      const action = locked ? 'data-upgrade' : `data-copy-prompt="${projectIndex}"`;
      const actionLabel = locked ? 'Upgrade to access' : `Copy prompt for ${project.title}`;
      const actionText = locked ? 'Upgrade' : 'Copy prompt';
      return `<a class="project-card aspect-landscape" href="#project-detail" data-project-index="${projectIndex}" style="--order:${order}"><div class="card-image">${projectMedia(project)}<button class="project-like${project.isLiked ? ' is-liked' : ''}" type="button" data-like-project="${project.id}" aria-label="${project.isLiked ? 'Remove bookmark for' : 'Bookmark'} ${project.title}"><span aria-hidden="true">${project.isLiked ? '&#9829;' : '&#9825;'}</span><b>${project.likeCount || 0}</b></button></div><div class="card-meta">${project.isPremium || projectAccessPlan(project) !== 'free' ? '<span class="premium-badge">Premium</span>' : ''}<h2>${project.title}</h2><button class="copy-prompt" type="button" ${action} aria-label="${actionLabel}" title="${actionLabel}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2 2H6a2 2 0 0 0 2 2v8a2 2 0 0 0 2 2h2"></path></svg><span>${actionText}</span></button></div></a>`;
    }).join('');
    return `<section class="home-category"><header><h2>${name}</h2><button type="button" data-filter="${filter}">See all</button></header><div class="home-category-grid">${cards}</div></section>`;
  }).join('');
}

function renderProjects() {
  const query = search.value.trim().toLowerCase();
  let visible = projects.filter((project) => {
    const mappedCategories = folderProjectMap[activeFilter] || [];
    const matchesFilter = activeFilter === 'all' || project.category === activeFilter || mappedCategories.includes(project.category) || project.tags.includes(activeFilter);
    const matchesQuickFilter = activeQuickFilter === 'all'
      || (activeQuickFilter === 'free' && !project.isPremium)
      || (activeQuickFilter === 'premium' && project.isPremium)
      || (activeQuickFilter === 'popular' && (project.likeCount || 0) > 0);
    return matchesFilter && matchesQuickFilter && (!query || project.title.toLowerCase().includes(query) || project.tags.some((tag) => tag.includes(query)));
  });
  if (activeQuickFilter === 'popular') visible = visible.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  renderHomeCollections();
  grid.innerHTML = visible.map((project, index) => `
    <a class="project-card aspect-landscape" href="#project-detail" data-project-index="${projects.indexOf(project)}" style="--order:${index}">
      <div class="card-image">${projectMedia(project)}<button class="project-like${project.isLiked ? ' is-liked' : ''}" type="button" data-like-project="${project.id}" aria-label="${project.isLiked ? 'Remove bookmark for' : 'Bookmark'} ${project.title}"><span aria-hidden="true">${project.isLiked ? '♥' : '♡'}</span><b>${project.likeCount || 0}</b></button></div>
      <div class="card-meta">${project.isPremium || projectAccessPlan(project) !== 'free' ? '<span class="premium-badge">Premium</span>' : ''}<h2>${project.title}</h2><button class="copy-prompt" type="button" ${!canAccessProject(project) ? 'data-upgrade' : `data-copy-prompt="${projects.indexOf(project)}"`} aria-label="${!canAccessProject(project) ? 'Upgrade to access' : 'Copy prompt for ' + project.title}" title="${!canAccessProject(project) ? 'Upgrade to access' : 'Copy prompt'}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2 2H6a2 2 0 0 0 2 2v8a2 2 0 0 0 2 2h2"></path></svg><span>${!canAccessProject(project) ? 'Upgrade' : 'Copy prompt'}</span></button></div>
    </a>
  `).join('');
  requestAnimationFrame(layoutProjectCards);
  grid.querySelectorAll('img').forEach((image) => image.addEventListener('load', layoutProjectCards, { once: true }));
  lastVisibleProjects = visible;
  const isHome = activeFilter === 'all' && activeQuickFilter === 'all' && !query;
  const quickHeading = { free: 'Free projects', premium: 'Premium projects', popular: 'Popular projects' };
  archiveHeading.textContent = isHome ? 'Portfolio' : (quickHeading[activeQuickFilter] || categoryNames[activeFilter] || activeFilter);
  document.querySelectorAll('[data-quick-filter]').forEach((item) => item.classList.toggle('is-active', item.dataset.quickFilter === activeQuickFilter));
  document.querySelectorAll('.filter-panel [data-filter]').forEach((item) => item.classList.toggle('is-active', item.dataset.filter === activeFilter));
  document.querySelector('.archive').classList.remove('is-detail');
  document.querySelector('.hero-copy').hidden = false;
  const tagsForCategory = isHome ? [] : [...new Set([...(categoryTags[activeFilter] || []), ...projects.filter((project) => project.category === activeFilter).flatMap((project) => project.tags || [])])];
  categoryTagsElement.innerHTML = isHome ? '' : tagsForCategory.map((tag) => `<button type="button" data-filter="${normalizePublicTag(tag)}">${formatPublicTag(tag)}</button>`).join('');
  categoryTagsElement.hidden = isHome;
  document.querySelector('.archive').classList.toggle('is-home', isHome);
  folderGrid.hidden = !isHome;
  document.querySelector('#home-collections').hidden = !isHome;
  grid.hidden = isHome;
  projectDetail.hidden = true;
  projectDetail.innerHTML = '';
  emptyState.hidden = visible.length > 0;
}

function renderProjectDetail(project) {
  const related = lastVisibleProjects.filter((item) => item !== project).slice(0, 3);
  const locked = !canAccessProject(project);
  projectDetail.innerHTML = `
    <button class="detail-back" type="button">← Back to ${categoryNames[activeFilter] || 'Libraries'}</button>
    <div class="detail-layout">
      <div class="detail-main-card aspect-${project.aspectRatio === '9:16' ? 'portrait' : 'landscape'}">${projectMedia(project)}<button class="project-like${project.isLiked ? ' is-liked' : ''}" type="button" data-like-project="${project.id}" aria-label="${project.isLiked ? 'Remove bookmark for' : 'Bookmark'} ${project.title}"><span aria-hidden="true">${project.isLiked ? '&#9829;' : '&#9825;'}</span><b>${project.likeCount || 0}</b></button></div>
      <aside class="detail-info"><span class="eyebrow">${categoryNames[activeFilter] || 'Project'}</span>${project.isPremium || projectAccessPlan(project) !== 'free' ? '<span class="premium-badge">Premium</span>' : ''}<h2>${project.title}</h2><p>${project.description || 'A considered digital experience built with clarity, character, and a strong visual point of view.'}</p><div class="detail-meta"><span>Category<strong>${categoryNames[activeFilter] || 'Project'}</strong></span><span>Format<strong>Digital design</strong></span></div><button class="detail-contact" type="button" ${locked ? 'data-upgrade' : `data-copy-prompt="${projects.indexOf(project)}"`}>${locked ? 'Upgrade' : 'Copy prompt'}</button></aside>
    </div>
    <div class="detail-related-grid">${related.map((item) => `<a class="detail-related-card" href="#project-detail" data-project-index="${projects.indexOf(item)}">${projectMedia(item)}<h3>${item.title}</h3></a>`).join('')}</div>`;
  document.querySelector('.archive').classList.add('is-detail');
  document.querySelector('.hero-copy').hidden = true;
  categoryTagsElement.hidden = true;
  folderGrid.hidden = true;
  grid.hidden = true;
  emptyState.hidden = true;
  projectDetail.hidden = false;
  projectDetail.querySelector('.detail-back').addEventListener('click', () => {
    document.querySelector('.archive').classList.remove('is-detail');
    renderProjects();
  });
}

document.addEventListener('click', (event) => {
  const likeButton = event.target.closest('[data-like-project]');
  if (likeButton) {
    event.preventDefault();
    event.stopPropagation();
    toggleProjectLike(likeButton.dataset.likeProject);
    return;
  }
  const upgradeButton = event.target.closest('[data-upgrade]');
  if (upgradeButton) {
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('pricing/index.html');
    return;
  }
  const copyButton = event.target.closest('[data-copy-prompt]');
  if (copyButton) {
    event.preventDefault();
    event.stopPropagation();
    const project = projects[Number(copyButton.dataset.copyPrompt)];
    if (project) copyPrompt(project, copyButton);
    return;
  }
  const projectCard = event.target.closest('.project-card,.detail-related-card,.latest-drop');
  if (projectCard) {
    event.preventDefault();
    const project = projects[Number(projectCard.dataset.projectIndex)];
    if (project) renderProjectDetail(project);
    return;
  }
  const homeLink = event.target.closest('[data-home]');
  if (homeLink) {
    event.preventDefault();
    activeFilter = 'all';
    activeQuickFilter = 'all';
    search.value = '';
    if (archiveSearch) archiveSearch.value = '';
    renderProjects();
    window.location.hash = 'portfolio';
    return;
  }
  const quickFilter = event.target.closest('[data-quick-filter]');
  if (quickFilter) {
    event.preventDefault();
    activeQuickFilter = quickFilter.dataset.quickFilter;
    document.querySelectorAll('[data-quick-filter]').forEach((item) => item.classList.toggle('is-active', item.dataset.quickFilter === activeQuickFilter));
    document.querySelectorAll('.archive-filter-buttons [data-archive-filter]').forEach((item) => item.classList.remove('is-active'));
    renderProjects();
    return;
  }
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  event.preventDefault();
  if (button.dataset.filter === 'components') {
    consumeComponentVisit().then((allowed) => {
      if (allowed) activateLibraryFilter(button);
    });
    return;
  }
  activateLibraryFilter(button);
});

function activateLibraryFilter(button) {
  activeFilter = button.dataset.filter;
  activeQuickFilter = 'all';
  document.querySelectorAll('[data-quick-filter]').forEach((item) => item.classList.remove('is-active'));
  document.querySelectorAll('[data-archive-filter]').forEach((item) => item.classList.toggle('is-active', item.dataset.archiveFilter === activeFilter));
  document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
  renderProjects();
  document.querySelector('#filter-panel').classList.remove('is-open');
  document.querySelector('.mobile-filter-trigger').setAttribute('aria-expanded', 'false');
}

async function consumeComponentVisit() {
  const client = window.troveSupabase;
  const sessionData = client ? (await client.auth.getSession()).data : null;
  if (!sessionData?.session?.user) {
    const localResult = consumeLocalComponentVisit();
    if (!localResult.allowed) showUpgradeModal('You have used your 3 component visits for this week. Upgrade to keep exploring the full library.');
    return localResult.allowed;
  }
  const { data, error } = await client.rpc('consume_component_visit');
  if (error) {
    showUpgradeModal('Component access is temporarily unavailable. Please try again shortly.');
    return false;
  }
  if (!data?.allowed) {
    showUpgradeModal('You have used your 3 component visits for this week. Upgrade to keep exploring the full library.');
    return false;
  }
  return true;
}

function getLocalFairUse() {
  const today = new Date().toISOString().slice(0, 10);
  const date = new Date(`${today}T00:00:00Z`);
  const day = date.getUTCDay();
  date.setUTCDate(date.getUTCDate() - (day === 0 ? 6 : day - 1));
  const weekStart = date.toISOString().slice(0, 10);
  let usage = { date: today, weekStart, promptCopies: 0, componentCopies: 0, componentVisits: 0 };
  try {
    usage = { ...usage, ...(JSON.parse(localStorage.getItem('trovesites-fair-use') || '{}')) };
  } catch {}
  if (usage.date !== today) {
    usage.date = today;
    usage.promptCopies = 0;
    usage.componentCopies = 0;
  }
  if (usage.weekStart !== weekStart) {
    usage.weekStart = weekStart;
    usage.componentVisits = 0;
  }
  return usage;
}

function saveLocalFairUse(usage) {
  try { localStorage.setItem('trovesites-fair-use', JSON.stringify(usage)); } catch {}
}

function consumeLocalComponentVisit() {
  const usage = getLocalFairUse();
  if (usage.componentVisits >= 3) return { allowed: false, reason: 'component_visit_limit' };
  usage.componentVisits += 1;
  saveLocalFairUse(usage);
  return { allowed: true };
}

function consumeLocalCopy(project) {
  const usage = getLocalFairUse();
  if (usage.componentCopies >= 5) return { allowed: false, reason: 'component_copy_limit' };
  if (project.category === 'components') {
    usage.componentCopies += 1;
  } else {
    if (usage.promptCopies >= 3) return { allowed: false, reason: 'prompt_limit' };
    usage.promptCopies += 1;
  }
  saveLocalFairUse(usage);
  return { allowed: true };
}

function showUpgradeModal(message) {
  let modal = document.querySelector('#upgrade-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'upgrade-modal';
    modal.className = 'upgrade-modal';
    modal.innerHTML = '<div class="upgrade-modal-backdrop" data-upgrade-close></div><section class="upgrade-modal-card" role="dialog" aria-modal="true" aria-labelledby="upgrade-title"><button class="upgrade-modal-close" type="button" data-upgrade-close aria-label="Close">×</button><span class="upgrade-modal-icon">✦</span><h2 id="upgrade-title">Upgrade for the full experience</h2><p data-upgrade-message></p><a class="upgrade-modal-action" href="pricing/index.html">View plans</a></section>';
    document.body.append(modal);
    modal.querySelectorAll('[data-upgrade-close]').forEach((item) => item.addEventListener('click', () => modal.remove()));
  }
  modal.querySelector('[data-upgrade-message]').textContent = message;
  modal.classList.add('is-open');
}
async function copyPrompt(project, button) {
  const client = window.troveSupabase;
  if (client && project.id) {
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session?.user) {
      const localResult = consumeLocalCopy(project);
      if (!localResult.allowed) {
        const message = localResult.reason === 'component_copy_limit'
          ? 'You have reached the 5 component copies allowed today.'
          : 'You have reached the 3 prompt copies allowed today.';
        showUpgradeModal(`${message} Upgrade to keep creating without limits.`);
        return;
      }
    } else {
      const { data, error } = await client.rpc('consume_project_copy', { p_project_id: project.id });
      if (error) {
        showUpgradeModal('Usage limits are not available yet. Please try again shortly.');
        return;
      }
      if (!data?.allowed) {
        const message = data.reason === 'component_copy_limit'
          ? 'You have reached the 5 component copies allowed today.'
          : 'You have reached the 3 prompt copies allowed today.';
        showUpgradeModal(`${message} Upgrade to keep creating without limits.`);
        return;
      }
    }
  } else {
    const localResult = consumeLocalCopy(project);
    if (!localResult.allowed) {
      const message = localResult.reason === 'component_copy_limit'
        ? 'You have reached the 5 component copies allowed today.'
        : 'You have reached the 3 prompt copies allowed today.';
      showUpgradeModal(`${message} Upgrade to keep creating without limits.`);
      return;
    }
  }
  const prompt = project.prompt || `Create a polished visual design inspired by ${project.title}, with thoughtful typography, a refined layout, and a distinctive art direction.`;
  try {
    await navigator.clipboard.writeText(prompt);
  } catch {
    const field = document.createElement('textarea');
    field.value = prompt;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    field.remove();
  }
  button.classList.add('is-copied');
  window.setTimeout(() => button.classList.remove('is-copied'), 1400);
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = 'Prompt copied';
  window.clearTimeout(toast.dismissTimer);
  toast.dismissTimer = window.setTimeout(() => toast.remove(), 1800);
}

const publicFolderConfig = [
  ['Templates', 'templates'],
  ['Components', 'components'],
  ['Backgrounds', 'backgrounds']
];

const normalizePublicCategory = (category) => {
  const normalized = String(category || 'other').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return normalized === 'templates-components' ? 'templates' : normalized;
};
const normalizePublicTag = (tag) => String(tag || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
const formatPublicTag = (tag) => String(tag || '').trim().replace(/(^|[-\s])([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`).replace(/-/g, ' ');

function renderSidebarTags() {
  const section = document.querySelector('#sidebar-tag-section');
  const list = document.querySelector('#sidebar-tag-list');
  if (!section || !list) return;

  const tagCounts = new Map();
  projects.forEach((project) => {
    [...new Set(project.tags)].forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1));
  });
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10);

  section.hidden = topTags.length === 0;
  list.innerHTML = topTags.map(([tag]) => `<button type="button" data-filter="${tag}">${formatPublicTag(tag).toUpperCase()}</button>`).join('');
}

function renderLatestDrops() {
  const list = document.querySelector('#latest-drops-list');
  if (!list) return;
  const section = list.closest('.latest-drops');
  list.innerHTML = projects.slice(0, 3).map((project) => {
    const index = projects.indexOf(project);
    const updated = project.updatedAt ? new Date(project.updatedAt) : null;
    const date = updated && !Number.isNaN(updated.valueOf())
      ? updated.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : formatPublicTag(project.category);
    return `<a class="latest-drop" href="#project-detail" data-project-index="${index}" aria-label="Open ${project.title}">${projectMedia(project)}<span><strong>${project.title}</strong><small>${date}</small></span></a>`;
  }).join('');
  if (section) section.hidden = projects.length === 0;
}

async function loadProjectLikes(items = projects) {
  const client = window.troveSupabase;
  if (!client || !items.length) return;
  const ids = items.map((project) => project.id).filter(Boolean);
  if (!ids.length) return;
  const { data: counts } = await client.from('cms_project_like_counts').select('project_id,like_count').in('project_id', ids);
  const countMap = new Map((counts || []).map((row) => [row.project_id, Number(row.like_count) || 0]));
  let likedIds = new Set();
  const { data: sessionData } = await client.auth.getSession();
  if (sessionData.session?.user) {
    const { data: liked } = await client.from('cms_project_likes').select('project_id').eq('user_id', sessionData.session.user.id).in('project_id', ids);
    likedIds = new Set((liked || []).map((row) => row.project_id));
  }
  items.forEach((project) => {
    project.likeCount = countMap.get(project.id) || 0;
    project.isLiked = likedIds.has(project.id);
  });
  renderProjects();
}

async function toggleProjectLike(projectId) {
  const project = projects.find((item) => item.id === projectId);
  const client = window.troveSupabase;
  if (!project || !client) return;
  const { data: sessionData } = await client.auth.getSession();
  if (!sessionData.session?.user) {
    document.querySelector('.signin-trigger')?.click();
    return;
  }
  const userId = sessionData.session.user.id;
  const wasLiked = Boolean(project.isLiked);
  const detailWasOpen = !projectDetail.hidden;
  project.isLiked = !wasLiked;
  project.likeCount = Math.max(0, (project.likeCount || 0) + (wasLiked ? -1 : 1));
  renderProjects();
  if (detailWasOpen) renderProjectDetail(project);
  const result = wasLiked
    ? await client.from('cms_project_likes').delete().eq('project_id', projectId).eq('user_id', userId)
    : await client.from('cms_project_likes').insert({ project_id: projectId, user_id: userId });
  if (result.error) {
    project.isLiked = wasLiked;
    project.likeCount = Math.max(0, (project.likeCount || 0) + (wasLiked ? 1 : -1));
    renderProjects();
    if (detailWasOpen) renderProjectDetail(project);
    window.alert(result.error.message);
  }
}

async function loadPublicProjects() {
  const client = window.troveSupabase;
  if (!client) return;
  const { data: sessionData } = await client.auth.getSession();
  if (sessionData.session?.user) {
    const { data: subscription } = await client.from('billing_subscriptions').select('plan,status').eq('user_id', sessionData.session.user.id).maybeSingle();
    currentPlan = subscription?.status === 'active' || subscription?.status === 'trialing' ? (subscription.plan || 'free') : 'free';
  }
  const { data, error } = await client
    .from('cms_projects')
    .select('id,name,slug,category,description,prompt,tags,aspect_ratio,is_premium,access_plan,image_url,updated_at')
    .eq('status', 'live')
    .not('image_url', 'is', null)
    .order('updated_at', { ascending: false });

  if (error) {
    console.warn('Unable to load published projects from Supabase:', error.message);
    projects = [];
    folders = [];
    emptyState.textContent = 'Published projects are temporarily unavailable.';
  } else {
    projects = (data || []).map((project) => ({
      id: project.id,
      title: project.name,
      category: normalizePublicCategory(project.category),
      tags: (project.tags || []).map(normalizePublicTag).filter(Boolean),
      aspectRatio: project.aspect_ratio === '9:16' ? '9:16' : '16:9',
      isPremium: Boolean(project.is_premium),
      accessPlan: project.access_plan || (project.is_premium ? 'starter' : 'free'),
      image: project.image_url,
      updatedAt: project.updated_at,
      description: project.description || '',
      prompt: project.prompt || '',
      slug: project.slug
    }));
    folders = publicFolderConfig
      .map(([name, filter]) => {
        const items = projects.filter((project) => project.category === filter);
        const images = items.slice(0, 2).map((item) => item.image);
        return { name, filter, count: items.length, images: [images[0], images[1] || images[0]] };
      })
      .filter((folder) => folder.count > 0);
    emptyState.textContent = 'No published projects yet.';
  }
  renderSidebarTags();
  renderLatestDrops();
  renderFolders();
  renderProjects();
  await loadProjectLikes(projects);
  const requestedProject = libraryParams.get('project');
  if (requestedProject) {
    const project = projects.find((item) => item.slug === requestedProject);
    if (project) {
      activeFilter = project.category;
      renderProjects();
      renderProjectDetail(project);
      requestAnimationFrame(() => projectDetail.scrollIntoView({ block: 'start', behavior: 'smooth' }));
    }
  }
}

search.addEventListener('input', () => {
  if (archiveSearch) archiveSearch.value = search.value;
  renderProjects();
});
if (archiveSearch) archiveSearch.addEventListener('input', () => {
  search.value = archiveSearch.value;
  renderProjects();
});
document.querySelectorAll('[data-archive-filter]').forEach((button) => button.addEventListener('click', () => {
  const sidebarButton = document.querySelector(`[data-filter="${button.dataset.archiveFilter}"]`);
  if (sidebarButton) sidebarButton.click();
}));
window.addEventListener('resize', layoutProjectCards);
renderFolders();
renderProjects();
loadPublicProjects();
