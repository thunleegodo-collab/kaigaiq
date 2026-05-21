const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const dataSrc = fs.readFileSync(path.join(ROOT, 'shops-data.js'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataSrc, sandbox);
const SHOPS_DATA = sandbox.window.SHOPS_DATA;

const slugMap = JSON.parse(fs.readFileSync(path.join(ROOT, 'shop-slug-map.json'), 'utf8'));

const CITIES = {
  '香港': { slug: 'hongkong', flag: '🇭🇰', en: 'Hong Kong', region: 'アジア',
    intro: '世界中のVIPが集まる国際都市・香港。日本人キャストの需要が高く、米ドルペッグのHKDで給与の円換算メリットも大きいエリアです。銅鑼湾（コーズウェイベイ）・尖沙咀（チムサーチョイ）に日系ラウンジ・バーが集中。月収HK$35,000〜80,000（約70〜160万円）が標準レンジ。',
    keywords: '香港 キャバクラ,香港 ラウンジ,香港 日本人,銅鑼湾 求人,コーズウェイベイ' },
  'バンコク': { slug: 'bangkok', flag: '🇹🇭', en: 'Bangkok', region: 'アジア',
    intro: 'タイ・バンコクは東南アジア最大の日系ナイトワークエリア。スクンビット通り（Soi23・33・55等）に12店舗以上の日本式キャバクラ・ラウンジ・ガールズバーが集中。物価が安く実質手取りが大きいのが魅力。月収12〜35万バーツ（約55〜160万円）、業界最高水準店舗あり。',
    keywords: 'バンコク キャバクラ,バンコク ラウンジ,スクンビット 求人,タイ 日本人キャスト' },
  'シンガポール': { slug: 'singapore', flag: '🇸🇬', en: 'Singapore', region: 'アジア',
    intro: 'シンガポールは東南アジア屈指の経済都市で、日系ラウンジ・キャバクラが集中。Cuppage Plaza、Orchard Road周辺に4店舗の日本人キャスト在籍店。SGDが対円で堅調で実質収入は過去最高水準。月収SGD 9,000〜15,000（約105〜175万円）。',
    keywords: 'シンガポール キャバクラ,シンガポール ラウンジ,Orchard 求人' },
  'ホーチミン': { slug: 'hochiminh', flag: '🇻🇳', en: 'Ho Chi Minh', region: 'アジア',
    intro: 'ベトナム・ホーチミンは物価の安さと高収入の両立が魅力。Le Thanh Ton通りに日系キャバクラ・ガールズバーが集中。月収50万円〜可能で、生活コストは日本の約1/3。寮完備・短期勤務OKの店舗も多数。',
    keywords: 'ホーチミン キャバクラ,ホーチミン ガールズバー,ベトナム 求人' },
  'プノンペン': { slug: 'phnompenh', flag: '🇰🇭', en: 'Phnom Penh', region: 'アジア',
    intro: 'カンボジア・プノンペンは日本式高級ラウンジの新興エリア。BKK1地区に5店舗の日系ナイトワーク店。月収US$2,000〜15,000（約32〜237万円）と上限が高く、銀座式の格式あるサービスを提供する完全会員制店舗も。',
    keywords: 'プノンペン キャバクラ,カンボジア ラウンジ,BKK1 求人' },
  'ハノイ': { slug: 'hanoi', flag: '🇻🇳', en: 'Hanoi', region: 'アジア',
    intro: 'ベトナム・ハノイの日系ナイトワーク店舗。日本式カラオケスナックで、客層は9割日本人。語学不要・送迎あり。時給300,000VND〜、各種バック制度あり。',
    keywords: 'ハノイ キャバクラ,ハノイ ガールズバー' },
  '台北': { slug: 'taipei', flag: '🇹🇼', en: 'Taipei', region: 'アジア',
    intro: '台湾・台北・林森北路の日式スナック。マネージャー優しく、ビジネスオーナー・良識ある常連客が多い働きやすい環境。日給350元、ドリンクバック・テキーラバック・ボトルバックあり。台湾労働ビザ取得支援。',
    keywords: '台北 スナック,台湾 キャバクラ,林森北路 求人' },
  '上海': { slug: 'shanghai', flag: '🇨🇳', en: 'Shanghai', region: 'アジア',
    intro: '中国上海・古北日本人街の日系キャバクラ。1階カウンター・2階カラオケ完全個室の構成。月収約20万円以上、3週間以上で片道航空券支給、寮費無料。',
    keywords: '上海 キャバクラ,中国 日本人,古北 求人' },
  '韓国・江陵': { slug: 'korea', flag: '🇰🇷', en: 'Korea Gangneung', region: 'アジア',
    intro: '韓国屈指の観光地・江陵の海前ラウンジ。日給20,000円（最低保証）、寮あり、往復航空券支給。日本の携帯から電話推奨。',
    keywords: '韓国 キャバクラ,韓国 ラウンジ,江陵 求人' },
  'ロサンゼルス': { slug: 'losangeles', flag: '🇺🇸', en: 'Los Angeles', region: '北アメリカ',
    intro: 'ロサンゼルス唯一のメンバーズ制クラブ。外キャバ経験者を会員として扱う。月収30〜100万円（100時間勤務）、初回20万円のお礼金、キャスト専用寮・送迎完備。',
    keywords: 'LA キャバクラ,ロサンゼルス 日本人,アメリカ ナイトワーク' },
  'デュッセルドルフ': { slug: 'dusseldorf', flag: '🇩🇪', en: 'Düsseldorf', region: 'ヨーロッパ',
    intro: 'ドイツ・デュッセルドルフの日本人街の日系キャバクラ。最新カラオケ機器導入。月収約100万円（週末中心）、ビザ申請料会社負担、寮あり。',
    keywords: 'デュッセルドルフ キャバクラ,ドイツ 日本人,欧州 ナイトワーク' },
  'ドバイ': { slug: 'dubai', flag: '🇦🇪', en: 'Dubai', region: '中東',
    intro: 'ドバイ初のシンガポール×札幌すすきの系列ラウンジ。3ヶ月契約600万円・6ヶ月700万円・12ヶ月800万円の円建て保証。所得税ゼロ、米ドルペッグで為替メリット。',
    keywords: 'ドバイ キャバクラ,ドバイ ラウンジ,中東 求人,UAE 日本人' }
};

const READ_LINK = (relUrl) => `<a href="${relUrl}" style="color:#e6c97a;">${relUrl.replace(/^\//, '').replace(/\.html$/, '')}</a>`;

function buildAreaPage(cityName, conf, shops) {
  const canonicalUrl = `https://kaigaiq.com/area/${conf.slug}.html`;
  const title = `${cityName}のキャバクラ・ラウンジ求人【${shops.length}店掲載】月収相場・店舗一覧 | KaigaiQ`;
  const desc = `${conf.flag} ${cityName}（${conf.en}）の海外キャバクラ・ラウンジ求人を${shops.length}店掲載。${conf.intro.slice(0, 80)}`;
  const ogImage = (shops[0] && shops[0].heroImage) || 'https://kaigaiq.com/icons/icon-512.svg';

  const shopCards = shops.map(s => {
    const slug = slugMap[s.id];
    const img = (s.gallery && s.gallery[0]) || s.heroImage;
    let salary = (s.salary && (s.salary.monthly || s.salary.daily)) || '';
    salary = String(salary).replace(/^(月収|月給|日給)\s*/, '');
    if (!salary || /問い合わせ|相談/.test(salary)) salary = '未経験OK';
    const benefits = (s.benefits || []).slice(0, 2).join('・');
    return `
        <a href="/shop/${slug}.html" class="area-shop-card">
          <div class="area-shop-img" role="img" aria-label="${s.name}の店舗写真" style="background-image:url('${img}')"></div>
          <div class="area-shop-info">
            <h3>${s.name}</h3>
            <p class="area-shop-type">${s.type}</p>
            <p class="area-shop-salary">月収 ${salary}</p>
            ${benefits ? `<p class="area-shop-benefits">${benefits}</p>` : ''}
          </div>
        </a>`;
  }).join('');

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cityName}の海外キャバクラ・ラウンジ求人`,
    numberOfItems: shops.length,
    itemListElement: shops.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://kaigaiq.com/shop/${slugMap[s.id]}.html`,
      name: s.name
    }))
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://kaigaiq.com/' },
      { '@type': 'ListItem', position: 2, name: conf.region, item: 'https://kaigaiq.com/#areas' },
      { '@type': 'ListItem', position: 3, name: cityName, item: canonicalUrl }
    ]
  };

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="google-site-verification" content="bxECX6P4sHUXqpweZYxY_JlXS6HvMRzqHsiejpXr_f8" />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-HP8686808M"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-HP8686808M');
  </script>
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="keywords" content="${conf.keywords},海外キャバクラ求人,海外ナイトワーク,未経験OK">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:site_name" content="KaigaiQ">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${ogImage}">
  <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
  <script type="application/ld+json">${JSON.stringify(itemListLd)}</script>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#c8a45c">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Inter:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/style.css">
  <style>
    .area-hero { padding: 120px 24px 60px; background: linear-gradient(135deg,#0d0d18 0%,#0a0a0f 50%,#12101a 100%); text-align: center; }
    .area-hero h1 { font-size: clamp(1.8rem, 4vw, 2.6rem); margin-bottom: 16px; }
    .area-hero-flag { font-size: 3rem; display: block; margin-bottom: 8px; }
    .area-hero-sub { color: rgba(255,255,255,0.7); max-width: 720px; margin: 0 auto; font-size: 0.95rem; line-height: 1.8; }
    .area-stats { display: flex; justify-content: center; gap: 40px; margin-top: 32px; }
    .area-stat { text-align: center; }
    .area-stat-num { font-size: 2rem; font-weight: 700; color: #c8a45c; }
    .area-stat-label { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
    .area-shops-section { padding: 60px 24px; max-width: 1200px; margin: 0 auto; }
    .area-shops-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 32px; }
    .area-shop-card { display: flex; flex-direction: column; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; text-decoration: none; color: inherit; transition: all 0.25s; }
    .area-shop-card:hover { transform: translateY(-3px); border-color: #c8a45c; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    .area-shop-img { height: 160px; background-size: cover; background-position: center; }
    .area-shop-info { padding: 16px; }
    .area-shop-info h3 { font-size: 1.05rem; margin-bottom: 6px; color: #fff; }
    .area-shop-type { font-size: 0.82rem; color: rgba(255,255,255,0.6); margin-bottom: 6px; }
    .area-shop-salary { font-size: 0.9rem; color: #e6c97a; font-weight: 600; margin-bottom: 6px; }
    .area-shop-benefits { font-size: 0.78rem; color: rgba(255,255,255,0.5); }
    .area-related { padding: 40px 24px 80px; max-width: 900px; margin: 0 auto; }
    .area-related h2 { font-size: 1.4rem; margin-bottom: 16px; color: #c8a45c; }
    .area-related ul { list-style: none; padding: 0; }
    .area-related li { margin-bottom: 12px; line-height: 1.7; color: rgba(255,255,255,0.7); }
    .area-related a { color: #e6c97a; text-decoration: none; }
    .area-related a:hover { text-decoration: underline; }
    .breadcrumb { padding: 16px 24px; background: rgba(255,255,255,0.02); font-size: 0.82rem; }
    .breadcrumb a { color: rgba(255,255,255,0.6); text-decoration: none; }
    .breadcrumb a:hover { color: #c8a45c; }
  </style>
</head>
<body>
  <header class="header scrolled" id="header">
    <div class="header-inner">
      <a href="/" class="logo">
        <span class="logo-icon">K</span>
        <span class="logo-text">KaigaiQ</span>
      </a>
      <nav class="nav" id="nav">
        <a href="/#areas" class="nav-link">エリアから探す</a>
        <a href="/#pickup" class="nav-link">ピックアップ求人</a>
        <a href="/news.html" class="nav-link">ニュース一覧</a>
        <a href="/apply.html" class="nav-link" style="color:#c8a45c;font-weight:600;">掲載申し込み</a>
      </nav>
    </div>
  </header>

  <nav class="breadcrumb" aria-label="パンくずリスト">
    <a href="/">ホーム</a> ＞ <a href="/#areas">${conf.region}</a> ＞ ${cityName}
  </nav>

  <section class="area-hero">
    <span class="area-hero-flag" aria-hidden="true">${conf.flag}</span>
    <h1>${cityName}のキャバクラ・ラウンジ求人</h1>
    <p class="area-hero-sub">${conf.intro}</p>
    <div class="area-stats">
      <div class="area-stat"><div class="area-stat-num">${shops.length}</div><div class="area-stat-label">掲載店舗</div></div>
      <div class="area-stat"><div class="area-stat-num">${conf.flag}</div><div class="area-stat-label">${conf.en}</div></div>
    </div>
  </section>

  <section class="area-shops-section">
    <h2 style="font-size:1.4rem;color:#c8a45c;">${cityName}の店舗一覧</h2>
    <div class="area-shops-grid">${shopCards}
    </div>
  </section>

  <section class="area-related">
    <h2>関連情報</h2>
    <ul>
      <li>${READ_LINK('/guide-visa.html')}：${cityName}を含む海外渡航・ビザ取得ガイド</li>
      <li>${READ_LINK('/guide-salary.html')}：給与・バックシステム完全解説</li>
      <li>${READ_LINK('/guide-housing.html')}：寮・住居の実態と選び方</li>
      <li>${READ_LINK('/guide-safety.html')}：海外で安全に働くためのガイド</li>
      <li>${READ_LINK('/guide-stories.html')}：先輩キャストの体験談</li>
      <li>${READ_LINK('/news.html')}：海外キャバクラ業界の最新ニュース</li>
    </ul>
  </section>

  <footer style="padding: 32px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); font-size: 0.82rem;">
    <p>© 2026 KaigaiQ - 海外ナイトワーク・リゾキャバ求人ポータル</p>
    <p style="margin-top: 8px;"><a href="/" style="color: #c8a45c;">← トップへ戻る</a></p>
  </footer>
</body>
</html>
`;
}

const AREA_OUT_DIR = path.join(ROOT, 'area');
if (!fs.existsSync(AREA_OUT_DIR)) fs.mkdirSync(AREA_OUT_DIR, { recursive: true });

const cityShops = {};
for (const [id, s] of Object.entries(SHOPS_DATA)) {
  if (!cityShops[s.city]) cityShops[s.city] = [];
  cityShops[s.city].push({ id, ...s });
}

const generatedCities = [];
for (const [cityName, conf] of Object.entries(CITIES)) {
  const shops = cityShops[cityName] || [];
  if (conf.slug === 'bangkok') {
    shops.sort((a, b) => (b.premium ? 1 : 0) - (a.premium ? 1 : 0));
  }
  const html = buildAreaPage(cityName, conf, shops);
  fs.writeFileSync(path.join(AREA_OUT_DIR, `${conf.slug}.html`), html);
  generatedCities.push({ slug: conf.slug, name: cityName, count: shops.length });
  console.log(`✓ ${cityName} → /area/${conf.slug}.html (${shops.length} shops)`);
}

const sitemapPath = path.join(ROOT, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
sitemap = sitemap.replace(/\n\s*<url><loc>https:\/\/kaigaiq\.com\/area\/[^<]+<\/loc>[\s\S]*?<\/url>/g, '');
const areaEntries = generatedCities.map(c =>
  `  <url><loc>https://kaigaiq.com/area/${c.slug}.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
).join('\n');
sitemap = sitemap.replace(/(\s*<!-- Shop Pages \(pre-rendered SSG\) -->)/, `\n  <!-- Area Landing Pages -->\n${areaEntries}\n$1`);
fs.writeFileSync(sitemapPath, sitemap);
console.log(`\n✓ sitemap.xml updated with ${generatedCities.length} area URLs`);
