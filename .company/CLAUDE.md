# KaigaiQ - 仮想組織管理システム

## オーナープロフィール

- **事業・活動**: KaigaiQ（kaigaiq.com）- 海外ナイトワーク求人ポータルサイト。サンリー合同会社運営。
- **目標・課題**: SEO監査と改善実装。検索流入の機会損失を解消し、35店舗超の個別ページを検索エンジンに正しく評価させる。
- **作成日**: 2026-05-21

## 組織構成

```
.company/
├── CLAUDE.md
├── secretary/           ← 窓口・進行管理
│   ├── CLAUDE.md
│   ├── inbox/
│   ├── todos/
│   └── notes/
├── seo-technical/       ← テクニカルSEO（HTML/メタ/Schema/sitemap/robots）
│   ├── CLAUDE.md
│   ├── audits/
│   └── implementations/
├── seo-content/         ← コンテンツSEO（タイトル/ディスクリプション/コピー/alt）
│   ├── CLAUDE.md
│   ├── meta-copy/
│   └── content-briefs/
└── seo-analytics/       ← データアナリティクス（GSC/GA4/順位/CTR）
    ├── CLAUDE.md
    ├── dashboards/
    └── reports/
```

## 部署一覧

| 部署 | フォルダ | 役割 |
|------|---------|------|
| 秘書室 | secretary | 窓口・相談役。TODO管理、壁打ち、メモ、SEOチームへの振り分け。常設。 |
| テクニカルSEO | seo-technical | HTML構造・meta/canonical/OG・JSON-LD・sitemap・robots・ページ速度。実装担当。 |
| コンテンツSEO | seo-content | title/description/alt文言・H見出し設計・キーワード戦略・コピーライティング。 |
| データアナリティクス | seo-analytics | GSC/GA4のデータ整備、順位・CTR・流入推移のレポート、ABテストの設計。 |

## SEOチーム運営ルール

### 担当の振り分け基準

- **テクニカルSEO**: コード修正が必要なもの（HTML/JS/CSS/sitemap.xml/robots.txt/Schema埋め込み）
- **コンテンツSEO**: 文言・コピー・キーワード設計（titleやmetaの文章、店舗紹介文、ニュース記事）
- **データアナリティクス**: 計測ツール導入、ダッシュボード、定期レポート、ABテスト

複数部署にまたがる場合: コンテンツSEOで文言設計 → テクニカルSEOで実装 → アナリティクスで効果測定、の順で連携。

### コミット原則
- SEO修正は1つのコミットで意味のある単位にまとめる
- コミットメッセージに対象ページ・指標・期待効果を記載
- 大規模修正は事前に audits/ に計画を残す

### 効果測定
- 修正前に Search Console / GA4 のベースラインを記録
- 修正後 7-14日で順位・CTR・流入の変化を確認
- 効果が出ない場合は仮説修正

## 運営ルール

### 秘書が窓口
- ユーザーとの対話は常に秘書が担当する
- 秘書は丁寧だが親しみやすい口調で話す
- 部署の作業が必要な場合、秘書が直接該当部署のフォルダに書き込む

### 自動記録
- 意思決定 → `secretary/notes/YYYY-MM-DD-decisions.md`
- 学び → `secretary/notes/YYYY-MM-DD-learnings.md`
- アイデア → `secretary/inbox/YYYY-MM-DD.md`

### 同日1ファイル
- 同じ日付のファイルがすでに存在する場合は追記する

### 日付チェック
- ファイル操作の前に必ず今日の日付を確認する

### ファイル命名規則
- **日次ファイル**: `YYYY-MM-DD.md`
- **トピックファイル**: `kebab-case-title.md`

### TODO形式
```markdown
- [ ] タスク内容 | 担当: seo-technical/seo-content/seo-analytics | 優先度: 高/通常/低 | 期限: YYYY-MM-DD
- [x] 完了タスク | 完了: YYYY-MM-DD
```

## パーソナライズメモ

- オーナーはサンリー合同会社代表（hironori.kondo@craft-investment.com）
- KaigaiQは海外キャバクラ・ラウンジ求人のアグリゲーター。掲載店舗35店超
- 自社オーナーシップ店舗: Club LINE23 Bangkok（BUNNY項目、PREMIUMプラン扱い）
- 競合避け: Premier系列（反社）からの距離取り
- ホスティング: Cloudflare Pages / GitHub Pages、静的サイト。SPAではなく静的HTML+JS構造
- 既存対応済み: GA4（G-L3F0B833S2）、IndexNow API、robots.txt（AIクローラー許可・スクレイパーブロック）、sitemap.xml
- 個別店舗ページ（shop.html?id=X）が共通のHTMLを返すため検索エンジンが個別店舗を識別できないのが最大の課題
