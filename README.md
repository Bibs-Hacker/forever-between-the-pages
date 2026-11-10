# Forever Between the Pages

> Two hearts. Countless stories. Infinite pages.
> A private, invitation-only, cloud-synchronized digital storybook platform.
> Created by **Dev Brian** · for **Babe Nancy** · *Dev Brian Studios*.

This is a real full-stack application, not a static demo:

- **Frontend** — a consolidated `index.html` (splash, auth, library, 3D reader,
  author studio) plus ES modules in `/src`. No build step; deploy as static files.
- **Backend** — Supabase (PostgreSQL + Auth + Storage), with Row Level Security,
  a secure invitation-redemption flow, and trusted role assignment.
- **Reader** — realistic page turning via StPageFlip, with an accessible fallback.
- **Offline** — genuine offline reading via IndexedDB (not just a shell cache).
- **PWA** — installable, with a service worker and web app manifest.

---

## 1. What you need

- A free [Supabase](https://supabase.com) project.
- A [Vercel](https://vercel.com) account (or any static host).

## 2. Set up the database (5 SQL files, in order)

In the Supabase dashboard open **SQL Editor** and run, one after another:

1. `supabase/migrations/0001_schema.sql`
2. `supabase/migrations/0001b_reader_tables.sql`
3. `supabase/migrations/0002_functions.sql`
4. `supabase/migrations/0003_rls.sql`

These create every table, the trusted server-side functions
(`redeem_invitation`, `create_invitation`, `revoke_invitation`,
`bootstrap_first_admin`), the new-user trigger, and all Row Level Security
policies.

## 3. Storage buckets

In **Storage** create two buckets:

- `covers` — **public** (book covers, cover-designer exports).
- `manuscripts` — **private** (uploaded source files, chapter illustrations,
  downloadable exports). Serve these with **signed URLs** only.

## 4. Connect the app

Open `config.js` and paste your project's **public** credentials
(Supabase → Project Settings → API):

```js
window.FBTP_CONFIG = {
  SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "eyJ...your anon public key...",
  VAPID_PUBLIC_KEY: ""
};
```

Both values are **safe to ship to the browser** — the anon key is designed to be
public and is protected by Row Level Security. **Never** put the `service_role`
key here or anywhere in the frontend.

If these are left blank, the app does not crash: it shows a graceful
“this library needs to be connected” screen.

## 5. Deploy to Vercel

1. Push this folder to a Git repo (or drag-and-drop in Vercel).
2. Framework preset: **Other** (no build command, output = project root).
3. Deploy. Vercel serves `index.html` and the static assets as-is.
4. **Important:** editing `config.js` locally does not change an existing
   deploy. Commit the edited `config.js` (or edit it in the Vercel project) and
   **redeploy** — the change only applies to builds created afterward.

### Supabase auth URLs

In Supabase → **Authentication → URL Configuration**, add your Vercel URL
(e.g. `https://your-app.vercel.app`) to **Site URL** and **Redirect URLs**, so
live login and password-reset links work on the deployed site.

## 6. First admin (Dev Brian) — one time

The author studio is only visible to admins, so the very first admin is
promoted directly in Supabase (one time):

1. Create Dev Brian's account: open the deployed app → **Redeem invitation**,
   fill in name / email / password and any placeholder code, submit. The
   account is created even though the placeholder code is rejected (the code
   only sets the *role*, not whether the account exists). Alternatively create
   the user in Supabase → Authentication → Users.
2. In Supabase → **SQL Editor**, find the id and promote it:
   ```sql
   update profiles set role = 'admin'
   where id = (select id from auth.users where email = 'devbrian@example.com');
   ```
   (Use Dev Brian's real email.) This is the trusted, server-side promotion the
   spec requires — role is never set from the client.
3. Reload the app and sign in. The **Author studio** (pencil icon) now appears.

> A convenience `bootstrap_first_admin()` RPC also exists (and the studio has a
> “Claim first admin” button) that promotes the caller **only while no admin
> exists**; but since the studio is hidden from non-admins, the SQL promotion
> above is the reliable first step.


## 7. Invite Nancy

In **Author studio → Invitations**: enter Nancy's email, role **Reader**,
optional expiry → **Generate code**. Send her the code. She opens the app →
**Redeem invitation** → enters the same email + the code → her account is
bound to the invitation and granted the reader role on the trusted server side.

Invitation codes are random, single-use, email-bound and validated by a
`SECURITY DEFINER` database function — never by the browser alone.

---

## Project layout

```
index.html                     consolidated app shell + screens + styles
config.js                      your public Supabase credentials (edit this)
manifest.webmanifest           PWA manifest
service-worker.js              app-shell cache + update handling
icons/                         app icons (svg + png)
src/db.js                      data access (Supabase queries + RPCs)
src/auth.js                    sign up / in / out / reset + invitation flow
src/reader.js                  pagination + StPageFlip + accessible fallback
src/offline.js                 IndexedDB offline library + sync queue
src/app.js                     UI orchestration and state
supabase/migrations/*.sql      schema, functions, RLS
DEPLOYMENT.md                  checklist
TESTING-REPORT.md              what was tested / not tested
KNOWN-LIMITATIONS.md           honest scope notes
```

See **KNOWN-LIMITATIONS.md** for an honest account of what is fully wired,
what is scaffolded, and what still needs your Supabase project to verify live.
