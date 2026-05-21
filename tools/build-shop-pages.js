const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SHOPS_DATA_PATH = path.join(ROOT, 'shops-data.js');
const SHOP_TEMPLATE_PATH = path.join(ROOT, 'shop.html');
const SHOP_OUT_DIR = path.join(ROOT, 'shop');

const dataSrc = fs.readFileSync(SHOPS_DATA_PATH, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataSrc, sandbox);
const SHOPS_DATA = sandbox.window.SHOPS_DATA;

const template = fs.readFileSync(SHOP_TEMPLATE_PATH, 'utf8');

function slugify(id) {
  return id.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildHead(shop, id, slug) {
  let rawSalary = (shop.salary && (shop.salary.monthly || shop.salary.daily)) || '';
  rawSalary = String(rawSalary).replace(/^(月収|月給|日給)\s*/, '');
  const isPlaceholder = !rawSalary || /問い合わせ|相談|お問合せ/.test(rawSalary);
  const salaryClause = isPlaceholder ? '未経験OK・寮完備' : `月収${rawSalary}`;
  const benefitsTop = (shop.benefits && shop.benefits.length > 0)
    ? shop.benefits.slice(0, 3).join('・')
    : 'サポート充実';
  const conceptShort = (shop.conceptMeta || shop.concept || '').slice(0, 140);
  const title = `${shop.name}｜${shop.city}${shop.type}求人 - ${salaryClause} | KaigaiQ`;
  const desc = `${shop.flag} ${shop.city}の${shop.type}「${shop.name}」のキャスト求人情報。${conceptShort}。${salaryClause}、${benefitsTop}。`;
  const canonicalUrl = `https://kaigaiq.com/shop/${slug}.html`;
  const ogImage = shop.heroImage || (shop.gallery && shop.gallery[0]) || 'https://kaigaiq.com/icons/icon-512.svg';

  const typeMap = {
    'キャバクラ': 'NightClub',
    'ラウンジ': 'NightClub',
    'ガールズバー': 'BarOrPub',
    'スナック': 'BarOrPub',
    'Bar': 'BarOrPub',
    'コンカフェ': 'CafeOrCoffeeShop',
    '高級会員制ラウンジ': 'NightClub',
    'KTV': 'NightClub'
  };
  const schemaType = typeMap[shop.type] || 'LocalBusiness';
  const address = shop.address || (shop.contact && shop.contact.address) || '';
  const primaryAddress = address.split(/\s*\/\s*/)[0];

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: shop.name,
    url: canonicalUrl,
    image: shop.heroImage,
    description: shop.conceptMeta || shop.concept,
    address: { '@type': 'PostalAddress', addressLocality: shop.city, streetAddress: primaryAddress },
    areaServed: shop.city
  };
  if (shop.contact && shop.contact.phone) localBusiness.telephone = shop.contact.phone;
  if (shop.contact && shop.contact.email) localBusiness.email = shop.contact.email;
  if (shop.contact && shop.contact.website) localBusiness.sameAs = [shop.contact.website];
  if (shop.hours) localBusiness.openingHours = shop.hours;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://kaigaiq.com/' },
      { '@type': 'ListItem', position: 2, name: shop.region, item: 'https://kaigaiq.com/#areas' },
      { '@type': 'ListItem', position: 3, name: shop.city, item: 'https://kaigaiq.com/#areas' },
      { '@type': 'ListItem', position: 4, name: shop.name, item: canonicalUrl }
    ]
  };

  const monthlySalary = shop.salary && shop.salary.monthly ? String(shop.salary.monthly) : '';
  const jobPosting = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: `${shop.name} キャスト募集（${shop.city}・${shop.type}）`,
    description: `${shop.concept || ''}${shop.benefits ? '\n\n【待遇】\n' + shop.benefits.join('\n') : ''}${shop.housing ? '\n\n【住居】\n' + (Array.isArray(shop.housing) ? shop.housing.join('\n') : shop.housing) : ''}`,
    identifier: { '@type': 'PropertyValue', name: 'KaigaiQ', value: id },
    datePosted: '2026-05-21',
    employmentType: ['FULL_TIME', 'PART_TIME', 'TEMPORARY'],
    hiringOrganization: { '@type': 'Organization', name: shop.name, sameAs: canonicalUrl },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: shop.city, streetAddress: primaryAddress }
    },
    directApply: false,
    url: canonicalUrl
  };
  if (monthlySalary) {
    jobPosting.baseSalary = {
      '@type': 'MonetaryAmount',
      value: { '@type': 'QuantitativeValue', value: monthlySalary, unitText: 'MONTH' }
    };
  }

  return {
    title: escHtml(title),
    desc: escHtml(desc),
    canonicalUrl,
    ogImage: escHtml(ogImage),
    ogTitle: escHtml(`${shop.name}（${shop.flag} ${shop.city}・${shop.type}）| KaigaiQ`),
    twTitle: escHtml(`${shop.name}（${shop.flag} ${shop.city}・${shop.type}）`),
    jsonLd: [localBusiness, breadcrumb, jobPosting]
  };
}

