function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

module.exports = async function supabaseHeartbeat(req, res) {
  if ((req.method || 'GET') !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
    return sendJson(res, 401, { error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    console.error('Supabase heartbeat is missing server configuration');
    return sendJson(res, 500, { error: 'Supabase heartbeat is not configured' });
  }

  try {
    // Keep this deliberately small: an existing table, one selected column, and
    // at most one row. RLS still applies to this request.
    const response = await fetch(`${supabaseUrl}/rest/v1/user_roles?select=user_id&limit=1`, {
      headers: { apikey: anonKey, Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error('Supabase heartbeat failed', response.status);
      return sendJson(res, 503, { error: 'Supabase heartbeat failed', status: response.status });
    }

    return sendJson(res, 200, { ok: true, checkedAt: new Date().toISOString(), operation: 'read' });
  } catch (error) {
    console.error('Supabase heartbeat request failed', error);
    return sendJson(res, 503, { error: 'Supabase heartbeat failed' });
  }
};
