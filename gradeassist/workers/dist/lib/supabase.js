"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const assertEnv = (value, name) => {
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
};
exports.supabase = (0, supabase_js_1.createClient)(assertEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"), assertEnv(supabaseServiceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"));
