import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase URL or Key. Google Login will not work.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
