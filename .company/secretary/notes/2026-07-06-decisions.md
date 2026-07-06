# 意思決定ログ 2026-07-06

## 戦略転換：SEO grind停止 → 計測付きIG→LINE→応募 導線へ再配分
オーナー承認（「その提案で動きましょう」）に基づき実行。

### 決定
- 「検出-インデックス未登録」73件の根本原因はサイト権威性不足＝手動インデックス登録は対症療法との判断。
  低権威の新規サイトが8年選手の競合とニッチSEOで正面から戦うのは不利。
- 全ページ手動リクエストの grind を **停止**。手動対象は自店BUNNY＋収益/信頼の要（apply/about）＋高価値
  ピックアップ店に限定。残りは自然クロールに委任。
- 主レバレッジをオーナーの構造的強みであるInstagram（insta-company）起点の **計測できる導線** へ再配分。

### 実行
1. GSC手動登録：BUNNY（自店・最重要）を本日分として登録完了。apply以降は本日のGSCクォータ上限に到達
   （＝grind停止の自然な区切り）。
2. 日次インデックスcron（8aa6933b）を削除。
3. `gsc-indexing-queue.md` を縮小し、残り店舗/newsを「自然クロール委任」保留として明記（無言truncationせず一覧残置）。
4. CTA計測 `analytics-events.js` を新設し全88ページ＋3ビルドテンプレートに同梱。LINE相談/掲載申込/電話/メール
   クリックをGA4イベント化（従来ゼロ→計測開始）。
5. 導線設計書 `.company/seo-analytics/funnel-ig-line-apply.md` を作成（UTMスキーム・KPI・週次レビュー・
   insta-companyハンドオフ・GA4オーナー操作待ち）。

### オーナー操作待ち（GA4管理・clublinebangkok@gmail.com）
- `generate_lead` と `line_consult` を GA4「キーイベント」に登録すれば計測が有効化。

### 学び
- GSC手動リクエストは1プロパティ約10-12件/日のクォータあり。本日はエリア/ガイド16件＋BUNNYで上限到達。
- CTA計測は全ページ個別編集ではなく `twemoji-init.js` 同様の共通委任リスナー1本が保守的。アンカーは
  全ページ共通の `</body>`（area pagesはtwemojiタグを持たないため）。
- Google認証HTML（google*.html）は `</body>` を持つものがあり、機械挿入で誤ってタグが入る→認証ファイルは
  pristineに保つ（google174を復元）。
