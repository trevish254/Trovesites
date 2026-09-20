import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

const sha1 = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-1', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'POST required' }, 405);

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

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return json({ error: 'A file field is required' }, 400);
  if (file.size > 10 * 1024 * 1024) return json({ error: 'Maximum file size is 10 MB' }, 413);

  const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
  const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
  const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');
  if (!cloudName || !apiKey || !apiSecret) return json({ error: 'Cloudinary server secrets are not configured' }, 500);

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = String(form.get('public_id') || `trovesites/${user.id}/${crypto.randomUUID()}`);
  const signature = await sha1(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`);
  const upload = new FormData();
  upload.append('file', file);
  upload.append('api_key', apiKey);
  upload.append('timestamp', String(timestamp));
  upload.append('public_id', publicId);
  upload.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: 'POST', body: upload });
  const result = await response.json();
  if (!response.ok) return json({ error: result.error?.message || 'Cloudinary upload failed' }, 502);

  return json({ secure_url: result.secure_url, public_id: result.public_id, width: result.width, height: result.height, format: result.format });
});
