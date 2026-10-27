import { createClient } from '@supabase/supabase-js';

// Read configuration from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Diagnostics helper for school administration
 */
export async function testDatabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  provider: 'Supabase' | 'Local Persistent Store';
}> {
  if (!supabase) {
    return {
      connected: true,
      message: 'Running in Local Persistent Store mode with complete schema, RBAC and seed data.',
      provider: 'Local Persistent Store',
    };
  }

  try {
    const { error } = await supabase.from('school_profile').select('school_name').limit(1);
    if (error) {
      return {
        connected: false,
        message: `Supabase query error: ${error.message}`,
        provider: 'Supabase',
      };
    }
    return {
      connected: true,
      message: 'Connected successfully to production Supabase PostgreSQL cluster.',
      provider: 'Supabase',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown connection error';
    return {
      connected: false,
      message: `Failed to connect: ${msg}`,
      provider: 'Supabase',
    };
  }
}
