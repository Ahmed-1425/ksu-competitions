import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not defined. Falling back to anon key (operations may fail if RLS blocks).');
  }

  return createClient(supabaseUrl, serviceRoleKey || (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
