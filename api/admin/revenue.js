const PAGE_SIZE = 100;
const MAX_PAGES = 100;

function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function getDodoBaseUrl() {
  return getDodoEnvironment() === 'live_mode'
    ? 'https://live.dodopayments.com'
    : 'https://test.dodopayments.com';
}

function getDodoEnvironment() {
  return process.env.DODO_PAYMENTS_ENVIRONMENT
    || (process.env.DODO_PAYMENTS_API_KEY?.startsWith('dodo_live_') ? 'live_mode' : 'test_mode');
}

async function getAdminUser(req) {
  const authorization = req.headers.authorization || '';
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!authorization.startsWith('Bearer ') || !supabaseUrl || !anonKey) return null;

  const headers = { apikey: anonKey, Authorization: authorization };
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers });
  if (!userResponse.ok) return null;
  const user = await userResponse.json();
  if (!user?.id) return null;

  const roleUrl = new URL(`${supabaseUrl}/rest/v1/user_roles`);
  roleUrl.search = new URLSearchParams({ select: 'role', user_id: `eq.${user.id}`, role: 'eq.admin', limit: '1' });
  const roleResponse = await fetch(roleUrl, { headers });
  if (!roleResponse.ok) return null;
  const roles = await roleResponse.json();
  return roles.some((role) => role.role === 'admin') ? user : null;
}

module.exports = async function adminRevenue(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const user = await getAdminUser(req);
    if (!user) return sendJson(res, 403, { error: 'Admin access required' });
    if (!process.env.DODO_PAYMENTS_API_KEY) return sendJson(res, 503, { error: 'Dodo Payments is not configured' });

    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const environment = getDodoEnvironment();
    const byCurrency = {};
    let paymentCount = 0;

    for (let pageNumber = 0; pageNumber < MAX_PAGES; pageNumber += 1) {
      const query = new URLSearchParams({
        created_at_gte: monthStart.toISOString(),
        created_at_lte: now.toISOString(),
        status: 'succeeded',
        page_size: String(PAGE_SIZE),
        page_number: String(pageNumber),
      });
      const response = await fetch(`${getDodoBaseUrl()}/payments?${query}`, {
        headers: { Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}` },
      });
      if (!response.ok) {
        console.error('Dodo revenue request failed', response.status);
        return sendJson(res, 502, { error: 'Unable to retrieve Dodo payments' });
      }

      const payload = await response.json();
      const items = Array.isArray(payload.items) ? payload.items : [];
      for (const payment of items) {
        const currency = String(payment.currency || 'USD').toUpperCase();
        const amount = Number(payment.total_amount);
        if (!Number.isFinite(amount)) continue;
        byCurrency[currency] = (byCurrency[currency] || 0) + amount;
        paymentCount += 1;
      }
      if (items.length < PAGE_SIZE) break;
    }

    return sendJson(res, 200, {
      period: monthStart.toISOString().slice(0, 7),
      environment,
      payment_count: paymentCount,
      by_currency: byCurrency,
    });
  } catch (error) {
    console.error('Dodo revenue lookup failed', error?.message || 'Unknown error');
    return sendJson(res, 500, { error: 'Unable to load revenue right now' });
  }
};
