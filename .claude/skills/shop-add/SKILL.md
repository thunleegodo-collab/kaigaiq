---
name: shop-add
description: kaigaiq.com（海外ナイトワーク求人サイト）に掲載店舗を1件追加する。「店舗を追加して」「新しい店を登録」「この店をKaigaiQに載せて」「掲載店を増やしたい」で起動。shops-data.js への登録 → ビルドスクリプトで shop/ と area/ を再生成 → index.html の手動箇所を更新、までを担当。系列重複チェック・Twemoji・UIガイドの確認を含む。デプロイ（push）はユーザー承認後。
---

# KaigaiQ 店舗追加フロー

作業ディレクトリ: `C:\Users\kango\KaigaiQ`（GitHub Pages / legacy build 配信、リポジトリ `thunleegodo-collab/kaigaiq`）

サイト全体は静的HTML。店舗ページとエリアページは **`shops-data.js` を単一のソースとしてビルド生成**される。手で `shop/*.html` を編集しない。

## 0. 着手前チェック（省略しない）

### 0-1. 系列重複チェック
追加候補が既存掲載店の姉妹店・同系列でないかを必ず確認する。同一運営の店を重ねて載せない。既知の系列関係:

- **City Group**（北海道発、海外初店舗2023年シンガポール）: 既存の `PremiereHK` / `PremiereVN` / `Premier`(SG) / `CPB`(BKK) が該当。`Premia` という別名表記も出回る（nightlifeblog独自表記）
- **C.C.Club（HK）と SideWay（SG）**: 30年運営の同じ日本企業の姉妹店。片方の掲載で十分
- **KASHO Lounge（SG）**: マレーシア Throne ラウンジの姉妹店。日本人キャストが1割しかいない
- **S.R.C Singapore Resort Club**: ベトナム・カンボジア・日本・マレーシアにも展開のチェーン

判定に迷ったら追加せずユーザーに確認する。

### 0-2. 既存IDとの衝突確認
`shop-slug-map.json`（現在38エントリ）と `shops-data.js` のキーを見て、ID・slugが既存とぶつからないか確認する。

### 0-3. 写真の受け取り
写真はユーザーから zip で提供され、`shop-images/{slug}/` に置く前例がある（`shop-images/okinawa`, `shop-images/barrail`, `shop-images/Macallan Bar`）。未提供なら Unsplash のURL直参照でも可（既存店の `heroImage`/`gallery` は Unsplash URL が主）。

## 1. `shops-data.js` にエントリ追加

`window.SHOPS_DATA` に `"ID": { ... }` を追加。既存エントリ（先頭の `PremiereHK` が最も完全）を雛形にする。フィールド:

`name` / `type` / `flag` / `region` / `city` / `heroImage` / `gallery` / `concept` / `conceptMeta` / `salary`(daily, monthly, backs) / `benefits` / `housing` / `visa` / `hours` / `address` / `contact`(line, phone, email, website) / `priceSystem` / `notes`
（自社オーナーシップ店・PREMIUMプラン店は `premium: true`。並び順ソートに使われる）

重要な制約:
- **`city` はビルド側のテーブルに存在する値を使う**。`tools/build-area-pages.js` の `CITIES` と `tools/build-shop-pages.js` の `countryMap` に載っていない都市名を書くと、エリアページに出ず JSON-LD の国コードも欠落する。新都市なら両方のテーブルに追記が必要
- `type` は `build-shop-pages.js` の `typeMap`（キャバクラ/ラウンジ/ガールズバー/スナック/Bar/コンカフェ/高級会員制ラウンジ/KTV）に合わせる。外れると schema.org 型が `LocalBusiness` にフォールバックする
- `conceptMeta` は meta description に先頭140字が使われる

## 2. 給与の構造化テーブルに追記（Google for Jobs）

`tools/build-shop-pages.js` の `SALARY_STRUCT` に `ID: { currency, min, max?, unit }` を追加する。**新店舗追加時の手動作業**で、書き忘れると JobPosting の `baseSalary` が出ない。給与が「問い合わせ」など曖昧な店は意図的に省略する運用（既存の除外例: Okinawa / epicSG / CPB / Bell / alco / Salon）。

## 3. slug が特殊な場合は3箇所を同期

slug は既定で `ID.toLowerCase()` から生成される。既公開URL維持などで上書きが必要な場合、`SLUG_OVERRIDES` / `SHOP_SLUG_OVERRIDES` を**3ファイルすべて**に同じ内容で入れる:
- `tools/build-shop-pages.js`（`SLUG_OVERRIDES`）
- `script.js`（6行目 `SHOP_SLUG_OVERRIDES`）
- `shop.js`（6行目 `SHOP_SLUG_OVERRIDES`）

