# 意思決定ログ 2026-09-04

9/3のスナップショットと検品で判明した課題への対応。オーナー指示は「LINE導線の一括整備 → 8/7記事の訂正 → 公開」。

## 1. LINE導線の一括整備（最優先の機会損失）

### 判明した実態
9/3の検品で「新記事にLINE導線がない」と指摘され調査したところ、**サイト全体で
`https://line.me/R/ti/p/@637hamys` を持つページは index.html の1枚だけ**だった。

- 静的ページ（news.html / about / apply / guide×7 / 404）の「LINE相談」ボタンは
  `/#contact` を指しており、**トップページのCTAセクションへ飛ばす1ホップ構造**だった
- `shop.html` とその生成物38件のヘッダー・モバイルナビは `#shop-contact` を指していたが、
  **このidはサイト内のどこにも存在せず、クリックしても何も起きない死んだアンカー**だった
- `area/*.html`（12件）と `news/*.html`（26件）にはLINE導線が一切なかった

GA4の28日データで `/guide-dekasegi.html`（22セッション）やnews記事のランディングが
キーイベント0だった一方、トップページに16件が集中していたのはこの構造が原因と考えられる。
Organic流入86.5%がエリア・ガイド・記事に着地しているのに、主CVの導線がトップにしかなかった。

### 対応
1. 「LINE相談」等とラベルされたCTAをLINE直リンクへ変更（`header-cta` / `mobile-nav-link cta` /
   `guide-cta-btn` / `sidebar-cta-btn` / `sim-cta`）。対象: index / news.html / about / apply /
   404 / guide×7 / shop.html
2. 導線が皆無だったページにCTAセクション（`section-cta`・LINEボタン1つ）を追加。
   shop.html（→shop/*.html 38件）、build-news-pages.js（→26件）、build-area-pages.js（→12件）
3. 結果、LINE直リンクを持つページは **1 → 89件**

### 設計判断
- **mailtoは展開しない**。index.html のCTAには `mailto:thunleegodo@gmail.com` が併記されているが、
  個人色のあるアドレスを89ページへ広げるのは避け、追加CTAはLINEボタン1つに絞った
- `nav-link`「お問い合わせ」とフッターの「LINEまたはメールにてご連絡ください」は `/#contact` のまま残した。
  メール導線も含む案内であり、直リンク化するとメールの選択肢が消えるため
- 委任リスナー方式の `analytics-events.js` が href で判定するため、追加CTAは自動的に
  `line_consult` ＋ `generate_lead` を発火する。個別対応は不要（検品で確認済み）

## 2. 8/7記事の為替記述の精緻化

前回「155 vs 157円の矛盾」として検品が挙げた件を一次ソースで確認したところ、
8/7記事の「157円台」は **7/31の協調介入当日の水準としては正しく**、誤りは
「その後は157円台後半〜158円台半ばでの推移が続いています」と書いて **8/3の155円台の急伸を落としていた**点だった。

あわせて「協調介入としては約15年ぶり」も確認した。これは日経の見出し表現（2011年の円売り協調介入以来）で
誤りではないが、**円買いの日米協調介入としては1998年6月以来およそ28年ぶり**がより正確なため書き換えた。

修正内容（news.html の data-full → 再ビルドで記事へ反映）:
- 7/30に日本の単独介入、7/31に米国も加わる協調介入、と日付と主体を明示
- 「円買いの日米協調介入は1998年6月以来およそ28年ぶり」
- 「8月3日には一時155円台まで円高が進んだのち、157円台後半〜158円台半ばへ戻しています」

**訂正の痕跡を残すため**、build-news-pages.js に `modifiedMap` を新設し、
本記事の JSON-LD `dateModified` を 2026-09-04 に更新した（未登録の記事は従来どおり公開日と同日）。

## 3. 韓国ウォンのレート（検品指摘 → 誤りではないと確定）

検品が2回とも「KRWだけ他通貨と整合しない外れ値」と指摘したため一次確認した。

- 8/7記事: 100KRW≒11.1円（逆算 USD/KRW≒1,423）
- 9/3記事: 100KRW≒11.7円（逆算 USD/KRW≒1,359）

実勢は **USD/KRW が 8/7 1,407.48 → 8/31 1,367.08 → 9/3 1,361.14** とウォンが対ドルで約4.5%上昇しており、
KRWだけ対円で伸びたのは実勢どおり。**両記事とも修正不要**と判断した。
逆算クロスチェックだけでは市場の実際の動きと区別できない例として記録しておく。

## 4. 検品で🔴となり同時に是正した既存不具合

- **`#shop-contact` の死んだアンカー**（shop.html + 生成38件）。サイト全体で未定義アンカーはこれだけだった。
  LINE直リンクへ置換して解消
- **area/*.html 12件のTwemoji未適用**（国旗絵文字がOS絵文字のまま出力されていた）。
  build-area-pages.js に `twemoji-init.js` の読み込みを追加
- **フォントスタックが共通規約と不一致**。`style.css` の base が
  `'Noto Sans JP','Inter',-apple-system,sans-serif` で、`-apple-system` はWindowsで無視されるため
  webfont読込に失敗すると規約が禁じる「sans-serif単独」に落ちる状態だった。
  base と `'Inter', sans-serif` 指定8箇所（style.css 4 / news.css 2 / shop.css 2）に
  Hiragino / Yu Gothic / Meiryo を補った

## 5. 公開リポジトリへの本名露出（🔴・現ツリーは是正、履歴は未対応）

検品が `gh repo view` で確認したところ、`github.com/thunleegodo-collab/kaigaiq` は **PUBLIC**。
`.gitignore` がなく `.company/` 配下もコミット済みで、以下に本名・個人メールが含まれていた。

- `.company/CLAUDE.md`、`.company/seo-analytics/dashboards/baseline-tracking.md`、
  `.company/seo-technical/audits/2026-07-05-followup-persona.md`、
  `.company/seo-technical/implementations/2026-07-05-seo-vocab-gfj.md`、`CLAUDE.md`

共通規約「URL・公開識別子に本名を使わない」および QA_CHECKLIST「経営者個人の本名の露出がないか」に抵触。
**現ツリーからは5ファイルすべてを中立表記へ置換した**（「オーナー個人アカウント」等）。

ただし **git履歴には残っている**。完全な除去には履歴の書き換え（filter-repo等）またはリポジトリの
非公開化が必要で、いずれも影響が大きいためオーナー判断待ちとする。
なお `clublinebangkok@gmail.com` は本名を含まない運用アカウントのため、規約上の是正対象外とし残置した。

## 6. 未対応（記録のみ）

- `shop/ozl.html` — 旧店舗の改名リダイレクトスタブ。本番で200を返すが sitemap / shop-slug-map から
  意図的に除外されている。今回の対象外
- meta description の語途中切断（全26記事共通・生成スクリプト由来）。8/7に「別タスク化」と判断した状態を継続
- 追加した89件のLINEリンクに `target="_blank" rel="noopener"` がない（`shop.js` が生成する
  店舗LINEボタンとは不統一）。挙動上の実害はないため今回は見送り
- `CLAUDE.md` の「PageSpeed 100達成済み（Google Fonts削除）」がGoogle Fonts読込の実装と乖離
