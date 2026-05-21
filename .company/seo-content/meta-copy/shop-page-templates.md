---
date: "2026-05-21"
type: meta-copy-template
target: shop.html (個別店舗)
---

# 店舗個別ページ meta 文言テンプレート

## 設計方針

shop.js が `SHOPS_DATA[id]` を読み込み時に下記テンプレートで動的注入する。
変数: `{name}`, `{city}`, `{type}`, `{flag}`, `{conceptShort}`, `{salaryMonthly}`, `{benefitTop}`

---

## title テンプレート

```
{name}｜{city}{type}求人 - 月収{salaryMonthly} | KaigaiQ
```

**例**:
- `Rashell｜香港ラウンジ求人 - 月収 HK$35,000〜 | KaigaiQ`
- `Club LINE23 Bangkok｜バンコクキャバクラ求人 - 月収10〜30万バーツ | KaigaiQ`

**ガイドライン**:
- 32-40字に収める
- 店舗名 → エリア+業態 → 訴求（給与）→ サイト名 の順
- 月収が「お問い合わせ」の場合は「未経験OK・寮完備」等の特典を表示

---

## description テンプレート

```
{flag} {city}の{type}「{name}」のキャスト求人情報。{conceptShort}。月収{salaryMonthly}、{benefitTop}。給与シミュレーターで収入を事前チェック。
```

**例**:
- `🇭🇰 香港のラウンジ「Rashell」のキャスト求人情報。銅鑼湾の日本人キャスト100%ジャパニーズバー。月収 HK$35,000〜、未経験OK・ノルマなし・寮完備。給与シミュレーターで収入を事前チェック。`
- `🇹🇭 バンコクのキャバクラ「Club LINE23 Bangkok」の求人情報。スクンビットSoi23、10年実績のVIPカラオケラウンジ。月収10〜30万バーツ、寮完備・ビザサポート有。`

**ガイドライン**:
- 120-160字
- 旗絵文字を含めると検索結果で目を引く
- 「未経験OK」「寮完備」「ノルマなし」等の検索される語を含める

---

## og:title テンプレート

```
{name}（{flag} {city}・{type}）| KaigaiQ
```

短く、SNSシェア向け。

---

## og:description テンプレート

description と同じ、または短縮版（80-100字）

---

## og:image

heroImage または gallery[0] をそのまま使用。
1200×630px推奨だが現状の画像でも可。

---

## canonical

```
https://kaigaiq.com/shop.html?id={id}
```

URLエンコード必須（例: `TWENTY FOUR Bangkok` → `TWENTY%20FOUR%20Bangkok`）

---

## conceptShort 生成ルール
SHOPS_DATA[id].concept から最初の50字を抽出 + 「。」

## salaryMonthly 取得ルール
- `salary.monthly` をそのまま使用
- 空または「お問い合わせください」の場合は `salary.daily` を使用
- 両方欠落時は「未経験OK・寮完備」等の特典でフォールバック

## benefitTop 取得ルール
benefits[0..2] を「・」で結合（最大40字）
