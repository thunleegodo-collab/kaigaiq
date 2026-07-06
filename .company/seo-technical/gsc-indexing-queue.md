---
date: "2026-07-05"
updated: "2026-07-06"
type: queue
status: 縮小（grind停止）
purpose: GSC URL検査「インデックス登録をリクエスト」の消化キュー。2026-07-06に戦略転換で"全件grind"を停止。最重要ページのみ手動、残りは自然クロールに委任。
---

# GSCインデックス登録リクエスト・キュー

## 方針転換（2026-07-06）
「検出-インデックス未登録」73件の根本原因はサイトの権威性/信頼度不足であり、手動リクエストは対症療法。低権威の新規サイトが8年選手の競合とニッチで戦うのにSEOを主チャネルにするのは不利——との判断で、**全ページを手動リクエストするgrindを停止**。
- 手動対象は「自店BUNNY＋収益/信頼の要（apply/about）＋高価値ピックアップ店」に限定。
- それ以外の店舗/newsページは **自然クロールに委任**（sitemap/IndexNow送信済＋内部リンクで到達可能。無理に押さない）。
- 日次cron（8aa6933b）は2026-07-06に削除済。
- レバレッジは計測付きIG→LINE→応募 導線へ再配分（`.company/seo-analytics/` 参照）。

## 手動リクエスト済み（最重要）
- [x] https://kaigaiq.com/shop/bunny.html | 済 2026-07-06（自店・最重要）
- [~] https://kaigaiq.com/apply.html | 2026-07-06 本日のクォータ上限エラー→翌日以降に少数パスで再試行
- [ ] https://kaigaiq.com/about.html | 次回パス優先（E-E-A-T信頼の要）
- ピックアップ店（次回パス・最大〜1日クォータ分）: teeup / piaget / barrail / epicvn / epic-sg / vidamia / usagi

登録済み6+旧URL2・リクエスト済み(7/5: guide-dekasegi, area/bangkok, shop/rashell)は除外済み。
以下エリア/ガイド16件は 済 2026-07-06。

- [x] https://kaigaiq.com/area/dubai.html | 済 2026-07-06
- [x] https://kaigaiq.com/area/dusseldorf.html | 済 2026-07-06
- [x] https://kaigaiq.com/area/hanoi.html | 済 2026-07-06
- [x] https://kaigaiq.com/area/hochiminh.html | 済 2026-07-06
- [x] https://kaigaiq.com/area/hongkong.html | 済 2026-07-06
- [x] https://kaigaiq.com/area/korea.html | 済 2026-07-06
- [x] https://kaigaiq.com/area/losangeles.html | 済 2026-07-06
- [x] https://kaigaiq.com/area/phnompenh.html | 済 2026-07-06
- [x] https://kaigaiq.com/area/shanghai.html | 済 2026-07-06
- [x] https://kaigaiq.com/area/singapore.html | 済 2026-07-06
- [x] https://kaigaiq.com/area/taipei.html | 済 2026-07-06
- [x] https://kaigaiq.com/guide-housing.html | 済 2026-07-06
- [x] https://kaigaiq.com/guide-legal.html | 済 2026-07-06
- [x] https://kaigaiq.com/guide-salary.html | 済 2026-07-06
- [x] https://kaigaiq.com/guide-stories.html | 済 2026-07-06
- [x] https://kaigaiq.com/guide-visa.html | 済 2026-07-06
## 保留＝自然クロールに委任（手動リクエストしない・2026-07-06方針転換）
以下は手動キューから外す。sitemap/IndexNow送信済＋内部リンク到達可能のため、Googleのクロール判断に委ねる。
権威性が上がれば順次インデックスされる想定。about・apply・ピックアップ店は上部「手動リクエスト済み/次回パス」で別管理。
（一覧は記録として残置。無言truncationはしない）

