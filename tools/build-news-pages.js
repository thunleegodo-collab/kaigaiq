const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NEWS_HTML = path.join(ROOT, 'news.html');
const NEWS_OUT_DIR = path.join(ROOT, 'news');

const html = fs.readFileSync(NEWS_HTML, 'utf8');

const articleRe = /<article class="news-(?:featured|article-card)[^"]*"([^>]*?)data-img="([^"]+)"\s+data-date="([^"]+)"\s+data-cat="([^"]+)"\s+data-cat-class="([^"]+)"\s+data-title="([^"]+)"\s+data-full="([^"]+)"/g;

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const slugMap = {
  '2026年 海外キャバクラ業界の最新トレンド：東南アジアを中心に急成長': 'asia-industry-trend',
  '円安継続で日本人キャストへの追い風加速 - 2026年春・海外キャバクラ業界トレンド': 'yen-tailwind-2026',
  '【香港】Rashell新規掲載 - 銅鑼湾の日本人キャスト100%ジャパニーズバー': 'rashell-hk-launch',
  '円安時代の海外ナイトワーク：日本円換算で見る都市別月収比較（2026年4月版）': 'currency-comparison-2026q2',
  '【ドバイ】PJ Dubai がリニューアルオープン、最高級の空間に': 'pj-dubai-renewal',
  '【タイ】2026年のナイトライフ業界規制緩和の動きまとめ': 'thailand-deregulation-2026',
  '【体験談】未経験から香港で月収150万円を達成したAさんの話': 'hk-experience-1500k',
  '【プノンペン】カンボジアの日本式ラウンジ市場が急拡大': 'phnompenh-market-expansion',
  '海外キャバクラで働く前に知っておきたい5つのこと': 'essential-tips-before-overseas',
  '【ホーチミン】epic Vietnam が2026年3月にグランドオープン': 'epic-vietnam-launch',
  '【シンガポール】外国人エンターテイナーのビザ制度が変更': 'singapore-visa-update',
  '【体験談】韓国・江陵のラウンジで働くBさんの1日に密着': 'korea-gangneung-day',
  '【バンコク】THE EMPEROR CLUBが業界最高水準の給与体系を発表': 'bangkok-emperor-club-salary',
  '海外ナイトワーク：国別の給与比較ランキング2026年版': 'salary-ranking-2026',
  '【バンコク】Lounge BARON が人気急上昇中': 'bangkok-baron-popularity',
  '【ドイツ】デュッセルドルフの日本人向けナイトライフ市場の現状': 'dusseldorf-market',
  '初めての海外ナイトワーク：持ち物チェックリスト完全版': 'packing-checklist',
  '【体験談】シンガポールのピアジェで働くCさんが語る海外生活の魅力': 'sg-piaget-experience',
  '【ベトナム】外国人労働者向け就労ビザの最新情報2026': 'vietnam-visa-2026',
  '海外キャバクラ市場2025年の振り返りと2026年の展望': '2025-recap-2026-outlook',
  '円安162円時代の海外ナイトワーク：2026年上半期の振り返りと夏の展望': 'yen-162-h1-recap-2026',
  '海外ナイトワークと税金の基礎知識：住民票・非居住者・確定申告はどうなる？': 'overseas-nightwork-tax-basics',
  '雨季の東南アジア渡航ガイド：バンコク・ホーチミンの気候対策と体調管理': 'rainy-season-guide-sea',
};

const articles = [];
let m;
while ((m = articleRe.exec(html)) !== null) {
  const attrs = m[1];
  const article = {
    _isFeatured: /news-featured/.test(m[0]),
    category: (attrs.match(/data-category="([^"]+)"/) || [, ''])[1],
    img: decode(m[2]),
    date: m[3],
    cat: decode(m[4]),
    catClass: m[5],
    title: decode(m[6]),
    full: decode(m[7])
  };
  article.slug = slugMap[article.title] || article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').slice(0, 40);
  article.dateSlug = article.date.replace(/\./g, '-');
  article.url = `https://kaigaiq.com/news/${article.dateSlug}-${article.slug}.html`;
  article.urlPath = `/news/${article.dateSlug}-${article.slug}.html`;
  articles.push(article);
}

function paragraphize(fullText) {
  return fullText.split('||').map(p => {
    p = p.trim();
    if (!p) return '';
    if (/^【.+】$/.test(p)) return `<h2 class="news-heading">${esc(p)}</h2>`;
    if (/^[・\-]/.test(p) || /^\d+[\.\)、]/.test(p)) {
      return `<p class="news-listitem">${esc(p)}</p>`;
    }
    return `<p>${esc(p)}</p>`;
  }).join('\n      ');
}

