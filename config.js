// FOREVER BETWEEN THE PAGES — runtime configuration
// -----------------------------------------------------------------------------
// Fill these two values with YOUR Supabase project's PUBLIC credentials.
// Both are safe to ship to the browser (the anon key is designed to be public;
// it is protected by Row Level Security). NEVER put the service_role key here.
//
// Where to find them: Supabase Dashboard -> Project Settings -> API
//   Project URL   -> SUPABASE_URL
//   anon public   -> SUPABASE_ANON_KEY
// -----------------------------------------------------------------------------
window.FBTP_CONFIG = {
  SUPABASE_URL: "",      // e.g. https://xxxxxxxx.supabase.co
  SUPABASE_ANON_KEY: "", // e.g. eyJhbGciOi...
  // Optional Web Push (leave blank to disable push):
  VAPID_PUBLIC_KEY: ""
};

// Derived flag used by the app to show a graceful "needs to be connected"
// screen instead of crashing when the values above are still empty.
window.FBTP_CONFIG.isConfigured = Boolean(
  window.FBTP_CONFIG.SUPABASE_URL && window.FBTP_CONFIG.SUPABASE_ANON_KEY
);
