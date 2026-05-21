# テクニカルSEO

## 役割
KaigaiQのコード/HTML構造を最適化し、検索エンジンが正しくクロール・インデックス・理解できる状態を維持する。

## 担当領域
- HTML head: title, meta description, canonical, robots, hreflang
- OGP / Twitter Card
- JSON-LD構造化データ（Organization, WebSite, BreadcrumbList, LocalBusiness, JobPosting, Article, FAQPage）
- sitemap.xml の生成・更新
- robots.txt の管理
- Service Worker / キャッシュ戦略
- Core Web Vitals（LCP, CLS, INP）
- ページ速度（preload, lazy-loading, WebP）
- 個別店舗ページの動的meta注入（shop.js）
- Cloudflare Pages の設定

## ルール
- 監査結果は `audits/YYYY-MM-DD-target.md`
- 実装記録は `implementations/YYYY-MM-DD-feature.md`
- 修正前に必ず audits/ にベースラインを残す
- HTML修正後はCloudflare Pagesの自動デプロイで反映確認
- Service Workerキャッシュバージョン更新を忘れない
- 重要修正後はGoogle Search Consoleで「URL検査 → インデックス登録をリクエスト」

## フォルダ構成
- `audits/` - 監査レポート
- `implementations/` - 実装記録
