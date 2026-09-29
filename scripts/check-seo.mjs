// Read-only smoke checks against a production build: node scripts/check-seo.mjs http://localhost:3107
import assert from 'node:assert/strict';
const base = process.argv[2] ?? 'http://localhost:3107';
const canonicalOrigin = process.env.SITE_URL ?? 'https://kmwindow.com';
const titles = new Set();
for (const path of ['/', '/about', '/services', '/contact', '/contact/부산', '/contact/부산동', '/contact/망포동', '/contact/분당정자동']) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${path}: one H1`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `${path}: unique title`);
  titles.add(title);
  assert.equal(new URL(html.match(/rel="canonical" href="([^"]+)"/)?.[1]).href, new URL(path, canonicalOrigin).href, `${path}: canonical`);
  assert.ok(html.includes('property="og:image"'), `${path}: OG image`);
  assert.ok(html.includes('content="summary_large_image"'), `${path}: social card`);
  assert.ok(!html.includes('content="noindex'), `${path}: indexable`);
  const data = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
  if (path === '/') {
    const graph = data.find((entry) => entry['@graph'])['@graph'];
    assert.equal(graph.find((entry) => entry['@type'] === 'Organization').areaServed.name, '대한민국');
    assert.ok(graph.some((entry) => entry['@type'] === 'WebSite'));
  } else {
    const breadcrumb = data.find((entry) => entry['@type'] === 'BreadcrumbList');
    assert.equal(breadcrumb.itemListElement.at(-1).item, new URL(path, canonicalOrigin).href);
  }
  console.log('PASS', path);
}
for (const [oldPath, newPath] of [['망포', '망포동'], ['부산광역시', '부산'], ['분당정자', '분당정자동']]) {
  const res = await fetch(new URL(`/contact/${oldPath}`, base), { redirect: 'manual', headers: { 'user-agent': 'Googlebot' } });
  assert.equal(res.status, 308, oldPath);
  assert.equal(new URL(res.headers.get('location'), base).pathname, `/contact/${encodeURIComponent(newPath)}`);
}
const missing = await fetch(new URL('/contact/not-a-real-region', base));
assert.equal(missing.status, 404);
assert.ok((await missing.text()).includes('content="noindex"'));
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(urls.length, 5355);
assert.equal(new Set(urls).size, urls.length);
assert.ok(urls.every((url) => url.startsWith(canonicalOrigin + '/')));
assert.ok(!urls.includes(new URL('/contact/망포', canonicalOrigin).href));
const robots = await (await fetch(new URL('/robots.txt', base))).text();
assert.ok(robots.includes('Allow: /'));
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
for (const asset of ['/og-image.png', '/icon.png', '/icon.svg', '/apple-icon.png', '/naverddd4e9eccd9ed0d1dd3ddc4dff908242.html']) {
  assert.equal((await fetch(new URL(asset, base))).status, 200, asset);
}
console.log('PASS redirects, 404/noindex, 5,355 sitemap URLs, robots, images and Naver verification');
