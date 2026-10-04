MASHMAC - FREE STARTER
1. Host these files on a static web host.
2. Open app.js and replace:
   PASTE_YOUR_PROJECT_URL_HERE
   PASTE_YOUR_PUBLISHABLE_KEY_HERE
3. Keep BUCKET = "mashmac".
4. Your Supabase bucket must allow the logged-in user to upload/list/delete their own folder.
5. For video playback, the bucket must be public OR replace getPublicUrl() with signed URLs.

Security:
- Never put a Supabase service_role/secret key in this app.
- The publishable/anon key is intended for client-side use, but access must be controlled by Storage RLS policies.
