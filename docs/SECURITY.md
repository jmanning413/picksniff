# PickSniff Security Profile — June 2026

> Defensive security review of the live application. Findings are ordered by severity
> with concrete remediations. Code-level references verified against the current `main`.
> Re-run this review after any auth, email, or payment change.

---

## 1. Asset inventory (what an attacker would want)

| Asset | Where | Impact if compromised |
|---|---|---|
| Subscriber email list + send capability | Supabase `subscribers` + `/api/broadcast` + Resend | Spam/phishing from your domain; Resend ban; domain reputation destroyed |
| User accounts (email, password hashes, quiz history, collections) | Supabase Auth + `profiles`/`wishlist`/`owned`/`quiz_results` | Credential exposure, privacy breach |
| Service-role key (`SUPABASE_SERVICE_ROLE_KEY`) | Vercel env only | Full RLS bypass — total DB read/write |
| Stripe secret key + webhook secret | Vercel env only | Payment manipulation (limited: tips only, no stored cards) |
| Deploy pipeline | GitHub `jmanning413/picksniff` → Vercel | Arbitrary code on picksniff.com |
| Brand/domain (hello@picksniff.com sender) | Resend + DNS | Phishing leverage |

No payment card data ever touches the app (Stripe-hosted checkout). No PII beyond
email/username/bio. That keeps the blast radius small — the email list and send
capability are the crown jewels.

---

## 2. Findings

### F-1 🔴 CRITICAL — Broadcast secret shipped in the client bundle
`app/admin/email/page.js` compares the admin password to the literal
`'picksniff-broadcast-2026'` in client code, and `/api/broadcast` authorizes with
`BROADCAST_SECRET`, which must equal that same string for the tool to work. **Anyone
who reads the JS bundle can send arbitrary HTML email to the full subscriber list from
hello@picksniff.com.**

**Remediation (do now):**
1. Delete the hardcoded comparison — the page should simply take a password field and
   send it; the server check is the only gate.
2. Rotate `BROADCAST_SECRET` in Vercel to a long random value (`openssl rand -hex 32`).
3. Add `robots: { index: false }` metadata to the page and disallow `/admin` in `app/robots.js`.
4. Optional hardening: move admin auth to "must be logged in AND user id in an
   `ADMIN_USER_IDS` env list" instead of a shared secret.

### F-2 🟠 HIGH — `/api/subscribe` is an unauthenticated email-send primitive with no rate limit
Any POST with `{email}` inserts a row and triggers a welcome email. An attacker can:
(a) subscription-bomb strangers (harassment via your domain, CAN-SPAM/complaint risk),
(b) burn your Resend quota, (c) bloat the list with garbage that later poisons broadcast
deliverability.

**Remediation:** Upstash sliding-window limit (5/min/IP) using the existing
`lib/ratelimit.js` pattern; consider double-opt-in later (send confirm link instead of
instant welcome), which also fixes the consent problem in LEGAL.md §4.

### F-3 🟠 HIGH — No throttling on authentication
`signIn`/`signUp` server actions have no rate limit or lockout → credential stuffing and
password spraying are unimpeded. Supabase has some project-level protections, but don't
rely on defaults you haven't verified.

**Remediation:** Add a 5/min/IP limiter inside the actions (they can read `headers()`);
verify Supabase Auth "rate limits" settings in the dashboard; keep the 8-char minimum
password (consider raising to 10 + a breached-password check later).

### F-4 🟠 HIGH — Public RLS SELECT on all user tables
`profiles`, `wishlist`, `owned`, `quiz_results` are `select using (true)` — the anon key
(public by design) can enumerate **all** users' emails? No — emails live in `auth.users`
(not exposed) — but usernames, bios, full collections, and quiz history of every user are
bulk-readable by anyone with the anon key, not just via the profile pages you built.
That's a scraping/doxxing surface and contradicts the old plan where "view others' quiz
results" was a premium feature.