function transform(template, shop, id, slug) {
  const h = buildHead(shop, id, slug);
  let html = template;

  html = html.replace(
    /<title id="pageTitle">[^<]*<\/title>/,
    `<title id="pageTitle">${h.title}</title>`
  );
  html = html.replace(
    /<meta name="description" id="metaDesc" content="[^"]*">/,
    `<meta name="description" id="metaDesc" content="${h.desc}">`
  );
  html = html.replace(
    /<link rel="canonical" id="canonicalLink" href="[^"]*">/,
    `<link rel="canonical" id="canonicalLink" href="${h.canonicalUrl}">`
  );
  html = html.replace(
    /<meta property="og:title" id="ogTitle" content="[^"]*">/,
    `<meta property="og:title" id="ogTitle" content="${h.ogTitle}">`
  );
  html = html.replace(
    /<meta property="og:description" id="ogDesc" content="[^"]*">/,
    `<meta property="og:description" id="ogDesc" content="${h.desc}">`
  );
  html = html.replace(
    /<meta property="og:url" id="ogUrl" content="[^"]*">/,
    `<meta property="og:url" id="ogUrl" content="${h.canonicalUrl}">`
  );
  html = html.replace(
    /<meta property="og:image" id="ogImage" content="[^"]*">/,
    `<meta property="og:image" id="ogImage" content="${h.ogImage}">`
  );
  html = html.replace(
    /<meta name="twitter:title" id="twTitle" content="[^"]*">/,
    `<meta name="twitter:title" id="twTitle" content="${h.twTitle}">`
  );
  html = html.replace(
    /<meta name="twitter:description" id="twDesc" content="[^"]*">/,
    `<meta name="twitter:description" id="twDesc" content="${h.desc}">`
  );
  html = html.replace(
    /<meta name="twitter:image" id="twImage" content="[^"]*">/,
    `<meta name="twitter:image" id="twImage" content="${h.ogImage}">`
  );

  const jsonLdBlocks = h.jsonLd.map((d, i) => {
    const ids = ['ldLocalBusiness', 'ldBreadcrumb', 'ldJobPosting'];
    return `  <script type="application/ld+json" id="${ids[i]}">${JSON.stringify(d)}</script>`;
  }).join('\n');
  html = html.replace(
    /<link rel="stylesheet" href="shop.css">/,
    `<link rel="stylesheet" href="shop.css">\n${jsonLdBlocks}\n  <script>window.SHOP_ID = ${JSON.stringify(id)};</script>`
  );

  html = html.replace(
    /(src|href)="(?!https?:|\/\/|\/|data:|#|mailto:|tel:)([^"]+)"/g,
    '$1="/$2"'
  );

  return html;
}

if (!fs.existsSync(SHOP_OUT_DIR)) fs.mkdirSync(SHOP_OUT_DIR, { recursive: true });

const slugMap = {};
const ids = Object.keys(SHOPS_DATA);
for (const id of ids) {
  const shop = SHOPS_DATA[id];
  const slug = slugify(id);
  slugMap[id] = slug;
  const html = transform(template, shop, id, slug);
  const outPath = path.join(SHOP_OUT_DIR, `${slug}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`✓ ${id} → /shop/${slug}.html`);
}

const sitemapPath = path.join(ROOT, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
const oldEntries = [...sitemap.matchAll(/<url><loc>https:\/\/kaigaiq\.com\/shop\.html\?id=[^<]+<\/loc>[^<]*<changefreq>[^<]+<\/changefreq>[^<]*<priority>[^<]+<\/priority><\/url>\n?/g)];
oldEntries.forEach(m => { sitemap = sitemap.replace(m[0], ''); });

const newShopEntries = ids.map(id => {
  const slug = slugMap[id];
  return `  <url><loc>https://kaigaiq.com/shop/${slug}.html</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
}).join('\n');
sitemap = sitemap.replace(
  /(\s*<!-- Shop Pages -->)?(\s*<url><loc>https:\/\/kaigaiq\.com\/shop\.html<\/loc>[\s\S]*?<\/url>)/,
  (m, c, shopPage) => `${shopPage}\n  <!-- Shop Pages (pre-rendered) -->\n${newShopEntries}`
);
fs.writeFileSync(sitemapPath, sitemap);
console.log(`\n✓ sitemap.xml updated with ${ids.length} pre-rendered shop URLs`);

const slugMapPath = path.join(ROOT, 'shop-slug-map.json');
fs.writeFileSync(slugMapPath, JSON.stringify(slugMap, null, 2));
console.log(`✓ shop-slug-map.json written (${ids.length} entries)`);