- [ ] https://kaigaiq.com/news/2026-06-12-rainy-season-guide-sea.html
- [ ] https://kaigaiq.com/shop/alco.html
- [ ] https://kaigaiq.com/shop/banksy.html
- [ ] https://kaigaiq.com/shop/baron.html
- [ ] https://kaigaiq.com/shop/barrail.html
- [ ] https://kaigaiq.com/shop/bell.html
- [ ] https://kaigaiq.com/shop/clubl.html
- [ ] https://kaigaiq.com/shop/clubys.html
- [ ] https://kaigaiq.com/shop/cpb.html
- [ ] https://kaigaiq.com/shop/dolcenotte.html
- [ ] https://kaigaiq.com/shop/doors.html
- [ ] https://kaigaiq.com/shop/emperorclub.html
- [ ] https://kaigaiq.com/shop/epic-sg.html
- [ ] https://kaigaiq.com/shop/epicvn.html
- [ ] https://kaigaiq.com/shop/gion.html
- [ ] https://kaigaiq.com/shop/jugemu.html
- [ ] https://kaigaiq.com/shop/kyoto.html
- [ ] https://kaigaiq.com/shop/laputa.html
- [ ] https://kaigaiq.com/shop/leone.html
- [ ] https://kaigaiq.com/shop/nozomi.html
- [ ] https://kaigaiq.com/shop/nyx.html
- [ ] https://kaigaiq.com/shop/okinawa.html
- [ ] https://kaigaiq.com/shop/piaget.html
- [ ] https://kaigaiq.com/shop/pjdubai.html
- [ ] https://kaigaiq.com/shop/plusone.html
- [ ] https://kaigaiq.com/shop/premier.html
- [ ] https://kaigaiq.com/shop/premierehk.html
- [ ] https://kaigaiq.com/shop/premierevn.html
- [ ] https://kaigaiq.com/shop/room282.html
- [ ] https://kaigaiq.com/shop/salon.html
- [ ] https://kaigaiq.com/shop/teeup.html
- [ ] https://kaigaiq.com/shop/twenty-four-bangkok.html
- [ ] https://kaigaiq.com/shop/universe.html
- [ ] https://kaigaiq.com/shop/usagi.html
- [ ] https://kaigaiq.com/shop/vidamia.html
- [ ] https://kaigaiq.com/shop/villa.html
- [ ] https://kaigaiq.com/news/2026-01-25-2025-recap-2026-outlook.html
- [ ] https://kaigaiq.com/news/2026-01-28-vietnam-visa-2026.html
- [ ] https://kaigaiq.com/news/2026-01-30-sg-piaget-experience.html
- [ ] https://kaigaiq.com/news/2026-02-02-packing-checklist.html
- [ ] https://kaigaiq.com/news/2026-02-05-dusseldorf-market.html
- [ ] https://kaigaiq.com/news/2026-02-08-bangkok-baron-popularity.html
- [ ] https://kaigaiq.com/news/2026-02-10-salary-ranking-2026.html
- [ ] https://kaigaiq.com/news/2026-02-12-bangkok-emperor-club-salary.html
- [ ] https://kaigaiq.com/news/2026-02-15-korea-gangneung-day.html
- [ ] https://kaigaiq.com/news/2026-02-18-singapore-visa-update.html
- [ ] https://kaigaiq.com/news/2026-02-20-epic-vietnam-launch.html
- [ ] https://kaigaiq.com/news/2026-02-25-phnompenh-market-expansion.html
- [ ] https://kaigaiq.com/news/2026-02-28-hk-experience-1500k.html
- [ ] https://kaigaiq.com/news/2026-03-01-thailand-deregulation-2026.html
- [ ] https://kaigaiq.com/news/2026-03-03-pj-dubai-renewal.html
- [ ] https://kaigaiq.com/news/2026-03-04-asia-industry-trend.html
- [ ] https://kaigaiq.com/news/2026-04-20-currency-comparison-2026q2.html
- [ ] https://kaigaiq.com/news/2026-05-18-yen-tailwind-2026.html
- [ ] https://kaigaiq.com/news/2026-06-24-overseas-nightwork-tax-basics.html
- [ ] https://kaigaiq.com/news/2026-07-04-yen-162-h1-recap-2026.html
