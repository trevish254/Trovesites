let vercelMetricsRefreshTimer;

window.renderCmsUi = (dashboard) => {
  dashboard.className = 'cms-dashboard-shell';
  dashboard.hidden = false;
  dashboard.innerHTML = `
    <header class="site-header cms-site-header">
      <a class="identity" href="../index.html#top" aria-label="Trovesites home"><img src="../assets/trovesites-logo.jpg" alt="Trovesites"><span>Trovesites</span></a>
      <nav class="main-nav" aria-label="Main navigation"><a href="../index.html#portfolio">Libraries</a><a href="../pricing/index.html">Pricing</a><a href="../about/index.html">About us</a><a href="../contact/index.html">Contact us</a></nav>
      <div class="header-actions"><div class="socials" aria-label="Social links"><a href="#dribbble" aria-label="Dribbble">◈</a><a href="#x" aria-label="X">X</a><a href="#instagram" aria-label="Instagram">◎</a></div><button class="contact-button cms-signout-button" id="signout-button" type="button">Sign out</button></div>
      <button class="mobile-filter-trigger" type="button" aria-label="Open filters" aria-controls="filter-panel" aria-expanded="false">☰</button>
    </header>
    <div class="cms-dashboard-layout">
      <aside class="filter-panel cms-dashboard-sidebar" id="filter-panel" aria-label="CMS navigation">
        <div class="search-box"><label for="project-search">Search CMS</label><div class="search-input-wrap"><input id="project-search" type="search" autocomplete="off"><span aria-hidden="true">⌕</span></div></div>
        <section class="filter-section"><h2>Overview</h2><button class="filter-link is-active" type="button">⌂&nbsp; Dashboard</button></section>
        <section class="filter-section"><h2>Content</h2><button class="filter-link" type="button">✎&nbsp; Content</button><button class="filter-link" type="button">▤&nbsp; Site Content</button><button class="filter-link" type="button">▱&nbsp; Pages</button><button class="filter-link" type="button">▧&nbsp; Media Library</button></section>
        <section class="filter-section"><h2>Operations</h2><button class="filter-link" type="button">☷&nbsp; Project Management</button><button class="filter-link" type="button">♧&nbsp; Agents</button></section>
        <section class="filter-section"><h2>Administration</h2><button class="filter-link" type="button">♙&nbsp; Users</button><button class="filter-link" type="button">♙&nbsp; User Access</button><button class="filter-link" type="button">▤&nbsp; Billing</button><button class="filter-link" type="button">▥&nbsp; Reports</button><button class="filter-link" type="button">⚙&nbsp; System</button><button class="filter-link" type="button">⚙&nbsp; Settings</button></section>
        <div class="sidebar-actions"><a href="../index.html#portfolio">View public library</a><span class="cms-sidebar-status">Admin mode</span></div>
      </aside>
      <main class="cms-dashboard-content" id="cms-dashboard-content">
        <div class="cms-dashboard-heading"><div><h1>Admin Analytics Dashboard</h1></div></div>
        <section class="cms-kpi-grid" aria-label="Analytics summary">
          <article class="cms-kpi-card"><div class="cms-kpi-top"><span>Total Users</span><span>♧</span></div><strong>2,845</strong><small class="positive">▲ +2.8%</small></article>
          <article class="cms-kpi-card"><div class="cms-kpi-top"><span>Total Projects</span><span>□</span></div><strong>1,512</strong><small class="positive">▲ +0.07%</small></article>
          <article class="cms-kpi-card"><div class="cms-kpi-top"><span>Total Media Items</span><span>▧</span></div><strong>8,910</strong><small class="positive">▲ +2.0%</small></article>
          <article class="cms-kpi-card"><div class="cms-kpi-top"><span>Revenue (Month)</span><span>$</span></div><strong>$12,500</strong><small class="negative">▼ -2.7%</small></article>
          <article class="cms-kpi-card"><div class="cms-kpi-top"><span>Active Agents</span><span>♧</span></div><strong>24</strong><small class="positive">▲ +28%</small></article>
        </section>
        <section class="cms-dashboard-grid cms-dashboard-grid-top">
          <article class="cms-panel cms-growth-panel"><header><div><h2>User Growth over 6 Months</h2></div><label>Date Range: <select><option>Last 6 Months</option><option>Last Year</option></select></label></header><div class="cms-line-chart"><svg viewBox="0 0 620 225" role="img" aria-label="User growth line chart"><defs><linearGradient id="growth-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#a9b9ad" stop-opacity=".45"></stop><stop offset="1" stop-color="#a9b9ad" stop-opacity="0"></stop></linearGradient></defs><path class="chart-area" d="M38 181 L130 145 L222 119 L314 92 L406 59 L498 35 L580 12 L580 181 Z"></path><path class="chart-line" d="M38 181 L130 145 L222 119 L314 92 L406 59 L498 35 L580 12"></path><g class="chart-dots"><circle cx="38" cy="181" r="4"></circle><circle cx="130" cy="145" r="4"></circle><circle cx="222" cy="119" r="4"></circle><circle cx="314" cy="92" r="4"></circle><circle cx="406" cy="59" r="4"></circle><circle cx="498" cy="35" r="4"></circle><circle cx="580" cy="12" r="4"></circle></g><g class="chart-labels"><text x="112" y="136">37.31</text><text x="203" y="110">56.80</text><text x="300" y="83">89.30</text><text x="488" y="26">111.50</text></g></svg><div class="chart-x-labels"><span>Jan 2021</span><span>Feb 2021</span><span>Oct 2021</span><span>Apr 2022</span><span>May 2022</span><span>Jun 2022</span></div></div></article>
          <article class="cms-panel cms-traffic-panel"><header><h2>Traffic Sources</h2></header><div class="cms-donut"></div><div class="cms-legend"><span><i class="c1"></i>Direct</span><span><i class="c2"></i>Organic Search</span><span><i class="c3"></i>Referral</span><span><i class="c4"></i>Social</span></div></article>
          <article class="cms-panel cms-viewed-panel"><header><h2>Most Frequently Viewed Components</h2></header><div class="cms-ranking"><div><span>Color Palettes</span><b>20</b><i><em style="width:92%"></em></i></div><div><span>Form Fields</span><b>13</b><i><em style="width:70%"></em></i></div><div><span>Layouts</span><b>12</b><i><em style="width:65%"></em></i></div><div><span>Insert Comps</span><b>10</b><i><em style="width:55%"></em></i></div><div><span>Sections</span><b>9</b><i><em style="width:48%"></em></i></div><div><span>Others</span><b>3</b><i><em style="width:20%"></em></i></div></div></article>
        </section>
        <section class="cms-dashboard-grid cms-dashboard-grid-bottom">
          <article class="cms-panel cms-bar-panel"><header><h2>Project Creations by Month</h2><select><option>New Months</option><option>Last 6 Months</option></select></header><div class="cms-bar-chart"><span style="height:33%"></span><span style="height:62%"></span><span style="height:78%"></span><span style="height:90%"></span><span style="height:48%"></span><span style="height:40%"></span><span style="height:78%"></span><span style="height:84%"></span><span style="height:97%"></span><span style="height:68%"></span></div></article>
          <article class="cms-panel cms-activity-panel"><header><h2>Recent Agent Activity</h2><button type="button">View Projects⌄</button></header><table><thead><tr><th>Agent Name</th><th>Action</th><th>Project</th><th>Timestamp</th></tr></thead><tbody><tr><td>Agent Name</td><td><a href="#">View Project</a></td><td><a href="#">View Project</a></td><td>2023-01-03 15:39</td></tr><tr><td>Agent Name</td><td><a href="#">View Project</a></td><td><a href="#">View Project</a></td><td>2023-07-02 15:39</td></tr><tr><td>Agent Name</td><td><a href="#">View Project</a></td><td><a href="#">View Project</a></td><td>2023-07-02 15:39</td></tr><tr><td>Agent Name</td><td><a href="#">View Project</a></td><td><a href="#">View Project</a></td><td>2023-01-01 15:39</td></tr></tbody></table></article>
        </section>
      </main>
    </div>`;
  const cmsHeaderActions = dashboard.querySelector('.cms-site-header .header-actions');
  if (cmsHeaderActions && !cmsHeaderActions.querySelector('.cms-theme-toggle')) {
    const themeToggle = document.createElement('button');
    themeToggle.type = 'button';
    themeToggle.className = 'theme-toggle cms-theme-toggle';
    themeToggle.setAttribute('aria-label', document.documentElement.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem('trovesites-theme', nextTheme);
      themeToggle.setAttribute('aria-label', nextTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    });
    cmsHeaderActions.insertBefore(themeToggle, cmsHeaderActions.querySelector('#signout-button'));
  }
  window.troveActiveCmsView = 'dashboard';
  window.setTimeout(() => {
    loadDashboardSummary().then(loadDashboardRevenue);
    loadDashboardCharts();
    loadVercelMetrics('dashboard');
  }, 0);
  const content = dashboard.querySelector('#cms-dashboard-content');
  if (content) content.dataset.dashboardMarkup = content.innerHTML;
};

