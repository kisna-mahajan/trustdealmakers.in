# Trust DealMakers — Project Context for Claude

## What this project is

Static website for **Trust DealMakers** (trustdealmakers.in), an international business consulting firm. Single `index.html` file hosted on GitHub Pages with Cloudflare DNS.

## Business context

**Founder:** Anil Mahajane, MBA (IIFT 1984)
**Services:** International Trade & Indenting · Industrial Asset Monetisation · International Representation & Market Development

### Detailed founder background

Anil Mahajane is an industrial management professional with experience in procurement, commercial operations, project coordination, and industrial business development.

- At **Vardhaman Special Steels**: Head (C&A) and Chief Projects Coordinator — led modernisation/expansion including Steel Melt Shop, Billet Casting, Steel Rolling Mill, Oxygen Plant
- At **Oswal Agro Group (Mandideep)**: Reported to CMD — commercial and operational management of multiple manufacturing facilities; coordinated Solvent Extraction Plants and Hydrogenated Oil capacity expansion

Key differentiator: Deep understanding of the **buyer's mindset** from years of evaluating suppliers, comparing technical proposals, negotiating commercial terms, and participating in capital equipment procurement decisions.

### Industry advisory network

- **Industrial Engineering & Manufacturing** — IIT-background engineers covering machinery, automation, electrical equipment, techno-commercial assessments
- **Healthcare & Medical Equipment** — Medical professionals covering hospital operations, diagnostic equipment, medical device procurement
- **Commercial & Market Development** — Procurement, vendor evaluation, industrial sourcing across manufacturing, healthcare, chemicals, technology

### Industries represented

Machinery manufacturers · Industrial chemicals · Specialty chemicals · Medical equipment · Hospital devices · Global buying houses · Procurement companies · Technology companies

### Contact details

- Email: india@trustdealmakers.in (primary, shown on website)
- Phone: +91 80585 34511 (shown on website)
- LinkedIn: linkedin.com/in/honchohunters

---

## Technical setup

| Item | Detail |
|------|--------|
| Hosting | GitHub Pages, source **GitHub Actions** (`Publish site` workflow builds `_site/` from `main`; switched from "Deploy from a branch" on 2026-10-20) |
| DNS | Cloudflare (nameservers: imani + nash) |
| Domain registrar | GoDaddy |
| Custom domain | trustdealmakers.in |
| CNAME file | `trustdealmakers.in` |
| SSL | GitHub Pages / Let's Encrypt (Enforce HTTPS enabled) |
| Font | Inter via Google Fonts |
| Design inspiration | bain.com |

### DNS records that matter (Cloudflare)

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | trustdealmakers.in | 185.199.108.153 | DNS only |
| A | trustdealmakers.in | 185.199.109.153 | DNS only |
| A | trustdealmakers.in | 185.199.110.153 | DNS only |
| A | trustdealmakers.in | 185.199.111.153 | DNS only |
| CNAME | www | kisna-mahajan.github.io | DNS only |
| A | mail | 95.216.16.101 | DNS only |
| MX | trustdealmakers.in | mail.trustdealmakers.in | DNS only |

### trustdealmakers.com (redirect-only domain)

Registered at GoDaddy, DNS on Cloudflare (same imani + nash nameservers). It hosts no site: every request 301-redirects to `https://trustdealmakers.in/`.

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | trustdealmakers.com | 192.0.2.1 (placeholder, never reached) | Proxied |
| CNAME | www | trustdealmakers.com | Proxied |
| MX ×3 | trustdealmakers.com | route1/2/3.mx.cloudflare.net | DNS only |
| TXT | trustdealmakers.com | SPF, plus DKIM and DMARC records for Email Routing | DNS only |

- **Redirect:** Cloudflare → Rules → Redirect Rules, "Redirect to .in": hostname `trustdealmakers.com` or `www.trustdealmakers.com` → static 301 to `https://trustdealmakers.in`. Paths and query strings are dropped (fine for a single-page site).
- **Email:** Cloudflare Email Routing forwards `india@trustdealmakers.com` to the owner's Gmail.
- **Gotcha:** GoDaddy's "domain forwarding" setting does nothing here. It only works while the domain uses GoDaddy nameservers. Moving DNS to Cloudflare (for Email Routing) also imported GoDaddy's parking records, which showed a GoDaddy `/lander` page until they were replaced (fixed 2026-10-16). The A and www records must stay **Proxied**, or the redirect rule never runs.

---

## Site structure

Single-page app in one file, `index.html` (CSS in `<style>`, then the pages, then one `<script>`). No framework. Edit only `index.html`: a small build (`tools/build-site.mjs`, run by GitHub Actions) makes the per-page copies that get published.

