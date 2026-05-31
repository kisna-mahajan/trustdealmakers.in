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
| Hosting | GitHub Pages, `main` branch, `/ (root)` |
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

---

## Site structure

Single-page app — all pages are `div.page` elements toggled by `showPage(id)` in JavaScript. No routing, no build step, no framework.

**Pages:** `home` · `trade` · `industrial` · `about` · `contact`

**Excluded from site:** Executive Search (exists on the original trustdealmakers.in but not included here by design)

### Images (stored in `images/`)

- `header.jpeg` — nav logo
- `cover1.png` — home/contact hero
- `international.jpeg` — trade page hero
- `industrial.jpeg` — industrial assets hero
- `display-image.jpeg` — Anil's profile photo

---

## Design system

| Token | Value |
|-------|-------|
| Primary red | `#CC0000` |
| Dark hover | `#aa0000` |
| Near-black | `#111111` |
| Body text | `#333333` |
| Muted text | `#666666` |
| Border | `#e0e0e0` |
| Background gray | `#f5f5f5` |
| Max width | `1280px` |
| Section padding | `96px 48px` |

Key patterns: cards with red top-border on hover · dark stats section · CTA bands · sticky nav with 3px red accent bar · Inter 900 for headlines

---

## Typography

Dual-font system: **Playfair Display** (serif, headlines) + **Inter** (sans-serif, body). Loaded via Google Fonts.