async function loadVercelMetrics(view = 'dashboard') {
  const content = document.querySelector('#cms-dashboard-content');
  const client = window.troveSupabase;
  if (!content || !client) return;
  window.troveActiveCmsView = view;
  window.clearTimeout(vercelMetricsRefreshTimer);
  content.querySelector('.cms-vercel-live-panel')?.remove();

  const panel = document.createElement('section');
  panel.className = 'cms-vercel-live-panel cms-content-card cms-user-loading';
  panel.innerHTML = '<div class="cms-content-card-icon">V</div><div><h2>Loading Vercel data</h2><p>Checking deployment health…</p></div>';
  content.append(panel);

  const config = window.troveSupabaseConfig || {};
  const { data: sessionData } = await client.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) {
    panel.innerHTML = '<div class="cms-content-card-icon">V</div><div><h2>Vercel data unavailable</h2><p>Your admin session has expired. Sign in again to view deployment data.</p></div>';
    return;
  }

  try {
    const response = await fetch(`${config.url || client.supabaseUrl}/functions/v1/vercel-metrics`, {
      headers: {
        apikey: config.anonKey || client.supabaseKey,
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Vercel API request failed');
    if (view === 'system') applySystemMetrics(result);

    const latest = result.latest;
    const summary = result.summary || {};
    const state = latest?.state || 'UNKNOWN';
    const statusLabel = state === 'READY' ? 'Operational' : state === 'ERROR' ? 'Build failed' : state;
    const latestTime = latest?.created ? new Date(latest.created).toLocaleString() : 'No deployments found';
    const averageBuild = summary.averageBuildMs == null ? '—' : `${(summary.averageBuildMs / 1000).toFixed(1)}s`;
    const rows = (result.deployments || []).slice(0, 5).map((deployment) => {
      const deploymentState = deployment.state || 'UNKNOWN';
      const created = deployment.created ? new Date(deployment.created).toLocaleString() : '—';
      return `<tr><td>${escapeHtml(deployment.target || 'preview')}</td><td><span class="cms-service-status ${deploymentState === 'READY' ? '' : 'is-warning'}"><i></i>${escapeHtml(deploymentState)}</span></td><td>${escapeHtml(created)}</td><td>${escapeHtml(deployment.url || '—')}</td></tr>`;
    }).join('');

    panel.className = 'cms-vercel-live-panel cms-panel';
    panel.innerHTML = `<header><div><span class="cms-section-label">Vercel / ${escapeHtml(view)}</span><h2>Deployment health</h2><span>Live project data from Vercel · Updated ${escapeHtml(new Date(result.fetchedAt).toLocaleTimeString())} · Auto-refreshes every 30 seconds</span></div><span class="cms-system-live ${state === 'READY' ? '' : 'is-warning'}"><i></i>${escapeHtml(statusLabel)}</span></header><div class="cms-vercel-summary"><article><span>Latest deployment</span><strong>${escapeHtml(state)}</strong><small>${escapeHtml(latestTime)}</small></article><article><span>Deployments checked</span><strong>${summary.total ?? 0}</strong><small>${summary.successful ?? 0} successful</small></article><article><span>Failed deployments</span><strong>${summary.failed ?? 0}</strong><small>Last 20 deployments</small></article><article><span>Average build</span><strong>${escapeHtml(averageBuild)}</strong><small>Successful builds</small></article></div>${rows ? `<div class="cms-vercel-deployments"><h3>Recent deployments</h3><div class="cms-project-table"><table><thead><tr><th>Target</th><th>Status</th><th>Created</th><th>URL</th></tr></thead><tbody>${rows}</tbody></table></div></div>` : '<p class="cms-vercel-empty">No Vercel deployments were returned for this project.</p>'}`;
    vercelMetricsRefreshTimer = window.setTimeout(() => {
      if (document.visibilityState === 'visible' && window.troveActiveCmsView === view) loadVercelMetrics(view);
    }, 30000);
  } catch (error) {
    panel.innerHTML = `<div class="cms-content-card-icon">V</div><div><h2>Vercel data unavailable</h2><p>${escapeHtml(error.message || 'Unable to load deployment data.')}</p></div>`;
  }
}

function applySystemMetrics(result) {
  const health = result.health || {};
  const checks = [health.website, health.supabase].filter(Boolean);
  const averageResponse = checks.length ? Math.round(checks.reduce((total, check) => total + (check.responseMs || 0), 0) / checks.length) : null;
  const operational = checks.length > 0 && checks.every((check) => check.ok);
  const summary = document.querySelectorAll('.cms-system-summary article');
  if (summary[0]) summary[0].innerHTML = `<span>System status</span><strong>${operational ? 'Online' : 'Degraded'}</strong><small class="${operational ? 'positive' : 'pending'}">Live health check</small>`;
  if (summary[1]) summary[1].innerHTML = `<span>Avg. response time</span><strong>${averageResponse == null ? '—' : `${averageResponse}ms`}</strong><small>${health.checkedAt ? 'Measured just now' : 'No measurement'}</small>`;
  if (summary[2]) summary[2].innerHTML = '<span>API requests</span><strong>—</strong><small>Provider metrics not connected</small>';
  if (summary[3]) summary[3].innerHTML = '<span>Storage used</span><strong>—</strong><small>Storage metrics not connected</small>';

  const headerStatus = document.querySelector('.cms-system-actions .cms-system-live');
  if (headerStatus) {
    headerStatus.classList.toggle('is-warning', !operational);
    headerStatus.innerHTML = `<i></i>${operational ? 'All systems operational' : 'Service attention needed'}`;
  }

  const serviceRows = document.querySelectorAll('.cms-services-list article');
  const serviceChecks = [health.website, health.supabase, null, health.supabase];
  serviceRows.forEach((row, index) => {
    const check = serviceChecks[index];
    const status = row.querySelector('.cms-service-status');
    const uptime = row.querySelector('.cms-service-uptime');
    if (!status || !uptime) return;
    if (!check) {
      uptime.textContent = '—';
      status.classList.add('is-warning');
      status.innerHTML = '<i></i>Not measured';
      return;
    }
    uptime.textContent = `${check.responseMs}ms`;
    status.classList.toggle('is-warning', !check.ok);
    status.innerHTML = `<i></i>${check.ok ? 'Operational' : 'Unavailable'}`;
  });
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('.cms-dashboard-sidebar .filter-link');
  if (!button) return;
  const label = button.textContent.replace(/[^a-zA-Z ]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');
  const view = label.includes('dashboard') ? 'dashboard' : label.includes('site content') ? 'site content' : label.includes('content') ? 'content' : label;
  window.troveActiveCmsView = view;
  const titles = {
    content: ['Content', 'Manage projects, folders, and reusable content.'],
    'site content': ['Site Content', 'Manage the content displayed across the public site.'],
    pages: ['Pages', 'Organize and publish site pages.'],
    'media library': ['Media Library', 'Manage images and other reusable media assets.'],
    'project management': ['Project Management', 'Track projects and their publishing status.'],
    agents: ['Agents', 'Manage the agents connected to your workspace.'],
    users: ['Users', 'View and manage workspace users.'],
    'user access': ['User Access', 'Control roles and permissions for your workspace.'],
    billing: ['Billing', 'Review billing and subscription information.'],
    reports: ['Reports', 'Review activity and performance reports.'],
    system: ['System', 'Manage system-level CMS configuration.'],
    settings: ['Settings', 'Configure your CMS workspace preferences.']
  };
  if (view !== 'dashboard' && !titles[view]) return;

  document.querySelectorAll('.cms-dashboard-sidebar .filter-link').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  const content = document.querySelector('#cms-dashboard-content');
  if (!content) return;
  if (view === 'dashboard') {
    if (content.dataset.dashboardMarkup) content.innerHTML = content.dataset.dashboardMarkup;
    loadDashboardSummary().then(loadDashboardRevenue);
    loadDashboardCharts();
    loadVercelMetrics('dashboard');
    return;
    content.innerHTML = `<div class="cms-projects-head"><h1>Content Management - All Projects</h1><div class="cms-project-actions"><button class="cms-page-action" type="button">Add New Project</button><select><option>Drafts</option><option>Live</option><option>All projects</option></select></div></div><div class="cms-project-filters"><label>Site Section<select><option>Dropdown</option>${folders.map(([name]) => `<option>${name}</option>`).join('')}</select></label><label>Publish Status<select><option>Dropdown</option><option>Live</option><option>Draft</option></select></label><label class="cms-project-search"><input type="search" placeholder="Search"><span>⌕</span></label></div><label class="cms-add-item"><input type="checkbox"> Add new element</label><div class="cms-project-grid">${folders.slice(0, 4).map(([name, count, first, second], index) => `<article class="cms-project-card"><header><label><input type="checkbox"> ${name} - Project Management</label><span class="cms-project-state ${index === 1 || index === 3 ? 'is-draft' : ''}">${index === 1 || index === 3 ? 'Draft' : 'Live'}</span></header><div class="cms-project-card-body"><div class="cms-project-preview"><div class="folder-stack"><div class="folder-paper folder-paper-left"><img src="${first}" alt=""></div><div class="folder-paper folder-paper-right"><img src="${second}" alt=""></div><div class="folder-paper folder-paper-front"><img src="${first}" alt="${name} preview"></div><span class="folder-badge">${count}</span><span class="folder-clip" aria-hidden="true"></span></div></div><div class="cms-project-editor"><button class="cms-project-pencil" type="button" aria-label="Edit ${name}">edit</button><label>Project name: <input value="${name}" /></label><label>Brief description <textarea>Brief description or brand thoughtful experiences</textarea></label><span>Tags</span><div class="cms-project-tags"><i>NO-CODE x</i><i>UI KIT</i><i>LOGO</i><i>CONCEPT ART x</i><i>AI PROMPT x</i><i>TEMPLATE x</i><i>PRINT</i></div><span>Bulk actions</span><div class="cms-project-bulk"><button type="button">Add to Components</button><button type="button">Assign to Agent</button><b>x</b></div></div></div></article>`).join('')}</div>`;
    return;
  }
  if (view === 'users') {
    loadRealUsers(content);
    return;
  }
  if (view === 'project management') {
    loadRealProjects(content);
    return;
  }
  if (!content.dataset.dashboardMarkup) content.dataset.dashboardMarkup = content.innerHTML;
  const [title, description] = titles[view];
  if (view === 'content') {
    const folders = [
      ['Templates', 6, 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024'],
      ['Components', 4, 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122'],
      ['Sections', 12, 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024', 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004'],
      ['Backgrounds', 3, 'https://framerusercontent.com/images/PmMTtBWdns9q73sBmlgu6h7pB0.png?width=1122&height=1402', 'https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004'],
      ['Branding', 12, 'https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122'],
      ['Automations', 9, 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024', 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004']
    ];
    content.innerHTML = `<div class="cms-content-library-head"><span class="cms-section-label">Admin workspace</span><button class="cms-page-action" type="button">New project</button></div><div class="cms-folder-grid">${folders.map(([name, count, first, second]) => `<article class="cms-folder-card"><div class="folder-stack"><div class="folder-paper folder-paper-left"><img src="${first}" alt=""></div><div class="folder-paper folder-paper-right"><img src="${second}" alt=""></div><div class="folder-paper folder-paper-front"><img src="${first}" alt="${name} preview"></div><span class="folder-badge">${count}</span><span class="folder-clip" aria-hidden="true"></span></div><div class="cms-folder-title"><h2>${name}</h2><button class="cms-folder-edit" type="button" aria-label="Edit ${name}" title="Edit ${name}">✎</button></div></article>`).join('')}</div>`;
    window.troveCmsFolders = folders;
    content.innerHTML = `<div class="cms-content-library-head"><span class="cms-section-label">Admin workspace</span><button class="cms-page-action cms-new-folder" type="button">New folder</button></div><div class="cms-folder-grid cms-managed-folder-grid">${folders.map(([name, count, first, second], index) => `<article class="cms-folder-card cms-managed-folder" data-folder-index="${index}"><div class="folder-stack"><div class="folder-paper folder-paper-left"><img src="${first}" alt=""></div><div class="folder-paper folder-paper-right"><img src="${second}" alt=""></div><div class="folder-paper folder-paper-front"><img src="${first}" alt="${name} preview"></div><span class="folder-badge">${count}</span><span class="folder-clip" aria-hidden="true"></span></div><div class="cms-folder-title"><h2>${name}</h2><button class="cms-folder-edit" type="button" data-folder-action="rename" aria-label="Rename ${name}" title="Rename folder">edit</button></div><div class="cms-folder-reorder"><button type="button" data-folder-action="left" title="Move left">←</button><button type="button" data-folder-action="right" title="Move right">→</button></div></article>`).join('')}</div>`;
    return;
  }
  if (view === 'project management') {
    const projectRows = [
      ['Atreelie', 'Website design', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122'],
      ['Atreelie', 'Website design', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122'],
      ['Along the Coast', 'Website', 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024'],
      ['Reverie', 'Website design', 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004']
    ];
    content.innerHTML = `<div class="cms-management-layout"><section class="cms-management-main"><div class="cms-management-heading"><h1>Manage Project Templates</h1><div class="cms-management-tools"><label><span>⌕</span><input type="search" placeholder="Search"></label><button type="button">⚱</button><button type="button">▥</button><button type="button">☷</button></div></div><div class="cms-management-actions"><button class="cms-create-project" type="button">Create New Project</button><button class="cms-filter-tags" type="button">Filter Tags⌄</button></div><div class="cms-project-table"><table><thead><tr><th><input type="checkbox"></th><th>Name</th><th>Category</th><th>Status</th><th>Last Updated ↕</th><th>Actions</th></tr></thead><tbody>${projectRows.map(([name, category, image], index) => `<tr><td><input type="checkbox" ${index === 1 ? 'checked' : ''}></td><td><img src="${image}" alt=""><strong>${name}</strong></td><td>${category}</td><td><span class="cms-status-dot">●</span> Draft</td><td>July 13, 2026</td><td><div class="cms-row-actions"><button type="button" title="Edit">✎</button><button type="button" title="Duplicate">▣</button><button type="button" title="Archive">▤</button><button class="is-danger" type="button" title="Delete">♧</button></div></td></tr>`).join('')}</tbody></table><footer><span>New page</span><button disabled>‹|</button><button class="is-current">1</button><button>›</button><button>›|</button></footer></div><div class="cms-management-panels"><section><h2>Content Settings</h2><div class="cms-chip-list"><i>Hero</i><i>Landing Page</i><i>Concept ART</i><i>AI</i><i>AI PROMPT</i><i>STOCK PHOTO</i><i>TEMPLATE</i></div></section><section><h2>Categories</h2><p class="is-selected">All projects</p><p>Templates</p><p>Components</p><p>Sections</p><p>Backgrounds</p><p>Branding</p></section><section><h2>LATEST AGENCY WORK</h2><p>▣ Client: Luxury Stay branding</p><p>▣ Digital Art Series</p><p>▣ Digital Art Series</p></section><section><h2>User Prompts</h2><p>We craft timeless brands and thoughtful experiences.</p><p>We craft timeless brands and thoughtful experiences.</p></section></div></section><aside class="cms-edit-project"><header><h2>Edit Project</h2><button type="button">×</button></header><label>Project Name<input value="Atreelie"></label><label>Category<select><option>Templates, Components</option><option>Website design</option></select></label><label>Tags<div class="cms-edit-tags"><i>Hero</i><i>Landing Page</i><i>SaaS</i><i>Agency</i><i>Creative</i><i>Technology</i></div></label><label>Primary Image<div class="cms-primary-image"><img src="https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122" alt=""><button type="button">Crop/Resize</button></div><button class="cms-upload" type="button">↥ Upload Image</button></label><label>Text Prompt<textarea>We craft timeless brands and thoughtful experiences. Design with purpose.</textarea></label><label>Project<input value="Atreelie"></label><label>Metadata<select><option>Templates</option><option>Components</option></select></label></aside></div>`;
    return;
  }
  if (view === 'agents') {
    loadRealAgents(content);
    return;
    /* Legacy placeholder agent layout retained below for reference. */
    const agents = [['Maya Chen', 'Creative director', 'maya@trovesites.com', 'Active'], ['Jon Bell', 'Brand strategist', 'jon@trovesites.com', 'Active'], ['Amara Okafor', 'Visual designer', 'amara@trovesites.com', 'Away'], ['Eli Santos', 'Content editor', 'eli@trovesites.com', 'Active']];
    content.innerHTML = `<div class="cms-agents-page"><div class="cms-agents-heading"><div><span class="cms-section-label">Operations / Agents</span><h1>Agent workspace</h1><p>Coordinate the people shaping your Trovesites library.</p></div><button class="cms-page-action" type="button">Invite agent</button></div><section class="cms-agent-stats"><article><span>Total agents</span><strong>24</strong><small class="positive">▲ +28% this month</small></article><article><span>Active now</span><strong>18</strong><small>Across 6 projects</small></article><article><span>Assigned projects</span><strong>42</strong><small>8 awaiting review</small></article><article><span>Avg. response</span><strong>2.4h</strong><small class="positive">▲ 12% faster</small></article></section><div class="cms-agents-toolbar"><label><span>⌕</span><input type="search" placeholder="Search agents"></label><select><option>All roles</option><option>Design</option><option>Strategy</option><option>Content</option></select><select><option>All status</option><option>Active</option><option>Away</option></select></div><section class="cms-agent-directory"><header><h2>Agent directory</h2><span>24 agents</span></header><div class="cms-agent-list">${agents.map(([name, role, email, status], index) => `<article class="cms-agent-row"><div class="cms-agent-avatar avatar-${index}">${name.split(' ').map((part) => part[0]).join('')}</div><div class="cms-agent-identity"><strong>${name}</strong><span>${role}</span><small>${email}</small></div><span class="cms-agent-status ${status === 'Away' ? 'is-away' : ''}"><i></i>${status}</span><div class="cms-agent-project"><span>Current project</span><strong>${['Luxury Stay branding', 'Digital Art Series', 'Along the Coast', 'Atreelie'][index]}</strong></div><button class="cms-agent-more" type="button">•••</button></article>`).join('')}</div></section><section class="cms-agent-bottom"><article><header><h2>Recent agent activity</h2><button type="button">View all</button></header><p><b>Maya Chen</b> updated <u>Luxury Stay branding</u><time>12 min ago</time></p><p><b>Jon Bell</b> submitted a project for review<time>48 min ago</time></p><p><b>Amara Okafor</b> added 8 media items<time>2 hrs ago</time></p></article><article><header><h2>Workload overview</h2><span>This month⌄</span></header><div class="cms-workload"><span style="height:62%"></span><span style="height:45%"></span><span style="height:80%"></span><span style="height:54%"></span><span style="height:92%"></span><span style="height:70%"></span><span style="height:84%"></span></div></article></section></div>`;
    return;
  }
  if (view === 'users') {
    const users = [['Trevis Murishti', 'trevishmurishti@gmail.com', 'Admin', 'Active', 'Today, 9:42 AM'], ['Kevin Projects', 'kevvprojects@gmail.com', 'Admin', 'Active', 'Today, 8:18 AM'], ['Maya Chen', 'maya@trovesites.com', 'Editor', 'Active', 'Yesterday, 4:06 PM'], ['Jon Bell', 'jon@trovesites.com', 'Viewer', 'Invited', 'Sep 18, 2026'], ['Amara Okafor', 'amara@trovesites.com', 'Editor', 'Active', 'Sep 16, 2026']];
    content.innerHTML = `<div class="cms-users-page"><div class="cms-users-heading"><div><span class="cms-section-label">Administration / Users</span><h1>Manage Users</h1><p>Invite people, assign roles, and manage workspace access.</p></div><button class="cms-page-action" type="button">Invite user</button></div><section class="cms-user-stats"><article><span>Total users</span><strong>2,845</strong><small class="positive">▲ +2.8% this month</small></article><article><span>Active users</span><strong>2,416</strong><small>85% of your workspace</small></article><article><span>Admins</span><strong>8</strong><small>Full workspace access</small></article><article><span>Pending invites</span><strong>12</strong><small class="pending">Awaiting response</small></article></section><div class="cms-users-toolbar"><label><span>⌕</span><input type="search" placeholder="Search users by name or email"></label><select><option>All roles</option><option>Admin</option><option>Editor</option><option>Viewer</option></select><select><option>All status</option><option>Active</option><option>Invited</option><option>Suspended</option></select></div><section class="cms-users-directory"><header><div><h2>Workspace users</h2><span>Showing 5 of 2,845 users</span></div><button type="button">Export users</button></header><div class="cms-users-table"><table><thead><tr><th><input type="checkbox"></th><th>User</th><th>Role</th><th>Status</th><th>Last active</th><th>Actions</th></tr></thead><tbody>${users.map(([name, email, role, status, active], index) => `<tr><td><input type="checkbox"></td><td><div class="cms-user-cell"><span class="cms-user-avatar user-avatar-${index}">${name.split(' ').map((part) => part[0]).join('')}</span><span><strong>${name}</strong><small>${email}</small></span></div></td><td><span class="cms-role-pill">${role}</span></td><td><span class="cms-user-status ${status === 'Invited' ? 'is-invited' : ''}"><i></i>${status}</span></td><td>${active}</td><td><button class="cms-user-more" type="button">•••</button></td></tr>`).join('')}</tbody></table></div><footer><span>Rows per page: 5</span><button disabled>‹</button><button class="is-current">1</button><button>2</button><button>3</button><button>›</button></footer></section><section class="cms-user-bottom"><article><header><h2>Role distribution</h2><span>All users</span></header><div class="cms-role-bars"><p><span>Admin</span><b>8</b><i><em style="width:18%"></em></i></p><p><span>Editor</span><b>36</b><i><em style="width:52%"></em></i></p><p><span>Viewer</span><b>124</b><i><em style="width:78%"></em></i></p></div></article><article><header><h2>Access activity</h2><button type="button">View report</button></header><p><b>48</b> new users joined this month</p><p><b>18</b> invitations are still pending</p><p><b>6</b> access changes made this week</p></article></section></div>`;
    return;
  }
  if (view === 'user access') {
    const roles = [['Admin', 'Full workspace access', '8 users', 'is-admin'], ['Editor', 'Create and manage content', '36 users', ''], ['Viewer', 'Read-only workspace access', '124 users', ''], ['Agent', 'Assigned project access', '18 users', '']];
    const permissions = [['Projects', 'Create, edit, publish'], ['Media library', 'Upload, edit, organize'], ['Site content', 'Edit public content'], ['Users', 'Invite and manage users'], ['Reports', 'View workspace reports'], ['Billing', 'Manage subscription']];
    content.innerHTML = `<div class="cms-access-page"><div class="cms-access-heading"><div><span class="cms-section-label">Administration / User Access</span><h1>Access & permissions</h1><p>Control what each role can see and do across the workspace.</p></div><button class="cms-page-action" type="button">Create role</button></div><section class="cms-access-summary"><article><span>Roles</span><strong>4</strong><small>Workspace roles</small></article><article><span>Members</span><strong>186</strong><small>Across all roles</small></article><article><span>Custom rules</span><strong>12</strong><small class="positive">▲ 3 this month</small></article><article><span>Pending review</span><strong>6</strong><small class="pending">Needs attention</small></article></section><div class="cms-access-grid"><section class="cms-role-directory"><header><div><h2>Workspace roles</h2><span>Choose a role to review its permissions</span></div><button type="button">＋ Add role</button></header><div class="cms-role-list">${roles.map(([name, description, users, style], index) => `<button class="cms-role-row ${index === 0 ? 'is-selected' : ''}" type="button"><span class="cms-role-icon ${style}">${name.slice(0, 1)}</span><span><strong>${name}</strong><small>${description}</small></span><b>${users}</b><em>›</em></button>`).join('')}</div></section><section class="cms-permission-panel"><header><div><span class="cms-section-label">Selected role</span><h2>Admin permissions</h2><p>Full access to all Trovesites workspace features.</p></div><button class="cms-outline-action" type="button">Edit role</button></header><div class="cms-permission-list">${permissions.map(([name, description]) => `<label><span><strong>${name}</strong><small>${description}</small></span><input type="checkbox" checked><i></i></label>`).join('')}</div></section></div><section class="cms-access-bottom"><article><header><h2>Recent access changes</h2><button type="button">View audit log</button></header><p><b>Kevin Projects</b> assigned <strong>Editor</strong> role to Maya Chen<time>Today, 8:18 AM</time></p><p><b>Trevis Murishti</b> updated Admin permissions<time>Yesterday, 4:06 PM</time></p><p><b>Kevin Projects</b> invited Jon Bell as Viewer<time>Sep 18, 2026</time></p></article><article><header><h2>Access guidelines</h2></header><div class="cms-access-note"><span>✦</span><p>Keep administrator access limited to people who manage workspace settings and user permissions.</p></div><button class="cms-learn-more" type="button">Learn about roles and permissions →</button></article></section></div>`;
    return;
  }
  if (view === 'billing') {
    renderCmsBilling(content);
    loadCmsBilling(content);
    return;
  }
  if (view === 'billing legacy') {
    const invoices = [['INV-2026-09', 'September 2026', '$49.00', 'Paid'], ['INV-2026-08', 'August 2026', '$49.00', 'Paid'], ['INV-2026-07', 'July 2026', '$49.00', 'Paid'], ['INV-2026-06', 'June 2026', '$49.00', 'Paid']];
    content.innerHTML = `<div class="cms-billing-page"><div class="cms-billing-heading"><div><span class="cms-section-label">Administration / Billing</span><h1>Billing & subscription</h1><p>Manage your plan, payment details, and workspace invoices.</p></div><button class="cms-page-action" type="button">Manage plan</button></div><section class="cms-billing-summary"><article><span>Current plan</span><strong>Studio</strong><small>Renews October 1, 2026</small></article><article><span>Monthly total</span><strong>$49</strong><small>USD / month</small></article><article><span>Team members</span><strong>18 / 25</strong><small>7 seats available</small></article><article><span>Next payment</span><strong>$49.00</strong><small class="positive">Scheduled</small></article></section><div class="cms-billing-grid"><section class="cms-plan-card"><header><div><span class="cms-section-label">Your subscription</span><h2>Studio plan</h2><p>Everything you need to manage and grow your creative workspace.</p></div><span class="cms-plan-badge">Active</span></header><div class="cms-plan-price"><strong>$49</strong><span>/ month</span></div><div class="cms-plan-features"><p><i>✓</i> Up to 25 team members</p><p><i>✓</i> Unlimited projects and media</p><p><i>✓</i> Advanced access controls</p><p><i>✓</i> Priority support</p></div><div class="cms-plan-actions"><button class="cms-page-action" type="button">Change plan</button><button class="cms-outline-action" type="button">Cancel subscription</button></div></section><section class="cms-usage-card"><header><div><h2>Workspace usage</h2><span>Current billing period</span></div><button type="button">View details</button></header><div class="cms-usage-row"><div><span>Team members</span><b>18 of 25</b></div><i><em style="width:72%"></em></i></div><div class="cms-usage-row"><div><span>Storage</span><b>68 GB of 100 GB</b></div><i><em style="width:68%"></em></i></div><div class="cms-usage-row"><div><span>Projects</span><b>42 of unlimited</b></div><i><em style="width:34%"></em></i></div><div class="cms-usage-note"><span>✦</span><p>Your workspace is running smoothly. You have room for 7 more team members.</p></div></section></div><section class="cms-payment-invoices"><section class="cms-payment-card"><header><h2>Payment method</h2><button type="button">Edit</button></header><div class="cms-payment-method"><span class="cms-card-brand">VISA</span><div><strong>•••• 4242</strong><small>Expires 08 / 2028</small></div><span class="cms-payment-default">Default</span></div><button class="cms-add-payment" type="button">＋ Add payment method</button></section><section class="cms-invoices-card"><header><div><h2>Recent invoices</h2><span>Download your billing history</span></div><button type="button">View all</button></header><table><thead><tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>${invoices.map(([id, date, amount, status]) => `<tr><td>${id}</td><td>${date}</td><td>${amount}</td><td><span class="cms-invoice-status">${status}</span></td><td><button class="cms-download-invoice" type="button">↓</button></td></tr>`).join('')}</tbody></table></section></section></div>`;
    return;
  }
  if (view === 'reports') {
    loadRealReports(content);
    return;
    /* Legacy placeholder report layout retained below for reference. */
    const reportRows = [['Client: Luxury Stay branding', 'Branding', '2,418', '8m 42s', '+18.4%'], ['Digital Art Series', 'Illustration', '1,906', '6m 18s', '+12.7%'], ['Along the Coast', 'Website', '1,642', '5m 54s', '+9.2%'], ['Atreelie', 'Website design', '1,284', '4m 36s', '+6.8%']];
    content.innerHTML = `<div class="cms-reports-page"><div class="cms-reports-heading"><div><span class="cms-section-label">Analytics / Reports</span><h1>Workspace reports</h1><p>A considered view of how people discover and engage with your library.</p></div><div class="cms-reports-actions"><select><option>Last 30 days</option><option>Last 90 days</option><option>This year</option></select><button class="cms-page-action" type="button">Export report</button></div></div><section class="cms-report-stats"><article><div><span>Total visitors</span><b>42,861</b></div><small class="positive">▲ 18.6% <em>vs previous period</em></small><i class="cms-sparkline"><em style="height:35%"></em><em style="height:48%"></em><em style="height:41%"></em><em style="height:62%"></em><em style="height:57%"></em><em style="height:76%"></em><em style="height:92%"></em></i></article><article><div><span>Project views</span><b>18,492</b></div><small class="positive">▲ 12.4% <em>vs previous period</em></small><i class="cms-sparkline sparkline-sage"><em style="height:45%"></em><em style="height:38%"></em><em style="height:55%"></em><em style="height:49%"></em><em style="height:70%"></em><em style="height:67%"></em><em style="height:88%"></em></i></article><article><div><span>Avg. engagement</span><b>6m 24s</b></div><small class="positive">▲ 8.1% <em>vs previous period</em></small><i class="cms-sparkline sparkline-gold"><em style="height:60%"></em><em style="height:54%"></em><em style="height:69%"></em><em style="height:64%"></em><em style="height:79%"></em><em style="height:72%"></em><em style="height:96%"></em></i></article><article><div><span>Returning visitors</span><b>36.8%</b></div><small class="negative">▼ 2.4% <em>vs previous period</em></small><i class="cms-sparkline sparkline-rose"><em style="height:82%"></em><em style="height:76%"></em><em style="height:69%"></em><em style="height:71%"></em><em style="height:59%"></em><em style="height:52%"></em><em style="height:44%"></em></i></article></section><div class="cms-reports-main-grid"><section class="cms-report-chart"><header><div><h2>Audience growth</h2><span>Visitors and project views over time</span></div><select><option>Daily</option><option>Weekly</option></select></header><div class="cms-report-line"><div class="cms-report-y"><span>8k</span><span>6k</span><span>4k</span><span>2k</span><span>0</span></div><svg viewBox="0 0 720 230" role="img" aria-label="Audience growth chart"><defs><linearGradient id="report-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9caf9f" stop-opacity=".42"></stop><stop offset="1" stop-color="#9caf9f" stop-opacity="0"></stop></linearGradient></defs><path class="report-area" d="M8 188 L95 166 L182 174 L269 126 L356 142 L443 91 L530 108 L617 54 L708 28 L708 205 L8 205 Z"></path><path class="report-line" d="M8 188 L95 166 L182 174 L269 126 L356 142 L443 91 L530 108 L617 54 L708 28"></path><path class="report-line secondary" d="M8 197 L95 184 L182 188 L269 165 L356 173 L443 146 L530 152 L617 124 L708 112"></path><g class="report-dots"><circle cx="8" cy="188" r="3"></circle><circle cx="95" cy="166" r="3"></circle><circle cx="182" cy="174" r="3"></circle><circle cx="269" cy="126" r="3"></circle><circle cx="356" cy="142" r="3"></circle><circle cx="443" cy="91" r="3"></circle><circle cx="530" cy="108" r="3"></circle><circle cx="617" cy="54" r="3"></circle><circle cx="708" cy="28" r="3"></circle></g></svg><div class="cms-report-x"><span>Aug 24</span><span>Aug 31</span><span>Sep 7</span><span>Sep 14</span><span>Sep 20</span></div></div><footer><span><i class="legend-visitors"></i>Visitors</span><span><i class="legend-views"></i>Project views</span></footer></section><section class="cms-report-sources"><header><div><h2>Traffic sources</h2><span>Where your audience comes from</span></div><button type="button">View details</button></header><div class="cms-source-donut"></div><div class="cms-source-list"><p><span><i class="source-a"></i>Direct</span><b>38%</b></p><p><span><i class="source-b"></i>Organic search</span><b>27%</b></p><p><span><i class="source-c"></i>Social</span><b>21%</b></p><p><span><i class="source-d"></i>Referral</span><b>14%</b></p></div></section></div><section class="cms-report-performance"><header><div><h2>Top performing content</h2><span>Projects with the most engagement this period</span></div><button type="button">View all projects →</button></header><table><thead><tr><th>Project</th><th>Category</th><th>Views</th><th>Avg. engagement</th><th>Change</th></tr></thead><tbody>${reportRows.map(([project, category, views, engagement, change]) => `<tr><td><span class="cms-report-project-dot"></span><strong>${project}</strong></td><td>${category}</td><td>${views}</td><td>${engagement}</td><td class="cms-report-change">${change}</td></tr>`).join('')}</tbody></table></section></div>`;
    loadVercelMetrics('reports');
    return;
  }
  if (view === 'system') {
    const services = [['CMS application', 'All systems operational', '99.99%', 'Operational'], ['Authentication', 'Supabase Auth', '99.98%', 'Operational'], ['Media delivery', 'Asset delivery network', '99.97%', 'Operational'], ['Database', 'Primary workspace database', '99.99%', 'Operational']];
    content.innerHTML = `<div class="cms-system-page"><div class="cms-system-heading"><div><span class="cms-section-label">Administration / System</span><h1>System health</h1><p>Monitor performance, services, integrations, and workspace infrastructure.</p></div><div class="cms-system-actions"><span class="cms-system-live"><i></i>All systems operational</span><button class="cms-page-action" type="button">System settings</button></div></div><section class="cms-system-summary"><article><span>System uptime</span><strong>99.99%</strong><small class="positive">▲ 0.02% this month</small></article><article><span>Avg. response time</span><strong>184ms</strong><small class="positive">▼ 12ms from last week</small></article><article><span>API requests</span><strong>18.4k</strong><small>Last 24 hours</small></article><article><span>Storage used</span><strong>68%</strong><small>68 GB of 100 GB</small></article></section><div class="cms-system-main-grid"><section class="cms-services-card"><header><div><h2>Service status</h2><span>Live overview of your workspace services</span></div><button type="button">Refresh status</button></header><div class="cms-services-list">${services.map(([name, description, uptime]) => `<article><span class="cms-service-icon">✦</span><div><strong>${name}</strong><small>${description}</small></div><span class="cms-service-uptime">${uptime}</span><span class="cms-service-status"><i></i>Operational</span></article>`).join('')}</div></section><section class="cms-performance-card"><header><div><h2>Performance</h2><span>Average response time</span></div><select><option>Last 24 hours</option><option>Last 7 days</option></select></header><div class="cms-performance-value"><strong>184</strong><span>ms</span><small>Fast and healthy</small></div><div class="cms-performance-chart"><span style="height:36%"></span><span style="height:48%"></span><span style="height:42%"></span><span style="height:60%"></span><span style="height:50%"></span><span style="height:69%"></span><span style="height:57%"></span><span style="height:78%"></span><span style="height:64%"></span><span style="height:87%"></span><span style="height:72%"></span><span style="height:92%"></span></div><footer><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>Now</span></footer></section></div><div class="cms-system-bottom"><section class="cms-integrations-card"><header><div><h2>Connected services</h2><span>External services connected to Trovesites</span></div><button type="button">Manage</button></header><div class="cms-integrations-list"><article><span class="cms-integration-mark supabase-mark">S</span><div><strong>Supabase</strong><small>Database & authentication</small></div><span class="cms-connected">Connected</span></article><article><span class="cms-integration-mark google-mark">G</span><div><strong>Google</strong><small>OAuth sign-in provider</small></div><span class="cms-connected">Connected</span></article><article><span class="cms-integration-mark ngrok-mark">↗</span><div><strong>Ngrok</strong><small>Public preview tunnel</small></div><span class="cms-connected">Connected</span></article></div></section><section class="cms-system-activity"><header><h2>System activity</h2><button type="button">View logs</button></header><p><span class="cms-activity-dot is-green"></span>Authentication service checked <time>2 min ago</time></p><p><span class="cms-activity-dot is-green"></span>Database backup completed <time>18 min ago</time></p><p><span class="cms-activity-dot is-gold"></span>New system configuration saved <time>Yesterday</time></p></section></div><section class="cms-maintenance-note"><span>✦</span><div><strong>System maintenance</strong><p>No scheduled maintenance. We will notify administrators before any planned service interruption.</p></div><button type="button">View status page →</button></section></div>`;
    loadVercelMetrics('system');
    return;
  }
  if (view === 'settings') {
    content.innerHTML = `<div class="cms-settings-page"><div class="cms-settings-heading"><div><span class="cms-section-label">Administration / Settings</span><h1>Workspace settings</h1><p>Shape how your Trovesites workspace looks, behaves, and communicates.</p></div><button class="cms-page-action" type="button">Save changes</button></div><div class="cms-settings-layout"><nav class="cms-settings-nav"><button class="is-active" type="button">General</button><button type="button">Appearance</button><button type="button">Notifications</button><button type="button">Security</button><button type="button">Integrations</button></nav><div class="cms-settings-content"><section class="cms-settings-card"><header><div><h2>General information</h2><p>Basic details about your workspace.</p></div></header><div class="cms-settings-form"><label>Workspace name<input value="Trovesites"></label><label>Workspace URL<input value="trovesites-alpha.vercel.app"></label><label>Workspace description<textarea>Creative resources, projects, and thoughtful digital experiences in one place.</textarea></label><label>Default language<select><option>English (US)</option><option>English (UK)</option></select></label></div></section><section class="cms-settings-card"><header><div><h2>Workspace appearance</h2><p>Choose how your private CMS workspace feels.</p></div></header><div class="cms-theme-options"><button class="is-selected" type="button"><span class="theme-preview theme-light"></span><strong>Light</strong><small>Bright and minimal</small></button><button type="button"><span class="theme-preview theme-soft"></span><strong>Soft cream</strong><small>Warm and understated</small></button><button type="button"><span class="theme-preview theme-dark"></span><strong>Dark</strong><small>Focused and calm</small></button></div><label class="cms-settings-toggle"><span><strong>Use compact navigation</strong><small>Show more items in the sidebar</small></span><input type="checkbox"><i></i></label></section><section class="cms-settings-card"><header><div><h2>Notifications</h2><p>Choose what updates you receive from the workspace.</p></div></header><div class="cms-settings-checks"><label><span><strong>Project activity</strong><small>Updates when projects are created or changed</small></span><input type="checkbox" checked><i></i></label><label><span><strong>Access changes</strong><small>Alerts when roles or permissions are updated</small></span><input type="checkbox" checked><i></i></label><label><span><strong>Weekly summary</strong><small>A weekly overview of workspace activity</small></span><input type="checkbox" checked><i></i></label><label><span><strong>Product updates</strong><small>News and improvements from Trovesites</small></span><input type="checkbox"><i></i></label></div></section><section class="cms-settings-card cms-settings-security"><header><div><h2>Security</h2><p>Keep your account and workspace protected.</p></div><span class="cms-security-status"><i></i>Protected</span></header><div class="cms-security-items"><div><span>Two-factor authentication</span><small>Recommended for all administrators</small><button type="button">Enable</button></div><div><span>Active sessions</span><small>2 active sessions on your account</small><button type="button">Review</button></div></div></section></div></div>`;
    return;
  }
  if (view === 'media library') {
    loadRealMedia(content);
    return;
    const media = [['Luxury Stay branding', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', 'PNG', '2.4 MB'], ['Along the Coast', 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024', 'PNG', '1.8 MB'], ['Digital Art Series', 'https://framerusercontent.com/images/PmMTtBWdns9q73sBmlgu6h7pB0.png?width=1122&height=1402', 'PNG', '3.1 MB'], ['Reverie interface', 'https://framerusercontent.com/images/6RtZRPJzwkOvGXbjZVFqSjywlQ.png?width=1567&height=1004', 'PNG', '2.2 MB'], ['Editorial template', 'https://framerusercontent.com/images/GqQks9HafgkRK7rdTAf0oC9JI.png?width=2004&height=2004', 'PNG', '1.6 MB'], ['Brand palette', 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', 'PNG', '2.7 MB']];
    content.innerHTML = `<div class="cms-media-page"><div class="cms-media-heading"><div><span class="cms-section-label">Content / Media Library</span><h1>Media library</h1><p>Keep every image, reference, and reusable asset close at hand.</p></div><button class="cms-page-action" type="button">Upload media</button></div><section class="cms-media-summary"><article><span>Total media</span><strong>8,910</strong><small>Across your workspace</small></article><article><span>Storage used</span><strong>68 GB</strong><small>of 100 GB available</small></article><article><span>Images</span><strong>7,482</strong><small class="positive">▲ 8.4% this month</small></article><article><span>Collections</span><strong>24</strong><small>Organized folders</small></article></section><div class="cms-media-toolbar"><label><span>⌕</span><input type="search" placeholder="Search media"></label><select><option>All media</option><option>Images</option><option>Videos</option><option>Documents</option></select><select><option>Recently added</option><option>Name A-Z</option><option>Largest first</option></select><button type="button">☷</button><button type="button">▦</button></div><div class="cms-media-layout"><aside class="cms-media-folders"><header><h2>Collections</h2><button type="button">＋</button></header><button class="is-active" type="button"><span>▧</span> All media <b>8,910</b></button><button type="button"><span>▱</span> Brand assets <b>342</b></button><button type="button"><span>▤</span> Project images <b>5,218</b></button><button type="button"><span>▦</span> Social content <b>1,906</b></button><button type="button"><span>▱</span> Unsorted <b>1,444</b></button><div class="cms-media-storage"><div><span>Storage</span><b>68%</b></div><i><em style="width:68%"></em></i><small>68 GB of 100 GB</small></div></aside><section class="cms-media-assets"><header><div><h2>All media</h2><span>Showing 6 recently added items</span></div><label><input type="checkbox"> Select all</label></header><div class="cms-media-grid">${media.map(([name, image, type, size]) => `<article class="cms-media-card"><div class="cms-media-image"><img src="${image}" alt="${name}"><button type="button">•••</button><input type="checkbox"></div><div class="cms-media-meta"><strong>${name}</strong><span>${type} · ${size}</span></div></article>`).join('')}</div></section></div></div>`;
    return;
  }
  if (view === 'pages') {
    const pages = [['Home', 'Landing page', 'Published', 'Today, 9:42 AM', '98%'], ['About us', 'Standard page', 'Published', 'Sep 18, 2026', '94%'], ['Libraries', 'Collection page', 'Published', 'Sep 16, 2026', '91%'], ['Pricing', 'Standard page', 'Draft', 'Sep 12, 2026', '86%'], ['Contact us', 'Form page', 'Published', 'Sep 8, 2026', '96%']];
    content.innerHTML = `<div class="cms-pages-page"><div class="cms-pages-heading"><div><span class="cms-section-label">Content / Pages</span><h1>Site pages</h1><p>Build, organize, and publish the pages that shape your public site.</p></div><button class="cms-page-action" type="button">Create page</button></div><section class="cms-pages-summary"><article><span>Total pages</span><strong>18</strong><small>Across your public site</small></article><article><span>Published</span><strong>14</strong><small class="positive">Ready for visitors</small></article><article><span>Drafts</span><strong>4</strong><small class="pending">Needs review</small></article><article><span>SEO health</span><strong>92%</strong><small class="positive">▲ 4.8% this month</small></article></section><div class="cms-pages-toolbar"><label><span>⌕</span><input type="search" placeholder="Search pages"></label><select><option>All page types</option><option>Landing page</option><option>Standard page</option><option>Collection page</option></select><select><option>All status</option><option>Published</option><option>Draft</option></select><button type="button">☷</button></div><section class="cms-pages-directory"><header><div><h2>All pages</h2><span>Manage your public site structure</span></div><button type="button">Reorder pages</button></header><div class="cms-pages-table"><table><thead><tr><th><input type="checkbox"></th><th>Page</th><th>Type</th><th>Status</th><th>Last updated</th><th>SEO health</th><th></th></tr></thead><tbody>${pages.map(([name, type, status, date, seo], index) => `<tr><td><input type="checkbox"></td><td><div class="cms-page-cell"><span class="cms-page-icon">${index === 0 ? '⌂' : '▱'}</span><span><strong>${name}</strong><small>trovesites.com/${name.toLowerCase().replace(/ /g, '-')}</small></span></div></td><td>${type}</td><td><span class="cms-page-status ${status === 'Draft' ? 'is-draft' : ''}"><i></i>${status}</span></td><td>${date}</td><td><div class="cms-seo-score"><i><em style="width:${seo}"></em></i><span>${seo}</span></div></td><td><button class="cms-page-more" type="button">•••</button></td></tr>`).join('')}</tbody></table></div><footer><span>Showing 5 of 18 pages</span><button disabled>‹</button><button class="is-current">1</button><button>2</button><button>3</button><button>›</button></footer></section><section class="cms-pages-bottom"><article><header><h2>Publishing checklist</h2><span>4 items to review</span></header><p><i class="cms-check-done">✓</i> Homepage has a title and description</p><p><i class="cms-check-done">✓</i> Navigation links are connected</p><p><i class="cms-check-pending">!</i> Pricing page is still a draft</p><p><i class="cms-check-pending">!</i> Add social image to Contact us</p></article><article><header><h2>Site structure</h2><button type="button">View navigation</button></header><div class="cms-site-structure"><span>Home</span><b>→</b><span>Libraries</span><b>→</b><span>About us</span><b>→</b><span>Contact us</span></div><p>Your primary navigation contains 4 published pages.</p></article></section></div>`;
    return;
  }
  if (view === 'site content') {
    const sections = [['Homepage hero', 'Homepage', 'Published', 'Updated today'], ['About us introduction', 'About us', 'Published', 'Updated Sep 18, 2026'], ['Library description', 'Libraries', 'Published', 'Updated Sep 16, 2026'], ['Pricing page copy', 'Pricing', 'Draft', 'Updated Sep 12, 2026'], ['Contact details', 'Contact us', 'Published', 'Updated Sep 8, 2026']];
    content.innerHTML = `<div class="cms-site-content-page"><div class="cms-site-content-heading"><div><span class="cms-section-label">Content / Site Content</span><h1>Site content</h1><p>Shape the words, labels, and sections visitors see across Trovesites.</p></div><button class="cms-page-action" type="button">Add content</button></div><section class="cms-site-content-summary"><article><span>Content items</span><strong>42</strong><small>Across 6 public pages</small></article><article><span>Published</span><strong>36</strong><small class="positive">Ready for visitors</small></article><article><span>Drafts</span><strong>6</strong><small class="pending">Awaiting review</small></article><article><span>Last published</span><strong>Today</strong><small>9:42 AM</small></article></section><div class="cms-site-content-toolbar"><label><span>⌕</span><input type="search" placeholder="Search site content"></label><select><option>All page areas</option><option>Homepage</option><option>About us</option><option>Libraries</option><option>Pricing</option></select><select><option>All status</option><option>Published</option><option>Draft</option></select><button type="button">☷</button></div><div class="cms-site-content-layout"><aside class="cms-content-sections"><header><h2>Content areas</h2><button type="button">＋</button></header><button class="is-active" type="button"><span>⌂</span> All content <b>42</b></button><button type="button"><span>▱</span> Homepage <b>12</b></button><button type="button"><span>▤</span> About us <b>7</b></button><button type="button"><span>▧</span> Libraries <b>9</b></button><button type="button"><span>▱</span> Pricing <b>6</b></button><button type="button"><span>▱</span> Contact us <b>8</b></button><div class="cms-publish-note"><i>✓</i><p>All public content is synced with the latest published version.</p></div></aside><section class="cms-site-content-list"><header><div><h2>All site content</h2><span>Manage copy and public-facing sections</span></div><button type="button">Preview site</button></header><div class="cms-site-content-items">${sections.map(([name, page, status, date], index) => `<article><span class="cms-site-content-icon">${['✦', 'Aa', '▦', '$', '⌕'][index]}</span><div><strong>${name}</strong><small>${page} · ${date}</small></div><span class="cms-site-status ${status === 'Draft' ? 'is-draft' : ''}"><i></i>${status}</span><button class="cms-site-content-edit" type="button">Edit</button><button class="cms-site-content-more" type="button">•••</button></article>`).join('')}</div><footer><span>Showing 5 of 42 content items</span><button disabled>‹</button><button class="is-current">1</button><button>2</button><button>3</button><button>›</button></footer></section></div><section class="cms-site-content-bottom"><article><header><h2>Publishing overview</h2><span>This week</span></header><div class="cms-publish-progress"><div><span>Published content</span><b>86%</b></div><i><em style="width:86%"></em></i></div><p>6 draft items are waiting for review before publishing.</p></article><article><header><h2>Quick actions</h2></header><div class="cms-quick-actions"><button type="button"><span>＋</span><strong>Create content</strong><small>Start from a blank item</small></button><button type="button"><span>◉</span><strong>Preview changes</strong><small>See the public site</small></button><button type="button"><span>↗</span><strong>Publish updates</strong><small>Push approved content live</small></button></div></article></section></div>`;
    return;
  }
  content.innerHTML = `
    <div class="cms-dashboard-heading cms-inner-page-heading">
      <div><span class="cms-section-label">Admin workspace</span><h1>${title}</h1><p>${description}</p></div>
      <button class="cms-page-action" type="button">+ Add content</button>
    </div>
    <section class="cms-content-toolbar"><label>Search <input type="search" placeholder="Search ${title.toLowerCase()}" /></label><select><option>All statuses</option><option>Published</option><option>Draft</option></select></section>
    <section class="cms-content-grid" aria-label="CMS content items">
      <article class="cms-content-card"><div class="cms-content-card-icon">✦</div><div><h2>${title} workspace</h2><p>Your ${title.toLowerCase()} items will appear here as they are created.</p></div><span class="cms-content-status">Ready</span></article>
      <article class="cms-content-card"><div class="cms-content-card-icon">＋</div><div><h2>Create your first item</h2><p>Start organizing this area of the CMS.</p></div><button class="cms-card-action" type="button">Get started</button></article>
    </section>`;
});

document.addEventListener('visibilitychange', () => {
  const view = window.troveActiveCmsView;
  if (document.visibilityState === 'visible' && ['dashboard', 'reports', 'system'].includes(view)) loadVercelMetrics(view);
});

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-refresh-reports]')) loadRealReports(document.querySelector('#cms-dashboard-content'));
});

document.addEventListener('click', (event) => {
  const openButton = event.target.closest('[data-new-project]');
  if (openButton) {
    const panel = document.querySelector('[data-project-form]');
    const form = panel?.querySelector('form');
    if (panel) panel.hidden = false;
    if (form) {
      setProjectCategoryOptions(form);
      form.reset();
      delete form.dataset.projectId;
      form.elements.image.required = true;
      setProjectImagePreview(form, null);
      setProjectTags(form, form.elements.category.value, []);
      panel.querySelector('h2').textContent = 'Create Project';
      form.querySelector('button[type="submit"]').textContent = 'Save project';
      const status = form.querySelector('[data-project-status]');
      if (status) status.textContent = '';
    }
    return;
  }
  const closeButton = event.target.closest('[data-close-project]');
  if (closeButton) {
    const panel = closeButton.closest('[data-project-form]');
    if (panel) panel.hidden = true;
  }
});

async function logCmsActivity(action, project, metadata = {}) {
  const client = window.troveSupabase;
  if (!client || !project) return;
  await client.from('cms_activity').insert({
    action,
    entity_type: 'project',
    entity_id: project.id || null,
    entity_name: project.name || '',
    metadata,
  });
}

async function loadRealAgents(content) {
  const client = window.troveSupabase;
  content.innerHTML = `<div class="cms-agents-page"><div class="cms-agents-heading"><div><span class="cms-section-label">Operations / Agents</span><h1>Agent workspace</h1><p>Manage agents assigned to your Trovesites workspace.</p></div><button class="cms-page-action" type="button" data-new-agent>Add agent</button></div><section class="cms-content-card cms-user-loading" data-agent-form-panel hidden><form class="cms-agent-form"><h2>Add agent</h2><label>Full name<input name="name" required placeholder="Agent name"></label><label>Email<input name="email" type="email" required placeholder="agent@example.com"></label><label>Role<select name="role"><option>Content editor</option><option>Creative director</option><option>Brand strategist</option><option>Visual designer</option></select></label><label>Status<select name="status"><option>Active</option><option>Away</option><option>Invited</option><option>Suspended</option></select></label><div><button type="submit" class="cms-page-action">Save agent</button><button type="button" data-close-agent>Cancel</button></div><p data-agent-status></p></form></section><section class="cms-agent-directory"><header><div><h2>Agent directory</h2><span data-agent-count>Loading agents…</span></div></header><div class="cms-agent-list" data-agent-list><p>Loading agents from Supabase…</p></div></section></div>`;
  if (!client) return;
  const { data: agents, error } = await client.from('cms_agents').select('id,name,email,role,status,created_at').order('created_at', { ascending: false });
  const list = content.querySelector('[data-agent-list]');
  if (error) {
    list.innerHTML = `<p>${escapeHtml(error.message)}. Run supabase/010_cms_agents.sql in Supabase SQL Editor.</p>`;
    return;
  }
  const rows = agents || [];
  content.querySelector('[data-agent-count]').textContent = `${rows.length} agent${rows.length === 1 ? '' : 's'} in workspace`;
  list.innerHTML = rows.map((agent, index) => `<article class="cms-agent-row"><div class="cms-agent-avatar avatar-${index % 4}">${escapeHtml(agent.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2))}</div><div class="cms-agent-identity"><strong>${escapeHtml(agent.name)}</strong><span>${escapeHtml(agent.role)}</span><small>${escapeHtml(agent.email)}</small></div><span class="cms-agent-status ${agent.status !== 'Active' ? 'is-away' : ''}"><i></i>${escapeHtml(agent.status)}</span><time>${escapeHtml(new Date(agent.created_at).toLocaleDateString())}</time></article>`).join('') || '<p>No agents added yet.</p>';
}

async function loadRealReports(content) {
  const client = window.troveSupabase;
  content.innerHTML = `<div class="cms-reports-page"><div class="cms-reports-heading"><div><span class="cms-section-label">Analytics / Reports</span><h1>Workspace reports</h1><p>Live CMS activity from Supabase. Visitor analytics will be added when GA4 reporting access is connected.</p></div><button class="cms-page-action" type="button" data-refresh-reports>Refresh report</button></div><section class="cms-report-stats cms-real-report-stats"><article><div><span>CMS actions</span><b data-report-actions>—</b></div><small>Last 30 days</small></article><article><div><span>Projects</span><b data-report-projects>—</b></div><small>Current workspace</small></article><article><div><span>Uploads</span><b data-report-uploads>—</b></div><small>Tracked image uploads</small></article><article><div><span>Last activity</span><b data-report-last>—</b></div><small>Most recent event</small></article></section><section class="cms-report-performance cms-real-report-activity"><header><div><h2>Recent CMS activity</h2><span>Project changes recorded by administrators</span></div></header><table><thead><tr><th>Action</th><th>Project</th><th>Actor</th><th>Time</th></tr></thead><tbody data-report-activity><tr><td colspan="4">Loading activity…</td></tr></tbody></table></section></div>`;
  if (!client) return;
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [{ data: activity, error: activityError }, { count: projectCount, error: projectError }] = await Promise.all([
    client.from('cms_activity').select('action,entity_name,created_at,actor_id').gte('created_at', since).order('created_at', { ascending: false }).limit(100),
    client.from('cms_projects').select('id', { count: 'exact', head: true }),
  ]);
  if (activityError || projectError) {
    const message = activityError?.message || projectError?.message || 'Unable to load report data.';
    content.querySelector('[data-report-activity]').innerHTML = `<tr><td colspan="4">${escapeHtml(message)}. Run supabase/009_cms_activity.sql in Supabase SQL Editor.</td></tr>`;
    return;
  }
  const events = activity || [];
  content.querySelector('[data-report-actions]').textContent = String(events.length);
  content.querySelector('[data-report-projects]').textContent = String(projectCount || 0);
  content.querySelector('[data-report-uploads]').textContent = String(events.filter((event) => event.action === 'uploaded').length);
  content.querySelector('[data-report-last]').textContent = events[0] ? new Date(events[0].created_at).toLocaleDateString() : '—';
  content.querySelector('[data-report-activity]').innerHTML = events.slice(0, 20).map((event) => `<tr><td>${escapeHtml(event.action)}</td><td>${escapeHtml(event.entity_name || 'Project')}</td><td>Administrator</td><td>${escapeHtml(new Date(event.created_at).toLocaleString())}</td></tr>`).join('') || '<tr><td colspan="4">No activity recorded yet.</td></tr>';
  loadVercelMetrics('reports');
}

async function loadDashboardSummary() {
  const client = window.troveSupabase;
  const grid = document.querySelector('.cms-kpi-grid');
  if (!client || !grid) return;
  if (grid.querySelectorAll('.cms-kpi-card').length === 5) grid.insertAdjacentHTML('beforeend', '<article class="cms-kpi-card"></article>');
  const cards = grid.querySelectorAll('.cms-kpi-card');
  const { data, error } = await client.from('cms_projects').select('category,image_url,tags');
  if (error) return;
  const projects = data || [];
  const categories = projects.reduce((counts, project) => {
    const category = normalizeProjectCategory(project.category || 'Other');
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
  const summary = [
    ['Templates', categories.Templates || 0, 'Projects in this category'],
    ['Components', categories.Components || 0, 'Projects in this category'],
    ['Sections', categories.Sections || 0, 'Projects in this category'],
    ['Backgrounds', categories.Backgrounds || 0, 'Projects in this category'],
    ['Media items', projects.filter((project) => project.image_url).length, 'Images linked to projects'],
  ];
  cards.forEach((card, index) => {
    const [label, count, note] = summary[index];
    card.innerHTML = `<div class="cms-kpi-top"><span>${label}</span><span>${index === 4 ? '▧' : '□'}</span></div><strong>${count}</strong><small>${note}</small>`;
  });

  const rankingTitle = document.querySelector('.cms-viewed-panel h2');
  const rankingNote = document.querySelector('.cms-viewed-panel .cms-panel-note');
  const ranking = document.querySelector('.cms-viewed-panel .cms-ranking');
  if (!ranking) return;
  if (rankingTitle) rankingTitle.textContent = 'Most Used Component Tags';
  if (rankingNote) rankingNote.textContent = 'From component project tags';
  const tagCounts = {};
  projects.filter((project) => normalizeProjectCategory(project.category || 'Other') === 'Components').forEach((project) => {
    (project.tags || []).forEach((tag) => {
      const cleanTag = String(tag).trim();
      if (cleanTag) tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
    });
  });
  const rankedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = rankedTags[0]?.[1] || 1;
  ranking.innerHTML = rankedTags.length ? rankedTags.map(([tag, count]) => `<div><span>${escapeHtml(tag)}</span><b>${count}</b><i><em style="width:${Math.round((count / max) * 100)}%"></em></i></div>`).join('') : '<p class="cms-ranking-empty">No component tags have been added yet.</p>';
}

async function loadDashboardSummary() {
  const client = window.troveSupabase;
  const grid = document.querySelector('.cms-kpi-grid');
  if (!client || !grid) return;
  if (grid.querySelectorAll('.cms-kpi-card').length === 5) grid.insertAdjacentHTML('beforeend', '<article class="cms-kpi-card"></article>');
  const cards = grid.querySelectorAll('.cms-kpi-card');
  const [{ data: users }, { data: projects, error: projectError }, { count: folderCount }, { count: activeAgentCount }] = await Promise.all([
    client.rpc('admin_list_users'),
    client.from('cms_projects').select('id,image_url'),
    client.from('cms_folders').select('id', { count: 'exact', head: true }),
    client.from('cms_agents').select('id', { count: 'exact', head: true }).eq('status', 'Active'),
  ]);
  if (projectError) return;
  const projectRows = projects || [];
  const summary = [
    ['Total users', Array.isArray(users) ? users.length : 0, 'Admin directory'],
    ['Total projects', projectRows.length, 'Saved in workspace'],
    ['Total media', projectRows.filter((project) => project.image_url).length, 'Images linked to projects'],
    ['Total folders', folderCount || 0, 'Content categories'],
    ['Revenue / month', '—', 'Loading Dodo payments'],
    ['Active agents', activeAgentCount || 0, 'Active in workspace'],
  ];
  cards.forEach((card, index) => {
    const [label, count, note] = summary[index];
    card.innerHTML = `<div class="cms-kpi-top"><span>${label}</span><span>${index === 2 ? '▧' : index === 4 ? '$' : '□'}</span></div><strong>${count}</strong><small>${note}</small>`;
  });
  cards.forEach((card, index) => {
    const note = card.querySelector('small');
    if (!note) return;
    note.className = index === 4 ? '' : 'positive';
    note.textContent = index === 4 ? 'Loading Dodo payments' : `▲ ${summary[index][2]}`;
  });
}

function renderCmsBilling(content) {
  content.innerHTML = `<div class="cms-admin-billing"><header class="cms-admin-billing-head"><div><span class="cms-section-label">Administration / Billing</span><h1>Revenue & subscriptions</h1><p>A live view of the plans, renewals, and payments supporting Trovesites.</p></div><button class="cms-page-action" type="button" data-billing-refresh>Refresh</button></header><section class="cms-admin-billing-metrics"><article><span>Monthly recurring revenue</span><strong data-billing-mrr>—</strong><small>Active recurring subscriptions</small></article><article><span>Active subscribers</span><strong data-billing-active>—</strong><small>Loading verified subscriptions</small></article><article><span>Renewal watch</span><strong data-billing-watch>—</strong><small>Set to cancel at period end</small></article><article><span>Payments this month</span><strong data-billing-payments>—</strong><small>Loading Dodo payments</small></article></section><section class="cms-admin-billing-grid"><article class="cms-admin-billing-card cms-admin-revenue"><header><div><h2>Revenue pulse</h2><span>Last six months of recorded invoices</span></div><span class="cms-billing-live">● Live</span></header><div class="cms-billing-chart" data-billing-chart><p>Loading payment history…</p></div></article><article class="cms-admin-billing-card"><header><div><h2>Plan mix</h2><span>Active subscribers by plan</span></div></header><div class="cms-plan-mix" data-billing-plans><p>Loading plans…</p></div></article></section><section class="cms-admin-billing-card cms-billing-directory"><header><div><h2>Subscriber activity</h2><span data-billing-directory-note>Loading current subscriptions…</span></div></header><div class="cms-billing-table"><table><thead><tr><th>Plan</th><th>Status</th><th>Billing</th><th>Next renewal</th><th>Amount</th></tr></thead><tbody data-billing-subscribers><tr><td colspan="5">Loading secure billing data…</td></tr></tbody></table></div></section><section class="cms-admin-billing-card cms-billing-invoice-card"><header><div><h2>Recent payments</h2><span>Synced invoice records</span></div></header><div class="cms-billing-table"><table><thead><tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody data-billing-invoices><tr><td colspan="4">Loading payment records…</td></tr></tbody></table></div></section></div>`;
  content.querySelector('[data-billing-refresh]')?.addEventListener('click', () => loadCmsBilling(content));
}

function billingMoney(value, currency = 'USD') {
  const amount = Number(value || 0);
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: String(currency || 'USD').toUpperCase() }).format(amount); } catch { return `${amount.toFixed(2)} ${currency}`; }
}

async function loadCmsBilling(content) {
  const client = window.troveSupabase;
  if (!client || window.troveActiveCmsView !== 'billing') return;
  try {
    const { data: sessionData } = await client.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) throw new Error('Sign in again to view billing analytics.');
    const [overviewResponse, revenueResponse] = await Promise.all([fetch('/api/admin/billing-overview', { headers: { Authorization: `Bearer ${token}` } }), fetch('/api/admin/revenue', { headers: { Authorization: `Bearer ${token}` } })]);
    const overview = await overviewResponse.json().catch(() => ({}));
    const revenue = await revenueResponse.json().catch(() => ({}));
    if (!overviewResponse.ok) throw new Error(overview.error || 'Billing analytics are unavailable.');
    if (window.troveActiveCmsView !== 'billing') return;
    const subscriptions = overview.subscriptions || [];
    const invoices = overview.invoices || [];
    const active = subscriptions.filter((item) => ['active', 'trialing'].includes(String(item.status).toLowerCase()));
    const cancellers = active.filter((item) => item.cancel_at_period_end);
    const currencies = [...new Set(active.map((item) => item.currency || 'USD'))];
    const mrr = currencies.map((currency) => [currency, active.filter((item) => (item.currency || 'USD') === currency && String(item.plan).toLowerCase() !== 'lifetime').reduce((sum, item) => sum + Number(item.amount || 0), 0)]).filter(([, amount]) => amount);
    content.querySelector('[data-billing-mrr]').textContent = mrr.length === 1 ? billingMoney(mrr[0][1], mrr[0][0]) : mrr.length ? `${mrr.length} currencies` : '$0.00';
    content.querySelector('[data-billing-active]').textContent = String(active.length);
    content.querySelector('[data-billing-watch]').textContent = String(cancellers.length);
    const paymentCount = revenueResponse.ok ? Number(revenue.payment_count || 0) : 0;
    content.querySelector('[data-billing-payments]').textContent = String(paymentCount);
    const plans = active.reduce((map, item) => { const key = item.plan || 'Paid'; map[key] = (map[key] || 0) + 1; return map; }, {});
    const maxPlan = Math.max(...Object.values(plans), 1);
    content.querySelector('[data-billing-plans]').innerHTML = Object.entries(plans).length ? Object.entries(plans).sort((a, b) => b[1] - a[1]).map(([plan, count]) => `<p><span>${escapeHtml(plan)}</span><b>${count}</b><i><em style="width:${Math.round(count / maxPlan * 100)}%"></em></i></p>`).join('') : '<p class="cms-billing-empty">No active subscriptions yet.</p>';
    const months = Array.from({ length: 6 }, (_, index) => { const date = new Date(); date.setMonth(date.getMonth() - (5 - index), 1); return date; });
    const monthly = months.map((date) => ({ label: date.toLocaleDateString(undefined, { month: 'short' }), total: invoices.filter((invoice) => { const issued = new Date(invoice.issued_at || invoice.created_at); return issued.getFullYear() === date.getFullYear() && issued.getMonth() === date.getMonth(); }).reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0) }));
    const peak = Math.max(...monthly.map((item) => item.total), 1);
    content.querySelector('[data-billing-chart]').innerHTML = `<div class="cms-billing-bars">${monthly.map((item) => `<span><i style="height:${Math.max(6, Math.round(item.total / peak * 100))}%"></i><b>${escapeHtml(item.label)}</b></span>`).join('')}</div>`;
    content.querySelector('[data-billing-directory-note]').textContent = `${subscriptions.length} synced subscriber${subscriptions.length === 1 ? '' : 's'}`;
    content.querySelector('[data-billing-subscribers]').innerHTML = subscriptions.length ? subscriptions.slice(0, 8).map((item) => `<tr><td><strong>${escapeHtml(item.plan || 'Paid')}</strong></td><td><span class="cms-billing-status ${['active', 'trialing'].includes(String(item.status).toLowerCase()) ? '' : 'is-muted'}">${escapeHtml(item.status || 'Unknown')}</span></td><td>${escapeHtml(item.interval || '—')}</td><td>${item.current_period_end ? new Date(item.current_period_end).toLocaleDateString() : '—'}</td><td>${billingMoney(item.amount, item.currency)}</td></tr>`).join('') : '<tr><td colspan="5">No subscription records have been synced yet.</td></tr>';
    content.querySelector('[data-billing-invoices]').innerHTML = invoices.length ? invoices.slice(0, 6).map((item) => `<tr><td>${escapeHtml(item.dodo_invoice_id || '—')}</td><td>${item.issued_at ? new Date(item.issued_at).toLocaleDateString() : '—'}</td><td>${billingMoney(item.amount, item.currency)}</td><td>${escapeHtml(item.status || 'Recorded')}</td></tr>`).join('') : '<tr><td colspan="4">No invoice records have been synced yet.</td></tr>';
  } catch (error) { const target = content.querySelector('[data-billing-subscribers]'); if (target) target.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message || 'Unable to load billing analytics.')}</td></tr>`; }
}

async function loadDashboardRevenue() {
  if (window.troveActiveCmsView !== 'dashboard') return;
  const card = [...document.querySelectorAll('.cms-kpi-card')].find((item) => item.querySelector('.cms-kpi-top span')?.textContent.trim().toLowerCase() === 'revenue / month');
  const value = card?.querySelector('strong');
  const note = card?.querySelector('small');
  const client = window.troveSupabase;
  if (!card || !value || !note || !client) return;

  value.textContent = '…';
  note.textContent = 'Loading Dodo payments';
  try {
    const { data: sessionData } = await client.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) throw new Error('Sign in again to load revenue.');
    const response = await fetch('/api/admin/revenue', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Dodo revenue is unavailable.');
    if (window.troveActiveCmsView !== 'dashboard') return;

    const entries = Object.entries(result.by_currency || {}).sort((a, b) => b[1] - a[1]);
    const month = new Date(`${result.period}-01T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', year: 'numeric', timeZone: 'UTC' });
    const environmentLabel = result.environment === 'live_mode' ? 'Live Dodo' : 'Dodo test mode';
    if (entries.length === 1) {
      const [currency, minorAmount] = entries[0];
      const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency });
      const fractionDigits = formatter.resolvedOptions().maximumFractionDigits;
      value.textContent = formatter.format(minorAmount / (10 ** fractionDigits));
      card.removeAttribute('title');
    } else if (entries.length > 1) {
      value.textContent = `${entries.length} currencies`;
      card.title = entries.map(([currency, minorAmount]) => {
        const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency });
        const fractionDigits = formatter.resolvedOptions().maximumFractionDigits;
        return formatter.format(minorAmount / (10 ** fractionDigits));
      }).join(' · ');
    } else {
      value.textContent = '0';
      card.removeAttribute('title');
    }
    note.textContent = `${result.payment_count || 0} successful payment${result.payment_count === 1 ? '' : 's'} · ${month} · ${environmentLabel}`;
  } catch (error) {
    if (window.troveActiveCmsView !== 'dashboard') return;
    value.textContent = 'Unavailable';
    note.textContent = error.message || 'Dodo revenue is unavailable.';
  }
}

