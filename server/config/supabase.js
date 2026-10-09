import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase-project-id')) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('[SupabaseConfig] Connected to Supabase PostgreSQL Database successfully.');
    } catch (err) {
        console.warn('[SupabaseConfig] Supabase initialization warning:', err.message);
    }
} else {
    console.log('[SupabaseConfig] Supabase credentials not set or using placeholder values. Utilizing standard database layer with auto failover.');
}

export { supabase };
export default supabase;