現在の唯一の実例: `{ epicSG: 'epic-sg' }`。

## 4. ビルド実行

```
node tools/build-shop-pages.js
node tools/build-area-pages.js
```

- `build-shop-pages.js`: `shop.html` をテンプレに全店舗分の `shop/{slug}.html` を再生成し、`sitemap.xml` の店舗URLと `shop-slug-map.json` を書き直す
- `build-area-pages.js`: `area/{citySlug}.html` を全再生成し、`sitemap.xml` のエリアURLを差し替える。掲載数もデータから自動計算される
- どちらも冪等。既存ページが差分ゼロになるのが正常
- `sitemap.xml` は書き換えで改行コードが混ざりやすい。コミット前にLFへ正規化する

## 5. 手動更新が必要な箇所（自動化されていない）

`index.html` はビルド対象外。次を手で直す:

- **エリアカードの店舗数**: `area-card-count` の「N店舗」（例: `<p class="area-card-count">12店舗</p>`）
- **ヒーローの掲載店舗数**: `stat-num` の `data-target`（現在35）
- **新規掲載店セクション**（`id="new-shops"`）に新店を追加
- **ピックアップ求人**（`id="pickup"`）に載せる場合は下記UIガイド遵守

※ トップの「全店舗グリッド」（`allShopsGrid`）は `window.SHOPS_DATA` からJSで描画されるため手動更新不要。

### ピックアップ求人カードのUIガイド（厳守）
- ティアバッジ（PREMIUM / STANDARD）は `job-card-header` 内の左側 `job-badge` に置く（`<span class="job-badge premium">PREMIUM</span>`）
- **`tier-badge`（画像領域に被さるバッジ）は使わない**。CSSには残っているが使用禁止
- HOT / NEW などのステータスバッジ（`job-badge hot` 等）と並べるのは可
- 理由: 「Premiumバッジが国の上に出ているので削除して、Standardも左側に統一して」というオーナー指示（2026-05-27）

## 6. Twemoji（Windowsの国旗英字問題）

Windows の Segoe UI Emoji は国旗絵文字を「VN」「HK」「SG」等の英字2文字で表示する。対策として `/twemoji-init.js`（CDN動的ロード＋重複防止）を各HTMLの `</body>` 前に入れる:

```
<script src="/twemoji-init.js" defer></script>
```

現状（要確認事項含む）:
- `index.html` / 各ガイド / `about.html` / `apply.html` / `404.html` / `shop.html`テンプレ / `tools/build-news-pages.js` のテンプレ → **導入済み**（shopページは再生成しても維持される）
- `area/*.html` と `tools/build-area-pages.js` のテンプレ → **未導入**（実測でヒット0）。エリアページで国旗が英字表示になる。手で `area/*.html` を直しても次のビルドで消えるため、直すならテンプレ側
- 新規に手書きHTMLを足す場合は必ずこのタグを入れる

## 7. 確認とデプロイ

- ローカルで生成された `shop/{slug}.html` を開き、title / description / canonical / OGP / JSON-LD 3種（LocalBusiness, BreadcrumbList, JobPosting）と `window.SHOP_ID` が正しいか確認
- `git diff` で意図しない全ページ差分（改行コード等）が出ていないか確認
- **push（＝デプロイ）はユーザーの承認を得てから**。`main` への push で GitHub Pages が配信される
- GitHub Pages では `_redirects` / `_headers` は無効（Cloudflare/Netlify形式）。旧URLのリダイレクトは meta refresh のHTMLスタブで対応する（例: `shop/ozl.html`）
- カスタムActions（`.github/workflows/pages.yml`）と legacy ビルドが同時に走り、pages.yml 側が「Deployment failed」で落ちることがある。legacy 側が success なら配信は正常（実URLの200で判定）
- Google認証HTML（`google823549b64d1f975d.html` / `google174f800e13268e41.html`）と IndexNow キーファイル（`8e84a4f60d3248aa62a6c1e51f71af20.txt`）は**削除・改変禁止**

## 8. 公開後（任意）

- IndexNow に新URLをPOST（キーは上記 `.txt`。手順は `.company/seo-technical/indexnow-key.md`）
- 記録は `.company/` の該当部署（実装なら `seo-technical/implementations/`、窓口メモは `secretary/`）に残す

## やらないこと

- `shop/*.html` `area/*.html` の直接編集（ビルドで上書きされる）
- ユーザー承認なしの push / デプロイ
- 系列重複が疑われる店の見切り発車での追加
