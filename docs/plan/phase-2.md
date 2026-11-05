# Phase 2: vendor tools and bookings

Builds on Phase 1 (directory, quote requests, budget planner, merged in PR #1). See `suba-plan.pdf`, pages 4, 5 and 13.

Goal by the end of month 6: 40 paying vendors, 100 bookings a month, Rs. 0.9M monthly revenue.

Phase 2 ships in two parts. Vendors need a place to see quotes and block dates before couples can pay deposits, so **2a comes first**.

## 2a: vendor tools (this PR)

| Item | What ships | Why now |
|---|---|---|
| Vendor sign-up | `/app/vendor`: a signed-in user lists a business (name, category, city, WhatsApp, starting price, description). New listings are hidden until the suba.lk team approves them. | Lets us sign vendors up ourselves and onboard the first 300 |
| Packages | Vendor adds and removes packages (name, price, what's included) | Shows real prices, which is our main selling point |
| Quote inbox | The vendor sees quote requests for their own listings and marks each one replied or closed. Each request has a WhatsApp reply link. | Phase 1 collected quotes that no vendor could see |
| Availability | Vendor blocks booked dates. The public profile has a "Check a date" box. | Needed before anyone can reserve a date |
| New categories | DJs and bands, astrologers, ashtaka, fragrance and favours | Covers the Phase 2 categories in the plan |
| Apple-style UI | System font stack (SF Pro on Apple devices), neutral greys, larger and tighter Latin headings, pill-shaped main buttons, soft cards. All done through tokens. | The owners asked for it |

All vendor queries are filtered by the signed-in owner's ID (`owner_id = session.user.id`). New listings start with `published = false`.

## 2b: bookings and revenue (next PR)

| Item | Plan |
|---|---|
| Deposits | A `bookings` table. "Reserve date" creates a PayHere order for a deposit (20% by default) and blocks the date when PayHere's webhook confirms payment. This reuses the order and webhook code from the invitation checkout. |
| Refunds | Cancellation within 7 days gets a full refund, handled manually by the team at first. Every change goes into `audit_log`. |
| Reviews | A `reviews` table linked to a booking whose date has passed, so only real customers can review. One review per booking. |
| Vendor plans | Free / Pro Rs. 3,900 / Premium Rs. 9,900 a month as a `subscriptions` table, paid through PayHere's recurring payments. Pro gives unlimited leads; Premium adds featured placement. |
| Featured listings | A "Featured" label, shown at the top of a category in one city. Always clearly labelled. |
| Payouts | Weekly manual bank transfer, recorded in a `payouts` table. |
| Admin | `/admin` for team users (`users.is_team`): approve vendors, moderate reviews, handle refunds. |
| Card printing | Turn an invitation into a print-ready PDF and send it to 2 partner printers as a quote request. |

## Risks

- **Deposits make us responsible for disputes.** Write the cancellation policy before turning deposits on.
- **The rate limiter is per server.** Move it to Redis or Upstash before running more than one instance.
- **The vendor lead list stays out of git.** The repo is public, and the list holds other people's phone numbers and emails (PDPA). Share it privately, for example in a private Google Sheet.

## How we'll measure it

- Share of quote requests that get a reply within 24 hours (target 50%+).
- Vendors approved each week.
- Vendors with at least one package.
- Vendors with blocked dates set.
