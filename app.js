const WHATSAPP_NUMBER = '918758750596';
const STORE_NAME = 'Viral Gadget Store';
const INSTAGRAM_HANDLE = '@viralgadgetstore';
const CONTACT_EMAIL = 'support@viralgadgetstore.com';

const STORE_LOGO = 'logo.jpg';
const STORE_LOGO_FALLBACK =
  'https://images.unsplash.com/photo-1614680434025-475aedb62806?w=80&h=80&fit=crop&crop=center&auto=format&q=80';

const IMAGE_FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect fill="#1E293B" width="400" height="400"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#22C55E" font-family="system-ui,sans-serif" font-size="14">Gadget</text>
    </svg>`
  );

const CATEGORIES = [
  { id: 'smart-gadgets', name: 'Smart Gadgets', icon: 'cpu' },
  { id: 'mobile-accessories', name: 'Mobile Accessories', icon: 'smartphone' },
  { id: 'gaming', name: 'Gaming', icon: 'gamepad-2' },
  { id: 'smart-lighting', name: 'Smart Lighting', icon: 'lightbulb' },
  { id: 'audio-devices', name: 'Audio Devices', icon: 'headphones' },
  { id: 'tech-essentials', name: 'Tech Essentials', icon: 'plug' },
];

const products = [
  {
    id: 'VG101',
    name: 'Magnetic Wireless Power Bank',
    price: '₹1,299',
    description: '10,000mAh slim power bank with magnetic mount.',
    category: 'smart-gadgets',
    featured: true,
    trending: true,
    keywords: ['power bank', 'charger', 'wireless', 'magnetic', 'battery', 'portable'],
    image: 'https://images.unsplash.com/photo-1609599007897-4d8348c4d238?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
  },
  {
    id: 'VG102',
    name: 'Smart LED Clock',
    price: '₹999',
    description: 'RGB alarm clock with temp display and USB port.',
    category: 'smart-lighting',
    featured: true,
    trending: true,
    keywords: ['clock', 'led', 'alarm', 'desk', 'rgb', 'smart home'],
    image: 'https://images.unsplash.com/photo-1563861826100-9cb518190475?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
  },
  {
    id: 'VG103',
    name: 'Mini Retro Game Console',
    price: '₹1,499',
    description: 'Pocket handheld with 500+ classic 8-bit games.',
    category: 'gaming',
    featured: true,
    trending: false,
    keywords: ['game', 'console', 'retro', 'gaming', 'handheld', 'arcade'],
    image: 'https://images.unsplash.com/photo-1486401899863-0d435851a5ad?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
  },
  {
    id: 'VG104',
    name: 'RGB Bluetooth Speaker',
    price: '₹1,799',
    description: 'Portable waterproof speaker with LED light ring.',
    category: 'audio-devices',
    featured: true,
    trending: true,
    keywords: ['speaker', 'bluetooth', 'audio', 'music', 'rgb', 'waterproof'],
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
  },
  {
    id: 'VG105',
    name: '360° Phone Car Mount',
    price: '₹649',
    description: 'Strong suction dash mount with magnetic grip.',
    category: 'mobile-accessories',
    featured: false,
    trending: true,
    keywords: ['car', 'mount', 'phone holder', 'dashboard', 'magnetic', 'gps'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
  },
  {
    id: 'VG106',
    name: 'USB-C GaN Fast Charger 65W',
    price: '₹2,199',
    description: 'Compact dual-port charger for phone and laptop.',
    category: 'tech-essentials',
    featured: false,
    trending: true,
    keywords: ['charger', 'usb-c', 'gan', 'fast charging', 'laptop', 'adapter'],
    image: 'https://images.unsplash.com/photo-1583863788433-e3a45b05a8f0?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
  },
];

const VALID_PAGES = ['home', 'products', 'categories', 'contact'];
let currentPage = 'home';
let searchQuery = '';
let activeCategoryFilter = 'all';

function squareImageUrl(url) {
  if (!url) return IMAGE_FALLBACK;
  try {
    const u = new URL(url);
    u.searchParams.set('w', '400');
    u.searchParams.set('h', '400');
    u.searchParams.set('fit', 'crop');
    u.searchParams.set('crop', 'center');
    u.searchParams.set('auto', 'format');
    u.searchParams.set('q', '80');
    return u.toString();
  } catch {
    return url;
  }
}

function buildOrderMessage(product) {
  return [
    `Hi ${STORE_NAME}, I want to order:`,
    `Product: ${product.name}`,
    `Code: ${product.id}`,
    `Price: ${product.price}`,
  ].join('\n');
}

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function productSearchText(product) {
  const keywords = (product.keywords || []).join(' ');
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const catName = cat ? cat.name : '';
  return [product.name, product.id, product.description, product.price, keywords, catName]
    .join(' ')
    .toLowerCase();
}

function filterBySearch(query, list) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  const terms = q.split(/\s+/).filter(Boolean);
  return list.filter((product) => {
    const haystack = productSearchText(product);
    return terms.every((term) => haystack.includes(term));
  });
}

function filterByCategory(list) {
  if (!activeCategoryFilter || activeCategoryFilter === 'all') return list;
  return list.filter((p) => p.category === activeCategoryFilter);
}

function getDisplayProducts() {
  return filterBySearch(searchQuery, filterByCategory(products));
}

function countByCategory(categoryId) {
  return products.filter((p) => p.category === categoryId).length;
}

const WA_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 shrink-0" aria-hidden="true">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.882 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
</svg>`;

