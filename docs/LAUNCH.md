# Launch runbook: fresh production start

Follow the steps in order. Each step lists who does it and how to check it worked.

The database in `.env.local` (Supabase project `xcrgtdsowbzekquxczzd`, ap-south-1) currently holds **test data only**: 512 `@example.com` accounts from Playwright, 2 seed accounts (`@invitation.lk`, with a known password), 409 invitations and 27 sandbox "paid" orders. That project becomes production, so the test data has to go.

---

## 1. Back up the database (owner, 5 min)

Supabase dashboard → **Database → Backups**: download today's backup. On the free plan, use Project Settings → Database → connection string with `pg_dump` instead:

```bash
pg_dump "$DATABASE_URL" --no-owner --format=custom --file=suba-before-launch.dump
```

**Check:** the backup file exists and is larger than 0 bytes. Don't start step 2 without it.

## 2. Delete the test data (owner, in the Supabase SQL editor)

This can't be undone. Run it only after step 1.

```sql
begin;
-- who will be deleted (expect 514)
select count(*) from users where email like '%@example.com' or email like '%@invitation.lk';

-- orders and audit rows reference users without cascade, so delete them first
delete from orders    where user_id  in (select id from users where email like '%@example.com' or email like '%@invitation.lk');
delete from audit_log where actor_id in (select id from users where email like '%@example.com' or email like '%@invitation.lk');
-- deleting a user cascades to their sessions, accounts, invitations, guests, RSVPs, seating and media rows
delete from users where email like '%@example.com' or email like '%@invitation.lk';

select (select count(*) from users) users, (select count(*) from invitations) invitations;  -- expect 0, 0
commit;
```

Also delete the old local photo files: `public/uploads/invitations/*`. Photo storage moves to R2 in Phase 0.

**Why the seed accounts go too:** their password is written in `scripts/seed-credentials.ts` in a public repo. Never run that script against production again.

## 3. Apply the vendor migrations (developer, 1 min)

```bash
npm run db:migrate
```

This adds the `vendors`, `vendor_packages`, `quote_requests` and `vendor_blocked_dates` tables and the new categories. It only adds things; it changes no existing data.

**Check:** `/en/vendors` loads and says "No vendors here yet" instead of "This page couldn't load".

## 4. Import the vendor leads as hidden listings (developer, 1 min)

```bash
npx tsx --env-file=.env.local scripts/import-vendor-leads.ts --dry-run   # shows what will happen
npx tsx --env-file=.env.local scripts/import-vendor-leads.ts
```

- 168 of the 257 leads are imported (6 categories, 5 cities). The rest are categories we haven't opened yet (cakes, catering, bridal wear and others) or cities outside Phase 1. They stay in the CSV.
- Every imported listing has `published = false`. **Nothing shows on the site yet.**
- Running it again is safe: rows that already exist are skipped.
- The CSV stays in `outreach/`, which git ignores. Never commit it; the repo is public.

## 5. Verify vendors and switch them on (vendor-signup lead, ongoing)

For each lead, working from `outreach/vendor-leads.csv`:

1. **Call** the number in the CSV. Confirm the business is still running, the name, the city and the category.
2. **Ask permission** to list them on suba.lk, and write down the date and who agreed (PDPA). Offer the founding-vendor deal: Pro free for 6 months.
3. **Ask them to sign up** at `https://suba.lk/si/login?mode=signup` using their business email.
4. **Link their account and publish** (Supabase SQL editor):

   ```sql
   update vendors
   set owner_id = (select id from users where email = 'vendor@their-business.lk'),
       whatsapp = '94771234567',        -- digits only, from the call
       verified = true,
       published = true
   where slug = 'lassana-flora-pvt-ltd-colombo';
   ```

5. The vendor then adds their packages, prices and booked dates at `/app/vendor`.

Only switch a category on in a city (by advertising it) once it has 15 or more live vendors there.

**If a vendor says no:** `delete from vendors where slug = '…';` and mark the row "declined" in the CSV so nobody calls them again.

## 6. Production environment variables (owner)

Set these on the hosting platform, not in a file in the repo:

| Variable | Production value |
|---|---|
| `APP_URL`, `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_URL` | `https://suba.lk` |
| `BETTER_AUTH_SECRET`, `AUTH_SECRET` | A **new** random value (`openssl rand -base64 32`), different from the one in `.env.local` |
| `DATABASE_URL` | The Supabase pooler URL (port 6543) |
| `PAYHERE_MERCHANT_ID`, `PAYHERE_MERCHANT_SECRET` | Live keys once PayHere approves the account. Sandbox keys until then. Payments are switched off while these are empty. |
| `STORAGE_*` | Cloudflare R2 keys (needed for photo uploads) |
| `RESEND_API_KEY` | Resend, with a verified `suba.lk` sending domain |
| `SENTRY_DSN` | From a new Sentry project |

## 7. Deploy and check it works (developer)

1. Deploy the `release/v1` branch to a preview URL first.
2. Smoke test in si, ta and en, on a phone and a desktop:
   - Sign up, create an invitation and preview it
   - Find a vendor and send a quote request
   - Budget planner
   - Vendor dashboard: add a package and block a date
3. Load test the **preview URL, never production**: `node tests/load/stress.mjs https://<preview-url> 300 50`
4. Point the `suba.lk` DNS at the deployment and check HTTPS works for both `suba.lk` and `www.suba.lk`.
5. Submit the sitemap in Google Search Console.

## 8. Still missing before marketing (see docs/plan/roadmap.html)

- Photo uploads on R2 (they currently save to the server's own disk, which doesn't survive deploys)
- CI on every PR, Sentry alerts, daily backups
- Privacy policy, terms, refund policy
- A real support WhatsApp number on the site (the placeholder was removed)
- An `/admin` screen, so steps 5.4 and 5.5 don't need SQL
