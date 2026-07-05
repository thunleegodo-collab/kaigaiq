---
date: "2026-07-05"
type: implementation
status: deployed
commit: c8c4ec5
based_on: audits/2026-07-05-followup-persona.md
---

# SEO実装記録: ペルソナ語彙注入＋Google for Jobs＋旧URL正規化＋出稼ぎハブ

競合（外キャバどっとコム・旅メイト）の勝ちパターン分析に基づく実装。本番反映確認済（2026-07-05）。

## 実装内容

1. **語彙注入**: title/meta/H1/OG/Article schemaに「出稼ぎ」「夜職」「キャバ嬢」。カバレッジ: 夜職0→19頁、出稼ぎ3→20頁、キャバ嬢0→15頁（ルート+area 26頁中）
2. **guide-dekasegi.html新設**: 空白クエリ「海外 出稼ぎ 夜職」「海外ナイトワーク 未経験」の受け皿。国別比較表（8都市+リンク）、始め方5ステップ、FAQ10問（FAQPage schema）、Article+BreadcrumbList。area12頁・index・footerから内部リンク
3. **JobPosting修正**（build-shop-pages.js）: validThrough=2026-12-31、baseSalary数値+通貨コード（SALARY_STRUCT手動テーブル32/38店。除外6店=Okinawa/epicSG/CPB/Bell/alco/Salonは給与データ曖昧のため）、datePosted=2026-07-05
4. **canonical上書きバグ修正**（shop.js）: 静的頁でrenderShopがcanonical/og:urlを`shop.html?id=`(空ID)で上書きしていた。JSレンダリング後のGooglebotには壊れたcanonicalが見えていた重大バグ
5. **旧URL正規化**: shop.html?id=X→location.replaceで静的頁へ。script.js内部リンク2箇所も静的URL化
6. **epicSG slug分裂解消**: SLUG_OVERRIDES={epicSG:'epic-sg'}で既公開URLに一本化（script.js/shop.jsのSHOP_SLUG_OVERRIDESと同期必須）
7. 全38店の旧テンプレ重複BreadcrumbList削除、description二重句点修正、area生アンカー日本語化、guide-visa 2026年更新、sw.js v21

## 運用メモ
- **validThrough=2026-12-31は期限切れ前に更新が必要**（切れるとGoogle for Jobsから消える）。datePostedと合わせて四半期ごとにビルド再実行を推奨
- 新店舗追加時はSALARY_STRUCTにも給与構造を追記すること
- pages.yml（カスタムActions）はlegacyビルドとの競合で「Deployment failed, try again later」になることがある。legacy側success+実URL 200なら正常

## 未着手（次回候補）
- GSC実測（インデックス状況・クエリ）— GA4プロパティはG-HP8686808Mに全頁統一済み、正プロパティか要オーナー確認
- リッチリザルトテストでJobPosting/FAQPage検証
- 未経験ハブ/独立FAQページ、E-E-A-T強化（監修者表記・体験談の一次性）
- ホスティング前提統一（GitHub Pages配信下で_headers/_redirects無効）

## 追記: GSC実測・検証結果（2026-07-05 実施）

### GSC所有権確認（新規）
- ChromeログインアカウントにはGSCプロパティが未登録だった → HTMLファイル法（google823549b64d1f975d.html をリポジトリに追加）で https://kaigaiq.com/ の所有権確認完了
- プロパティ自体は別アカウントで2026/03/16からsitemap送信済みの既存物（過去データ閲覧可）
- 既存のmeta verification（bxECX...）とGA4（G-HP8686808M）は**別のGoogleアカウント**に紐づく（GA法の所有権確認は「関連付けられていない」で失敗）→ 正アカウントの特定はオーナー要確認

### インデックス実測（最終更新 2026/06/30）
- **登録済み 8 / 未登録 76**。未登録の内訳: 「検出 - インデックス未登録」73（=クロール待ち・最重要）、robots.txtブロック2、代替ページ(canonical)1
- 検索露出ゼロの根本原因はこのインデックス率（8/84）
- 対応: sitemapは7/5に再読込済（成功）。URL検査で guide-dekasegi / area/bangkok / shop/rashell の3本を優先クロールキューに追加済み。以降も主要ページを1日数本ずつリクエスト推奨（クォータあり）

### 検索パフォーマンス（直近3ヶ月）
- クリック140 / 表示2,511 / CTR 5.6% / 平均掲載順位7.4、クエリ40種
- 上位: リゾキャバ 海外 稼げる(6cl/73imp)、プレミア バンコク(4/295)、海外リゾキャバ(3/39)、club premier bangkok(2/88)
- 5/21施策以降、表示回数は明確な上昇トレンド。「夜職」「出稼ぎ」系クエリは実績ゼロ=今回の語彙注入の伸び代

### リッチリザルトテスト（shop/rashell.html）
- **4件有効: パンくず/求人情報/地域のお店/組織 — JobPostingはGoogle for Jobs対象と判定**
- 残警告は任意項目のみ。validThrough/currency警告はGoogle側フェッチが旧キャッシュだったもので、ライブHTMLは修正済み（curl確認）。addressCountryも全38店に付与済み（commit db421a7）
