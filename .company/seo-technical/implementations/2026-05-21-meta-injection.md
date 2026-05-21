---
date: "2026-05-21"
type: implementation
status: completed
target: shop.html, shop.js, news.html, index.html, apply.html
---

# 実装記録: SEO Meta注入・JSON-LD拡充

## 背景
2026-05-21 ベースライン監査（`audits/2026-05-21-baseline.md`）で発覚した致命的問題への対応。

## 実装内容

### 1. shop.html
- `<title id="pageTitle">` を更新（既定値も求人系キーワード入りに変更）
- `<meta name="description" id="metaDesc">` 追加
- `<link rel="canonical" id="canonicalLink">` 追加
- `<meta name="robots" content="index, follow">` 追加
- OG タグ4種（type, title, desc, url, image, site_name）追加、ID付与で動的更新可能に
- Twitter Card 4種追加、同様にID付与
- 動的注入対象すべてに `id` 属性を付与

### 2. shop.js renderShop()
ファイル冒頭で URL から `id` を取得し、`SHOPS_DATA[id]` から以下を生成・注入:

| 注入先 | 内容 |
|--------|------|
| `#pageTitle` | `{name}｜{city}{type}求人 - 月収{salary} \| KaigaiQ` |
| `#metaDesc` | `{flag} {city}の{type}「{name}」のキャスト求人情報。{conceptShort}。月収{salary}、{benefitsTop}。` |
| `#ogTitle/#twTitle` | `{name}（{flag} {city}・{type}）| KaigaiQ` |
| `#ogDesc/#twDesc` | description と同文 |
| `#ogImage/#twImage` | `shop.heroImage` |
| `#canonicalLink/#ogUrl` | `https://kaigaiq.com/shop.html?id={encoded-id}` |

### 3. shop.js injectShopJsonLd()
新規関数。3種類のJSON-LDをページに動的注入:

#### LocalBusiness / NightClub / BarOrPub
- type マップ: キャバクラ→NightClub, ラウンジ→NightClub, ガールズバー→BarOrPub, スナック→BarOrPub, コンカフェ→CafeOrCoffeeShop
- name, url, image, description, address(PostalAddress), areaServed, telephone, email, sameAs, openingHours

#### BreadcrumbList
- ホーム → 地域(region) → 都市(city) → 店舗名 の4階層

#### JobPosting（Google for Jobs 連携）
- title, description（concept + benefits + housing統合）, identifier, datePosted, employmentType, hiringOrganization, jobLocation
- baseSalary は `salary.monthly` がある場合のみ追加

### 4. news.html
- title拡張: `海外キャバクラニュース - KaigaiQ｜業界動向・新店舗・体験談`
- description 追加（130字、キーワード入り）
- keywords 追加
- robots 追加
- canonical 追加
- og:url / og:image / twitter全種 追加
- BreadcrumbList JSON-LD 追加（インライン）

### 5. index.html
- 既存 WebSite JSON-LD に publisher (Organization) 追加
- FAQPage JSON-LD を新規追加（5問のFAQをmainEntity化）

### 6. apply.html
- description 追加（年間プラン明記）
- robots 追加
- canonical 追加
- twitter全種 追加

## 影響範囲
- 35店舗の個別ページが固有のtitle/description/canonical/OGを持つようになる
- Google for Jobs にRashell, Club LINE23 Bangkok等の求人が掲載される可能性が生まれる
- パンくずリストがリッチリザルトで表示される
- FAQリッチリザルトがTOPで表示される可能性が生まれる

## 注意点
- JS実行に依存する箇所（shop.html の動的meta注入）はGooglebotのレンダリング待ち。インデックス遅延の可能性あり
- Search Console で「URL検査 → インデックス登録をリクエスト」を主要店舗で個別実行推奨
- 完全SSRが必要な場合は次フェーズでビルドスクリプトを検討

## 次のアクション
- [ ] テクニカルSEO: 画像alt属性整備（shop-data.jsベース） | 期限: 2026-05-28
- [ ] テクニカルSEO: news.html個別記事のArticle Schemaを記事カードに埋め込み | 期限: 2026-06-01
- [ ] アナリティクス: Search Console でカバレッジ確認、デプロイ後7日でレポート作成
- [ ] コンテンツSEO: 35店舗の concept を検索キーワード視点で見直し