function productCardHtml(product) {
  const orderUrl = whatsappUrl(buildOrderMessage(product));
  const imgSrc = squareImageUrl(product.image);

  return `
    <article class="product-card h-full flex flex-col bg-card border border-border rounded-lg md:rounded-xl overflow-hidden min-w-0">
      <div class="product-image-wrap relative w-full aspect-square shrink-0 bg-card overflow-hidden rounded-t-lg md:rounded-t-xl">
        <img
          src="${imgSrc}"
          alt="${product.name}"
          width="400"
          height="400"
          class="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          data-fallback="${IMAGE_FALLBACK}"
        />
      </div>
      <div class="flex flex-col flex-1 p-2 md:p-2.5 min-h-0">
        <div class="flex flex-col flex-1 gap-0.5 min-h-0">
          <h2 class="text-[11px] md:text-xs font-bold text-primary leading-snug line-clamp-2 min-h-[2.125rem] md:min-h-[2.25rem]">
            ${product.name}
          </h2>
          <p class="text-[9px] md:text-[10px] text-muted leading-tight line-clamp-1 min-h-[0.875rem] md:min-h-[0.9375rem]">
            ${product.description}
          </p>
          <p class="text-[9px] md:text-[10px] text-muted/80 font-mono min-h-[0.875rem]">
            ${product.id}
          </p>
          <p class="text-xs md:text-sm font-bold text-accent min-h-[1.125rem] md:min-h-[1.25rem] pt-0.5">
            ${product.price}
          </p>
        </div>
        <a
          href="${orderUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-whatsapp mt-auto shrink-0 h-8 md:h-9 w-full inline-flex items-center justify-center gap-1.5 px-2 rounded-md md:rounded-lg bg-accent text-primary text-[10px] md:text-xs font-semibold hover:bg-accent-hover leading-none"
        >
          ${WA_ICON}
          <span class="truncate md:hidden">WhatsApp</span>
          <span class="truncate hidden md:inline">Order on WhatsApp</span>
        </a>
      </div>
    </article>
  `;
}

function bindProductImages(root) {
  root.querySelectorAll('.product-image-wrap img').forEach((img) => {
    img.addEventListener('error', () => {
      const fallback = img.dataset.fallback;
      if (fallback && img.src !== fallback) img.src = fallback;
    });
  });
}

function renderProductGrid(gridId, list, options = {}) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const { showEmpty = false, emptyId } = options;

  if (showEmpty && emptyId) {
    const empty = document.getElementById(emptyId);
    if (empty) empty.classList.toggle('hidden', list.length > 0);
    grid.classList.toggle('hidden', list.length === 0);
  }

  grid.classList.add('is-filtering');
  grid.innerHTML = list.map(productCardHtml).join('');
  bindProductImages(grid);
  requestAnimationFrame(() => grid.classList.remove('is-filtering'));
}

