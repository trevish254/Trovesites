import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'GET') return json({ error: 'GET required' }, 405);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: request.headers.get('Authorization') || '' } } },
  );
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: 'Authentication required' }, 401);

  const { data: role, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();
  if (roleError || !role) return json({ error: 'Admin access required' }, 403);

  const token = Deno.env.get('VERCEL_API_TOKEN');
  const teamId = Deno.env.get('VERCEL_TEAM_ID');
  const projectId = Deno.env.get('VERCEL_PROJECT_ID');
  if (!token || !teamId || !projectId) return json({ error: 'Vercel secrets are not configured' }, 500);

  const params = new URLSearchParams({ teamId, projectId, limit: '20' });
  const [response, websiteCheck, supabaseCheck] = await Promise.all([
    fetch(`https://api.vercel.com/v6/deployments?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    measureEndpoint('https://trovesites.vercel.app/'),
    measureEndpoint(`${Deno.env.get('SUPABASE_URL')}/auth/v1/health`),
  ]);
  const result = await response.json();
  if (!response.ok) return json({ error: result.error?.message || 'Vercel API request failed' }, 502);

  const deployments = Array.isArray(result.deployments) ? result.deployments : [];
  const latest = deployments[0] || null;
  const successful = deployments.filter((item: any) => item.state === 'READY');
  const failed = deployments.filter((item: any) => ['ERROR', 'CANCELED'].includes(item.state));
  const buildTimes = successful
    .map((item: any) => Number(item.ready) - Number(item.created))
    .filter((value: number) => Number.isFinite(value) && value >= 0);

  return json({
    projectId,
    teamId,
    fetchedAt: new Date().toISOString(),
    latest,
    deployments,
    summary: {
      total: deployments.length,
      successful: successful.length,
      failed: failed.length,
      averageBuildMs: buildTimes.length ? Math.round(buildTimes.reduce((sum: number, value: number) => sum + value, 0) / buildTimes.length) : null,
    },
    health: {
      website: websiteCheck,
      supabase: supabaseCheck,
      checkedAt: new Date().toISOString(),
    },
  });
});

async function measureEndpoint(url: string) {
  const started = performance.now();
  try {
    const response = await fetch(url, { method: 'GET' });
    return {
      ok: response.ok || response.status < 500,
      status: response.status,
      responseMs: Math.round(performance.now() - started),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      responseMs: Math.round(performance.now() - started),
      error: error instanceof Error ? error.message : 'Request failed',
    };
  }
}
