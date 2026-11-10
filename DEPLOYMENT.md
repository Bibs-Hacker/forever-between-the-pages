# Deployment Checklist — Forever Between the Pages

- [ ] Create a Supabase project.
- [ ] Run SQL in order: `0001_schema.sql` → `0001b_reader_tables.sql` → `0002_functions.sql` → `0003_rls.sql`.
- [ ] Create storage buckets: `covers` (public), `manuscripts` (private, signed URLs).
- [ ] Paste `SUPABASE_URL` + `SUPABASE_ANON_KEY` into `config.js` (public values only).
- [ ] Confirm the `service_role` key is NOT in any frontend file.
- [ ] Push to Git / import into Vercel. Framework preset: Other. No build command.
- [ ] Deploy.
- [ ] In Supabase → Authentication → URL Configuration, add the Vercel URL to Site URL + Redirect URLs.
- [ ] Create Dev Brian's account; open Author studio; click “Claim first admin” once; reload.
- [ ] Generate a reader invitation for Nancy; send her the code.
- [ ] Nancy redeems the code on the live site and signs in.
- [ ] Publish a first book; confirm it appears in Nancy's library and opens in the reader.
- [ ] Install the PWA on one device; verify offline download of that book works.
- [ ] Run the full pass in TESTING-REPORT.md and record results.

## Local preview (optional)

ES modules + service worker need a real origin, so do NOT open index.html via file://.
Serve over HTTP instead:

```
npx serve .
# or
python3 -m http.server 8080
```

Then open the printed http://localhost address.
