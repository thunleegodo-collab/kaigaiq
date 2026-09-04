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

## 7. 公開実績（2026-09-04）

- コミット d81e0d7（105ファイル・+2,147/-197）→ git push origin main
- GitHub Pages デプロイ完了を確認
- 本番反映確認:
  - 新記事 `/news/2026-09-03-year-end-dekasegi-guide.html` HTTP 200・LINEリンク1件
  - `/area/korea.html` HTTP 200・LINEリンク1件（従来0件）
  - `/shop/bunny.html` HTTP 200・LINEリンク3件、`/guide-dekasegi.html` HTTP 200・LINEリンク3件
  - sitemap.xml 87URL（area 12 / shop 38 / news 26 / その他11）、新記事を収録
  - 8/7記事に「28年ぶり」「8月3日には一時155円台」および `dateModified":"2026-09-04"` が反映
- IndexNow: sitemap収録の87URLを `api.indexnow.org` へ送信、HTTP 200（受理）

## 8. 次回に持ち越すオーナー判断

1. **git履歴に残る本名・個人メールの扱い**（履歴書き換え / リポジトリ非公開化 / 現状維持）
2. **戦略再判断**: IG導線を起動するか、SEOに寄せ直すか（9/3スナップショット §3-(1)）
3. 韓国コンテンツ拡充（最も転換するページに需要を流す）
4. GA4 ↔ Search Console のプロパティリンク（オーナー操作・1分）
5. GSCインデックス登録の次回パス（7/6から停止中）

## 9. git履歴からの本名・個人メール除去（オーナー指示で実施）

### 調査結果
- コミットの author / committer メールは全103コミットとも `thunleegodo@gmail.com` で、
  **本名メールはコミットメタデータには含まれていなかった**（ファイル内容のみ）
- 該当文字列の出現: `hironori.kondo@craft-investment.com` 109箇所 /
  `hironori.kondo`（側アカウント表記）13箇所 / `kondo側` 13箇所（全履歴の延べ）
- ブランチは main のみ、タグなし、**フォーク0件**（他所へ複製されていない）

### 実施手順
1. 全履歴のバックアップを bundle で取得（scratchpad に保管、`git bundle verify` で完全性確認）
2. `git-filter-repo --replace-text` で全履歴を置換
   - `hironori\.kondo@craft-investment\.com` → `オーナー個人アカウント`
   - `(hironori\.)?kondo側` → `オーナー個人`
3. 書き換え後の HEAD ツリーが旧 HEAD と**完全に一致**することを確認（公開物に変更なし）。
   コミット数も103のまま
4. `git push --force origin main`（2c81b09 → 68c14c3）
5. ローカルの到達不能オブジェクトを reflog expire + gc --prune=now で削除
6. 検証: ローカル全103コミットで該当0件、GitHub上の CLAUDE.md も該当0件

### 副作用
- **全コミットSHAが変化**した（例: 696c525 → d81e0d7）。過去ログのSHA参照は更新済み
- GitHub Pages は再デプロイされ、本番は正常（トップ・新記事とも HTTP 200）

### 残存リスク（オーナー判断）
- GitHubは force push 後も**到達不能になった旧コミットを、40桁のSHAを直接指定すれば一定期間参照できる**
  状態で保持する。フォーク0のため他所への複製はないが、即時に消し込むにはGitHubサポートへ
  「不要オブジェクトのGC」を依頼する必要がある
- 公開されていた期間に第三者のキャッシュ・コード検索インデックスへ取り込まれた可能性は残る
- バックアップbundleには旧履歴（＝本名メール）が含まれる。保管場所は scratchpad 配下で、
  問題なしと判断できた時点で削除してよい

### 再発防止
`.company/CLAUDE.md` のパーソナライズメモに「公開リポジトリのため本名・個人メールは記載しない」と明記済み。
