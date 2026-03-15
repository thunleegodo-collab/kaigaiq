// ========================================
// Shop Detail Page - Dynamic Rendering
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Get shop ID from URL params
  const params = new URLSearchParams(window.location.search);
  const shopId = params.get('id');

  if (!shopId || !window.SHOPS_DATA || !window.SHOPS_DATA[shopId]) {
    document.querySelector('.shop-hero-title').textContent = '店舗が見つかりません';
    return;
  }

  const shop = window.SHOPS_DATA[shopId];
  renderShop(shop);
  initInteractions();
});

function renderShop(shop) {
  // Page title
  document.getElementById('pageTitle').textContent = `${shop.name} - KaigaiQ`;

  // Hero
  document.getElementById('shopHeroBg').style.backgroundImage = `url('${shop.heroImage}')`;
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
      `<div class="gallery-item" style="background-image: url('${img}')" data-index="${i}"></div>`
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
  }

  // Map
  document.getElementById('mapAddress').textContent = shop.address || (shop.contact && shop.contact.address) || '住所情報なし';
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

  const galleryUrls = Array.from(galleryItems).map(item => {
    const bg = item.style.backgroundImage;
    return bg.slice(5, -2);
  });

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      currentIndex = parseInt(item.dataset.index);
      modalImg.src = galleryUrls[currentIndex];
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
    currentIndex = (currentIndex - 1 + galleryUrls.length) % galleryUrls.length;
    modalImg.src = galleryUrls[currentIndex];
  });

  document.getElementById('imageModalNext').addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % galleryUrls.length;
    modalImg.src = galleryUrls[currentIndex];
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + galleryUrls.length) % galleryUrls.length;
      modalImg.src = galleryUrls[currentIndex];
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % galleryUrls.length;
      modalImg.src = galleryUrls[currentIndex];
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