function renderHomeGrids() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const trending = products.filter((p) => p.trending).slice(0, 4);
  renderProductGrid('featured-grid', featured.length ? featured : products.slice(0, 4));
  renderProductGrid('trending-grid', trending.length ? trending : products.slice(2, 6));
}

function renderCategoryFilters() {
  const bar = document.getElementById('category-filter-bar');
  if (!bar) return;

  const chips = [
    { id: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.name })),
  ];

  bar.innerHTML = chips
    .map(
      (chip) => `
    <button
      type="button"
      data-category="${chip.id}"
      class="category-chip shrink-0 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-medium border transition-colors duration-200 ${
        activeCategoryFilter === chip.id
          ? 'bg-accent text-primary border-accent'
          : 'bg-card text-text-secondary border-border hover:border-accent/50'
      }"
    >
      ${chip.label}
    </button>
  `
    )
    .join('');

  bar.querySelectorAll('.category-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategoryFilter = btn.dataset.category;
      renderCategoryFilters();
      applySearch();
    });
  });
}

function renderCategoriesPage() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map((cat) => {
    const count = countByCategory(cat.id);
    return `
      <button
        type="button"
        data-category="${cat.id}"
        class="category-card h-full flex flex-col items-center text-center p-3 md:p-4 rounded-xl bg-card border border-border min-w-0"
      >
        <span class="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-accent/15 text-accent mb-2">
          <i data-lucide="${cat.icon}" class="w-5 h-5 md:w-6 md:h-6"></i>
        </span>
        <h3 class="text-xs md:text-sm font-semibold text-primary leading-tight">${cat.name}</h3>
        <p class="mt-1 text-[10px] md:text-xs text-muted">${count} product${count !== 1 ? 's' : ''}</p>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('[data-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategoryFilter = btn.dataset.category;
      navigateTo('products');
    });
  });

  initLucideIcons();
}

function applySearch() {
  if (currentPage !== 'products') return;
  renderProductGrid('product-grid', getDisplayProducts(), {
    showEmpty: true,
    emptyId: 'search-empty',
  });
}

function setActiveNav(page) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const match = link.dataset.nav === page;
    link.classList.toggle('is-active', match);
    if (match) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function updatePageTitle(page) {
  const titles = {
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    contact: 'Contact',
  };
  document.title = `${titles[page] || 'Shop'} — ${STORE_NAME}`;
}

function updateSearchVisibility() {
  const toggle = document.getElementById('search-toggle');
  if (!toggle) return;
  const hideOnContact = currentPage === 'contact';
  toggle.classList.toggle('hidden', hideOnContact);
}

function navigateTo(page, options = {}) {
  const { category, replace = false } = options;
  if (!VALID_PAGES.includes(page)) page = 'home';

  if (category !== undefined) activeCategoryFilter = category;

  const prev = currentPage;
  currentPage = page;

  document.querySelectorAll('.page-view').forEach((el) => {
    const isActive = el.dataset.page === page;
    el.classList.toggle('hidden', !isActive);
    if (isActive) {
      el.classList.add('is-entering');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.remove('is-entering'));
      });
    }
  });

  setActiveNav(page);
  updatePageTitle(page);
  updateSearchVisibility();

  if (page === 'home') renderHomeGrids();
  if (page === 'products') {
    renderCategoryFilters();
    applySearch();
  }
  if (page === 'categories') renderCategoriesPage();

  const hash = `#/${page}`;
  if (replace) history.replaceState({ page }, '', hash);
  else if (prev !== page) history.pushState({ page }, '', hash);

  window.scrollTo({ top: 0, behavior: prev === page ? 'auto' : 'smooth' });
  initLucideIcons();
}

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '') || 'home';
  const page = VALID_PAGES.includes(hash) ? hash : 'home';
  return page;
}

