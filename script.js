// ========================================
// KaigaiQ - Interactive Features
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- Mobile hamburger menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Counter animation ---
  const counters = document.querySelectorAll('.stat-num');
  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.dataset.target;
      const duration = 1500;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    });
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) heroObserver.observe(statsEl);

  // --- Area tab filtering ---
  const areaTabs = document.querySelectorAll('.area-tab');
  const areaCards = document.querySelectorAll('.area-card');

  areaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      areaTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const region = tab.dataset.region;
      areaCards.forEach(card => {
        if (region === 'all' || card.dataset.region === region) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Search suggestions ---
  const searchInput = document.getElementById('searchInput');
  const suggestionsEl = document.getElementById('searchSuggestions');

  const cities = [
    'ホーチミン', '香港', 'シンガポール', 'バンコク', 'プノンペン',
    'ハノイ', '台北', '上海', '韓国', 'ロサンゼルス',
    'デュッセルドルフ', 'ドバイ'
  ];

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (!query) {
      suggestionsEl.classList.remove('active');
      return;
    }

    const matches = cities.filter(c => c.includes(query));
    if (matches.length === 0) {
      suggestionsEl.classList.remove('active');
      return;
    }

    suggestionsEl.innerHTML = matches.map(c =>
      `<div class="search-suggestion">${c}</div>`
    ).join('');
    suggestionsEl.classList.add('active');

    suggestionsEl.querySelectorAll('.search-suggestion').forEach(item => {
      item.addEventListener('click', () => {
        searchInput.value = item.textContent;
        suggestionsEl.classList.remove('active');
        scrollToArea(item.textContent);
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hero-search')) {
      suggestionsEl.classList.remove('active');
    }
  });

  document.getElementById('searchBtn').addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) scrollToArea(query);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) scrollToArea(query);
    }
  });

  function scrollToArea(cityName) {
    filterShopsByCity(cityName);
  }

  // --- Area card click -> show city shops or go to shop page ---
  function handleAreaClick(cityName) {
    if (!window.SHOPS_DATA) {
      // Rocket Loader等でSHOPS_DATAがまだ読み込まれていない場合リトライ
      setTimeout(() => handleAreaClick(cityName), 200);
      return;
    }
    const matched = Object.entries(window.SHOPS_DATA).filter(([id, s]) =>
      s.city.includes(cityName) || cityName.includes(s.city)
    );
    if (matched.length === 1) {
      window.location.href = '/shop.html?id=' + encodeURIComponent(matched[0][0]);
      return;
    }
    filterShopsByCity(cityName);
  }

  areaCards.forEach(card => {
    card.addEventListener('click', () => {
      const cityName = card.querySelector('h3').textContent;
      handleAreaClick(cityName);
    });
  });

  function filterShopsByCity(cityName) {
    const grid = document.getElementById('allShopsGrid');
    if (!grid || !window.SHOPS_DATA) return;

    const entries = Object.entries(window.SHOPS_DATA);
    const matched = entries.filter(([id, s]) =>
      s.city.includes(cityName) || cityName.includes(s.city)
    );

    // Update header
    const allShopsHeader = document.getElementById('allShopsHeader');
    if (!allShopsHeader) return;

    const titleEl = allShopsHeader.querySelector('.section-title');
    const subEl = allShopsHeader.querySelector('.section-sub');
    if (titleEl && subEl) {
      if (matched.length > 0) {
        titleEl.textContent = `${cityName} の店舗一覧`;
        subEl.innerHTML = `${matched.length}件の店舗が見つかりました <button id="resetCityFilter" style="margin-left:12px;padding:4px 14px;background:rgba(200,164,92,0.15);border:1px solid rgba(200,164,92,0.3);border-radius:6px;color:#e6c97a;font-size:0.82rem;cursor:pointer;font-family:inherit;">すべて表示</button>`;
        document.getElementById('resetCityFilter').addEventListener('click', () => {
          titleEl.textContent = '全店舗一覧';
          subEl.textContent = `掲載中の全${entries.length}店舗`;
          renderShopGrid(grid, entries);
        });
      } else {
        titleEl.textContent = `${cityName} の店舗一覧`;
        subEl.innerHTML = `該当する店舗がありません <button id="resetCityFilter" style="margin-left:12px;padding:4px 14px;background:rgba(200,164,92,0.15);border:1px solid rgba(200,164,92,0.3);border-radius:6px;color:#e6c97a;font-size:0.82rem;cursor:pointer;font-family:inherit;">すべて表示</button>`;
        document.getElementById('resetCityFilter').addEventListener('click', () => {
          titleEl.textContent = '全店舗一覧';
          subEl.textContent = `掲載中の全${entries.length}店舗`;
          renderShopGrid(grid, entries);
        });
      }
    }

    renderShopGrid(grid, matched.length > 0 ? matched : entries);

    // Scroll to grid
    const offset = 80;
    const top = (allShopsHeader || grid).getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });

    // Highlight the area card
    areaCards.forEach(c => {
      c.style.border = '';
      c.style.boxShadow = '';
    });
    areaCards.forEach(card => {
      const name = card.querySelector('h3').textContent;
      if (name.includes(cityName) || cityName.includes(name)) {
        card.style.border = '1px solid var(--primary)';
        card.style.boxShadow = '0 0 30px rgba(200,164,92,0.2)';
      }
    });
  }

  window.renderShopGrid = function(grid, entries) {
    grid.innerHTML = entries.map(([id, s]) => `
      <a href="/shop.html?id=${encodeURIComponent(id)}" class="all-shop-card fade-in visible">
        <div class="all-shop-img" style="background-image:url('${s.gallery && s.gallery[0] ? s.gallery[0] : s.heroImage}')"></div>
        <div class="all-shop-body">
          <span class="all-shop-flag">${s.flag}</span>
          <div class="all-shop-info">
            <h4>${s.name}</h4>
            <p>${s.city} / ${s.type}</p>
          </div>
        </div>
      </a>
    `).join('');
  };

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- Back to top ---
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Scroll fade-in animation ---
  const fadeEls = document.querySelectorAll(
    '.area-card, .job-card, .news-card, .new-shop-item, .faq-item'
  );
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});