async function loadDashboardCharts() {
  const client = window.troveSupabase;
  if (!client) return;
  const [{ data: users, error: userError }, { data: projects, error: projectError }] = await Promise.all([
    client.rpc('admin_list_users'),
    client.from('cms_projects').select('created_at'),
  ]);
  if (userError || projectError) return;

  const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const monthLabel = (date) => date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  const now = new Date();
  const userMonths = Array.from({ length: 7 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - (6 - index), 1));
  const projectMonths = Array.from({ length: 10 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - (9 - index), 1));
  const countByMonth = (rows) => rows.reduce((counts, row) => {
    if (row.created_at) counts[monthKey(new Date(row.created_at))] = (counts[monthKey(new Date(row.created_at))] || 0) + 1;
    return counts;
  }, {});
  const userCounts = countByMonth(users || []);
  const projectCounts = countByMonth(projects || []);

  const chart = document.querySelector('.cms-growth-panel svg');
  if (chart) {
    const values = userMonths.map((month) => userCounts[monthKey(month)] || 0);
    const max = Math.max(...values, 1);
    const points = values.map((value, index) => [38 + index * 90.333, 181 - (value / max) * 150]);
    const line = points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
    chart.querySelector('.chart-line').setAttribute('d', `M${line}`);
    chart.querySelector('.chart-area').setAttribute('d', `M${line} L580 181 L38 181 Z`);
    chart.querySelectorAll('.chart-dots circle').forEach((dot, index) => {
      dot.setAttribute('cx', points[index][0].toFixed(1));
      dot.setAttribute('cy', points[index][1].toFixed(1));
    });
    chart.querySelectorAll('.chart-labels text').forEach((label, index) => {
      const value = values[Math.min(index + 1, values.length - 1)];
      label.textContent = String(value);
    });
    document.querySelectorAll('.cms-growth-panel .chart-x-labels span').forEach((label, index) => {
      label.textContent = monthLabel(userMonths[index + 1]);
    });
  }

  const bars = document.querySelectorAll('.cms-bar-panel .cms-bar-chart span');
  const projectValues = projectMonths.map((month) => projectCounts[monthKey(month)] || 0);
  const maxProjects = Math.max(...projectValues, 1);
  bars.forEach((bar, index) => {
    bar.style.height = `${Math.max(8, Math.round((projectValues[index] / maxProjects) * 100))}%`;
  });
}

