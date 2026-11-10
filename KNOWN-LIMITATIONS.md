# Known Limitations — Forever Between the Pages

An honest map of what is fully built, what is scaffolded, and what is deferred.
The goal of this first delivery is a **real, deployable foundation** that is
correct where it counts (security model, data model, auth, reader, offline),
not a false claim that every one of the 30 spec sections is production-complete.

## Fully implemented

- Database schema, indexes, foreign keys, UUIDs, timestamps (migrations 0001/0001b).
- Trusted server-side functions: invitation create/redeem/revoke, first-admin
  bootstrap, new-user profile trigger, role-change guard (migration 0002).
- Row Level Security on every table; readers see only published books and only
  their own private rows; admin cannot read readers' private notes (0003).
- Supabase Auth: register (invitation-bound), login, logout, password reset,
  persistent sessions, password visibility toggle.
- Library with search, realistic book-card covers, graceful empty state.
- Reader: structured-content pagination that never drops text, StPageFlip
  rendering with a two-page/one-page responsive switch, an accessible paged
  fallback for reduced-motion or when the library is unavailable, keyboard and
  button navigation, TOC with computed page numbers, progress bar.
- 8 reading themes + 10 fonts + size/line-height/spacing/margin/speed controls,
  saved to the cloud profile.
- Bookmarks and private notes (per user/book/chapter/page), cloud-synced.
- Reading-progress sync with resume prompt; offline queue flushed on reconnect.
- Genuine offline reading via IndexedDB (metadata + chapters + sync queue).
- Author studio: create book, add chapters, publish/unpublish, invitation
  manager with revoke, surprise-letter scheduling.
- PWA: manifest, installable, service worker (shell cache + network-first nav).
- Cinematic splash with particles, skip-intro (remembered), reduced-motion.

## Scaffolded / basic (works, but intentionally minimal in v2.0)

- **Rich-text editor**: chapter body is paragraph-structured plain text stored
  as structured JSON blocks. Headings/quotes/images/lists render in the reader;
  a full WYSIWYG toolbar is not yet wired.
- **Cover designer**: book cards and the reader render generated covers from
  metadata; a dedicated upload/position/export designer UI is not built.
- **Chapter reorder**: chapters use a `position` column; drag-to-reorder UI is
  not yet added (order is set on creation).
- **Imports** (DOCX/EPUB/PDF/MD/TXT) and **exports** (EPUB/PDF/TXT/MD/JSON):
  schema and storage design support them; converters are not implemented.
- **Surprise-letter envelope animation** and reader-side letter inbox UI are
  minimal; backend unlock enforcement (RLS `unlock_at <= now()`) is real.
- **Analytics dashboard / charts**: `reading_sessions` are recorded; the
  visual charts are not yet built.
- **Notification center UI** and **Web Push**: tables exist; Web Push needs a
  server sender + VAPID keys (kept server-side, see .env.example).

## Environment constraints (not code defects)

- This was authored in a sandbox with **no browser and no live Supabase**, so
  runtime behavior is verified by syntax checks and design review, not by a
  live click-through. Run the live pass in TESTING-REPORT.md.
- The app must be served over **HTTP(S)**, not opened via `file://` — ES
  modules and the service worker require a real origin. On Vercel this is
  automatic.
- `config.js` edits apply to a Vercel deploy only after you redeploy.

## Recommended next milestones

Following the spec's own roadmap: rich-text editor (M3), cover designer (M3),
import/export converters (M3/M8), analytics charts (M8), notification center +
Web Push (M7), surprise-letter animation (M7). The foundation here is built so
these extend it without rewriting the data or security model.
