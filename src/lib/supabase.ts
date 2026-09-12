import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client ini digunakan untuk Auth dan akses Storage (jika diperlukan) dari sisi client/server non-database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