document.addEventListener('click', async (event) => {
  const action = event.target.closest('[data-project-action]');
  if (!action) return;
  const project = (window.troveCmsProjects || []).find((item) => item.id === action.dataset.projectId);
  const client = window.troveSupabase;
  if (!project || !client) return;
  const content = document.querySelector('#cms-dashboard-content');
  const panel = document.querySelector('[data-project-form]');
  const form = panel?.querySelector('form');
  const status = form?.querySelector('[data-project-status]');
  const setStatus = (text, error = false) => {
    if (!status) return;
    status.textContent = text;
    status.dataset.error = String(error);
  };

  if (action.dataset.projectAction === 'edit') {
    if (!panel || !form) return;
    panel.hidden = false;
    panel.querySelector('h2').textContent = 'Edit Project';
    setProjectCategoryOptions(form, project.category);
    form.dataset.projectId = project.id;
    form.elements.name.value = project.name || '';
    form.elements.category.value = normalizeProjectCategory(project.category);
    if (form.elements.aspect_ratio) form.elements.aspect_ratio.value = normalizeProjectAspectRatio(project.aspect_ratio);
    if (form.elements.is_premium) form.elements.is_premium.checked = Boolean(project.is_premium);
    if (form.elements.access_plan) form.elements.access_plan.value = project.access_plan || (project.is_premium ? 'starter' : 'free');
    if (form.elements.status) form.elements.status.value = project.status || 'draft';
    form.elements.tags.value = (project.tags || []).join(', ');
    setProjectTags(form, form.elements.category.value, project.tags || []);
    form.elements.description.value = project.description || '';
    if (form.elements.prompt) form.elements.prompt.value = project.prompt || '';
    form.elements.image.required = false;
    if (form.elements.media_url) form.elements.media_url.value = isCmsVideoUrl(project.image_url) ? project.image_url : '';
    setProjectImagePreview(form, project.image_url, 'Current image');
    form.querySelector('button[type="submit"]').textContent = 'Update project';
    setStatus('');
    return;
  }

  if (action.dataset.projectAction === 'archive') {
    if (project.status === 'archived') {
      if (!window.confirm('Restore this project to Draft status?')) return;
      const { error } = await client.from('cms_projects').update({ status: 'draft' }).eq('id', project.id);
      if (error) window.alert(error.message); else { await logCmsActivity('restored', project); loadRealProjects(content); }
      return;
    }
    if (!window.confirm('Archive this project?')) return;
    const { error } = await client.from('cms_projects').update({ status: 'archived' }).eq('id', project.id);
    if (error) window.alert(error.message); else { await logCmsActivity('archived', project); loadRealProjects(content); }
    return;
  }

  if (action.dataset.projectAction === 'duplicate') {
    const duplicateName = `${project.name} Copy`;
    const { error } = await client.from('cms_projects').insert({
      name: duplicateName,
      slug: `${String(duplicateName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${crypto.randomUUID().slice(0, 8)}`,
      category: project.category || 'Uncategorized',
      description: project.description || '',
      prompt: project.prompt || '',
      aspect_ratio: normalizeProjectAspectRatio(project.aspect_ratio),
      tags: project.tags || [],
      is_premium: Boolean(project.is_premium),
      access_plan: project.access_plan || (project.is_premium ? 'starter' : 'free'),
      status: 'draft',
      image_url: project.image_url || null,
      cloudinary_public_id: project.cloudinary_public_id || null
    });
    if (error) window.alert(error.message); else { await logCmsActivity('duplicated', project); loadRealProjects(content); }
    return;
  }

  if (action.dataset.projectAction === 'delete') {
    if (!window.confirm(`Delete “${project.name}” permanently?`)) return;
    const { error } = await client.from('cms_projects').delete().eq('id', project.id);
    if (error) window.alert(error.message); else { await logCmsActivity('deleted', project); loadRealProjects(content); }
  }
});

