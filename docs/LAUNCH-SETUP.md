# Launch Setup — Owner Checklist

> The external/business setup only Joseph can do. The site code is ready for all
> of these. Do them in order; each unblocks the next. Written June 2026.
> Related: docs/GAMEPLAN.md (why), CATALOG.md (content), GAPS.md #0 (which Vercel project).

**Which Vercel project:** always `project-a022s` (it serves www.picksniff.com).
Never the old `picksniff` project. See GAPS.md #0.

---

## 1. Google Analytics — turn on measurement (~15 min)

Right now you cannot see any traffic. This fixes that. The code already supports it;
you just need the ID.

1. Go to **analytics.google.com**. Sign in with your Google account.
2. **Admin** (gear, bottom-left) → **Create → Property**. Name it `PickSniff`,
   set your timezone/currency, Next.
3. "About your business" — pick anything reasonable → **Create**, accept terms.
4. Platform: choose **Web**. Website URL: `https://www.picksniff.com`,
   stream name `PickSniff Web` → **Create stream**.
5. On the stream page, copy the **Measurement ID** — it looks like `G-XXXXXXXXXX`.
6. Go to **vercel.com → project-a022s → Settings → Environment Variables**.
   - Name: `NEXT_PUBLIC_GA_ID`
   - Value: the `G-XXXXXXXXXX` you copied
   - Environment: **Production** (check it) → **Save**.
7. Trigger a redeploy so it takes effect: Vercel → project-a022s → **Deployments** →
   the top one → **⋯ → Redeploy**. (Or just push any small change.)
8. **Verify:** open picksniff.com, then in GA go to **Reports → Realtime**. You
   should see yourself as 1 active user within a minute. If you see nothing after
   5 minutes, tell Claude — the code is CSP-ready for GA, so it should just work.

*(Privacy policy already worded to cover analytics, so nothing else to change.)*

---

## 2. Google Search Console — turn on SEO signal (~20 min)

This is how we learn which Google searches you show up for. Nothing SEO-related
can start until this is collecting data.

1. Go to **search.google.com/search-console**. Sign in (same Google account is fine).
2. **Add property** → choose the **URL prefix** box (the right-hand one) →
   enter `https://www.picksniff.com` → **Continue**.
3. Verification: easiest is **HTML tag** or **Google Analytics** (if you did step 1,
   the "Google Analytics" method auto-verifies — pick that). If it offers a DNS or
   HTML-file method instead and you get stuck, tell Claude and we'll add the
   verification meta tag to the site in one line.
4. Once verified: left sidebar → **Sitemaps** → under "Add a new sitemap" enter
   `sitemap.xml` → **Submit**. (Your sitemap lists all 800+ pages.)
5. **Verify:** the sitemap row should say "Success" within a day and show a
   discovered-URL count in the hundreds.
6. Nothing else to do here for ~2–4 weeks. Then we read the **Performance** tab to
   see which queries earn impressions, and build content targeting them.

---

## 3. FragranceNet affiliate — turn on revenue (~30 min + approval wait)

The only thing that turns your buy clicks into money. Approvals take days, so start now.

1. Go to **rakutenadvertising.com** → **Publishers → Sign up** (free).
2. You'll need: site URL `https://picksniff.com`, your legal name + address, and
   **tax info (W-9)** plus bank details for payouts. Have those ready.
3. Site description to paste:
   > *PickSniff is a free fragrance recommendation site. Visitors take a short quiz
   > and get ranked fragrance matches from a hand-curated library of 750 fragrances,
   > with links to buy at retailers. Content includes a fragrance encyclopedia and
   > accord/note guides.*
   Category: **Beauty / Fragrance**. Traffic: answer honestly (new, growing).
4. After your Rakuten account is approved, search the advertiser marketplace for
   **FragranceNet.com** and apply to their Partners Program. Questions:
   partners@fragrancenet.com.
5. **When approved, tell Claude.** Wiring the tracking parameters into the buy
   buttons is a one-file change (already built for this) plus adding FragranceNet
   as a retailer button.

*(FragranceX is a good second application via the same flow — also fast approvals.)*

---

## 4. Google sign-in — finish the button (~15 min)

The "Sign up with Google" button is built but hidden until Google is configured
(a visible-but-broken button is what stranded your friend earlier).

1. Supabase dashboard → your project → **Authentication → Sign In / Providers →
   Google** → toggle on. It shows a **callback URL** like
   `https://<yourref>.supabase.co/auth/v1/callback` — copy it.
2. **console.cloud.google.com** → create/select a project → **APIs & Services →
   OAuth consent screen**: External, app name PickSniff, your email, add
   `picksniff.com` as an authorized domain → save.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** →
   type **Web application** → under **Authorized redirect URIs** paste the Supabase
   callback URL from step 1 → **Create**.
4. Copy the **Client ID** and **Client Secret** into the Supabase Google form → Save.
5. In Supabase: **Authentication → URL Configuration** → Site URL
   `https://www.picksniff.com`, and add `https://www.picksniff.com/auth/callback`
   to Redirect URLs.
6. In **Vercel → project-a022s → Settings → Environment Variables**: add
   `NEXT_PUBLIC_GOOGLE_AUTH` = `1` (Production) → Save → redeploy.
7. **Tell Claude** and it'll run a real-browser test of the full Google flow.

---

## Order of operations

Do **1 and 2 today** (they're free, fast, and unblock everything else). Start **3**
this week so the approval clock runs. Do **4** whenever. Meanwhile Claude runs
**catalog batch 1** (real notes + descriptions) so there's content worth ranking by
the time Search Console starts reporting.
