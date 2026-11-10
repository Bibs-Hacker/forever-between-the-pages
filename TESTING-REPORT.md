# Testing Report — Forever Between the Pages

Honest status. “PASS” means verified here; “NEEDS LIVE” means the code is
implemented but can only be confirmed against your own Supabase project +
a browser (which this build environment cannot run).

## Verified in this environment

| Check | Result |
|---|---|
| All JS modules parse without syntax errors (`node --check`) | PASS |
| Service worker and config parse cleanly | PASS |
| SQL migrations are ordered and self-contained (idempotent `drop/create`) | PASS |
| App icons generated (svg + 192/512 png) | PASS |
| Graceful “not connected” gate when `config.js` is empty (no import crash) | PASS (by design: placeholder client) |
| HTML has no inline event handlers / `<script>` injection points for user data | PASS |

## Needs live Supabase + browser to confirm

### Authentication
- Valid registration with invitation — NEEDS LIVE
- Invalid / expired / already-redeemed invitation rejected by `redeem_invitation` — NEEDS LIVE (logic implemented)
- Valid login / invalid password / logout / session restore — NEEDS LIVE

### Publishing
- Create book, save draft, add/reorder chapters, publish/unpublish — NEEDS LIVE (create/add/publish/unpublish wired; drag-reorder is basic)
- Cover upload — NEEDS LIVE (storage bucket required; UI scaffolded)

### Reading
- Open book, flip pages, TOC navigation, bookmark, resume — NEEDS LIVE
- Theme / font / size / spacing changes apply to the reading surface — NEEDS LIVE (CSS-variable driven; logic implemented)
- Mobile single-page vs desktop two-page spread — NEEDS LIVE (portrait auto-switch implemented)

### Synchronization
- Progress upsert on page change, resume prompt on reopen — NEEDS LIVE (implemented)
- Offline edits queued in IndexedDB and flushed on reconnect — NEEDS LIVE (implemented)

### Security (depends on RLS running in your project)
- Reader cannot see unpublished books (RLS `books_read`) — NEEDS LIVE
- Reader cannot publish (RLS `books_write` requires `is_admin()`) — NEEDS LIVE
- Reader cannot read another user's private notes (RLS owner-only) — NEEDS LIVE
- Admin cannot read readers' private notes (policy intentionally owner-only) — NEEDS LIVE
- Invitation codes single-use (status flips to `redeemed`) — NEEDS LIVE
- Self-elevation blocked (`guard_role_change` trigger) — NEEDS LIVE
- No service-role key in browser source — PASS (not present anywhere)

### PWA
- Install prompt / standalone display — NEEDS LIVE
- Offline shell after first load — NEEDS LIVE (service worker implemented)
- Downloaded book available offline — NEEDS LIVE (IndexedDB implemented)

## How to run the live test pass

1. Complete README steps 1–5.
2. Serve locally over HTTP (not `file://`, ES modules + service worker need a
   real origin), e.g. `npx serve .` or `python3 -m http.server`.
3. Walk each “NEEDS LIVE” row above and record PASS/FAIL.
