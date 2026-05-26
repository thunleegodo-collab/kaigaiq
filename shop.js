// ========================================
// Shop Detail Page - Dynamic Rendering
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // ナビゲーションは常に初期化（SHOPS_DATAの読み込み状況に関わらず）
  initInteractions();

  // 店舗データの読み込みを待ってからレンダリング
  function initShopPage() {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('id') || window.SHOP_ID || '';

    if (!shopId) {
      document.querySelector('.shop-hero-title').textContent = '店舗が見つかりません';
      return;
    }

    if (!window.SHOPS_DATA) {
      // Rocket Loader等でSHOPS_DATAがまだ読み込まれていない場合リトライ
      setTimeout(initShopPage, 200);
      return;
    }

    if (!window.SHOPS_DATA[shopId]) {
      document.querySelector('.shop-hero-title').textContent = '店舗が見つかりません';
      return;
    }

    const shop = window.SHOPS_DATA[shopId];
    renderShop(shop);
  }

  initShopPage();
});

function renderShop(shop) {
  const params = new URLSearchParams(window.location.search);
  const shopId = params.get('id') || '';

  // SEO meta injection
  let rawSalary = (shop.salary && (shop.salary.monthly || shop.salary.daily)) || '';
  rawSalary = String(rawSalary).replace(/^(月収|月給|日給)\s*/, '');
  const isPlaceholder = !rawSalary || /問い合わせ|相談|お問合せ/.test(rawSalary);
  const salaryClause = isPlaceholder ? '未経験OK・寮完備' : `月収${rawSalary}`;
  const benefitsTop = (shop.benefits && shop.benefits.length > 0)
    ? shop.benefits.slice(0, 3).join('・')
    : 'サポート充実';
  const conceptShort = (shop.conceptMeta || shop.concept || '').slice(0, 140);
  const title = `${shop.name}｜${shop.city}${shop.type}求人 - ${salaryClause} | KaigaiQ`;
  const desc = `${shop.flag} ${shop.city}の${shop.type}「${shop.name}」のキャスト求人情報。${conceptShort}。${salaryClause}、${benefitsTop}。`;
  const canonicalUrl = `https://kaigaiq.com/shop.html?id=${encodeURIComponent(shopId)}`;
  const ogImage = shop.heroImage || (shop.gallery && shop.gallery[0]) || 'https://kaigaiq.com/icons/icon-512.svg';

  document.getElementById('pageTitle').textContent = title;
  const setMeta = (id, val) => { const el = document.getElementById(id); if (el) el.setAttribute('content', val); };
  setMeta('metaDesc', desc);
  setMeta('ogTitle', `${shop.name}（${shop.flag} ${shop.city}・${shop.type}）| KaigaiQ`);
  setMeta('ogDesc', desc);
  setMeta('ogImage', ogImage);
  setMeta('twTitle', `${shop.name}（${shop.flag} ${shop.city}・${shop.type}）`);
  setMeta('twDesc', desc);
  setMeta('twImage', ogImage);
  const canonical = document.getElementById('canonicalLink');
  if (canonical) canonical.setAttribute('href', canonicalUrl);
  const ogUrl = document.getElementById('ogUrl');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

  // Inject JSON-LD: LocalBusiness + BreadcrumbList + JobPosting
  injectShopJsonLd(shop, shopId, canonicalUrl);

  // Hero
  const heroEl = document.getElementById('shopHeroBg');
  heroEl.style.backgroundImage = `url('${shop.heroImage}')`;
  heroEl.setAttribute('role', 'img');
  heroEl.setAttribute('aria-label', `${shop.name}（${shop.flag} ${shop.city}・${shop.type}）のヒーロー画像`);
  document.getElementById('shopName').textContent = shop.name;
  document.getElementById('shopNameBreadcrumb').textContent = shop.name;
  document.getElementById('shopBadge').textContent = shop.type;
  document.getElementById('shopArea').querySelector('span').textContent = `${shop.flag} ${shop.region} / ${shop.city}`;
  document.getElementById('shopRegionLink').textContent = shop.region;

  // Concept
  document.getElementById('shopConceptText').textContent = shop.concept;

  // Gallery
  const galleryGrid = document.getElementById('shopGalleryGrid');
  if (shop.gallery && shop.gallery.length > 0) {
    galleryGrid.innerHTML = shop.gallery.map((img, i) =>
      `<div class="gallery-item" data-index="${i}"><img src="${img}" alt="${shop.name} 店内写真 ${i + 1}枚目（${shop.city}・${shop.type}）" loading="lazy" decoding="async"></div>`
    ).join('');
  } else {
    document.getElementById('shopGallery').style.display = 'none';
  }

  // Salary
  if (shop.salary) {
    if (shop.salary.daily) {
      document.getElementById('salaryDaily').textContent = shop.salary.daily;
    }
    if (shop.salary.monthly) {
      document.getElementById('salaryMonthly').textContent = shop.salary.monthly;
    }
    // バックシステム: 配列(backs) or 文字列(back) に対応
    const backSystem = document.getElementById('backSystem');
    if (shop.salary.backs && shop.salary.backs.length > 0) {
      backSystem.innerHTML = shop.salary.backs.map(b =>
        `<div class="back-item"><span class="back-item-icon"></span><span class="back-item-text">${b}</span></div>`
      ).join('');
    } else if (shop.salary.back) {
      const backItems = shop.salary.back.split(' / ');
      backSystem.innerHTML = backItems.map(b =>
        `<div class="back-item"><span class="back-item-icon"></span><span class="back-item-text">${b.trim()}</span></div>`
      ).join('');
    }
    // ボーナス情報
    if (shop.salary.bonus) {
      const monthlyEl = document.getElementById('salaryMonthly');
      monthlyEl.textContent = (monthlyEl.textContent ? monthlyEl.textContent + ' / ' : '') + shop.salary.bonus;
    }
  } else {
    document.getElementById('shopSalary').style.display = 'none';
  }

  // Benefits
  if (shop.benefits && shop.benefits.length > 0) {
    document.getElementById('benefitsGrid').innerHTML = shop.benefits.map(b =>
      `<div class="benefit-item">
        <span class="benefit-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
        <span class="benefit-text">${b}</span>
      </div>`
    ).join('');
  } else {
    document.getElementById('shopBenefits').style.display = 'none';
  }

  // Housing: 配列 or 文字列に対応
  if (shop.housing) {
    const housingIcons = ['🏠', '🛏️', '📶', '🪑', '🏢', '🔑', '🧹', '🚿'];
    const housingArr = Array.isArray(shop.housing) ? shop.housing : [shop.housing];
    if (housingArr.length > 0 && housingArr[0]) {
      document.getElementById('housingFeatures').innerHTML = housingArr.map((h, i) =>
        `<div class="housing-item"><span class="housing-icon">${housingIcons[i % housingIcons.length]}</span><span class="housing-text">${h}</span></div>`
      ).join('');
    } else {
      document.getElementById('shopHousing').style.display = 'none';
    }
  } else {
    document.getElementById('shopHousing').style.display = 'none';
  }

  // Visa: 配列 or 文字列に対応
  if (shop.visa) {
    const visaArr = Array.isArray(shop.visa) ? shop.visa : [shop.visa];
    if (visaArr.length > 0 && visaArr[0]) {
      document.getElementById('visaInfo').innerHTML = visaArr.map(v =>
        `<div class="visa-item">
          <span class="visa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span>
          <span class="visa-text">${v}</span>
        </div>`
      ).join('');
    } else {
      document.getElementById('shopVisa').style.display = 'none';
    }
  } else {
    document.getElementById('shopVisa').style.display = 'none';
  }

  // Price system: 配列 [{item,price}] or ネストオブジェクトに対応
  if (shop.priceSystem) {
    const priceTable = document.getElementById('priceTable');
    if (Array.isArray(shop.priceSystem) && shop.priceSystem.length > 0) {
      // 旧形式: [{item, price}, ...]
      priceTable.innerHTML =
        `<div class="price-row price-header"><div class="price-cell">項目</div><div class="price-cell">料金</div></div>` +
        shop.priceSystem.map(p =>
          `<div class="price-row"><div class="price-cell">${p.item}</div><div class="price-cell">${p.price}</div></div>`
        ).join('');
    } else if (typeof shop.priceSystem === 'object' && !Array.isArray(shop.priceSystem)) {
      // 新形式: ネストオブジェクト
      const sectionLabels = {
        counterBar: 'カウンターBAR',
        sofaLounge: 'ソファラウンジ',
        vipRoom: 'VIPルーム',
        vipClub: 'VIP CLUB',
        membership: '会員プラン',
        tax: '税・サービス料'
      };
      let html = '';
      for (const [key, val] of Object.entries(shop.priceSystem)) {
        const label = sectionLabels[key] || key;
        if (typeof val === 'string') {
          html += `<div class="price-row"><div class="price-cell">${label}</div><div class="price-cell">${val}</div></div>`;
        } else if (typeof val === 'object') {
          html += `<div class="price-row price-header"><div class="price-cell" style="flex:0 0 100%;">${label}</div></div>`;
          for (const [subKey, subVal] of Object.entries(val)) {
            html += `<div class="price-row"><div class="price-cell">${subKey}</div><div class="price-cell">${subVal}</div></div>`;
          }
        }
      }
      priceTable.innerHTML = html;
    } else {
      document.getElementById('shopPrice').style.display = 'none';
    }
  } else {
    document.getElementById('shopPrice').style.display = 'none';
  }

  // Notes
  if (shop.notes && shop.notes.length > 0) {
    document.getElementById('notesList').innerHTML = shop.notes.map(n =>
      `<li>${n}</li>`
    ).join('');
  } else {
    document.getElementById('shopNotes').style.display = 'none';
  }

  // Sidebar — hours/address はトップレベル or contact 内のどちらにも対応
  document.getElementById('sidebarType').textContent = shop.type;
  document.getElementById('sidebarArea').textContent = `${shop.flag} ${shop.city}`;
  document.getElementById('sidebarHours').textContent = shop.hours || (shop.contact && shop.contact.hours) || '-';
  document.getElementById('sidebarAddress').textContent = shop.address || (shop.contact && shop.contact.address) || '-';

  // Contact
  const lineBtn = document.getElementById('sidebarLineBtn');
  const emailBtn = document.getElementById('sidebarEmailBtn');
  const phoneBtn = document.getElementById('sidebarPhoneBtn');

  // Hide all CTA buttons by default
  if (lineBtn) lineBtn.style.display = 'none';
  if (emailBtn) emailBtn.style.display = 'none';
  if (phoneBtn) phoneBtn.style.display = 'none';

  if (shop.contact) {
    if (shop.contact.line) {
      document.getElementById('contactLine').style.display = '';
      const lineVal = shop.contact.line;
      const isLineUrl = lineVal.startsWith('http');
      document.getElementById('contactLineId').textContent = isLineUrl ? 'LINE友だち追加' : lineVal;
      if (lineBtn) {
        lineBtn.style.display = '';
        lineBtn.href = isLineUrl ? lineVal : `https://line.me/R/ti/p/${encodeURIComponent(lineVal)}`;
        lineBtn.target = '_blank';
        lineBtn.rel = 'noopener noreferrer';
      }
    }
    if (shop.contact.phone) {
      document.getElementById('contactPhone').style.display = '';
      const phoneEl = document.getElementById('contactPhoneNum');
      const cleanPhone = shop.contact.phone.replace(/[\s\-]/g, '');
      phoneEl.innerHTML = `<a href="tel:${cleanPhone}" style="color:inherit;text-decoration:none;">${shop.contact.phone}</a>`;
      if (phoneBtn) {
        phoneBtn.style.display = '';
        phoneBtn.href = `tel:${cleanPhone}`;
      }
    }
    if (shop.contact.email) {
      document.getElementById('contactEmail').style.display = '';
      const emailEl = document.getElementById('contactEmailAddr');
      emailEl.innerHTML = `<a href="mailto:${shop.contact.email}" style="color:inherit;text-decoration:none;">${shop.contact.email}</a>`;
      if (emailBtn) {
        emailBtn.style.display = '';
        emailBtn.href = `mailto:${shop.contact.email}`;
      }
    }
    if (shop.contact.website) {
      const wsEl = document.getElementById('contactWebsite');
      if (wsEl) {
        wsEl.style.display = '';
        const urlEl = document.getElementById('contactWebsiteUrl');
        const displayUrl = shop.contact.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
        urlEl.innerHTML = `<a href="${shop.contact.website}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;">${displayUrl}</a>`;
      }
    }
    if (shop.contact.instagram) {
      const igEl = document.getElementById('contactInstagram');
      if (igEl) {
        igEl.style.display = '';
        const urlEl = document.getElementById('contactInstagramUrl');
        const raw = shop.contact.instagram;
        const isUrl = raw.startsWith('http');
        const handle = isUrl
          ? '@' + raw.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '').replace(/^@?/, '')
          : (raw.startsWith('@') ? raw : '@' + raw);
        const href = isUrl ? raw : `https://www.instagram.com/${raw.replace(/^@/, '')}/`;
        urlEl.innerHTML = `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;">${handle}</a>`;
      }
    }
  }

  // Map
  const address = shop.address || (shop.contact && shop.contact.address) || '';
  const mapContainer = document.getElementById('shopMap');
  if ((address || shop.name) && mapContainer) {
    const primaryAddress = address.split(/\s*\/\s*/)[0];
    const isCityOnly = primaryAddress.length < 15;
    const queryStr = shop.mapQuery
      ? shop.mapQuery
      : (isCityOnly
        ? `${shop.name} ${primaryAddress || shop.city || ''}`.trim()
        : `${shop.name} ${primaryAddress}`.trim());
    const query = encodeURIComponent(queryStr);
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${query}`;
    mapContainer.innerHTML =
      `<div class="map-embed-wrap">` +
        `<iframe src="https://maps.google.com/maps?q=${query}&hl=ja&z=16&output=embed" ` +
          `loading="lazy" referrerpolicy="no-referrer-when-downgrade" ` +
          `allowfullscreen title="${shop.name} 地図"></iframe>` +
      `</div>` +
      `<div class="map-meta">` +
        `<p class="map-meta-address">${address || shop.city || ''}</p>` +
        `<a href="${mapsLink}" target="_blank" rel="noopener noreferrer" class="map-open-btn">Google Mapで開く &rarr;</a>` +
      `</div>`;
  } else if (mapContainer) {
    mapContainer.innerHTML = `<div class="map-placeholder"><p>住所情報なし</p></div>`;
  }
}

function injectShopJsonLd(shop, shopId, canonicalUrl) {
  const head = document.head;
  ['ldLocalBusiness', 'ldBreadcrumb', 'ldJobPosting'].forEach(id => {
    const old = document.getElementById(id);
    if (old) old.remove();
  });

  const typeMap = {
    'キャバクラ': 'NightClub',
    'ラウンジ': 'NightClub',
    'ガールズバー': 'BarOrPub',
    'スナック': 'BarOrPub',
    'Bar': 'BarOrPub',
    'コンカフェ': 'CafeOrCoffeeShop',
    '高級会員制ラウンジ': 'NightClub',
    'KTV': 'NightClub'
  };
  const schemaType = typeMap[shop.type] || 'LocalBusiness';

  const address = shop.address || (shop.contact && shop.contact.address) || '';
  const primaryAddress = address.split(/\s*\/\s*/)[0];

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    'name': shop.name,
    'url': canonicalUrl,
    'image': shop.heroImage,
    'description': shop.conceptMeta || shop.concept,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': shop.city,
      'streetAddress': primaryAddress
    },
    'areaServed': shop.city
  };
  if (shop.contact && shop.contact.phone) localBusiness.telephone = shop.contact.phone;
  if (shop.contact && shop.contact.email) localBusiness.email = shop.contact.email;
  if (shop.contact && shop.contact.website) localBusiness.sameAs = [shop.contact.website];
  if (shop.hours) localBusiness.openingHours = shop.hours;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'ホーム', 'item': 'https://kaigaiq.com/' },
      { '@type': 'ListItem', 'position': 2, 'name': shop.region, 'item': 'https://kaigaiq.com/#areas' },
      { '@type': 'ListItem', 'position': 3, 'name': shop.city, 'item': 'https://kaigaiq.com/#areas' },
      { '@type': 'ListItem', 'position': 4, 'name': shop.name, 'item': canonicalUrl }
    ]
  };

  const monthlySalary = shop.salary && shop.salary.monthly ? String(shop.salary.monthly) : '';
  const jobPosting = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': `${shop.name} キャスト募集（${shop.city}・${shop.type}）`,
    'description': `${shop.concept || ''}${shop.benefits ? '\n\n【待遇】\n' + shop.benefits.join('\n') : ''}${shop.housing ? '\n\n【住居】\n' + (Array.isArray(shop.housing) ? shop.housing.join('\n') : shop.housing) : ''}`,
    'identifier': { '@type': 'PropertyValue', 'name': 'KaigaiQ', 'value': shopId },
    'datePosted': '2026-05-21',
    'employmentType': ['FULL_TIME', 'PART_TIME', 'TEMPORARY'],
    'hiringOrganization': {
      '@type': 'Organization',
      'name': shop.name,
      'sameAs': canonicalUrl
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': shop.city,
        'streetAddress': primaryAddress
      }
    },
    'directApply': false,
    'url': canonicalUrl
  };
  if (monthlySalary) {
    jobPosting.baseSalary = {
      '@type': 'MonetaryAmount',
      'value': { '@type': 'QuantitativeValue', 'value': monthlySalary, 'unitText': 'MONTH' }
    };
  }

  const append = (id, data) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    head.appendChild(script);
  };
  append('ldLocalBusiness', localBusiness);
  append('ldBreadcrumb', breadcrumb);
  append('ldJobPosting', jobPosting);
}

function initInteractions() {
  // --- Hamburger ---
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

  // --- Copy LINE ID ---
  const copyBtn = document.getElementById('copyLineBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const lineId = document.getElementById('contactLineId').textContent;
      navigator.clipboard.writeText(lineId).then(() => {
        const toast = document.getElementById('copyToast');
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 2000);
      });
    });
  }

  // --- Image gallery modal ---
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('imageModalImg');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;

  const galleryData = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return img ? { src: img.src, alt: img.alt } : { src: '', alt: '' };
  });

  const setModalImage = (idx) => {
    modalImg.src = galleryData[idx].src;
    modalImg.alt = galleryData[idx].alt;
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      currentIndex = parseInt(item.dataset.index);
      setModalImage(currentIndex);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  document.getElementById('imageModalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById('imageModalPrev').addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    setModalImage(currentIndex);
  });

  document.getElementById('imageModalNext').addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % galleryData.length;
    setModalImage(currentIndex);
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
      setModalImage(currentIndex);
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % galleryData.length;
      setModalImage(currentIndex);
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- Back to top ---
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Header scroll ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}