**Remediation:** Decide what's actually public. If public profiles are the feature, this
is *acceptable by design* — document it in the privacy policy ("your username, bio, and
collections are public"). Then it moves from a security bug to a legal-disclosure item.
If not, tighten policies to owner-only and join through server code.

### F-5 🟡 MEDIUM — Rate-limit bypass on the results path
The only rate-limited endpoint is `/api/quiz/match`, whose response is discarded;
`/results` recomputes matches from raw query params with no limit — so the "quiz 10/min"
control protects nothing, and `/results` (which does double matching work per hit) is a
cheap CPU-amplification target. (GAPS #5.)

**Remediation:** Validate + rate-limit `/results` in middleware, or drop the decorative
API call and rate-limit `/results` directly.

### F-6 🟡 MEDIUM — Admin page exists as a public, indexable route
`/admin/email` renders for everyone (client-gated only). Even after F-1's fix, it
advertises the attack surface.

**Remediation:** noindex + robots disallow (with F-1), and gate rendering behind a
logged-in admin check server-side.

### F-7 🟡 MEDIUM — CSP allows `unsafe-inline` and `unsafe-eval` scripts
`next.config.mjs` CSP permits inline/eval script — this neuters most XSS mitigation. It's
currently "needed" for the inline GA snippet and the homepage inline localStorage script.

**Remediation (sequenced):** remove the dead inline homepage script (GAPS #14), move GA
to nonce-based or `afterInteractive` external-only, then drop `'unsafe-eval'` (Next 16
production doesn't need it) and finally `'unsafe-inline'` with a nonce. Do this as one
deliberate pass with testing — CSP changes break silently.

### F-8 🟡 MEDIUM — Self-XSS via `innerHTML` on the homepage
`HomepageRecentlyViewed` injects `f.brand`/`f.name` from localStorage via `innerHTML`.
Nothing writes that key today (dead code), but if it's ever populated from URL-derived
data this becomes stored XSS.

**Remediation:** Delete the section (GAPS #14). If rebuilt, use `textContent`/React.

### F-9 🟢 LOW — Missing security headers/hardening niceties
`Permissions-Policy` absent; `Strict-Transport-Security` handled by Vercel (verify);
`X-Frame-Options: SAMEORIGIN` present and CSP `frame-ancestors 'none'` (the stricter one
wins — fine). Cookie flags are Supabase-managed (httpOnly, secure — verify in devtools).

### F-10 🟢 LOW — Dependency & supply-chain posture
No lockfile audit in CI (no CI). Run `npm audit` periodically; dependencies are few and
mainstream (good). Pin the Node version in `package.json` `engines` to match Vercel.

---

## 3. Things that are actually done right (keep them)

- Secrets only in env; `.env.local` gitignored; `.env.example` has names not values.
- Zod validation on every API input; enum allowlists for quiz params.
- Stripe: hosted checkout, amount clamped server-side ($1–$999), webhook signature
  verified before processing.
- Supabase queries are parameterized throughout; no string-built SQL anywhere.
- Errors: generic messages to clients, `console.error` with route tags server-side.
- All external links `rel="noopener noreferrer"`.
- Graceful degradation when services are unconfigured (fails closed for broadcast/Stripe,
  open-but-harmless for rate limiting — acceptable given F-2 fix).
- Unsubscribe uses an unguessable per-subscriber UUID token, not the email address.

---

## 4. Hardening checklist (ordered, each ≤ half a day)

- [ ] F-1: de-hardcode broadcast auth + rotate secret + noindex admin
- [ ] F-2: rate-limit `/api/subscribe`
- [ ] F-3: rate-limit auth actions; check Supabase auth settings
- [ ] F-4: decide public-profile policy; update RLS or privacy policy to match
- [ ] F-5: validate + limit `/results`
- [ ] Enable GitHub 2FA + Vercel 2FA + Supabase 2FA (account takeover = game over)
- [ ] Verify SPF/DKIM/DMARC on picksniff.com before first real broadcast
- [ ] Add `npm audit` + lint + build GitHub Action
- [ ] F-7 CSP tightening pass (after dead-code removal)
- [ ] Quarterly: rotate service-role + broadcast secrets, re-run this checklist

## 5. Incident response (minimum viable)

1. **Kill switches:** Vercel → rollback to previous deployment (instant);
   Supabase → pause project; Resend → revoke API key (stops all email).
2. **If the list leaks / spam is sent:** revoke Resend key, rotate `BROADCAST_SECRET`,
   notify subscribers honestly, check Resend logs for what was sent.
3. **If service-role key leaks:** rotate in Supabase dashboard + update Vercel env +
   redeploy; audit `auth.users` and table contents for tampering.
4. Keep this file updated with dates of rotations.
