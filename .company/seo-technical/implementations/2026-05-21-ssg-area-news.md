---
date: "2026-05-21"
type: implementation
status: completed
target: shop/*.html, area/*.html, news/*.html, sitemap.xml
---

# 実装記録: SSG（A）+ 都市別ランディング（B）+ ニュース記事URL分離（C）

## 背景
2026-05-21 監査で「個別店舗が JS-injected meta のため Googlebot がレンダリングしないと検索流入を取れない」と判明。
その他にも「都市別の検索クエリ受け皿がない」「ニュース記事が1ページに統合されて長尾流入を取れない」問題があった。

## 実装

### A. 35店舗のプリレンダリングSSG
- `tools/build-shop-pages.js` を作成
- shops-data.js から SHOPS_DATA を vm で読み込み
- shop.html をテンプレートとして各店舗の HTML を生成
- 出力: `/shop/{slug}.html` × 35（小文字スラグ）
- 各ページに固有の title/desc/canonical/OG/Twitter + LocalBusiness/BreadcrumbList/JobPosting JSON-LD を埋め込み
- `window.SHOP_ID` を埋め込み、shop.js が読み込んで動的レンダリング継続
- shop.js を `window.SHOP_ID` フォールバック対応に改修（旧 `?id=X` も継続動作）
- 内部リンク（index.html）を `/shop.html?id=X` → `/shop/{slug}.html` に置換
- sitemap.xml 全面再構築

### B. 12都市の Area Landing Page
- `tools/build-area-pages.js` を作成
- 各都市の slug, 旗, 英名, region, intro テキスト, keywords を定義
- shops-data.js から都市別にグルーピング
- 出力: `/area/{slug}.html` × 12
  - hongkong / bangkok / singapore / hochiminh / phnompenh / hanoi / taipei / shanghai / korea / losangeles / dusseldorf / dubai
- 各ページ構成: ヒーロー＋都市紹介＋店舗カードグリッド＋関連ガイドリンク
- JSON-LD: BreadcrumbList + ItemList
- index.html のエリアカード12個を `<a href="/area/{slug}.html">` 化（クリックで都市ページへ遷移）
- バンコクは PREMIUM 店舗（Club LINE23 Bangkok）を最上位ソート

### C. 20本のニュース記事URL分離
- `tools/build-news-pages.js` を作成
- news.html から `<article>` の data-* 属性を正規表現で抽出
- 各記事に英語 slug を割り当て（slugMap 定義）
- 出力: `/news/{YYYY-MM-DD}-{slug}.html` × 20
- 各記事ページに NewsArticle + BreadcrumbList JSON-LD
- 共通スタイル：シンプルな記事レイアウト（ヒーロー+本文+戻るリンク）
- news.js を改修：news-clickable クリック時に articleIndex.json を fetch → 該当記事の個別 URL に遷移（fallback: 旧モーダル）
- `news-article-index.json` を生成（タイトル→URLマッピング）

## 生成物サマリ

| 種別 | ファイル数 | 出力先 |
|------|----------|--------|
| 店舗SSG | 35 | /shop/{slug}.html |
| 都市LP | 12 | /area/{slug}.html |
| ニュース記事 | 20 | /news/{date}-{slug}.html |
| ビルドスクリプト | 3 | tools/build-*.js |
| 補助JSON | 2 | shop-slug-map.json, news-article-index.json |

**sitemap.xml**: 10 (固定) + 35 (店舗) + 12 (エリア) + 20 (ニュース) = **77 URL** 登録

## 期待効果

### 短期（1ヶ月以内）
- 個別店舗ページの完全インデックス（Googlebot がレンダリング待ちなくメタを取得）
- 都市別検索クエリでのランクイン基盤完成
  - 「香港 キャバクラ 求人」「バンコク キャバクラ 求人」等のビッグキーワード
- ニュース記事のロングテール流入開始

### 中期（3ヶ月）
- 個別店舗ページが店舗名検索で1位獲得（Rashell, Club LINE23 Bangkok等）
- 都市別LPがエリア+業態クエリで上位表示
- Google for Jobs 掲載（JobPosting Schema 経由）

### 長期（6ヶ月）
- インデックス済みページ数 77+ → ドメイン全体の権威性向上
- 関連クエリでのリッチリザルト表示常態化

## 運用ルール
- 店舗データ追加時: `node tools/build-shop-pages.js` と `node tools/build-area-pages.js` を実行
- ニュース追加時: news.html に追記後 `node tools/build-news-pages.js` を実行
- 全ビルド時の手順は `tools/README.md` に記載（要作成）

## 次のアクション
- [ ] Google Search Console プロパティ確認、サイトマップ送信
- [ ] 各都市LP に競合サイトの内部リンク戦略を検討
- [ ] news.html を index ページとして再構築（個別記事へのリンク中心に）
- [ ] 35店舗の concept 文を都市LPの紹介文も含めて SEO 視点で見直し
