import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const assertEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const supabase = createClient(
  assertEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
  assertEnv(supabaseServiceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"),
);