document.addEventListener('submit', async (event) => {
  const form = event.target.closest('.cms-project-create-form');
  if (!form) return;
  event.preventDefault();
  const status = form.querySelector('[data-project-status]');
  const file = form.elements.image.files?.[0];
  const mediaUrl = form.elements.media_url?.value.trim() || '';
  const client = window.troveSupabase;
  const projectId = form.dataset.projectId;
  if (!projectId && !file && !mediaUrl) { status.textContent = 'Choose a media file or enter a media URL.'; status.dataset.error = 'true'; return; }
  const setStatus = (text, error = false) => { status.textContent = text; status.dataset.error = String(error); };
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    if (projectId && !file && !mediaUrl) {
      setStatus('Updating project in Supabase…');
      const { error } = await client.from('cms_projects').update({
        name: form.elements.name.value.trim(),
        category: form.elements.category.value.trim() || 'Uncategorized',
        description: form.elements.description.value.trim(),
        prompt: form.elements.prompt.value.trim(),
        aspect_ratio: normalizeProjectAspectRatio(form.elements.aspect_ratio?.value),
        tags: form.elements.tags.value.split(',').map((tag) => tag.trim()).filter(Boolean),
        is_premium: Boolean(form.elements.is_premium?.checked),
        access_plan: form.elements.access_plan?.value || 'free',
        status: form.elements.status?.value || 'draft'
      }).eq('id', projectId);
      if (error) throw error;
      await logCmsActivity('updated', { id: projectId, name: form.elements.name.value.trim() }, { imageUpdated: false });
      setStatus('Project updated successfully.');
      form.reset();
      delete form.dataset.projectId;
      form.elements.image.required = true;
      if (form.elements.media_url) form.elements.media_url.value = '';
      window.setTimeout(() => loadRealProjects(document.querySelector('#cms-dashboard-content')), 600);
      return;
    }
    let media = { secure_url: mediaUrl, public_id: null };
    if (mediaUrl && !/^https?:\/\//i.test(mediaUrl)) throw new Error('Media URL must start with http:// or https://.');
    if (file) {
      setStatus('Uploading media to Cloudinary');
      const uploadBody = new FormData();
      uploadBody.append('file', file);
      const { data: sessionData } = await client.auth.getSession();
      const config = window.troveSupabaseConfig || {};
      const functionResponse = await fetch(`${config.url || client.supabaseUrl}/functions/v1/cloudinary-upload`, {
        method: 'POST',
        headers: {
          apikey: config.anonKey || client.supabaseKey,
          Authorization: `Bearer ${sessionData.session?.access_token || ''}`
        },
        body: uploadBody
      });
      media = await functionResponse.json().catch(() => ({}));
      if (!functionResponse.ok || !media?.secure_url) throw new Error(media?.error || `Cloudinary upload failed (${functionResponse.status}).`);
    }
    if (projectId) {
      setStatus('Updating project in Supabase…');
      const { error } = await client.from('cms_projects').update({
        name: form.elements.name.value.trim(),
        category: form.elements.category.value.trim() || 'Uncategorized',
        description: form.elements.description.value.trim(),
        prompt: form.elements.prompt.value.trim(),
        aspect_ratio: normalizeProjectAspectRatio(form.elements.aspect_ratio?.value),
        tags: form.elements.tags.value.split(',').map((tag) => tag.trim()).filter(Boolean),
        is_premium: Boolean(form.elements.is_premium?.checked),
        access_plan: form.elements.access_plan?.value || 'free',
        status: form.elements.status?.value || 'draft',
        image_url: media.secure_url,
        cloudinary_public_id: media.public_id
      }).eq('id', projectId);
      if (error) throw error;
      await logCmsActivity('uploaded', { id: projectId, name: form.elements.name.value.trim() }, { imageUpdated: true });
      setStatus('Project updated successfully.');
      form.reset();
      delete form.dataset.projectId;
      form.elements.image.required = true;
      if (form.elements.media_url) form.elements.media_url.value = '';
      window.setTimeout(() => loadRealProjects(document.querySelector('#cms-dashboard-content')), 600);
      return;
    }
    setStatus('Saving project to Supabase…');
    const name = form.elements.name.value.trim();
    const { error: insertError } = await client.from('cms_projects').insert({
      name,
      slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${crypto.randomUUID().slice(0, 8)}`,
      category: form.elements.category.value.trim(),
      description: form.elements.description.value.trim(),
      prompt: form.elements.prompt.value.trim(),
      aspect_ratio: normalizeProjectAspectRatio(form.elements.aspect_ratio?.value),
      tags: form.elements.tags.value.split(',').map((tag) => tag.trim()).filter(Boolean),
      is_premium: Boolean(form.elements.is_premium?.checked),
      access_plan: form.elements.access_plan?.value || 'free',
      status: form.elements.status?.value || 'draft',
      image_url: media.secure_url,
      cloudinary_public_id: media.public_id
    });
    if (insertError) throw insertError;
    await logCmsActivity('created', { id: null, name }, { category: form.elements.category.value.trim() });
    setStatus('Project saved successfully.');
    form.reset();
    window.setTimeout(() => loadRealProjects(document.querySelector('#cms-dashboard-content')), 600);
  } catch (error) {
    setStatus(error.message || 'Unable to save project.', true);
  } finally {
    submit.disabled = false;
  }
});

document.addEventListener('click', (event) => {
  const openButton = event.target.closest('[data-new-agent]');
  if (openButton) {
    const panel = document.querySelector('[data-agent-form-panel]');
    if (panel) panel.hidden = false;
    return;
  }
  const closeButton = event.target.closest('[data-close-agent]');
  if (closeButton) {
    const panel = closeButton.closest('[data-agent-form-panel]');
    if (panel) panel.hidden = true;
  }
});

document.addEventListener('submit', async (event) => {
  const form = event.target.closest('.cms-agent-form');
  if (!form) return;
  event.preventDefault();
  const client = window.troveSupabase;
  const status = form.querySelector('[data-agent-status]');
  const submit = form.querySelector('button[type="submit"]');
  if (!client) return;
  submit.disabled = true;
  status.textContent = 'Saving agent…';
  try {
    const { error } = await client.from('cms_agents').insert({
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      role: form.elements.role.value,
      status: form.elements.status.value,
    });
    if (error) throw error;
    form.reset();
    form.closest('[data-agent-form-panel]').hidden = true;
    await loadRealAgents(document.querySelector('#cms-dashboard-content'));
  } catch (error) {
    status.textContent = error.message || 'Unable to save agent.';
  } finally {
    submit.disabled = false;
  }
});

async function loadRealMedia(content) {
  content.innerHTML = `<div class="cms-media-page"><div class="cms-media-heading"><div><span class="cms-section-label">Content / Media Library</span><h1>Media library</h1><p>Real images uploaded to your project workspace.</p></div></div><section class="cms-content-card cms-user-loading"><div class="cms-content-card-icon">✦</div><div><h2>Loading media</h2><p>Reading project images from Supabase.</p></div></section></div>`;
  const client = window.troveSupabase;
  if (!client) return;
  const { data, error } = await client.from('cms_projects').select('id,name,category,image_url,status,cloudinary_public_id,updated_at').not('image_url', 'is', null).order('updated_at', { ascending: false });
  if (error) {
    content.querySelector('.cms-content-card h2').textContent = 'Media library is not connected';
    content.querySelector('.cms-content-card p').textContent = error.message;
    return;
  }
  const media = (data || []).map((item) => ({ ...item, category: normalizeProjectCategory(item.category) }));
  const categories = ['Templates', 'Components', 'Sections', 'Backgrounds', 'Branding', 'Website design', 'Other'];
  const renderCards = (items) => items.map((item) => `<article class="cms-media-card"><div class="cms-media-image">${renderCmsMedia(item.image_url, item.name)}<button type="button" aria-label="More actions for ${escapeHtml(item.name)}">•••</button><input type="checkbox"></div><div class="cms-media-meta"><strong title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</strong><span>${isCmsVideoUrl(item.image_url) ? 'VIDEO' : 'IMAGE'} · ${escapeHtml(item.category || 'Uncategorized')}</span></div></article>`).join('');
  const render = (items = media, category = 'All media') => {
    const grouped = categories.map((item) => `<button type="button" data-media-category="${escapeHtml(item)}"><span>▧</span> ${escapeHtml(item)} <b>${media.filter((asset) => asset.category === item).length}</b></button>`).join('');
    content.innerHTML = `<div class="cms-media-page"><div class="cms-media-heading"><div><span class="cms-section-label">Content / Media Library</span><h1>Media library</h1><p>Real images uploaded through your project workspace.</p></div><span class="cms-media-live-status"><i></i>Connected to Supabase</span></div><section class="cms-media-summary"><article><span>Total media</span><strong>${media.length}</strong><small>Database-backed images</small></article><article><span>Categories</span><strong>${categories.length}</strong><small>Used by project assets</small></article><article><span>Cloudinary assets</span><strong>${media.filter((item) => item.cloudinary_public_id).length}</strong><small>Linked image files</small></article><article><span>Latest upload</span><strong>${media[0] ? new Date(media[0].updated_at).toLocaleDateString() : '—'}</strong><small>Most recently updated</small></article></section><div class="cms-media-toolbar"><label><span>⌕</span><input type="search" placeholder="Search media"></label><select data-media-type><option>All media</option><option>Images</option></select><select data-media-sort><option value="recent">Recently added</option><option value="name">Name A-Z</option></select><button type="button">☷</button><button type="button">▦</button></div><div class="cms-media-layout"><aside class="cms-media-folders"><header><h2>Categories</h2></header><button class="is-active" type="button" data-media-category="All media"><span>▧</span> All media <b>${media.length}</b></button>${grouped}</aside><section class="cms-media-assets"><header><div><h2 data-media-heading>${escapeHtml(category)}</h2><span data-media-count>Showing ${items.length} image${items.length === 1 ? '' : 's'}</span></div><label><input type="checkbox"> Select all</label></header><div class="cms-media-grid" data-media-grid>${renderCards(items) || '<p class="cms-media-empty">No uploaded project images found.</p>'}</div></section></div></div>`;
    const activeButton = [...content.querySelectorAll('[data-media-category]')].find((button) => button.dataset.mediaCategory === category);
    content.querySelectorAll('[data-media-category]').forEach((button) => button.classList.toggle('is-active', button === activeButton));
    bindMediaControls(content, media, categories);
  };
  render();
}

function bindMediaControls(content, media, categories) {
  const search = content.querySelector('input[type="search"]');
  const sort = content.querySelector('[data-media-sort]');
  let activeCategory = 'All media';
  const apply = () => {
    const query = (search.value || '').trim().toLowerCase();
    const filtered = media.filter((item) => (activeCategory === 'All media' || item.category === activeCategory) && `${item.name} ${item.category}`.toLowerCase().includes(query));
    if (sort.value === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    content.querySelector('[data-media-grid]').innerHTML = filtered.map((item) => `<article class="cms-media-card"><div class="cms-media-image">${renderCmsMedia(item.image_url, item.name)}<button type="button" aria-label="More actions for ${escapeHtml(item.name)}">•••</button><input type="checkbox"></div><div class="cms-media-meta"><strong title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</strong><span>${isCmsVideoUrl(item.image_url) ? 'VIDEO' : 'IMAGE'} · ${escapeHtml(item.category || 'Uncategorized')}</span></div></article>`).join('') || '<p class="cms-media-empty">No matching media found.</p>';
    content.querySelector('[data-media-heading]').textContent = activeCategory;
    content.querySelector('[data-media-count]').textContent = `Showing ${filtered.length} image${filtered.length === 1 ? '' : 's'}`;
  };
  search.addEventListener('input', apply);
  sort.addEventListener('change', apply);
  content.querySelectorAll('[data-media-category]').forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.mediaCategory;
    content.querySelectorAll('[data-media-category]').forEach((item) => item.classList.toggle('is-active', item === button));
    apply();
  }));
}

async function loadRealUsers(content) {
  content.innerHTML = `<div class="cms-users-page"><div class="cms-users-heading"><div><span class="cms-section-label">Administration / Users</span><h1>Manage Users</h1><p>Loading real users from Supabase…</p></div></div><section class="cms-content-card cms-user-loading"><div class="cms-content-card-icon">✦</div><div><h2>Loading workspace users</h2><p>Checking your admin-only user directory.</p></div></section></div>`;
  const client = window.troveSupabase;
  if (!client) {
    content.querySelector('.cms-content-card p').textContent = 'Supabase is not available on this page.';
    return;
  }
  const { data, error } = await client.rpc('admin_list_users');
  if (error) {
    content.querySelector('.cms-content-card h2').textContent = 'User directory is not connected yet';
    content.querySelector('.cms-content-card p').textContent = `${error.message} Run supabase/006_admin_users_directory.sql in Supabase SQL Editor, then reload.`;
    return;
  }
  const users = data || [];
  const active = users.filter((user) => user.last_sign_in_at).length;
  const admins = users.filter((user) => user.role === 'admin').length;
  const rows = users.map((user, index) => {
    const name = user.full_name || user.email?.split('@')[0] || 'Unnamed user';
    const initials = name.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    const activeDate = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never';
    const role = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Member';
    return `<tr><td><input type="checkbox"></td><td><div class="cms-user-cell"><span class="cms-user-avatar user-avatar-${index % 5}">${initials}</span><span><strong>${name}</strong><small>${user.email || 'No email'}</small></span></div></td><td><span class="cms-role-pill">${role}</span></td><td><span class="cms-user-status ${user.last_sign_in_at ? '' : 'is-invited'}"><i></i>${user.last_sign_in_at ? 'Active' : 'Never signed in'}</span></td><td>${activeDate}</td><td><button class="cms-user-more" type="button">•••</button></td></tr>`;
  }).join('');
  content.innerHTML = `<div class="cms-users-page"><div class="cms-users-heading"><div><span class="cms-section-label">Administration / Users</span><h1>Manage Users</h1><p>Real users retrieved securely from your Supabase workspace.</p></div><button class="cms-page-action" type="button">Invite user</button></div><section class="cms-user-stats"><article><span>Total users</span><strong>${users.length}</strong><small>From Supabase Auth</small></article><article><span>Active users</span><strong>${active}</strong><small>Users with a sign-in record</small></article><article><span>Admins</span><strong>${admins}</strong><small>Workspace administrators</small></article><article><span>Last refreshed</span><strong>Now</strong><small class="positive">Live directory</small></article></section><div class="cms-users-toolbar"><label><span>⌕</span><input type="search" placeholder="Search users by name or email"></label><select><option>All roles</option><option>Admin</option><option>Member</option></select><select><option>All status</option><option>Active</option><option>Never signed in</option></select></div><section class="cms-users-directory"><header><div><h2>Workspace users</h2><span>Showing ${users.length} real users</span></div><button type="button">Refresh users</button></header><div class="cms-users-table"><table><thead><tr><th><input type="checkbox"></th><th>User</th><th>Role</th><th>Status</th><th>Last active</th><th>Actions</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No users found.</td></tr>'}</tbody></table></div><footer><span>All users loaded</span></footer></section></div>`;
}

async function loadRealProjects(content) {
  const client = window.troveSupabase;
  content.innerHTML = `<div class="cms-management-layout"><section class="cms-management-main"><div class="cms-management-heading"><div><span class="cms-section-label">Operations / Project Management</span><h1>Manage Project Templates</h1><p>Loading projects from Supabase…</p></div></div><section class="cms-content-card cms-user-loading"><div class="cms-content-card-icon">✦</div><div><h2>Loading projects</h2><p>Checking the project workspace.</p></div></section></section></div>`;
  if (!client) return;
  const { data, error } = await client.from('cms_projects').select('id,name,category,description,prompt,tags,aspect_ratio,is_premium,access_plan,status,image_url,cloudinary_public_id,updated_at').order('updated_at', { ascending: false });
  if (window.troveActiveCmsView !== 'project management') return;
  if (error) {
    content.querySelector('.cms-content-card h2').textContent = 'Project database is not connected yet';
    content.querySelector('.cms-content-card p').textContent = `${error.message} Run supabase/008_cms_projects.sql, then reload.`;
    return;
  }
  const projects = (data || []).map((project) => ({ ...project, category: normalizeProjectCategory(project.category) }));
  window.troveCmsProjects = projects;
  const renderApprovedRows = () => projects.map((project) => `<tr><td><input type="checkbox"></td><td><div class="cms-project-name-cell">${renderCmsMedia(project.image_url || 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', project.name)}<strong>${escapeHtml(project.name)}</strong></div></td><td>${escapeHtml(project.category || 'Uncategorized')}</td><td><span class="cms-project-state ${project.status === 'draft' ? 'is-draft' : ''} ${project.status === 'archived' ? 'is-archived' : ''}">${escapeHtml(project.status === 'live' ? 'Live' : project.status === 'archived' ? 'Archived' : 'Draft')}</span></td><td>${new Date(project.updated_at).toLocaleDateString()}</td><td><div class="cms-row-actions"><button type="button" data-project-action="edit" data-project-id="${project.id}" title="Edit project">edit</button><button type="button" data-project-action="duplicate" data-project-id="${project.id}" title="Duplicate project">copy</button><button type="button" data-project-action="archive" data-project-id="${project.id}" title="Archive project">box</button><button class="is-danger" type="button" data-project-action="delete" data-project-id="${project.id}" title="Delete project">delete</button></div></td></tr>`).join('');
  content.innerHTML = `<div class="cms-management-layout"><section class="cms-management-main"><div class="cms-management-heading"><h1>Manage Project Templates</h1><div class="cms-management-tools"><label><span>⌕</span><input type="search" placeholder="Search"></label><button type="button">filter</button><button type="button">sort</button><button type="button">view</button></div></div><div class="cms-management-actions"><button class="cms-create-project" data-new-project type="button">Create New Project</button><button class="cms-filter-tags" type="button">Filter Tags⌄</button></div><div class="cms-project-table"><table><thead><tr><th><input type="checkbox"></th><th>Name</th><th>Category</th><th>Status</th><th>Last Updated ↕</th><th>Actions</th></tr></thead><tbody>${renderApprovedRows() || '<tr><td colspan="6">No projects yet. Create your first project.</td></tr>'}</tbody></table><footer><span>New page</span><button disabled>‹|</button><button class="is-current">1</button><button>›</button><button>›|</button></footer></div><div class="cms-management-panels"><section><h2>Content Settings</h2><div class="cms-chip-list"><i>Hero</i><i>Landing Page</i><i>Concept ART</i><i>AI</i><i>AI PROMPT</i><i>STOCK PHOTO</i><i>TEMPLATE</i></div></section><section><h2>Categories</h2><p class="is-selected">All projects</p><p>Templates</p><p>Components</p><p>Sections</p><p>Backgrounds</p><p>Branding</p></section><section><h2>LATEST AGENCY WORK</h2><p>▣ Client: Luxury Stay branding</p><p>▣ Digital Art Series</p><p>▣ Digital Art Series</p></section><section><h2>User Prompts</h2><p>We craft timeless brands and thoughtful experiences.</p><p>We craft timeless brands and thoughtful experiences.</p></section></div></section><aside class="cms-edit-project" data-project-form><header><h2>Edit Project</h2><button data-close-project type="button">×</button></header><form class="cms-project-create-form"><label>Project Name<input name="name" required placeholder="Project name"></label><label>Category<select name="category"><option>Templates, Components</option><option>Website design</option><option>Branding</option></select></label><label>Tags<div class="cms-edit-tags"><i>Hero</i><i>Landing Page</i><i>SaaS</i><i>Agency</i><i>Creative</i><i>Technology</i></div><input name="tags" placeholder="Add tags separated by commas"></label><label class="cms-premium-toggle"><input name="is_premium" type="checkbox"><span>Premium product</span><small>Show a Premium badge in the public library.</small></label><label>Primary Image<input name="image" type="file" accept="image/*,video/*" data-media-file required></label><label>Or paste image/video URL<input name="media_url" type="url" placeholder="https://…"><small>Direct image/video URL; use a video file upload for YouTube or Vimeo.</small></label><label>Short description<textarea name="description" placeholder="A brief description shown on the product page"></textarea></label><label>Prompt<textarea name="prompt" placeholder="Full prompt copied by users"></textarea></label><p class="cms-project-form-status" data-project-status></p><button class="cms-page-action" type="submit">Save project</button></form></aside></div>`;
  return;
  const renderRows = () => projects.map((project) => `<tr><td><input type="checkbox"></td><td><div class="cms-page-cell"><span class="cms-page-icon">▱</span><span><strong>${escapeHtml(project.name)}</strong><small>${escapeHtml(project.description || 'No description')}</small></span></div></td><td>${escapeHtml(project.category || 'Uncategorized')}</td><td><span class="cms-page-status ${project.status === 'draft' ? 'is-draft' : ''}"><i></i>${escapeHtml(project.status || 'draft')}</span></td><td>${new Date(project.updated_at).toLocaleDateString()}</td><td><button class="cms-page-more" type="button">•••</button></td></tr>`).join('');
  content.innerHTML = `<div class="cms-management-layout"><section class="cms-management-main"><div class="cms-management-heading"><div><span class="cms-section-label">Operations / Project Management</span><h1>Manage Project Templates</h1><p>Real projects saved in your Supabase workspace.</p></div><button class="cms-create-project" data-new-project type="button">Create New Project</button></div><div class="cms-project-table"><table><thead><tr><th><input type="checkbox"></th><th>Name</th><th>Category</th><th>Status</th><th>Last Updated</th><th>Actions</th></tr></thead><tbody>${renderRows() || '<tr><td colspan="6">No projects yet. Create your first project.</td></tr>'}</tbody></table><footer><span>${projects.length} saved project${projects.length === 1 ? '' : 's'}</span></footer></div></section><aside class="cms-edit-project" data-project-form hidden><header><h2>Create Project</h2><button data-close-project type="button">×</button></header><form class="cms-project-create-form"><label>Project name<input name="name" required placeholder="Project name"></label><label>Category<input name="category" required placeholder="Website design"></label><label>Description<textarea name="description" placeholder="Describe this project"></textarea></label><label>Tags<input name="tags" placeholder="branding, template, no-code"></label><label>Project image<input name="image" type="file" accept="image/*,video/*" data-media-file required></label><label>Or paste image/video URL<input name="media_url" type="url" placeholder="https://…"><small>Direct image/video URL</small></label><div class="cms-upload-preview" data-upload-preview hidden></div><p class="cms-project-form-status" data-project-status></p><button class="cms-page-action" type="submit">Save project</button></form></aside></div>`;
}

function enhanceProjectStatusControls(content, projects) {
  const statusOptions = '<option value="draft">Draft</option><option value="live">Live</option><option value="archived">Archived</option>';
  content.querySelectorAll('.cms-project-table tbody tr').forEach((row, index) => {
    const project = projects[index];
    const cell = row.children[3];
    if (!project || !cell || cell.querySelector('[data-project-status-id]')) return;
    cell.innerHTML = `<select class="cms-project-status-select" data-project-status-id="${project.id}" aria-label="Set status for ${escapeHtml(project.name)}">${statusOptions}</select>`;
    cell.querySelector('select').value = project.status || 'draft';
  });
  const form = content.querySelector('[data-project-form] form');
  if (form && !form.elements.status) {
    const label = document.createElement('label');
    label.innerHTML = `Status<select name="status"><option value="draft">Draft</option><option value="live">Live</option><option value="archived">Archived</option></select>`;
    form.querySelector('[name="name"]')?.closest('label')?.after(label);
  }
}

new MutationObserver(() => {
  const content = document.querySelector('#cms-dashboard-content');
  if (content && window.troveCmsProjects) enhanceProjectStatusControls(content, window.troveCmsProjects);
}).observe(document.body, { childList: true, subtree: true });

function setProjectCategoryOptions(form, currentValue = '') {
  const select = form?.elements?.category;
  if (!select || select.tagName !== 'SELECT') return;
  const categories = ['Templates', 'Components', 'Sections', 'Backgrounds', 'Branding', 'Website design', 'Other'];
  const options = currentValue && !categories.includes(currentValue) ? [currentValue, ...categories] : categories;
  select.innerHTML = options.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
  if (currentValue) select.value = currentValue;
}

function normalizeProjectCategory(category) {
  const value = String(category || '').trim();
  return /^(templates\s*[,/&]\s*components)$/i.test(value) ? 'Templates' : (value || 'Uncategorized');
}

function normalizeProjectAspectRatio(aspectRatio) {
  return aspectRatio === '9:16' ? '9:16' : '16:9';
}

const projectTagsByCategory = {
  Templates: ['Hero', 'Landing Page', 'SaaS', 'Agency', 'Creative', 'Technology', 'No-code'],
  Components: ['UI Kit', 'Navigation', 'Forms', 'Buttons', 'Cards', 'Responsive', 'Reusable'],
  Sections: ['Hero', 'Features', 'Testimonials', 'Pricing', 'FAQ', 'CTA', 'Footer'],
  Backgrounds: ['Gradient', 'Texture', 'Abstract', '3D', 'Pattern', 'Motion', 'Atmosphere'],
  Branding: ['Logo', 'Identity', 'Typography', 'Packaging', 'Print', 'Brand Strategy', 'Guidelines'],
  'Website design': ['Portfolio', 'Landing Page', 'E-commerce', 'SaaS', 'Responsive', 'No-code', 'Editorial'],
  Other: ['AI', 'AI Prompt', 'Stock Photo', 'Experimental', 'Inspiration']
};

function readProjectTags(input) {
  return [...new Set((input?.value || '').split(',').map((tag) => tag.trim()).filter(Boolean))];
}

function setProjectTags(form, category, selectedTags = []) {
  const input = form?.elements?.tags;
  const container = form?.querySelector('.cms-edit-tags');
  if (!input || !container) return;
  const suggestions = projectTagsByCategory[category] || projectTagsByCategory.Other;
  const selected = new Set(selectedTags.map((tag) => tag.trim()).filter(Boolean));
  container.innerHTML = suggestions.map((tag) => `<i class="${selected.has(tag) ? 'is-selected' : ''}" data-project-tag="${escapeHtml(tag)}" role="button" tabindex="0">${escapeHtml(tag)}</i>`).join('');
}

document.addEventListener('input', (event) => {
  const urlInput = event.target.closest('.cms-project-create-form input[name="media_url"]');
  if (urlInput?.form?.elements?.image) urlInput.form.elements.image.required = !urlInput.value.trim() && !urlInput.form.elements.image.files?.length;
});
document.addEventListener('change', (event) => {
  const statusSelect = event.target.closest('[data-project-status-id]');
  if (statusSelect) {
    const project = (window.troveCmsProjects || []).find((item) => item.id === statusSelect.dataset.projectStatusId);
    if (project && window.troveSupabase) {
      statusSelect.disabled = true;
      window.troveSupabase.from('cms_projects').update({ status: statusSelect.value }).eq('id', project.id).then(({ error }) => {
        statusSelect.disabled = false;
        if (error) window.alert(error.message);
        else { project.status = statusSelect.value; }
      });
    }
    return;
  }
  const select = event.target.closest('[data-project-form] select[name="category"]');
  if (select) {
    select.form.elements.tags.value = '';
    setProjectTags(select.form, select.value, []);
  }
});

document.addEventListener('input', (event) => {
  const input = event.target.closest('[data-project-form] input[name="tags"]');
  if (input) setProjectTags(input.form, input.form.elements.category.value, readProjectTags(input));
});

document.addEventListener('click', (event) => {
  const chip = event.target.closest('[data-project-tag]');
  if (!chip) return;
  const form = chip.closest('form');
  const input = form?.elements?.tags;
  if (!input) return;
  const tag = chip.dataset.projectTag;
  const tags = readProjectTags(input);
  const nextTags = tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag];
  input.value = nextTags.join(', ');
  setProjectTags(form, form.elements.category.value, nextTags);
});

document.addEventListener('pointerdown', (event) => {
  const select = event.target.closest('[data-project-form] select[name="category"]');
  if (select) setProjectCategoryOptions(select.form, select.form.dataset.projectId ? select.value : '');
}, true);

function initializeProjectFormOptions() {
  const managementMain = document.querySelector('.cms-management-main');
  if (managementMain) initializeProjectQuickCards(managementMain);
  const form = document.querySelector('[data-project-form] form');
  if (!form || form.dataset.categoryOptionsReady) return;
  if (!form.elements.aspect_ratio) {
    const label = document.createElement('label');
    label.innerHTML = '<span>Card aspect ratio</span><select name="aspect_ratio"><option value="16:9">16:9 landscape</option><option value="9:16">9:16 portrait</option></select>';
    form.querySelector('[name="category"]')?.closest('label')?.after(label);
  }
  if (!form.elements.access_plan) {
    const label = document.createElement('label');
    label.innerHTML = '<span>Required access plan</span><select name="access_plan"><option value="free">Free</option><option value="starter">Starter</option><option value="studio">Studio</option><option value="lifetime">Lifetime</option></select>';
    form.querySelector('[name="is_premium"]')?.closest('label')?.after(label) || form.querySelector('[name="category"]')?.closest('label')?.after(label);
  }
  setProjectCategoryOptions(form);
  setProjectTags(form, form.elements.category.value, []);
  form.dataset.categoryOptionsReady = 'true';
}

function initializeProjectQuickCards(main) {
  if (main.dataset.quickCardsReady) return;
  const table = main.querySelector('.cms-project-table');
  if (!table) return;
  main.querySelector('.cms-management-panels')?.remove();
  const projects = window.troveCmsProjects || [];
  const cards = document.createElement('section');
  cards.className = 'cms-project-quick-cards';
  cards.setAttribute('aria-label', 'Project summary');
  cards.innerHTML = `<article><span>Total projects</span><strong data-quick-total>${projects.length}</strong><small>Saved in workspace</small></article><article><span>Drafts</span><strong data-quick-drafts>${projects.filter((project) => project.status === 'draft').length}</strong><small>Awaiting review</small></article><article><span>Archived</span><strong data-quick-archived>${projects.filter((project) => project.status === 'archived').length}</strong><small>Hidden from active work</small></article><article><span>Categories</span><strong data-quick-categories>${new Set(projects.map((project) => project.category).filter(Boolean)).size}</strong><small>Types in use</small></article>`;
  table.parentNode.insertBefore(cards, table);
  const search = main.querySelector('.cms-management-tools input[type="search"]');
  const rows = [...table.querySelectorAll('tbody tr')];
  const update = () => {
    const query = (search?.value || '').trim().toLowerCase();
    const filtered = projects.filter((project) => `${project.name} ${project.category} ${project.status} ${project.description} ${(project.tags || []).join(' ')}`.toLowerCase().includes(query));
    rows.forEach((row, index) => { row.hidden = Boolean(projects[index] && query && !filtered.includes(projects[index])); });
    cards.querySelector('[data-quick-total]').textContent = filtered.length;
    cards.querySelector('[data-quick-drafts]').textContent = filtered.filter((project) => project.status === 'draft').length;
    cards.querySelector('[data-quick-archived]').textContent = filtered.filter((project) => project.status === 'archived').length;
    cards.querySelector('[data-quick-categories]').textContent = new Set(filtered.map((project) => project.category).filter(Boolean)).size;
  };
  search?.addEventListener('input', update);
  main.dataset.quickCardsReady = 'true';
}

const projectFormObserver = new MutationObserver(initializeProjectFormOptions);
if (document.body) projectFormObserver.observe(document.body, { childList: true, subtree: true });
else document.addEventListener('DOMContentLoaded', () => projectFormObserver.observe(document.body, { childList: true, subtree: true }), { once: true });

function setProjectImagePreview(form, source, label = 'Current image') {
  const input = form?.elements?.image;
  if (!input) return;
  let preview = form.querySelector('[data-upload-preview]');
  if (!preview) {
    preview = document.createElement('div');
    preview.className = 'cms-upload-preview';
    preview.dataset.uploadPreview = '';
    input.closest('label')?.appendChild(preview);
  }
  if (!source) {
    preview.hidden = true;
    preview.innerHTML = '';
    return;
  }
  preview.hidden = false;
  preview.innerHTML = `${renderCmsMedia(source, label)}<span>${escapeHtml(label)}</span>`;
}

function isCmsVideoUrl(source) {
  return /\/video\/upload\/|\.(mp4|webm|mov|m3u8|mpd)(?:[?#]|$)/i.test(source || '');
}

function renderCmsMedia(source, alt = '') {
  const safeSource = escapeHtml(source);
  return isCmsVideoUrl(source)
    ? `<video src="${safeSource}" autoplay loop muted playsinline preload="metadata" aria-label="${escapeHtml(alt)}"></video>`
    : `<img src="${safeSource}" alt="${escapeHtml(alt)}">`;
}

document.addEventListener('input', (event) => {
  const urlInput = event.target.closest('.cms-project-create-form input[name="media_url"]');
  if (urlInput?.form?.elements?.image) urlInput.form.elements.image.required = !urlInput.value.trim() && !urlInput.form.elements.image.files?.length;
});
document.addEventListener('change', (event) => {
  const input = event.target.closest('.cms-project-create-form input[name="image"]');
  const file = input?.files?.[0];
  if (input?.form?.elements?.image) input.form.elements.image.required = !file && !input.form.elements.media_url?.value.trim();
  if (file) setProjectImagePreview(input.form, URL.createObjectURL(file), 'New media selected');
});

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

document.addEventListener('click', (event) => {
  const action = event.target.closest('.cms-folder-edit, .cms-folder-reorder button, .cms-new-folder');
  if (!action) return;
  const card = action.closest('.cms-managed-folder');
  if (action.classList.contains('cms-new-folder')) {
    const name = window.prompt('Folder name');
    if (!name?.trim()) return;
    window.troveCmsFolders = window.troveCmsFolders || [];
    window.troveCmsFolders.push([name.trim(), 0, 'https://framerusercontent.com/images/S1XoYBF0d1PDfj6sBXkfCybfEQ.png?width=1402&height=1122', 'https://framerusercontent.com/images/qyI8WIzV0dnYvgWN6icaU57A0.png?width=1536&height=1024']);
    document.querySelectorAll('.cms-dashboard-sidebar .filter-link').forEach((item) => { if (item.textContent.toLowerCase().includes('content') && !item.textContent.toLowerCase().includes('site')) item.click(); });
    return;
  }
  if (!card) return;
  if (action.dataset.folderAction === 'rename') {
    const heading = card.querySelector('h2');
    const name = window.prompt('Rename folder', heading?.textContent || '');
    if (name?.trim() && heading) heading.textContent = name.trim();
    return;
  }
  const target = action.dataset.folderAction === 'left' ? card.previousElementSibling : card.nextElementSibling;
  if (target && target.classList.contains('cms-managed-folder')) {
    const grid = card.parentElement;
    if (action.dataset.folderAction === 'left') grid.insertBefore(card, target); else grid.insertBefore(target, card);
  }
});
