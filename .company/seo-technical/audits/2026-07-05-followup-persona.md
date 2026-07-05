---
date: "2026-07-05"
type: audit
status: completed
target: kaigaiq.com 全体（5/21ベースライン追跡 + ペルソナ語彙 + SERP競合）
persona: 20-30代日本人女性・夜職関係者
---

# KaigaiQ SEO 追跡監査（2026-07-05）

3並列エージェント監査の統合記録。①テクニカル追跡（リポジトリ+本番curl） ②コンテンツ/語彙（全87HTML grep） ③SERP競合（WebSearch・US検索経由につき順位は参考値）。

## 総評

5/21のテクニカル施策はほぼ完了し基盤は良好（shop 38店静的化・meta/canonical/JSON-LD・sitemap 83URL死にURL0・本番と乖離なし）。
残る本質課題は3つ：

1. **語彙ミスマッチ（最重要）**: ペルソナ検索語「夜職」「キャバ嬢」「水商売」「体入」= 0頁、「出稼ぎ」= 3頁。title/H1は全て事業者語彙（ナイトワーク/キャバクラ）のみ
2. **検索露出が確認できない**: 主要6クエリ＋サイト名検索でもkaigaiq上位に出ず（US検索経由・要GSC実測）
3. **Google for Jobs要件不備**: JobPosting 38/38実装済だが validThrough 0/38・baseSalaryが文字列（数値+currency必要）・datePosted全店2026-05-21固定

## 5/21ベースライン課題の解消状況

| Issue | 状態 | 備考 |
|---|---|---|
| #1 shop.html SPA | 解消済 | 38店静的化・meta/JSON-LD 3種完備。残: 全店末尾401行目に旧汎用BreadcrumbList残存（headと矛盾する二重パンくず）、description二重句点 |
| #2 news.html desc空 | 解消済 | 121字・OG/Twitter完備 |
| #3 画像alt | 概ね解消 | bg-image化+role=img/aria-labelで代替 |
| #4 JSON-LD不足 | 部分解消 | FAQPage/BreadcrumbList/NewsArticle/ItemList実装済。JobPostingがGfJ要件未達（上記） |
| #6 canonical | 部分解消 | 静的頁OK。旧 shop.html?id= が本番200生存＋canonicalが旧URL自身→重複経路。**script.js:160/235 が今も旧URL形式の内部リンクを生成** |
| #8 CWV計測 | 未着手 | PageSpeed/GSCベースライン未記録（5/21からの継続宿題） |

## 新規発見（テクニカル）

- **GA測定ID**: 全87頁 G-HP8686808M に統一済（G-L3F0B833S2 は0件）。CLAUDE.md・5/21監査の記載と不一致。どちらのGA4プロパティが正か未確認（GSC/GA4側の照合が必要）
- **ホスティング前提の矛盾**: 本番はGitHub Pages配信（Server: GitHub.com）のため `_headers`/`_redirects` は無効。セキュリティヘッダー未送出。ozl.htmlはmeta refresh+noindexで自己救済済み
- Google Fonts復活（CLAUDE.md記載と不一致）。indexは非同期化済みでrender-blocking回避、shop/*.htmlはCSS同期読み込みで不利
- sw.js v20 本番一致。404はHTTP 404を正しく返す

## 語彙ギャップ定量（87頁中の出現頁数）

- サイト語彙: ナイトワーク85 / キャバクラ68 / 未経験49 / ラウンジ44 / リゾキャバ39 / 短期20 / 日払い17
- ペルソナ語彙: **夜職0 / キャバ嬢0 / 水商売0 / ホステス0 / 体入0 / タトゥー0 / ワーホリ0 / 出稼ぎ3**（news系のみ）

## SERP競合（観察事実・US検索）

- 上位常連: 外キャバどっとコム(gaicaba)・旅メイト・caba-q・kaigai-bbs・店舗直営。gaicabaは都市頁+店舗頁で1クエリ複数枠
- 「リゾキャバ 海外」は記事・ガイド型が勝つ（求人一覧型でない）。年号【2026年最新】+権威付けタイトルが定石
- **空白クエリ**: 「海外ナイトワーク 未経験」＝夜職サイト不在（一般転職サイトのみ）、「海外 出稼ぎ 夜職」＝報道・一般コラムのみ
- kaigaiqは全調査クエリで上位確認できず。GSCでインデックス・クエリ実績の実測が最優先

## 統合アクションリスト（優先度順）

| # | 施策 | 担当 | 工数 | 期待効果 |
|---|---|---|---|---|
| 1 | index/area12/guide6のtitle・meta・H1に「出稼ぎ」「夜職」「キャバ嬢」を注入 | content | 半日 | 空白クエリ群への露出（構造転換） |
| 2 | JobPosting修正: validThrough追加・baseSalary数値+currency化・datePosted更新（build-shop-pages.jsで一括） | technical | 半日 | Google for Jobs掲載 |
| 3 | script.js:160/235 の内部リンクを /shop/{slug}.html へ差し替え＋旧shop.html?id=のcanonicalを静的頁へ | technical | 2時間 | 重複解消・リンクエクイティ集約 |
| 4 | GSCで所有権確認→インデックス状況・クエリ実測（GA4プロパティ G-HP8686808M との整合も確認） | analytics | 半日 | 現状把握（5/21からの宿題） |
| 5 | 「海外出稼ぎ完全ガイド」ハブ頁新設（夜職語彙・国別比較表・6ガイドへのハブ） | content | 1-2日 | 空白クエリ「出稼ぎ×夜職」の受け皿 |
| 6 | area12頁の生ファイル名アンカー（「guide-visa」等）を日本語化 | content | 1時間 | 内部リンク改善 |
| 7 | guide-visa title【2025年最新】→2026更新＋全ガイドtitleに夜職語彙併記 | content | 1時間 | 陳腐化解消 |
| 8 | 全38店末尾の旧BreadcrumbList削除・description二重句点修正（ビルド一括） | technical | 1時間 | 構造化データ矛盾解消 |
| 9 | 未経験ハブ頁 or 独立FAQ頁（年齢30代・タトゥー・体入・親バレ等20問+FAQPage） | content | 1日 | 「未経験」空白クエリ・不安系ロングテール |
| 10 | E-E-A-T強化（運営者プロフィール具体化・体験談に時期/都市タグ・監修者表記） | content | 1日 | YMYL隣接領域の信頼性 |
| 11 | ホスティング前提統一（GitHub Pages前提なら_headers/_redirects整理 or Cloudflareへ寄せる） | technical | 要方針決定 | セキュリティヘッダー送出 |

## 未確認事項（要オーナー判断）
- GA4正プロパティ: G-HP8686808M か G-L3F0B833S2 か（移行 or 誤設置）
- GSCアクセス可否（hironori.kondo@craft-investment.com で所有権確認済みか）
- ホスティングをGitHub Pages前提に統一するか、Cloudflare Pagesへ戻すか
