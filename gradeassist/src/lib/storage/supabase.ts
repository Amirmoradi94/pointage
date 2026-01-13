import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const assertEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const createBrowserSupabaseClient = () =>
  createClient(assertEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"), assertEnv(supabaseAnonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY"));

export const createServiceSupabaseClient = () =>
  createClient(
    assertEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    assertEnv(supabaseServiceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"),
  );
