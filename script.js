const projects = [
  { title: 'Client: Luxury Stay branding', category: 'branding', tags: ['branding', 'print'], image: 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', count: 6 },
  { title: 'Website design & development — Aterelie', category: 'websites', tags: ['websites', 'template', 'no-code'], image: 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', count: 4 },
  { title: 'Website design & development — Along the Coast', category: 'websites', tags: ['websites', 'no-code'], image: 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024', count: 12 },
  { title: 'App & website design — Reverie', category: 'websites', tags: ['websites', 'ui-kit'], image: 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004', count: 3 },
  { title: 'Digital Art Series', category: 'illustration', tags: ['illustration', 'concept-art'], image: 'https://framerusercontent.com/images/PmMTtBWdns9q73sBmlgu6h7pB0.png?width=1122&height=1402', count: 12 },
  { title: 'Editorial website template', category: 'websites', tags: ['websites', 'template'], image: 'https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004', count: 5 },
  { title: 'Photography preset collection', category: 'photography', tags: ['photography', 'stock-photo'], image: 'https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004', count: 9 }
];

const folders = [
  { name: 'Templates', filter: 'templates', count: 6, images: ['https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024'] },
  { name: 'Components', filter: 'components', count: 4, images: ['https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122'] },
  { name: 'Sections', filter: 'sections', count: 12, images: ['https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024', 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004'] },
  { name: 'Backgrounds', filter: 'backgrounds', count: 3, images: ['https://framerusercontent.com/images/PmMTtBWdns9q73sBmlgu6h7pB0.png?width=1122&height=1402', 'https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004'] },
  { name: 'Branding', filter: 'branding', count: 12, images: ['https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122'] },
  { name: 'Automations', filter: 'automations', count: 9, images: ['https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024', 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004'] }
];

const grid = document.querySelector('#project-grid');
const folderGrid = document.querySelector('#folder-grid');
const emptyState = document.querySelector('#empty-state');
const search = document.querySelector('#project-search');
const archiveHeading = document.querySelector('.hero-copy h1');
let activeFilter = 'all';
const folderProjectMap = { templates: ['websites'], components: ['websites'], sections: ['websites'], backgrounds: ['illustration'], branding: ['branding'], automations: ['photography'] };
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
        <div class="folder-paper folder-paper-left"><img src="${folder.images[0]}" alt=""></div>
        <div class="folder-paper folder-paper-right"><img src="${folder.images[1]}" alt=""></div>
        <div class="folder-paper folder-paper-front"><img src="${folder.images[0]}" alt="${folder.name} preview"></div>
        <span class="folder-badge">${folder.count}</span>
        <span class="folder-clip" aria-hidden="true"></span>
      </div>
      <h2>${folder.name}</h2>
    </a>
  `).join('');
}

function renderProjects() {
  const query = search.value.trim().toLowerCase();
  const visible = projects.filter((project) => {
    const mappedCategories = folderProjectMap[activeFilter] || [];
    const matchesFilter = activeFilter === 'all' || project.category === activeFilter || mappedCategories.includes(project.category) || project.tags.includes(activeFilter);
    return matchesFilter && (!query || project.title.toLowerCase().includes(query) || project.tags.some((tag) => tag.includes(query)));
  });
  grid.innerHTML = visible.map((project, index) => `
    <a class="project-card" href="#project-detail" data-project-index="${projects.indexOf(project)}" style="--order:${index}">
      <div class="card-image"><img src="${project.image}" alt="${project.title}" loading="lazy"></div>
      <div class="card-meta"><h2>${project.title}</h2><button class="copy-prompt" type="button" data-copy-prompt="${projects.indexOf(project)}" aria-label="Copy prompt for ${project.title}" title="Copy prompt"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg><span>Copy prompt</span></button></div>
    </a>
  `).join('');
  requestAnimationFrame(layoutProjectCards);
  grid.querySelectorAll('img').forEach((image) => image.addEventListener('load', layoutProjectCards, { once: true }));
  lastVisibleProjects = visible;
  const isHome = activeFilter === 'all' && !query;
  archiveHeading.textContent = isHome ? 'Portfolio' : (categoryNames[activeFilter] || activeFilter);
  document.querySelector('.archive').classList.remove('is-detail');
  document.querySelector('.hero-copy').hidden = false;
  categoryTagsElement.innerHTML = isHome ? '' : (categoryTags[activeFilter] || []).map((tag) => `<button type="button">${tag}</button>`).join('');
  categoryTagsElement.hidden = isHome;
  document.querySelector('.archive').classList.toggle('is-home', isHome);
  folderGrid.hidden = !isHome;
  grid.hidden = isHome;
  projectDetail.hidden = true;
  projectDetail.innerHTML = '';
  emptyState.hidden = visible.length > 0;
}

function renderProjectDetail(project) {
  const related = lastVisibleProjects.filter((item) => item !== project).slice(0, 3);
  projectDetail.innerHTML = `
    <button class="detail-back" type="button">← Back to ${categoryNames[activeFilter] || 'Libraries'}</button>
    <div class="detail-layout">
      <div class="detail-main-card"><img src="${project.image}" alt="${project.title}"></div>
      <aside class="detail-info"><span class="eyebrow">${categoryNames[activeFilter] || 'Project'}</span><h2>${project.title}</h2><p>A considered digital experience built with clarity, character, and a strong visual point of view.</p><div class="detail-meta"><span>Category<strong>${categoryNames[activeFilter] || 'Project'}</strong></span><span>Format<strong>Digital design</strong></span></div><button class="detail-contact" type="button" data-copy-prompt="${projects.indexOf(project)}">Copy prompt</button></aside>
    </div>
    <div class="detail-related-grid">${related.map((item) => `<a class="detail-related-card" href="#project-detail" data-project-index="${projects.indexOf(item)}"><img src="${item.image}" alt="${item.title}"><h3>${item.title}</h3></a>`).join('')}</div>`;
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
  const copyButton = event.target.closest('[data-copy-prompt]');
  if (copyButton) {
    event.preventDefault();
    event.stopPropagation();
    const project = projects[Number(copyButton.dataset.copyPrompt)];
    if (project) copyPrompt(project, copyButton);
    return;
  }
  const projectCard = event.target.closest('.project-card,.detail-related-card');
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
    search.value = '';
    renderProjects();
    window.location.hash = 'portfolio';
    return;
  }
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  event.preventDefault();
  activeFilter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
  renderProjects();
  document.querySelector('#filter-panel').classList.remove('is-open');
  document.querySelector('.mobile-filter-trigger').setAttribute('aria-expanded', 'false');
});
async function copyPrompt(project, button) {
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

search.addEventListener('input', renderProjects);
document.querySelector('.mobile-filter-trigger').addEventListener('click', (event) => {
  const panel = document.querySelector('#filter-panel');
  const open = panel.classList.toggle('is-open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});
window.addEventListener('resize', layoutProjectCards);
renderFolders();
renderProjects();