function buildArticlePage(article) {
  const dateIso = article.date.replace(/\./g, '-');
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.img],
    datePublished: dateIso,
    dateModified: dateIso,
    author: { '@type': 'Organization', name: 'KaigaiQ編集部', url: 'https://kaigaiq.com/about.html' },
    publisher: {
      '@type': 'Organization',
      name: 'KaigaiQ',
      logo: { '@type': 'ImageObject', url: 'https://kaigaiq.com/icons/icon-512.svg' }
    },
    description: article.full.split('||')[0].trim().slice(0, 160),
    mainEntityOfPage: { '@type': 'WebPage', '@id': article.url },
    articleSection: article.cat
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://kaigaiq.com/' },
      { '@type': 'ListItem', position: 2, name: 'ニュース', item: 'https://kaigaiq.com/news.html' },
      { '@type': 'ListItem', position: 3, name: article.title, item: article.url }
    ]
  };
  const excerpt = esc(article.full.split('||')[0].trim().slice(0, 160));

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
  <title>${esc(article.title)} | KaigaiQ ニュース</title>
  <meta name="description" content="${excerpt}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${article.url}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(article.title)}">
  <meta property="og:description" content="${excerpt}">
  <meta property="og:url" content="${article.url}">
  <meta property="og:image" content="${esc(article.img)}">
  <meta property="og:site_name" content="KaigaiQ">
  <meta property="article:published_time" content="${dateIso}">
  <meta property="article:section" content="${esc(article.cat)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(article.title)}">
  <meta name="twitter:description" content="${excerpt}">
  <meta name="twitter:image" content="${esc(article.img)}">
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#c8a45c">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Inter:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/style.css">
  <style>
    .news-detail-hero { padding: 100px 24px 40px; background: linear-gradient(135deg,#0d0d18 0%,#0a0a0f 50%,#12101a 100%); }
    .news-detail-container { max-width: 800px; margin: 0 auto; }
    .news-detail-meta { display: flex; gap: 12px; margin-bottom: 16px; font-size: 0.85rem; }
    .news-detail-meta .badge { padding: 4px 10px; border-radius: 4px; background: rgba(200,164,92,0.15); color: #e6c97a; }
    .news-detail-meta .date { color: rgba(255,255,255,0.5); }
    .news-detail-title { font-size: clamp(1.4rem, 3vw, 2.2rem); line-height: 1.4; color: #fff; margin-bottom: 24px; }
    .news-detail-img { width: 100%; height: 360px; background-size: cover; background-position: center; border-radius: 12px; margin-bottom: 32px; }
    .news-detail-body { padding: 0 24px 80px; max-width: 800px; margin: 0 auto; }
    .news-detail-body p { color: rgba(255,255,255,0.85); line-height: 1.9; margin-bottom: 16px; font-size: 0.96rem; }
    .news-detail-body .news-listitem { padding-left: 1.2em; color: rgba(255,255,255,0.8); }
    .news-heading { font-size: 1.3rem; color: #c8a45c; margin: 32px 0 16px; padding-left: 12px; border-left: 3px solid #c8a45c; }
    .breadcrumb { padding: 16px 24px; font-size: 0.82rem; background: rgba(255,255,255,0.02); }
    .breadcrumb a { color: rgba(255,255,255,0.6); text-decoration: none; }
    .breadcrumb a:hover { color: #c8a45c; }
    .news-detail-back { display: inline-block; margin-top: 32px; padding: 12px 24px; background: rgba(200,164,92,0.12); border: 1px solid rgba(200,164,92,0.3); border-radius: 8px; color: #e6c97a; text-decoration: none; font-size: 0.9rem; transition: all 0.25s; }
    .news-detail-back:hover { background: rgba(200,164,92,0.2); }
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
        <a href="/news.html" class="nav-link">ニュース一覧</a>
        <a href="/apply.html" class="nav-link" style="color:#c8a45c;font-weight:600;">掲載申し込み</a>
      </nav>
    </div>
  </header>

  <nav class="breadcrumb" aria-label="パンくずリスト">
    <a href="/">ホーム</a> ＞ <a href="/news.html">ニュース</a> ＞ ${esc(article.title)}
  </nav>

  <section class="news-detail-hero">
    <div class="news-detail-container">
      <div class="news-detail-meta">
        <span class="badge ${esc(article.catClass)}">${esc(article.cat)}</span>
        <span class="date">${esc(article.date)}</span>
      </div>
      <h1 class="news-detail-title">${esc(article.title)}</h1>
      <div class="news-detail-img" role="img" aria-label="${esc(article.title)} の記事画像" style="background-image:url('${esc(article.img)}')"></div>
    </div>
  </section>

  <article class="news-detail-body">
      ${paragraphize(article.full)}
      <a href="/news.html" class="news-detail-back">← ニュース一覧へ戻る</a>
  </article>

  <footer style="padding: 32px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); font-size: 0.82rem;">
    <p>© 2026 KaigaiQ - 海外ナイトワーク・リゾキャバ求人ポータル</p>
    <p style="margin-top: 8px;"><a href="/" style="color: #c8a45c;">トップへ戻る</a></p>
  </footer>
<script src="/twemoji-init.js" defer></script>
<script src="/analytics-events.js" defer></script>
</body>
</html>
`;
}

if (!fs.existsSync(NEWS_OUT_DIR)) fs.mkdirSync(NEWS_OUT_DIR, { recursive: true });

const generated = [];
for (const article of articles) {
  const filename = `${article.dateSlug}-${article.slug}.html`;
  fs.writeFileSync(path.join(NEWS_OUT_DIR, filename), buildArticlePage(article));
  generated.push({ filename, date: article.date, title: article.title });
  console.log(`✓ ${article.date} ${article.title.slice(0, 40)} → /news/${filename}`);
}

const sitemapPath = path.join(ROOT, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
sitemap = sitemap.replace(/\n\s*<url><loc>https:\/\/kaigaiq\.com\/news\/[^<]+<\/loc>[\s\S]*?<\/url>/g, '');
const newsEntries = generated.map(g =>
  `  <url><loc>https://kaigaiq.com/news/${g.filename}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
).join('\n');
sitemap = sitemap.replace(/(\s*<!-- Area Landing Pages -->)/, `\n  <!-- News Articles -->\n${newsEntries}\n$1`);
fs.writeFileSync(sitemapPath, sitemap);
console.log(`\n✓ sitemap.xml updated with ${generated.length} news article URLs`);

const indexPath = path.join(ROOT, 'news-article-index.json');
fs.writeFileSync(indexPath, JSON.stringify(articles.map(a => ({
  date: a.date, title: a.title, urlPath: a.urlPath, cat: a.cat, slug: a.slug
})), null, 2));
console.log(`✓ news-article-index.json written`);
