function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
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

  const roleResponse = await fetch(`${supabaseUrl}/rest/v1/user_roles?select=role&user_id=eq.${encodeURIComponent(user.id)}&role=eq.admin&limit=1`, { headers });
  if (!roleResponse.ok) return null;
  const roles = await roleResponse.json();
  return roles.some((role) => role.role === 'admin') ? user : null;
}

module.exports = async function billingOverview(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const user = await getAdminUser(req);
    if (!user) return sendJson(res, 403, { error: 'Admin access required' });

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) return sendJson(res, 503, { error: 'Billing analytics is not configured' });

    const headers = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` };
    const [subscriptionsResponse, invoicesResponse] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/billing_subscriptions?select=plan,status,amount,currency,interval,current_period_end,cancel_at_period_end,created_at,updated_at&order=updated_at.desc&limit=500`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/billing_invoices?select=dodo_invoice_id,amount,currency,status,issued_at,created_at&order=issued_at.desc.nullslast&limit=50`, { headers }),
    ]);
    if (!subscriptionsResponse.ok || !invoicesResponse.ok) {
      console.error('Billing analytics read failed', subscriptionsResponse.status, invoicesResponse.status);
      return sendJson(res, 502, { error: 'Unable to load billing analytics' });
    }

    const [subscriptions, invoices] = await Promise.all([subscriptionsResponse.json(), invoicesResponse.json()]);
    return sendJson(res, 200, {
      subscriptions: Array.isArray(subscriptions) ? subscriptions : [],
      invoices: Array.isArray(invoices) ? invoices : [],
      fetched_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Billing analytics lookup failed', error?.message || 'Unknown error');
    return sendJson(res, 500, { error: 'Unable to load billing analytics right now' });
  }
};
