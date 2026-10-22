// Read-only smoke checks against a production build: node scripts/check-seo.mjs http://localhost:3107
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const regions = JSON.parse(readFileSync(new URL('../lib/data/contact-regions.json', import.meta.url), 'utf8')).regions;
const areas = JSON.parse(readFileSync(new URL('../lib/data/service-areas.json', import.meta.url), 'utf8'));
assert.equal(areas.length, 17);
const areaBySlug = new Map(areas.map((area) => [area.slug, area]));
const allRegions = [...regions, ...areas.filter((area) => !regions.some((region) => region.slug === area.slug)).map((area) => ({ ...area, level: '시' }))];
const eligible = allRegions.filter((region) => ['도', '시', '군', '구'].includes(region.level));
const regionPath = (region) => `/contact/${areaBySlug.get(region.slug)?.urlSlug ?? `local-${region.code}`}`;
const indexedRegions = new Map(eligible.map((region) => [regionPath(region), region]));
assert.equal(indexedRegions.size, eligible.length);
const corePaths = ['/', '/about', '/services', '/contact', '/areas'];
const base = process.argv[2] ?? 'http://localhost:3107';
const configuredOrigin = process.env.SITE_URL ?? 'https://www.kmwindow.com';
const canonicalOrigin = configuredOrigin === 'https://kmwindow.com' ? 'https://www.kmwindow.com' : configuredOrigin;
const titles = new Set();
for (const path of [...corePaths, ...indexedRegions.keys()]) {
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
    assert.ok(directives?.includes(path.startsWith('/contact/') && !indexedRegions.has(path) ? 'noindex' : 'index'), `${path}: ${name} indexing`);
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
      const region = indexedRegions.get(path) ?? regions.find((item) => item.slug === slug);
      assert.ok(title.includes(indexedRegions.has(path) ? `${area ? region.name : region.fullName} 샤시 교체·창호 견적 상담 | 국민창호` : `국민창호 ${region.name} 창호 교체`), `${path}: brand, region and service title`);
      const heading = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1];
      assert.ok(heading.includes(`${region.name} 창호 교체`), `${path}: region and service H1`);
      const service = data.find((entry) => entry['@type'] === 'Service');
      assert.equal(service.areaServed.name, region.fullName, `${path}: correct service area`);
      assert.equal(service.url, new URL(path, canonicalOrigin).href);
      assert.ok(html.includes(service.description), `${path}: structured description is visible`);
    }
  }
  if (path === '/contact' || path.startsWith('/contact/')) assert.ok(!html.includes('contact-region-directory'));
  if (path === '/areas') for (const target of indexedRegions.keys()) assert.ok(html.includes(target), `directory: ${target}`);
  console.log('PASS', path);
}
// Removed Korean and retired URLs must return a real 404 without a redirect.
const removedSlugs = new Set([...eligible.map((region) => region.slug), '망포', '부산광역시', '분당정자', '부산동', '분당정자동']);
for (const level of ['읍', '면', '동']) {
  const region = regions.find((region) => region.level === level);
  removedSlugs.add(region.slug);
  removedSlugs.add(`local-${region.code}`);
}
for (const slug of removedSlugs) {
  const res = await fetch(new URL(`/contact/${encodeURIComponent(slug)}`, base), { redirect: 'manual' });
  assert.equal(res.status, 404, `${slug}: removed`);
  assert.equal(res.headers.get('location'), null, `${slug}: no redirect`);
  assert.ok((await res.text()).includes('content="noindex"'), `${slug}: 404 noindex`);
}
const missing = await fetch(new URL('/contact/not-a-real-region', base));
assert.equal(missing.status, 404);
assert.ok((await missing.text()).includes('content="noindex"'));
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(urls, [...corePaths, ...indexedRegions.keys()].map((path) => new URL(path, canonicalOrigin).href));
assert.equal(new Set(urls).size, urls.length);
assert.ok(urls.every((url) => url.startsWith(canonicalOrigin + '/') && /^[\x00-\x7F]*$/.test(url)));
for (const region of regions.filter((region) => ['읍', '면', '동'].includes(region.level))) {
  assert.ok(!urls.includes(new URL(regionPath(region), canonicalOrigin).href), `sitemap excludes ${region.slug}`);
}
assert.ok(!urls.includes(new URL('/contact/망포', canonicalOrigin).href));
const robots = await (await fetch(new URL('/robots.txt', base))).text();
assert.ok(robots.includes('Allow: /'));
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
for (const asset of ['/og-image.png', '/favicon.ico', '/icon.png', '/icon.svg', '/apple-icon.png']) {
  assert.equal((await fetch(new URL(asset, base))).status, 200, asset);
}
console.log(`PASS removed Korean/legacy URLs return 404, ${urls.length} sitemap URLs, robots and images`);
