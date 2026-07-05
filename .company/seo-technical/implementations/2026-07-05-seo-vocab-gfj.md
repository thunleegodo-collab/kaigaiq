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
