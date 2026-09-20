/*
 * The anon key is intended for browser use and is protected by Supabase
 * Row Level Security. Never put the service_role key in this file.
 */
const SUPABASE_URL = 'https://hluzosevovvethtpwtut.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsdXpvc2V2b3Z2ZXRodHB3dHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NjUyNjIsImV4cCI6MjEwNTM0MTI2Mn0.rmfXpJIKG_UNX0-l1GuelA7t0-D-lPCCeS2Ee9G20Mw';

window.troveSupabaseConfig = { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
window.troveSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
