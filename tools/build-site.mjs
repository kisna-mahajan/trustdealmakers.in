// Builds the published site into _site/.
//
// The site is one file (index.html). GitHub Pages has no /about/ etc. folders, so a
// direct link used to get a 404 and a JavaScript redirect. This script writes a real
// page for every route: a copy of index.html with that page already shown and its
// own <title>, description, canonical and social-preview tags. The description is the
// page's existing hero paragraph, so no new copy is introduced.
//
// Run: node tools/build-site.mjs     (no dependencies; Node 18+)
// GitHub Actions runs it on every push to main (.github/workflows/pages.yml).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '_site');
const origin = 'https://trustdealmakers.in';

// Must match pageUrls and pageTitles in index.html
const routes = [
  { id: 'bring-to-india',         url: '/bring-to-india/',            label: 'Bring to India' },
  { id: 'take-to-world',          url: '/global-market-development/', label: 'Take to the World' },
  { id: 'industrial',             url: '/industrial/',                label: 'Redeploy Globally' },
  { id: 'strategic-partnerships', url: '/strategic-partnerships/',    label: 'Strategic Partnerships' },
  { id: 'faq',                    url: '/faq/',                       label: 'FAQ' },
  { id: 'about',                  url: '/about/',                     label: 'About' },
  { id: 'vision',                 url: '/vision/',                    label: 'Vision 2036' },
  { id: 'engage',                 url: '/engage/',                    label: 'Engage' },
];

// Files and folders that make up the public site (everything else stays private)
const publish = [
  'index.html', '404.html', 'CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml', 'security.txt',
  'favicon.ico', 'favicon.svg', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png',
  '.well-known', 'images',
];

const decode = s => s
  .replace(/&nbsp;/g, ' ').replace(/&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"')
  .replace(/&rarr;/g, '→').replace(/&eacute;/g, 'é').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Replace exactly one match, or stop the build: a silent miss would publish wrong metadata
function replaceOnce(html, pattern, replacement, what) {
  const matches = html.match(new RegExp(pattern.source, pattern.flags.replace('g', '') + 'g'));
  if (!matches || matches.length !== 1) {
    throw new Error(`build-site: expected exactly one ${what}, found ${matches ? matches.length : 0}`);
  }
  return html.replace(pattern, () => replacement);
}

function heroText(html, id) {
  const start = html.indexOf(`<div id="${id}" class="page`);
  if (start < 0) throw new Error(`build-site: page #${id} not found`);
  const hero = html.slice(start).match(/class="(?:hero-cnt|sub-hero)">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (!hero) throw new Error(`build-site: no hero paragraph for #${id}`);
  return decode(hero[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function pageFor(html, route, homeTitle) {
  const title = `${route.label} | Trust DealMakers`;
  const desc = heroText(html, route.id);
  const url = origin + route.url;
  let h = html;
  h = replaceOnce(h, /<html lang="en-IN">/, `<html lang="en-IN" data-home-title="${attr(homeTitle)}">`, '<html> tag');
  h = replaceOnce(h, /<title>[^<]*<\/title>/, `<title>${text(title)}</title>`, '<title>');
  h = replaceOnce(h, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${attr(desc)}" />`, 'meta description');
  h = replaceOnce(h, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, 'canonical link');
  h = h.replace(/(<link rel="alternate" hreflang="[^"]+" href=")[^"]*(" \/>)/g, `$1${url}$2`);
  h = replaceOnce(h, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${attr(title)}" />`, 'og:title');
  h = replaceOnce(h, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${attr(desc)}" />`, 'og:description');
  h = replaceOnce(h, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`, 'og:url');
  h = replaceOnce(h, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${attr(title)}" />`, 'twitter:title');
  h = replaceOnce(h, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${attr(desc)}" />`, 'twitter:description');
  // Show this page in the HTML itself (crawlers and the first paint), not only after JS runs
  h = replaceOnce(h, /<div id="home" class="page active">/, '<div id="home" class="page">', 'active home page');
  h = replaceOnce(h, new RegExp(`<div id="${route.id}" class="page">`), `<div id="${route.id}" class="page active">`, `#${route.id} page`);
  return h;
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const item of publish) {
  const src = path.join(root, item);
  if (!fs.existsSync(src)) throw new Error(`build-site: missing ${item}`);
  fs.cpSync(src, path.join(out, item), { recursive: true });
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const homeTitle = decode(index.match(/<title>([^<]*)<\/title>/)[1]);
for (const route of routes) {
  const dir = path.join(out, route.url);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pageFor(index, route, homeTitle));
  console.log(`  ${route.url.padEnd(30)} ${route.label}`);
}
console.log(`Built ${routes.length + 1} pages into _site/`);
