/* KaigaiQ CTA計測 — GA4イベント自動送信（全ページ共通・委任リスナー方式）
 * IG→LINE→応募 導線を計測するための最小実装。
 * 既存のgtag()（G-HP8686808M）に event を送るだけ。ページビューはGA4が自動計測。
 * CTAのHTMLを個別に書き換えず、href/属性からクリック種別を判定して発火する。
 */
(function () {
  if (window.__kqEvents) return; window.__kqEvents = true;
  if (typeof window.gtag !== 'function') {
    // gtagが未定義でも落ちないようにダミーを用意（本番は各ページ先頭でgtag定義済み）
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  }

  // 現在ページのコンテキスト（どの店/どのページ発のCTAかをGA4で分解できるように）
  function pageContext() {
    var p = location.pathname;
    var ctx = { page_path: p };
    var m = p.match(/\/shop\/([^\/]+)\.html$/);
    if (m) { ctx.shop_slug = m[1]; ctx.page_type = 'shop'; }
    else if (/\/area\//.test(p)) { ctx.page_type = 'area'; }
    else if (/\/news\//.test(p)) { ctx.page_type = 'news'; }
    else if (/apply\.html$/.test(p)) { ctx.page_type = 'apply'; }
    else if (/\/guide-/.test(p)) { ctx.page_type = 'guide'; }
    else if (p === '/' || /index\.html$/.test(p)) { ctx.page_type = 'home'; }
    else { ctx.page_type = 'other'; }
    return ctx;
  }

  // クリック種別の判定（href優先、無ければテキスト）
  function classify(a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    var txt = (a.textContent || '').replace(/\s+/g, '');
    if (/line\.me|lin\.ee|@637hamys/.test(href)) return 'line_consult';   // LINE無料相談
    if (/^tel:/.test(href)) return 'tel_click';                           // 電話
    if (/apply\.html/.test(href)) {
      // 掲載申込（店舗オーナー向け）か キャスト応募かを文言で区別
      if (/掲載|出店|オーナー|店舗様/.test(txt)) return 'apply_shop';
      return 'apply_cast';                                                // キャスト応募（主要CV）
    }
    if (/mailto:/.test(href)) return 'email_click';
    return null;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var kind = classify(a);
    if (!kind) return;
    var ctx = pageContext();
    ctx.link_text = (a.textContent || '').trim().slice(0, 60);
    ctx.link_url = a.getAttribute('href');
    // GA4推奨: generate_lead を主CVに、種別はevent名＋paramの両方で持つ
    window.gtag('event', kind, ctx);
    if (kind === 'line_consult' || kind === 'apply_cast') {
      window.gtag('event', 'generate_lead', Object.assign({ lead_type: kind }, ctx));
    }
  }, true);
})();
