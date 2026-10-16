// Read-only smoke checks against a production build: node scripts/check-seo.mjs http://localhost:3107
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const regions = JSON.parse(readFileSync(new URL('../lib/data/contact-regions.json', import.meta.url), 'utf8')).regions;
const areas = JSON.parse(readFileSync(new URL('../lib/data/service-areas.json', import.meta.url), 'utf8'));
assert.equal(areas.length, 17);
const areaSlugs = new Set(areas.map((area) => area.urlSlug));
assert.equal(areaSlugs.size, 17);
const base = process.argv[2] ?? 'http://localhost:3107';
const configuredOrigin = process.env.SITE_URL ?? 'https://www.kmwindow.com';
const canonicalOrigin = configuredOrigin === 'https://kmwindow.com' ? 'https://www.kmwindow.com' : configuredOrigin;
const titles = new Set();
for (const path of ['/', '/about', '/services', '/contact', '/contact/계양', '/contact/부산동', '/contact/망포동', '/contact/분당정자동', '/contact/장안정자동', '/contact/광주', '/contact/전남광주', '/areas', ...areas.map((area) => `/contact/${area.urlSlug}`)]) {
  const response = await fetch(new URL(path, base), { redirect: 'manual' });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${path}: one H1`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `${path}: unique title`);
  titles.add(title);
  assert.equal(new URL(html.match(/rel="canonical" href="([^"]+)"/)?.[1]).href, new URL(path, canonicalOrigin).href, `${path}: canonical`);
  assert.ok(html.includes('property="og:image"'), `${path}: OG image`);
  assert.ok(html.includes('content="summary_large_image"'), `${path}: social card`);
  for (const name of ['robots', 'googlebot']) {
    const directives = html.match(new RegExp(`<meta name="${name}" content="([^"]+)"`))?.[1]?.split(/,\s*/);
    assert.ok(directives?.includes(path.startsWith('/contact/') && !areaSlugs.has(path.split('/').at(-1)) ? 'noindex' : 'index'), `${path}: ${name} indexing`);
    assert.ok(directives?.includes('follow'), `${path}: ${name} follow`);
  }
  const data = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
  if (path === '/') {
    const graph = data.find((entry) => entry['@graph'])['@graph'];
    assert.equal(graph.find((entry) => entry['@type'] === 'Organization').areaServed.name, '대한민국');
    assert.ok(graph.some((entry) => entry['@type'] === 'WebSite'));
  } else {
    const breadcrumb = data.find((entry) => entry['@type'] === 'BreadcrumbList');
    assert.equal(breadcrumb.itemListElement.at(-1).item, new URL(path, canonicalOrigin).href);
    if (path.startsWith('/contact/')) {
      const slug = path.split('/').at(-1);
      const area = areas.find((item) => item.urlSlug === slug);
      const region = regions.find((item) => item.slug === (area?.slug ?? slug)) ?? area;
      assert.ok(title.includes(area ? `${region.name} 샤시 교체·창호 견적 상담 | 국민창호` : `국민창호 ${region.name} 창호 교체`), `${path}: brand, region and service title`);
      const heading = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1];
      assert.ok(heading.includes(`${region.name} 창호 교체`), `${path}: region and service H1`);
      const service = data.find((entry) => entry['@type'] === 'Service');
      assert.equal(service.areaServed.name, region.fullName, `${path}: correct service area`);
      assert.equal(service.url, new URL(path, canonicalOrigin).href);
      assert.ok(html.includes(service.description), `${path}: structured description is visible`);
    }
  }
  if (path === '/contact' || path.startsWith('/contact/')) assert.ok(!html.includes('contact-region-directory'));
  if (path === '/areas') for (const area of areas) assert.ok(html.includes(`/contact/${area.urlSlug}`));
  console.log('PASS', path);
}
for (const area of areas) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(new URL(`/contact/${encodeURIComponent(area.slug)}`, base), { redirect: 'manual' });
    assert.equal(res.status, 200, `${area.slug}: no redirect`);
    assert.equal(res.headers.get('location'), null);
    const html = await res.text();
    for (const name of ['robots', 'googlebot']) {
      assert.ok(html.includes(`<meta name="${name}" content="noindex, follow"`), `${area.slug}: ${name} noindex`);
    }
    assert.equal(new URL(html.match(/rel="canonical" href="([^"]+)"/)?.[1]).href, new URL(`/contact/${area.urlSlug}`, canonicalOrigin).href);
  }
}
for (const [oldPath, newPath] of [['망포', '망포동'], ['부산광역시', 'busan'], ['분당정자', '분당정자동']]) {
  // Repeat requests to catch redirects whose Location disappears on a cache hit.
  for (let attempt = 0; attempt < 2; attempt++) {
  const res = await fetch(new URL(`/contact/${oldPath}`, base), { redirect: 'manual', headers: { 'user-agent': 'Googlebot' } });
  assert.equal(res.status, 308, oldPath);
  assert.ok(res.headers.get('location'), `${oldPath}: redirect Location`);
  assert.equal(new URL(res.headers.get('location'), base).pathname, `/contact/${encodeURIComponent(newPath)}`);
  }
}
const missing = await fetch(new URL('/contact/not-a-real-region', base));
assert.equal(missing.status, 404);
assert.ok((await missing.text()).includes('content="noindex"'));
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(urls, ['/', '/about', '/services', '/contact', '/areas', ...areas.map((area) => `/contact/${area.urlSlug}`)].map((path) => new URL(path, canonicalOrigin).href));
assert.equal(new Set(urls).size, urls.length);
assert.ok(urls.every((url) => url.startsWith(canonicalOrigin + '/')));
assert.ok(!urls.includes(new URL('/contact/망포', canonicalOrigin).href));
const robots = await (await fetch(new URL('/robots.txt', base))).text();
assert.ok(robots.includes('Allow: /'));
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
for (const asset of ['/og-image.png', '/favicon.ico', '/icon.png', '/icon.svg', '/apple-icon.png']) {
  assert.equal((await fetch(new URL(asset, base))).status, 200, asset);
}
console.log(`PASS redirects, 404/noindex, ${urls.length} sitemap URLs, robots and images`);