function initRouter() {
  const page = parseRoute();
  navigateTo(page, { replace: true });

  window.addEventListener('popstate', (e) => {
    const page = e.state?.page || parseRoute();
    navigateTo(page, { replace: true });
  });

  document.querySelectorAll('[data-nav], [data-go], #brand-link').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = el.dataset.nav || el.dataset.go;
      if (!target || !VALID_PAGES.includes(target)) return;
      e.preventDefault();
      if (el.dataset.go) activeCategoryFilter = 'all';
      navigateTo(target);
      closeSidebarIfOpen();
    });
  });
}

function closeSidebarIfOpen() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar?.classList.contains('is-open')) return;
  sidebar.classList.remove('is-open');
  document.getElementById('sidebar-overlay')?.classList.remove('is-open');
  document.getElementById('menu-toggle')?.classList.remove('is-open');
  document.body.classList.remove('sidebar-open');
}

function initLucideIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function initStoreLogo() {
  document.querySelectorAll('#store-logo, .sidebar-logo').forEach((logo) => {
    logo.src = STORE_LOGO;
    logo.addEventListener('error', () => {
      if (!logo.src.includes(STORE_LOGO_FALLBACK)) logo.src = STORE_LOGO_FALLBACK;
    });
  });
}

function initNavbar() {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const closeBtn = document.getElementById('sidebar-close');
  const sidebarWa = document.getElementById('sidebar-whatsapp');

  if (!menuToggle || !sidebar || !overlay) return;

  if (sidebarWa) {
    sidebarWa.href = whatsappUrl(`Hi ${STORE_NAME}, I need help with an order.`);
  }

  const setSidebarOpen = (open) => {
    sidebar.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    menuToggle.classList.toggle('is-open', open);
    document.body.classList.toggle('sidebar-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    if (open) initLucideIcons();
  };

  menuToggle.addEventListener('click', () => {
    setSidebarOpen(!sidebar.classList.contains('is-open'));
  });

  closeBtn?.addEventListener('click', () => setSidebarOpen(false));
  overlay.addEventListener('click', () => setSidebarOpen(false));

  document.querySelectorAll('.sidebar-nav-link').forEach((link) => {
    link.addEventListener('click', () => setSidebarOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) setSidebarOpen(false);
  });
}

function initSearch() {
  const toggle = document.getElementById('search-toggle');
  const panel = document.getElementById('search-panel');
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  if (!toggle || !panel || !input) return;

  const setSearchOpen = (open) => {
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close search' : 'Open search');
    if (open) requestAnimationFrame(() => input.focus());
  };

  toggle.addEventListener('click', () => {
    const willOpen = !panel.classList.contains('is-open');
    if (willOpen) {
      closeSidebarIfOpen();
      if (currentPage !== 'products') {
        navigateTo('products');
      }
    }
    setSearchOpen(willOpen);
    if (!willOpen) {
      input.value = '';
      searchQuery = '';
      clearBtn?.classList.add('hidden');
      applySearch();
    }
  });

  input.addEventListener('input', () => {
    searchQuery = input.value;
    clearBtn?.classList.toggle('hidden', !searchQuery);
    if (currentPage !== 'products') navigateTo('products', { replace: true });
    applySearch();
  });

  clearBtn?.addEventListener('click', () => {
    input.value = '';
    searchQuery = '';
    clearBtn.classList.add('hidden');
    applySearch();
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchQuery) {
        input.value = '';
        searchQuery = '';
        clearBtn?.classList.add('hidden');
        applySearch();
      } else {
        setSearchOpen(false);
      }
    }
  });
}

function initContactLinks() {
  const contactWa = document.getElementById('contact-whatsapp');
  if (contactWa) {
    contactWa.href = whatsappUrl(`Hi ${STORE_NAME}, I'd like to get in touch.`);
  }
}

function initStickySupport() {
  const sticky = document.getElementById('sticky-support');
  if (sticky) {
    sticky.href = whatsappUrl(`Hi ${STORE_NAME}, I need help with an order.`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initStoreLogo();
  initLucideIcons();
  initRouter();
  initNavbar();
  initSearch();
  initContactLinks();
  initStickySupport();
});