// ===== 給与シミュレーター =====
(function() {
  // 都市別日給レンジ（円換算・中央値）: [下限, 上限] 円/日
  const cityData = {
    singapore: { low: 18000, high: 55000, currency: 'SGD' },
    dubai:     { low: 25000, high: 70000, currency: 'AED' },
    bangkok:   { low: 8000,  high: 28000, currency: 'THB' },
    la:        { low: 22000, high: 60000, currency: 'USD' },
    hongkong:  { low: 18000, high: 45000, currency: 'HKD' },
    hcmc:      { low: 10000, high: 30000, currency: 'USD' },
    phnom:     { low: 9000,  high: 25000, currency: 'USD' },
  };
  // 経験倍率
  const expMult = [0.65, 0.85, 1.0, 1.25];

  function calc() {
    const city = document.getElementById('simCity')?.value;
    const exp  = parseInt(document.getElementById('simExp')?.value || 0);
    const days = parseInt(document.getElementById('simDays')?.value || 30);

    document.getElementById('simDaysLabel').textContent = days + '日';

    if (!city || !cityData[city]) return;
    const d = cityData[city];
    const mult = expMult[exp];
    const lo = Math.round(d.low  * mult * days / 10000) * 10000;
    const hi = Math.round(d.high * mult * days / 10000) * 10000;

    document.getElementById('simAmount').textContent =
      '¥ ' + lo.toLocaleString() + ' 〜 ' + hi.toLocaleString();
    document.getElementById('simRange').textContent =
      days + '日間勤務・' + ['未経験','経験1年未満','経験1〜3年','経験3年以上'][exp] + 'の場合の参考値';
  }

  document.addEventListener('DOMContentLoaded', () => {
    ['simCity','simExp','simDays'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', calc);
      document.getElementById(id)?.addEventListener('input', calc);
    });
    calc();
  });
})();

// ===== 待遇フィルター =====
(function() {
  // 各タグがshops-dataのbenefitsフィールドのどの文字列に対応するかのマッピング
  const benefitMap = {
    '未経験OK':       ['未経験OK', '未経験歓迎', '未経験の方', '未経験者大歓迎', '未経験者歓迎'],
    '短期OK':         ['短期OK', '短期歓迎', '短期可', 'お試し短期', '短期勤務可能', '短期滞在歓迎'],
    '日払い可':       ['日払い可', '日払いOK', '日払い', '日払い制度'],
    '寮完備':         ['寮完備', '寮あり', 'コンドミニアム', '寮支給'],
    '往復航空券支給': ['往復航空券', '航空券支給', '往復航空チケット支給', '航空チケット'],
    'ノルマなし':     ['ノルマなし', 'ノルマ一切なし', 'ノルマ無し', 'ノルマは一切なし', 'ノルマ・罰金なし'],
    '英語不要':       ['英語不要', '外国語不要', '英語が話せなくて', '外国語話せなくても大丈夫', '外国語不要'],
    '日本人スタッフ常駐': ['日本人スタッフ常駐', '日本人スタッフ', '日本人ママ常駐'],
    'ビザサポート':   ['ビザサポート', 'ビザ申請代行', 'VISA', 'visa', '就労ビザ', 'ビザサポートあり'],
    'プール付き寮':   ['プール', 'インフィニティプール', 'プール完備'],
    '送迎あり':       ['送迎あり', '無料送迎', '送迎'],
  };

  let currentFilter = 'all';

  function getShopBenefitsText(shopId) {
    if (!window.SHOPS_DATA || !window.SHOPS_DATA[shopId]) return '';
    const shop = window.SHOPS_DATA[shopId];
    const parts = [];
    if (Array.isArray(shop.benefits)) parts.push(shop.benefits.join(' '));
    if (Array.isArray(shop.housing)) parts.push(shop.housing.join(' '));
    else if (typeof shop.housing === 'string') parts.push(shop.housing);
    if (Array.isArray(shop.visa)) parts.push(shop.visa.join(' '));
    else if (typeof shop.visa === 'string') parts.push(shop.visa);
    if (shop.concept) parts.push(shop.concept);
    return parts.join(' ');
  }

  function shopMatchesBenefit(shopId, benefit) {
    if (benefit === 'all') return true;
    const keywords = benefitMap[benefit] || [benefit];
    const text = getShopBenefitsText(shopId);
    return keywords.some(kw => text.includes(kw));
  }

  function applyFilter(benefit) {
    currentFilter = benefit;
    const cards = document.querySelectorAll('#allShopsGrid .all-shop-card');
    let visibleCount = 0;
    cards.forEach(card => {
      const shopId = card.dataset.shopId;
      const match = shopMatchesBenefit(shopId, benefit);
      card.classList.toggle('hidden', !match);
      if (match) visibleCount++;
    });
    const countEl = document.getElementById('filteredCount');
    if (countEl) countEl.textContent = visibleCount;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.benefit-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.benefit-tag')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.benefit);
      });
    });
  });
})();
