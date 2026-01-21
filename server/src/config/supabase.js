import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "SUPABASE CONFIGURATION ERROR:",
    "\n- Missing SUPABASE_URL or SUPABASE_KEY in .env file",
    "\n- Google/Facebook login will not work",
    "\n- Please add these from your Supabase project dashboard:",
    "\n  * SUPABASE_URL: Your project URL (e.g., https://xxx.supabase.co)",
    "\n  * SUPABASE_KEY: Your 'anon' public key or 'service_role' key",
  );
} else if (
  supabaseKey.startsWith("sb_publishable_") &&
  supabaseKey.length < 50
) {
  console.warn(
    "SUPABASE_KEY appears incomplete or invalid.",
    "\nExpected format: Full anon key (eyJ...) or service_role key",
    "\nCurrent value looks truncated. Please verify in Supabase dashboard.",
  );
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : {
        auth: {
          getUser: async () => ({
            error: new Error(
              "Supabase not configured. Check SUPABASE_URL and SUPABASE_KEY in server/.env",
            ),
          }),
        },
      };
