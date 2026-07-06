---
date: "2026-07-06"
type: design
owner: seo-analytics
status: KaigaiQ側=実装済 / IG側=insta-companyへハンドオフ / GA4管理=オーナー操作待ち
---

# 計測付き IG → LINE → 応募 導線 設計書

## なぜこの導線か（背景）
「検出-インデックス未登録」73件の根本原因はサイトの権威性不足で、手動インデックス登録は対症療法。
低権威の新規サイトが8年選手の競合とニッチSEOで正面から戦うのは不利。一方オーナーはInstagram運用
（insta-company）に構造的な強みを持つ。よって主チャネルをSEOから **計測できるIG→LINE→応募導線** に
再配分する。SEOは下部ファネル（指名/商用クエリ）の受け皿として維持し、grindは停止済み。

## 導線の全体像
```
Instagram（リール/ストーリー/プロフィールリンク・UTM付き）
   │  ← insta-company が制作・投稿
   ▼
KaigaiQ 着地ページ（GA4がセッション流入元=instagramを記録）
   │  ← analytics-events.js が以下のクリックをGA4イベント化
   ▼
LINE無料相談クリック（line_consult / generate_lead）  ★主CV（KaigaiQで計測できる最終地点）
   │
   ▼
LINEトーク内で応募（＝オフGA4。ここから先はLINE運用側でタグ付けが必要）
```
KaigaiQ側で計測できるのは「LINE相談クリック（line_consult）」まで。実応募はLINE内で起きるため
GA4では見えない。実応募まで結ぶには **LINE側で流入元タグ付け**（insta-company/LINE運用の宿題）が要る。

## 実装済み（KaigaiQ側・2026-07-06）
### 1. CTA自動計測 `analytics-events.js`（全88ページ＋3ビルドテンプレートに同梱）
`twemoji-init.js` と同じく全ページ共通で読み込む委任リスナー。CTAのHTMLを個別に書き換えず、
href/文言からクリック種別を判定してGA4 `gtag('event', ...)` を発火する。既存GA4（G-HP8686808M）を利用。

| 発火イベント | 対象クリック | 補足 |
|---|---|---|
| `line_consult` | `line.me` / `lin.ee` / `@637hamys` リンク | ＋`generate_lead`(lead_type=line_consult) も同時発火＝主CV |
| `apply_cast` | `apply.html`（文言に掲載/オーナー等が無い） | ＋`generate_lead`。将来キャスト応募をapply化した場合に備え定義 |
| `apply_shop` | `apply.html`（文言に「掲載/出店/オーナー/店舗様」） | 店舗オーナー向け掲載申込 |
| `tel_click` | `tel:` リンク（店舗ページの電話） | shop.jsが動的注入する`<a href=tel:>`も捕捉 |
| `email_click` | `mailto:` リンク | 同上 |

各イベントには `page_type`（home/shop/area/news/guide/apply）と `shop_slug`（店舗ページ発の場合）を
パラメータで付与。→ GA4で「どのページ発のLINE相談か」「どの店舗が相談を生むか」を分解できる。

**設計判断:** LINEの実CVはline.meへの離脱クリック。委任リスナー＋capture方式なので、shop.jsが後から
注入する連絡先anchorも取りこぼさない。ページビューはGA4が自動計測するので二重計測しない。

### 2. UTMスキーム（IG→KaigaiQ流入の識別）
Instagramから貼る全リンクに付与する。GA4のセッション流入元をinstagramに固定し、施策別に分解する。

```
https://kaigaiq.com/<着地ページ>?utm_source=instagram&utm_medium=social&utm_campaign=<テーマ>&utm_content=<配置>
```
- `utm_source=instagram`（固定）
- `utm_medium=social`（固定）
- `utm_campaign=<テーマ>`：例 `bangkok-salary` / `dubai-guide` / `recruit-2026q3` / `bio`
- `utm_content=<配置>`：`bio_link` / `story_YYYYMMDD` / `reel_YYYYMMDD` / `post_YYYYMMDD`

**着地ページの推奨:**
- プロフィールリンク（常設）→ `/guide-dekasegi.html?...&utm_campaign=bio&utm_content=bio_link`
  （出稼ぎ総合ハブ＝迷わせず全国比較→各所へ内部リンク）
- 都市/給与のリール/ストーリー → 該当エリアページ or 該当店舗ページ（例 `/area/bangkok.html?...`）
- 自店BUNNY訴求 → `/shop/bunny.html?...`

## オーナー操作待ち（GA4管理コンソール・clublinebangkok@gmail.com）
KaigaiQのコード側だけでは完結しない。GA4管理画面で以下を1回設定すれば計測が有効化される。
1. **キーイベント（旧コンバージョン）に登録**：`generate_lead` と `line_consult` を「キーイベント」化。
   （管理 → イベント → 該当イベントを「キーイベントとしてマーク」）
2. （任意）**チャネル/流入元の確認**：レポート → 集客 → トラフィック獲得 で `session source = instagram` が
   出るか、UTM付きリンクを自分で1回踏んで検証。
3. （任意）DebugViewでline_consultイベントの発火をリアルタイム確認（GA4 Debug拡張 or `?debug_mode=1`）。

## insta-company へのハンドオフ（IG制作側の宿題）
KaigaiQ側の計測土台は敷いた。IG側は以下を担当（詳細は insta-company の.company体制で運用）。
- **プロフィールリンクをUTM付きに差し替え**（上記bio_link）。
- **投稿ごとにUTMを付ける運用**：リール/ストーリーのリンクに `utm_campaign`/`utm_content` を命名規則通り付与。
  ストーリーのリンクスタンプもUTM付きURLを使う。
- **CTA文言の統一**：「プロフィールのリンクから無料LINE相談」等、LINE相談への誘導を明示（応募のハードルを下げる）。
- **LINE側の流入元タグ付け**（実応募まで結ぶ場合）：LINE公式の流入経路別リッチメニュー/合言葉/リファラルパラメータ等で
  「IG経由の相談」を識別。→ KaigaiQのline_consult数と突合し、相談→応募の歩留まりを把握。
- 動画/コンテンツ制作は recruit動画スタイル規約（黒文字＋白ボックスのクリーン字幕）に準拠。

## KPI と週次レビュー（seo-analytics）
修正後7-14日でベースラインと比較。週1で以下を確認する。

| 指標 | 取得元 | 意味 |
|---|---|---|
| IG流入セッション数 | GA4 集客（source=instagram） | IG→サイト到達の量 |
| line_consult 件数（総数／IG別） | GA4 イベント | 主CVの絶対数と、IG寄与 |
| line_consult率 | line_consult ÷ IG流入セッション | 着地ページ→LINE相談の歩留まり（着地/CTA改善の指標） |
| apply_shop 件数 | GA4 イベント | 店舗掲載申込（収益側の先行指標） |
| campaign別 line_consult | GA4（utm_campaign別） | どのテーマ/都市が相談を生むか＝IG制作の当たり筋 |

**判断ルール:** line_consult率が低ければ着地ページ or CTA文言を改善（テクニカル/コンテンツSEOへ差し戻し）。
campaign別で当たったテーマをinsta-companyの次サイクル制作に反映。数字が動かない施策は素直に棄却。

## 関連
- KaigaiQ側実装: `/analytics-events.js`、`.company/seo-technical/`（CTA計測はテクニカルと共同）
- IG制作側: insta-company（別プロジェクト）
- grind停止の経緯: `.company/seo-technical/gsc-indexing-queue.md` の「方針転換（2026-07-06）」
