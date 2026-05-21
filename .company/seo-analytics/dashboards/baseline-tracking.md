---
date: "2026-05-21"
type: dashboard-spec
status: spec-draft
---

# SEOベースライントラッキング ダッシュボード仕様

## 目的
2026-05-21 の SEO 実装（meta注入・JSON-LD拡充）の効果を継続測定する。

## 測定ツール
- **Google Search Console**（プロパティ: kaigaiq.com）
  - 必要: hironori.kondo@craft-investment.com で所有権確認
- **Google Analytics 4**（測定ID: G-L3F0B833S2）
  - 注意: shop.html / apply.html の GA は `G-HP8686808M` が設定されている。要統一確認

## 計測項目

### 週次 KPI
| 指標 | ソース | 目標 | 現状 |
|------|--------|------|------|
| インデックス済みページ数 | GSC: ページ > インデックス | 40+ | 未測定 |
| Total Clicks (7d) | GSC: パフォーマンス | +50% (vs baseline) | 未測定 |
| Total Impressions (7d) | GSC: パフォーマンス | +100% (vs baseline) | 未測定 |
| Avg CTR (7d) | GSC: パフォーマンス | >2.0% | 未測定 |
| Avg Position (7d) | GSC: パフォーマンス | <25 | 未測定 |
| Mobile / Desktop split | GA4 | Mobile >70% | 未測定 |
| Bounce Rate (TOP) | GA4 | <60% | 未測定 |
| 平均滞在時間 (個別店舗) | GA4 | >90s | 未測定 |

### ページ別パフォーマンス
- TOP (`/`)
- 個別店舗（35店）— 特に PREMIUM の `BUNNY` (Club LINE23 Bangkok) と新規 `Rashell`
- news.html
- guide-*.html（7ページ）
- apply.html
- about.html

### 主要クエリ追跡
| 想定クエリ | 期待ランディング |
|-----------|-----------------|
| 海外キャバクラ 求人 | / |
| 香港 キャバクラ 求人 | /shop.html?id=Rashell or /#areas |
| バンコク キャバクラ 求人 | /shop.html?id=BUNNY |
| シンガポール ラウンジ 求人 | /shop.html?id=piaget |
| 海外ナイトワーク 未経験 | / or /guide-stories.html |
| 海外で働く ビザ | /guide-visa.html |
| リゾキャバ 給与 | /guide-salary.html |

### Schema 検証
- リッチリザルトテスト: https://search.google.com/test/rich-results
- 個別店舗で LocalBusiness / BreadcrumbList / JobPosting が正常に検出されるか
- TOPで FAQPage が検出されるか

### Core Web Vitals
- PageSpeed Insights: https://pagespeed.web.dev/
- 目標: LCP < 2.5s, CLS < 0.1, INP < 200ms

## 初回レポート予定
- **2026-05-28**: デプロイ後7日のスナップショット
- **2026-06-21**: 1ヶ月後の比較レポート
