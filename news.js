// ========================================
// News Page - Interactive Features
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- Hamburger menu ---
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

  // --- Category filtering ---
  const filterTabs = document.querySelectorAll('.news-filter-tab');
  const articleCards = document.querySelectorAll('.news-article-card');
  const featuredArticle = document.querySelector('.news-featured');
  const sidebarLinks = document.querySelectorAll('.sidebar-category-list a');

  function filterByCategory(category) {
    filterTabs.forEach(t => t.classList.remove('active'));
    filterTabs.forEach(t => {
      if (t.dataset.category === category) t.classList.add('active');
    });

    if (category === 'all') {
      articleCards.forEach(c => c.classList.remove('hidden'));
      featuredArticle.classList.remove('hidden');
    } else {
      featuredArticle.classList.toggle('hidden', featuredArticle.dataset.category !== category);
      articleCards.forEach(card => {
        card.classList.toggle('hidden', card.dataset.category !== category);
      });
    }
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterByCategory(tab.dataset.category);
    });
  });

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      filterByCategory(link.dataset.category);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // --- News Detail Modal ---
  const modal = document.getElementById('newsModal');
  const modalImg = document.getElementById('newsModalImg');
  const modalMeta = document.getElementById('newsModalMeta');
  const modalTitle = document.getElementById('newsModalTitle');
  const modalContent = document.getElementById('newsModalContent');
  const modalClose = document.getElementById('newsModalClose');

  function openArticle(article) {
    const img = article.dataset.img;
    const date = article.dataset.date;
    const cat = article.dataset.cat;
    const catClass = article.dataset.catClass;
    const title = article.dataset.title;
    const fullText = article.dataset.full;

    modalImg.style.backgroundImage = `url('${img}')`;
    modalMeta.innerHTML = `
      <span class="news-date-badge">${date}</span>
      <span class="news-cat-badge ${catClass}">${cat}</span>
    `;
    modalTitle.textContent = title;

    // Convert || to paragraph breaks
    const paragraphs = fullText.split('||').map(p => {
      p = p.trim();
      if (!p) return '';
      // Headings (【...】)
      if (/^【.+】$/.test(p)) {
        return `<h3 class="news-modal-heading">${p}</h3>`;
      }
      // List items (starting with ・ or number.)
      if (/^[・\-]/.test(p) || /^\d+[\.\)、]/.test(p)) {
        return `<p class="news-modal-list-item">${p}</p>`;
      }
      return `<p>${p}</p>`;
    }).join('');

    modalContent.innerHTML = paragraphs;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Attach click to all clickable articles
  document.querySelectorAll('.news-clickable').forEach(article => {
    article.style.cursor = 'pointer';
    article.addEventListener('click', (e) => {
      e.preventDefault();
      openArticle(article);
    });
  });

  // Close modal
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
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

  // --- Fade-in animation ---
  const fadeEls = document.querySelectorAll('.news-article-card, .sidebar-widget');
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

});
