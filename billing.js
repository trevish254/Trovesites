const billingClient = window.troveSupabase;

const billingDateParts = () => {
  const now = new Date();
  const today = [now.getUTCFullYear(), String(now.getUTCMonth() + 1).padStart(2, '0'), String(now.getUTCDate()).padStart(2, '0')].join('-');
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = monday.getUTCDay();
  monday.setUTCDate(monday.getUTCDate() - (day === 0 ? 6 : day - 1));
  return { today, weekStart: [monday.getUTCFullYear(), String(monday.getUTCMonth() + 1).padStart(2, '0'), String(monday.getUTCDate()).padStart(2, '0')].join('-') };
};

const setBillingUsage = (row, value, limit) => {
  if (!row) return;
  row.querySelector('b').textContent = `${value} of ${limit}`;
  row.querySelector('em').style.width = `${Math.min(100, Math.round((value / limit) * 100))}%`;
};

function applySubscription(subscription) {
  const paid = subscription && subscription.status !== 'cancelled' && subscription.status !== 'expired';
  const planKey = paid ? String(subscription.plan || 'starter').toLowerCase() : 'free';
  const limits = { free: [3, 5, 3], starter: [10, 15, 7], studio: ['Unlimited', 'Unlimited', 'Unlimited'], lifetime: ['Unlimited', 'Unlimited', 'Unlimited'] }[planKey] || [3, 5, 3];
  const features = {
    free: ['3 prompts per day', 'Personal project use', '3 component visits per week', '5 component copies per day', 'Fair-use library access'],
    starter: ['Website prompt library', 'Curated background videos', 'Essential UI sections', 'Starter Figma components', 'Personal project use'],
    studio: ['Complete website prompt library', 'Premium background video library', 'Full UI components library', 'Complete Figma component kits', 'Commercial brand use'],
    lifetime: ['Everything in Studio', 'Lifetime library access', 'Future asset updates', 'New prompt and UI drops', 'Commercial brand use'],
  }[planKey] || [];
  const plan = paid ? `${subscription.plan || 'Paid'} plan` : 'Free plan';
  const amount = paid && subscription.amount != null ? `$${Number(subscription.amount).toFixed(2)}` : '$0';
  const summary = document.querySelectorAll('.cms-billing-summary article');
  if (summary[0]) { summary[0].querySelector('strong').textContent = paid ? (subscription.plan || 'Paid') : 'Free'; summary[0].querySelector('small').textContent = paid ? (subscription.current_period_end ? `Renews ${new Date(subscription.current_period_end).toLocaleDateString()}` : 'Active subscription') : 'No active subscription'; }
  if (summary[1]) summary[1].querySelector('strong').textContent = amount;
  if (summary[2]) summary[2].querySelector('strong').textContent = `${limits[0]} / day`;
  if (summary[3]) summary[3].querySelector('strong').textContent = `${limits[1]} / day`;
  const card = document.querySelector('.cms-plan-card');
  if (!card) return;
  card.querySelector('h2').textContent = plan;
  card.querySelector('.cms-plan-price strong').textContent = amount;
  card.querySelector('.cms-plan-price span').textContent = paid ? '/ month' : '/ month';
  card.querySelector('.cms-plan-badge').textContent = paid ? (subscription.status || 'Active') : 'Active';
  card.querySelector('header p').textContent = paid ? 'Your verified Dodo subscription is active for this account.' : 'Explore the library with fair-use access before choosing a paid plan.';
  const featureRows = card.querySelectorAll('.cms-plan-features p');
  featureRows.forEach((row, index) => { if (features[index]) row.innerHTML = `<i>✓</i> ${features[index]}`; });
}

async function loadBilling() {
  if (!billingClient) return;
  const { data: sessionData } = await billingClient.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) { applySubscription(null); return; }
  const { today, weekStart } = billingDateParts();
  const [subscriptionResult, dailyResult, weeklyResult] = await Promise.all([
    billingClient.from('billing_subscriptions').select('plan,status,amount,currency,current_period_end,cancel_at_period_end').eq('user_id', userId).maybeSingle(),
    billingClient.from('user_daily_usage').select('prompt_copies,component_copies').eq('user_id', userId).eq('usage_date', today).maybeSingle(),
    billingClient.from('user_weekly_usage').select('component_visits').eq('user_id', userId).eq('week_start', weekStart).maybeSingle(),
  ]);
  if (subscriptionResult.error) console.warn('Unable to load billing subscription:', subscriptionResult.error.message);
  if (dailyResult.error || weeklyResult.error) console.warn('Unable to load billing usage:', dailyResult.error?.message || weeklyResult.error?.message);
  applySubscription(subscriptionResult.data);
  const daily = dailyResult.data || {};
  const weekly = weeklyResult.data || {};
  const summary = document.querySelectorAll('.cms-billing-summary article');
  const planKey = subscriptionResult.data?.status === 'active' || subscriptionResult.data?.status === 'trialing' ? String(subscriptionResult.data.plan || 'starter').toLowerCase() : 'free';
  const limits = { free: [3, 5, 3], starter: [10, 15, 7], studio: [Infinity, Infinity, Infinity], lifetime: [Infinity, Infinity, Infinity] }[planKey] || [3, 5, 3];
  if (summary[2]) summary[2].querySelector('strong').textContent = `${daily.prompt_copies || 0} / ${limits[0] === Infinity ? 'Unlimited' : limits[0]}`;
  if (summary[3]) summary[3].querySelector('strong').textContent = `${daily.component_copies || 0} / ${limits[1] === Infinity ? 'Unlimited' : limits[1]}`;
  const usageRows = document.querySelectorAll('.cms-usage-row');
  setBillingUsage(usageRows[0], daily.prompt_copies || 0, limits[0] === Infinity ? Math.max(1, daily.prompt_copies || 0) : limits[0]);
  setBillingUsage(usageRows[1], daily.component_copies || 0, limits[1] === Infinity ? Math.max(1, daily.component_copies || 0) : limits[1]);
  setBillingUsage(usageRows[2], weekly.component_visits || 0, limits[2] === Infinity ? Math.max(1, weekly.component_visits || 0) : limits[2]);
}

loadBilling();
if (billingClient) billingClient.auth.onAuthStateChange(() => window.setTimeout(loadBilling, 0));
