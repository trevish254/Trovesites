const products = {
  starter: process.env.DODO_STARTER_PRODUCT_ID,
  studio: process.env.DODO_STUDIO_PRODUCT_ID,
  lifetime: process.env.DODO_LIFETIME_PRODUCT_ID,
};
const dodoEnvironment = process.env.DODO_PAYMENTS_ENVIRONMENT
  || (process.env.DODO_PAYMENTS_API_KEY?.startsWith('dodo_live_') ? 'live_mode' : 'test_mode');
const dodoBaseUrl = dodoEnvironment === 'live_mode'
  ? 'https://live.dodopayments.com'
  : 'https://test.dodopayments.com';

function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function getAuthenticatedUser(req) {
  const authorization = req.headers.authorization || '';
  if (!authorization.startsWith('Bearer ') || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return null;
  const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: authorization },
  });
  return response.ok ? response.json() : null;
}

module.exports = async function checkout(req, res) {
  const method = req.method || 'GET';
  if (method !== 'GET' && method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  let input = req.query || {};
  if (method === 'POST') {
    try {
      input = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    } catch {
      return sendJson(res, 400, { error: 'Invalid request body' });
    }
  }

  const plan = String(input.plan || '').toLowerCase();
  const productId = products[plan];
  if (!productId) return sendJson(res, 400, { error: 'Unknown or unconfigured plan' });
  if (!process.env.DODO_PAYMENTS_API_KEY) return sendJson(res, 500, { error: 'Dodo Payments is not configured' });

  const user = await getAuthenticatedUser(req);
  if (!user?.id) return sendJson(res, 401, { error: 'Sign in before choosing a plan' });

  const origin = process.env.SITE_ORIGIN || 'https://trovesites.vercel.app';
  const response = await fetch(`${dodoBaseUrl}/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_cart: [{ product_id: productId, quantity: 1 }],
      return_url: `${origin}/payment/success/?plan=${encodeURIComponent(plan)}`,
      customer: { email: user.email, name: user.user_metadata?.full_name || user.email },
      metadata: { plan, source: 'trovesites-pricing', user_id: user.id },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.checkout_url) {
    console.error('Dodo checkout error', response.status, payload);
    return sendJson(res, 502, { error: 'Unable to create checkout session' });
  }

  if (method === 'GET') {
    res.statusCode = 302;
    res.setHeader('Location', payload.checkout_url);
    return res.end();
  }
  return sendJson(res, 200, { checkout_url: payload.checkout_url });
};
