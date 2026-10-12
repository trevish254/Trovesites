const crypto = require('crypto');

module.exports.config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function verifySignature(rawBody, req) {
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;
  const webhookId = req.headers['webhook-id'];
  const timestamp = req.headers['webhook-timestamp'];
  const signatureHeader = req.headers['webhook-signature'];
  if (!secret || !webhookId || !timestamp || !signatureHeader) return false;
  const encodedSecret = String(secret).replace(/^whsec_/, '');
  const key = Buffer.from(encodedSecret, 'base64');
  const signedContent = `${webhookId}.${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', key.length ? key : secret).update(signedContent).digest('base64');
  return String(signatureHeader).split(' ').some((value) => {
    const supplied = value.replace(/^v\d+,/, '');
    return supplied.length === expected.length && crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
  });
}

function supabaseRequest(path, options = {}) {
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('Supabase server credentials are not configured');
  return fetch(`${base}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
}

function pick(data, ...paths) {
  for (const path of paths) {
    let value = data;
    for (const part of path.split('.')) value = value?.[part];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
}

function eventData(event) { return event.data || event.payload?.data || event.payload || {}; }

function normalizeStatus(type, data) {
  const explicit = pick(data, 'status', 'subscription.status');
  if (explicit) return String(explicit).toLowerCase();
  if (/cancel|expire|unpaid|failed/i.test(type)) return 'cancelled';
  if (/pause|hold/i.test(type)) return 'on_hold';
  return 'active';
}

async function syncEvent(event, webhookId) {
  const data = eventData(event);
  const type = String(event.type || event.event_type || 'unknown').toLowerCase();
  const metadata = pick(data, 'metadata', 'subscription.metadata', 'checkout.metadata') || {};
  const userId = pick(metadata, 'user_id', 'userId');
  const customerId = pick(data, 'customer.customer_id', 'customer_id', 'subscription.customer_id');
  const subscriptionId = pick(data, 'subscription_id', 'subscription.id', 'id');
  const productId = pick(data, 'product_id', 'subscription.product_id');

  const eventResponse = await supabaseRequest('dodo_webhook_events', {
    method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
    body: JSON.stringify({ webhook_id: webhookId, event_type: type, payload: event }),
  });
  if (!eventResponse.ok) throw new Error(`Could not record webhook: ${await eventResponse.text()}`);
  if (!(await eventResponse.json()).length) return;

  let resolvedUserId = userId;
  if (!resolvedUserId && customerId) {
    const lookup = await supabaseRequest(`billing_subscriptions?select=user_id&dodo_customer_id=eq.${encodeURIComponent(customerId)}&limit=1`);
    resolvedUserId = (await lookup.json())[0]?.user_id;
  }
  if (!resolvedUserId) { console.warn('Dodo webhook has no mapped user', { webhookId, type, customerId }); return; }
  if (!/subscription|payment|checkout|invoice|refund/.test(type)) return;

  const amountRaw = pick(data, 'amount', 'recurring_pre_tax_amount', 'subscription.amount', 'total_amount');
  const amount = typeof amountRaw === 'number' ? amountRaw / 100 : amountRaw;
  const plan = pick(metadata, 'plan') || (productId === process.env.DODO_STUDIO_PRODUCT_ID ? 'studio' : productId === process.env.DODO_STARTER_PRODUCT_ID ? 'starter' : productId === process.env.DODO_LIFETIME_PRODUCT_ID ? 'lifetime' : 'paid');
  const response = await supabaseRequest('billing_subscriptions', {
    method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      user_id: resolvedUserId, dodo_customer_id: customerId, dodo_subscription_id: subscriptionId,
      dodo_product_id: productId, plan, status: normalizeStatus(type, data), amount,
      currency: pick(data, 'currency', 'subscription.currency') || 'USD',
      interval: pick(data, 'interval', 'subscription.interval'),
      current_period_start: pick(data, 'current_period_start', 'subscription.current_period_start', 'period_start'),
      current_period_end: pick(data, 'current_period_end', 'next_billing_date', 'subscription.current_period_end', 'period_end'),
      cancel_at_period_end: Boolean(pick(data, 'cancel_at_period_end', 'subscription.cancel_at_period_end')),
      updated_at: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error(`Could not sync subscription: ${await response.text()}`);
}

module.exports = async function dodoWebhook(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  try {
    const rawBody = await readRawBody(req);
    if (!verifySignature(rawBody, req)) return res.status(401).json({ error: 'Invalid webhook signature' });
    await syncEvent(JSON.parse(rawBody), String(req.headers['webhook-id']));
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Dodo webhook processing failed', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};