- Each page is a `div.page`; `showPage(id)` switches pages and calls `history.pushState` with a clean URL.
- **Pages and URLs:** `home` `/` · `bring-to-india` `/bring-to-india/` · `take-to-world` `/global-market-development/` (alias `/take-to-the-world/`) · `industrial` `/industrial/` (alias `/redeploy-globally/`) · `strategic-partnerships` `/strategic-partnerships/` · `faq` `/faq/` · `about` `/about/` · `vision` `/vision/` · `engage` `/engage/` (contact form).
- **Individual pages:** `tools/build-site.mjs` writes `_site/<route>/index.html` for each of the 8 inner pages: a copy of index.html with that page already `active` and its own `<title>` ("<label> | Trust DealMakers"), meta description and og/twitter description (= the page's existing hero paragraph), canonical, og:url and hreflang URLs. The home title travels in `<html data-home-title>` so the JS can restore it. The build fails loudly if a tag it rewrites is missing or duplicated.
- **Aliases and unknown paths** (`/take-to-the-world/`, `/redeploy-globally/`, typos) still get `404.html`, which stores the page in `sessionStorage` and redirects to `/`; the init code then shows that page under its canonical URL. Any new URL must be added to `pageUrls` / `urlToPage` in `index.html`, to `routes` in `tools/build-site.mjs`, and to `404.html`.
- **Engage form:** posts to formsubmit.co (`india@trustdealmakers.in`). The pathway tabs (`switchTab`) change the enquiry dropdown, the hidden `Pathway` field and the subject; "Redeploy Globally" also shows the asset fields. The header Engage button preselects the pathway page the visitor came from; in-page CTAs call `engageFrom(pathway)`.
- **Excluded from site:** Executive Search (exists on the original trustdealmakers.in but not included here by design).

### Project files

```
index.html          the whole site (the only file to edit for content and design)
404.html            redirect for aliases and unknown paths (keep its URL map in sync)
tools/build-site.mjs  builds _site/ (published files + per-page copies); no dependencies
.github/workflows/pages.yml  builds on every PR; builds and publishes on every push to main
_site/              build output (git-ignored)
images/hero/        hero photos used by the site: <page>-wide.webp (desktop) and <page>-phone.webp (portrait crop, phones <=600px)
images/AM.jpg       founder photo (also the og:image)
images/Logo.png     logo (has a white background; the footer shows it on a white plate)
images/*.jpg|webp   original hero photos, kept as sources for images/hero/ (not loaded by the site)
.claude/            local preview server (dev-server.js) + launch.json
sitemap.xml, robots.txt, CNAME, .nojekyll, favicons, .well-known/
```

### Local preview

- Source: `node .claude/dev-server.js` (or `site` in `.claude/launch.json`) serves the project root on http://localhost:8765 (next free port if taken). Inner pages go through `404.html` here.
- As published: `node tools/build-site.mjs`, then `node .claude/dev-server.js _site` (or `site-built`, port 8767). Inner pages load directly with status 200, like production.
- Unknown paths get `404.html` with status 404, like GitHub Pages, with its redirect pointed at `/` instead of the live domain.

### Deploy

Work on a branch, open a PR (the workflow runs the build as a check), merge to `main`. The `Publish site` workflow builds `_site/` and deploys it to GitHub Pages (a couple of minutes). Requires the repo setting Settings → Pages → Build and deployment → Source: **GitHub Actions**. Before 2026-10 it was "Deploy from a branch", which published every repo file, including CLAUDE.md at trustdealmakers.in/CLAUDE.md. Now only the files listed in `publish` in `tools/build-site.mjs` go live; add new public files there.

---

## Design system

| Token | Value |
|-------|-------|
| Primary red | `#CC0000` (`--red`) |
| Dark hover | `#aa0000` |
| Near-black | `#111111` (`--dark`) |
| Body text | `#2a2a2a` (`--text`) |
| Muted text | `#595959` (`--muted`, passes AA on white and #f7f7f7) |
| Border | `#e0e0e0` |
| Background gray | `#f7f7f7` (`--bg`) |
| Max width | `--mw` 1260px (nav, hero, section nav: padding inside) / `--cw` 1164px (`.wrap`, footer: padding outside). Both put content on the same left edge. |
| Section padding | `80px 48px` desktop, `48px 24px` phone |

Key patterns: one shared hero overlay (`.hero-ov`); hero label = small caps with a red left bar · `.s-label` / `.s-label-l` section labels (11px) · `.s-title` section titles · cards (red top border on hover; lift + shadow only on clickable cards) · `.box` highlight box (white on `.bg-light` sections) · `.tag` chips (not clickable, no hover) · `.flow` + `.flow-step` + `.flow-arr` for "A → B → C" chains · `ul.cols` lists flow into columns (min 220px each) · `.help-grid` for the five "Four Ways" cards (1/3 + 2/3, then 3 across; stacked at 860px and below) · dark stats band · CTA bands · sticky nav with 3px red accent bar · sticky section nav (pills from 1221px up, a `<select>` below).

Breakpoints: 1366 (tighter section pills) · 1220 (section pills become a select) · 1024 (2-column grids) · 860 (profile, stats and Engage stack) · 768 (phone layout, hamburger menu) · 600 (phone hero images) · 480 (tighter cards).

---

## Typography

Dual-font system: **Playfair Display** (serif, headlines) + **Inter** (sans-serif, body). Loaded via Google Fonts (non-blocking).

Scale: hero h1 `clamp(2rem, 3.9vw, 3.6rem)` > sub-hero h1 > `.s-title` `clamp(1.6rem, 2.5vw, 2.4rem)` = CTA band h2. Body copy 15-16px at weight 400 (no 300 on body text). Labels 11px uppercase with .16em tracking.

---

## Accessibility and behaviour (keep these working)

- One `<h1>` per page (the hero headline). FAQ: block titles are `h2`, questions `h3`.
- Everything clickable is a real `<a href>` or `<button>`: logo, home pathway cards, section pills (`href="#id"`), Engage tabs (`role="tab"`; arrow keys move between them).
- Pathways dropdown: opens on hover, on click (stays open until a second click, a click outside or Escape), and on keyboard focus.
- Mobile menu: Escape or a tap on the dimmed backdrop closes it; page scroll is locked while it is open; `aria-expanded` is kept in sync.
- On page change: instant jump to the top, focus moves to the page's `h1`, `document.title` becomes "<page> | Trust DealMakers". Back/Forward restore the scroll position (`history.state.y`).
- Section and FAQ jumps put `#id` in the URL, so a section can be shared.
- Skip link ("Skip to content", visible only on keyboard focus), visible `:focus-visible` rings, `prefers-reduced-motion` respected, back-to-top button (icon only).
- **No horizontal overflow on phones** (owner requirement). Verified 2026-10-20 on all 9 pages at 280/320/360/390/414/768/1024px and with text scaled 1.3×/1.5×/2×. The guards: `overflow-x: clip` on html and body (not `hidden`, which breaks sticky), `min-width: 0` on grid children, `overflow-wrap: break-word` site-wide (`anywhere` for emails and URLs), bullet lists use `display: block` with an absolutely positioned dot.

---

## Decisions log

- **2026-10-20 UX/UI refresh** (branch `ux-refresh`): 3 independent reviewer agents (navigation, mobile/accessibility, visual design) audited desktop and phone. Their fixes were applied **without changing any copy**. The only text change: every em dash (—) became a hyphen (-), as the owner asked. En dashes (–) were left alone (page title and meta tags, "12–24 months", "Buyer–Seller").
- Hero images moved from inline `style` attributes into CSS, so phones (<=600px) get a portrait crop (9-124 KB instead of up to 377 KB). Only the current page's hero is preloaded (small script in `<head>`).
- Image paths are absolute (`/images/...`): pushState changes the document URL, so relative paths would resolve to `/about/images/...` for anything loaded later (lazy images, CSS backgrounds).
- Section pills switch to the `<select>` below 1220px, because 8 pills don't fit on narrower screens (Strategic Partnerships has the longest set).
- "Four Ways We Help" (five cards): first row 01 (one third) + 02 (two thirds; the longest card), second row 03-05, at the owner's request (`.help-grid`). Order 01-05 kept.
- Individual pages are generated at publish time rather than committed: one source file, no copies to keep in sync, and only site files are published.
- Not changed (content, the owner's call): Engage page order (contact details above the form); the "Four Ways We Help" heading sits above five cards.

---

## Gotchas

- Inline JS in `onclick="..."` attributes: Python `re.sub` replacement strings can leave a literal backslash before quotes and break the handler. After bulk edits, run `node --check` on the extracted `<script>` and on each inline handler.
- A new page or URL needs: a `div.page`, entries in `pageUrls` (plus any alias in `urlToPage`), `404.html`, `pageTitles`, `routes` in `tools/build-site.mjs`, the hero preload map in `<head>` (if it has a hero), and `sitemap.xml`.
- The build rewrites head tags by exact pattern (`<meta name="description" content="..." />` etc.). If you change how those tags are written in index.html, run `node tools/build-site.mjs` locally: it stops with an error rather than publish wrong metadata.
- Never create an `AGENTS.md`: Codex reads this CLAUDE.md as its fallback, and an AGENTS.md would take its place.
- Python scripts in a temp folder: run them with `python -I`. A helper named like a stdlib module (e.g. `inspect.py`) next to the script gets imported instead of the real module.
- `.nav-dd:focus-within` drives keyboard opening of the dropdown. Do not switch it to `:has(:focus-visible)`: focus is lost while moving from the trigger into the menu.
- Do not set `overflow-x: hidden` on `html`: `body` then becomes the scroll container and the sticky section nav stops sticking.
- Never call `scrollIntoView()` on anything inside the sticky header or section nav. `html` has `scroll-padding-top` (88/150px), so the browser treats the stuck bar as hidden and scrolls the page up to reveal it; inside the scroll-spy this made the page creep upwards on its own (bug found and fixed 2026-10-20). The spy scrolls the pill row with `scrollLeft` instead.

---

## Known issues / pending work

1. (Resolved 2026-10-20, live after PR #11) Inner pages used to return 404 + redirect while sitemap.xml listed them. Verified live: all 8 inner URLs return 200 with their own titles; `/CLAUDE.md` and `/README.md` now 404. Owner to resubmit sitemap.xml in Google Search Console and check the inner URLs get indexed.
2. `images/international.webp` (662 KB) and the original hero files are no longer loaded; they can be removed from the repo once the owner is happy with the new images.
