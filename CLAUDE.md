# KaigaiQ

## 概要
海外就労・求人情報サービス。サンリー合同会社運営。
サイト：kaigaiq.com
LINE公式：@637hamys

## 技術構成
- GitHub Pages（legacy build）で配信。`_headers`/`_redirects` はCloudflare形式のため本番では無効
- 静的HTML
- GA4：G-HP8686808M（全ページ統一。clublinebangkok@gmail.com のGoogleアカウント管理。旧記載のG-L3F0B833S2は不使用）
- GSC：https://kaigaiq.com/ プロパティ。clublinebangkok@gmail.com（3月〜）＋ hironori.kondo側アカウント（2026-07-05所有権追加、確認ファイル google823549b64d1f975d.html は削除禁止）
- IndexNow APIキー設定済み（キーファイルの所在は要確認）

## デザイン
- ブランドカラー：ブラック×ゴールド
- LINEリッチメニュー設定済み（3パネル：求人を見る／無料相談／掲載申し込み）

## 過去の主な対応履歴
- Service Worker キャッシュ問題をHTTPS有効化で解決
- LINEリッチメニュー用SVG→PNG変換（Node.js/sharp使用）
- PageSpeed 100達成済み（Google Fonts削除・システムフォント置換）

## 注意事項
- bangkoknightguide.com（GitHub Pages）と連携あり
- GA4はclub-line-bangkokと別IDで管理
