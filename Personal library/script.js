/* ==========================================================================
   Personal Knowledge Library — script.js
   Vanilla JavaScript, no dependencies. Works on index.html and viewer.html.

   HOW TO ADD A DOCUMENT
   1. Put the PDF in the  pdfs/  folder (use a simple filename, no spaces:
      my-new-article.pdf).
   2. (Optional) Put a cover image in  assets/covers/  (JPG, WebP or SVG,
      about 600 x 400 px).
   3. Add one object to the DOCUMENTS array below. Copy the sample entry.
   4. Save and refresh. The card appears everywhere automatically.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CONFIGURATION
   -------------------------------------------------------------------------- */

const SITE = {
  name: 'Personal Knowledge Library',
  pdfFolder: 'pdfs/',          // folder that holds every PDF
  latestCount: 3               // how many "Latest additions" to show on the home page
};

/* Categories shown in the filter chips and the Categories section.
   `name` must match the `category` field of each document exactly. */
const CATEGORIES = [
  {
    name: 'Psychology',
    image: 'assets/categories/psychology.svg',
    imageAlt: 'Abstract illustration of connected nodes forming a mind map',
    description: 'How the mind works and why people think, feel and behave as they do.',
    topics: ['Cognition', 'Emotion', 'Behaviour', 'Bias']
  },
  {
    name: 'Critical Thinking',
    image: 'assets/categories/critical-thinking.svg',
    imageAlt: 'Abstract illustration of balanced scales weighing two ideas',
    description: 'Reasoning, logic, bias and the habits of clear, honest judgement.',
    topics: ['Logic', 'Fallacies', 'Evidence', 'Judgement']
  },
  {
    name: 'Technology',
    image: 'assets/categories/technology.svg',
    imageAlt: 'Abstract illustration of a microchip with glowing circuit traces',
    description: 'Tools, systems and ideas shaping how we work and live.',
    topics: ['Cloud', 'Security', 'Software', 'AI']
  },
  {
    name: 'Personal Development',
    image: 'assets/categories/personal-development.svg',
    imageAlt: 'Abstract illustration of ascending steps leading toward a rising sun',
    description: 'Growth, habits, discipline and becoming a better version of yourself.',
    topics: ['Habits', 'Discipline', 'Mindset', 'Growth']
  },
  {
    name: 'Business',
    image: 'assets/categories/business.svg',
    imageAlt: 'Abstract illustration of a rising bar chart with a trend line',
    description: 'Strategy, money, leadership and the practice of building things.',
    topics: ['Strategy', 'Finance', 'Leadership', 'Markets']
  },
  {
    name: 'Faith',
    image: 'assets/categories/faith.svg',
    imageAlt: 'Abstract illustration of light streaming through an archway',
    description: 'Reflections on belief, purpose, character and spiritual growth.',
    topics: ['Reflection', 'Prayer', 'Purpose', 'Character']
  },
  {
    name: 'General Knowledge',
    image: 'assets/categories/general-knowledge.svg',
    imageAlt: 'Abstract illustration of a globe with orbiting points',
    description: 'Curious facts and broad learning across many subjects.',
    topics: ['Science', 'History', 'Curiosities', 'World']
  },
  {
    name: 'Research/Education',
    image: 'assets/categories/research-education.svg',
    imageAlt: 'Abstract illustration of an open book beside a magnifying glass',
    description: 'Studies, academic work and ideas about teaching and learning.',
    topics: ['Methods', 'Study skills', 'Teaching', 'Literature']
  }
];

/* --------------------------------------------------------------------------
   2. YOUR DOCUMENTS  (edit this array)
   --------------------------------------------------------------------------
   id          unique, URL-safe text (letters, numbers, hyphens)
   title       the document title
   description one to three sentences describing it
   category    must match a category name above
   date        publication date as YYYY-MM-DD
   filename    exact file name inside the pdfs/ folder (case-sensitive!)
   coverImage  path to a cover image, or '' to use an automatic cover
   featured    true to show it in the "Featured" block on the home page
   tags        array of keywords used by search
   -------------------------------------------------------------------------- */
const DOCUMENTS = [
  {
    id: 'why-intelligent-people-sometimes-make-poor-decisions',
    title: 'Why Intelligent People Sometimes Make Poor Decisions',
    description: 'An exploration of how cognitive bias, overconfidence and emotional reasoning can lead even sharp minds astray, and the habits that help us decide more wisely.',
    category: 'Psychology',
    date: '2026-10-29',
    filename: 'why-intelligent-people-sometimes-make-poor-decisions.pdf',
    coverImage: 'assets/covers/why-intelligent-people-sometimes-make-poor-decisions.svg',
    featured: true,
    tags: ['decision making', 'cognitive bias', 'overconfidence', 'critical thinking']
  },
  {
    id: 'spotting-weak-arguments',
    title: 'A Practical Guide to Spotting Weak Arguments',
    description: 'Five steady questions and six common fallacies that help you test claims in the news, at work and in everyday conversation, without becoming a cynic.',
    category: 'Critical Thinking',
    date: '2026-10-22',
    filename: 'spotting-weak-arguments.pdf',
    coverImage: 'assets/covers/spotting-weak-arguments.svg',
    featured: true,
    tags: ['logic', 'fallacies', 'reasoning', 'evidence']
  },
  {
    id: 'cloud-computing-beginners-map',
    title: 'Cloud Computing Explained: A Beginner\'s Map',
    description: 'What the cloud really is, the three service layers, why organisations adopt it, how security responsibility is shared, and where a beginner should start.',
    category: 'Technology',
    date: '2026-10-15',
    filename: 'cloud-computing-beginners-map.pdf',
    coverImage: 'assets/covers/cloud-computing-beginners-map.svg',
    featured: true,
    tags: ['cloud', 'azure', 'infrastructure', 'beginners']
  },
  {
    id: 'quiet-power-of-small-habits',
    title: 'The Quiet Power of Small Habits',
    description: 'Why tiny, repeatable actions beat dramatic resolutions, with a simple four-step method for building habits that last and a plan for the days you miss.',
    category: 'Personal Development',
    date: '2026-10-08',
    filename: 'quiet-power-of-small-habits.pdf',
    coverImage: 'assets/covers/quiet-power-of-small-habits.svg',
    featured: false,
    tags: ['habits', 'consistency', 'discipline', 'growth']
  },
  {
    id: 'cash-flow-is-the-story',
    title: 'Cash Flow Is the Story: Reading Business Health Beyond Profit',
    description: 'Why a profitable business can still run out of money, the three numbers worth watching, and practical habits for keeping cash healthy as you grow.',
    category: 'Business',
    date: '2026-09-24',
    filename: 'cash-flow-is-the-story.pdf',
    coverImage: 'assets/covers/cash-flow-is-the-story.svg',
    featured: false,
    tags: ['cash flow', 'finance', 'small business', 'growth']
  },
  {
    id: 'faith-in-ordinary-days',
    title: 'Faith in Ordinary Days: Finding Purpose in Routine',
    description: 'A reflection on living faith through daily conduct, simple spiritual rhythms, honest doubt and the quiet meaning found in ordinary work and family life.',
    category: 'Faith',
    date: '2026-09-17',
    filename: 'faith-in-ordinary-days.pdf',
    coverImage: 'assets/covers/faith-in-ordinary-days.svg',
    featured: false,
    tags: ['reflection', 'purpose', 'daily practice', 'gratitude']
  },
  {
    id: 'knowledge-jotter-six-curious-facts',
    title: 'A Knowledge Jotter: Six Curious Facts Worth Remembering',
    description: 'A short notebook of six true and surprising facts, from slow-spinning planets and three-hearted octopuses to why bananas count as berries.',
    category: 'General Knowledge',
    date: '2026-09-10',
    filename: 'knowledge-jotter-six-curious-facts.pdf',
    coverImage: 'assets/covers/knowledge-jotter-six-curious-facts.svg',
    featured: false,
    tags: ['jotter', 'science', 'curiosity', 'facts']
  },
  {
    id: 'how-to-read-a-research-paper',
    title: 'How to Read a Research Paper Without Getting Lost',
    description: 'A practical reading order, a list of questions to ask, and ways to judge quality, so academic papers become approachable instead of intimidating.',
    category: 'Research/Education',
    date: '2026-09-03',
    filename: 'how-to-read-a-research-paper.pdf',
    coverImage: 'assets/covers/how-to-read-a-research-paper.svg',
    featured: false,
    tags: ['research', 'study skills', 'academic reading', 'notes']
  }

  /* Copy this template for your next document (remember the comma between entries):
  ,{
    id: 'my-next-document',
    title: 'My Next Document',
    description: 'A short description of what this document covers.',
    category: 'Technology',
    date: '2026-11-05',
    filename: 'my-next-document.pdf',
    coverImage: '',
    featured: false,
    tags: ['keyword one', 'keyword two']
  }
  */
];

/* ==========================================================================
   3. APPLICATION CODE — you normally do not need to edit below this line
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $  = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escapeHTML = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

  function parseDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(NaN);
  }
  function formatDate(iso) {
    const d = parseDate(iso);
    return isNaN(d) ? 'Undated' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  const timeOf = (doc) => parseDate(doc.date).getTime() || 0;

  const pdfUrl    = (doc) => SITE.pdfFolder + encodeURIComponent(doc.filename);
  const viewerUrl = (doc) => 'viewer.html?id=' + encodeURIComponent(doc.id);

  function sortDocs(list, direction) {
    const sign = direction === 'oldest' ? 1 : -1;
    return list.slice().sort((a, b) => (timeOf(a) - timeOf(b)) * sign || a.title.localeCompare(b.title));
  }

  /* Every category that exists: the configured ones, plus any a document uses that is not listed. */
  function allCategories() {
    const known = CATEGORIES.slice();
    DOCUMENTS.forEach((doc) => {
      if (!known.some((c) => c.name === doc.category)) {
        console.warn('Category "' + doc.category + '" is not listed in CATEGORIES (document: ' + doc.id + ').');
        known.push({ name: doc.category, description: '' });
      }
    });
    return known;
  }
  function countByCategory() {
    const counts = {};
    DOCUMENTS.forEach((doc) => { counts[doc.category] = (counts[doc.category] || 0) + 1; });
    return counts;
  }
  const toneIndex = (category) => Math.max(0, allCategories().findIndex((c) => c.name === category)) % 8;

  function goToLibrary() {
    const target = document.getElementById('library');
    if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------- Document card ---------- */
  function fallbackCoverHTML(doc) {
    return '<div class="cover-fallback tone-' + toneIndex(doc.category) + '" aria-hidden="true">' +
             '<span class="cover-cat">' + escapeHTML(doc.category) + '</span>' +
             '<span class="cover-mark">' + escapeHTML(doc.title) + '</span>' +
           '</div>';
  }

  function cardHTML(doc, index, options) {
    const featured = options && options.featuredBadge;
    const alt = doc.coverAlt || ('Cover image for “' + doc.title + '”');
    const cover = doc.coverImage
      ? '<img src="' + escapeHTML(doc.coverImage) + '" alt="' + escapeHTML(alt) + '" width="600" height="400" ' +
        'loading="lazy" decoding="async" data-cover-for="' + escapeHTML(doc.id) + '">'
      : fallbackCoverHTML(doc);

    const tags = (doc.tags || []).slice(0, 4).map((tag) =>
      '<li><button type="button" class="tag-btn" data-tag="' + escapeHTML(tag) + '" ' +
      'aria-label="Search for tag ' + escapeHTML(tag) + '">#' + escapeHTML(tag) + '</button></li>'
    ).join('');

    return (
      '<article class="doc-card" style="--i:' + index + '">' +
        '<div class="doc-cover">' + cover +
          (featured && doc.featured ? '<span class="badge-featured">Featured</span>' : '') +
        '</div>' +
        '<div class="doc-body">' +
          '<div class="doc-meta">' +
            '<span class="badge">' + escapeHTML(doc.category) + '</span>' +
            '<span class="badge badge-pdf" title="PDF document">PDF</span>' +
          '</div>' +
          '<h3 class="doc-title">' + escapeHTML(doc.title) + '</h3>' +
          '<p class="doc-desc">' + escapeHTML(doc.description) + '</p>' +
          (tags ? '<ul class="doc-tags" aria-label="Tags">' + tags + '</ul>' : '') +
          '<p class="doc-date">Published <time datetime="' + escapeHTML(doc.date) + '">' + escapeHTML(formatDate(doc.date)) + '</time></p>' +
          '<div class="doc-actions">' +
            '<a class="btn btn-primary btn-sm" href="' + viewerUrl(doc) + '" aria-label="Read “' + escapeHTML(doc.title) + '” online">Read PDF</a>' +
            '<a class="btn btn-secondary btn-sm" href="' + pdfUrl(doc) + '" download="' + escapeHTML(doc.filename) + '" ' +
               'aria-label="Download “' + escapeHTML(doc.title) + '” as a PDF file">Download PDF</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  /* If a cover image fails to load, swap in the generated cover. */
  function bindCoverFallbacks(root) {
    $$('img[data-cover-for]', root).forEach((img) => {
      img.addEventListener('error', () => {
        const doc = DOCUMENTS.find((d) => d.id === img.dataset.coverFor);
        if (!doc) return;
        img.insertAdjacentHTML('afterend', fallbackCoverHTML(doc));
        img.remove();
      }, { once: true });
    });
  }

  function renderCards(container, docs, options) {
    container.innerHTML = docs.map((doc, i) => cardHTML(doc, i, options)).join('');
    bindCoverFallbacks(container);
  }

  /* ---------- Navigation (shared by both pages) ---------- */
  function initNav() {
    const header = $('.site-header');
    const toggle = $('.nav-toggle');
    const nav = $('#primary-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
    }
    const isOpen = () => nav.classList.contains('is-open');

    toggle.addEventListener('click', () => setOpen(!isOpen()));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (isOpen() && !e.target.closest('.nav-bar')) setOpen(false);
    });
    window.matchMedia('(min-width: 981px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });

    const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Highlight the nav link of the section currently in view */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const links = $$('[data-nav]');
    const sections = ['home', 'library', 'categories', 'about'].map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          if (link.dataset.nav === entry.target.id) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => observer.observe(el));
  }

  function setYear() {
    const el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- HOME PAGE ---------- */
  function initHome() {
    const grid        = $('#library-grid');
    const form        = $('#library-form');
    const searchInput = $('#search-input');
    const sortSelect  = $('#sort-select');
    const clearBtn    = $('#clear-filters');
    const chipsEl     = $('#category-chips');
    const statusEl    = $('#results-status');
    const emptyEl     = $('#empty-state');
    const emptyTitle  = $('#empty-title');
    const emptyText   = $('#empty-text');
    const emptyClear  = $('#empty-clear');
    const tilesEl     = $('#category-grid');

    const state = { query: '', category: 'All', sort: 'newest' };
    const categories = allCategories();
    const counts = countByCategory();

    /* Hero stats */
    $('#stat-docs').textContent = String(DOCUMENTS.length);
    $('#stat-categories').textContent = String(categories.length);
    if (DOCUMENTS.length) {
      $('#stat-updated').textContent = formatDate(sortDocs(DOCUMENTS, 'newest')[0].date);
    }

    /* About-section stats (blog count comes from posts.js when it is loaded) */
    const postCount = (typeof POSTS !== 'undefined') ? POSTS.filter((p) => !p.draft).length : 0;
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = String(value); };
    setText('about-stat-docs', DOCUMENTS.length);
    setText('about-stat-categories', categories.length);
    setText('about-stat-posts', postCount);

    /* Featured + latest */
    (function renderHighlights() {
      const featured = sortDocs(DOCUMENTS.filter((d) => d.featured), 'newest').slice(0, 3);
      const latest = sortDocs(DOCUMENTS.filter((d) => !d.featured), 'newest').slice(0, SITE.latestCount);

      if (featured.length) {
        $('#featured-block').hidden = false;
        const featuredGrid = $('#featured-grid');
        featuredGrid.classList.toggle('is-editorial', featured.length === 3);
        featuredGrid.dataset.count = String(featured.length);
        renderCards(featuredGrid, featured, { featuredBadge: true });
      }
      if (latest.length) {
        $('#latest-block').hidden = false;
        renderCards($('#latest-grid'), latest);
      }
      $('#latest-empty').hidden = featured.length > 0 || latest.length > 0;
    })();

    /* Category chips (built once; pressed state is toggled later) */
    const chipItems = [{ name: 'All', count: DOCUMENTS.length }]
      .concat(categories.map((c) => ({ name: c.name, count: counts[c.name] || 0 })));
    chipsEl.innerHTML = chipItems.map((item) =>
      '<button type="button" class="chip" data-category="' + escapeHTML(item.name) + '" aria-pressed="false">' +
        escapeHTML(item.name) + ' <span class="chip-count">' + item.count + '</span>' +
      '</button>'
    ).join('');

    /* Category tiles */
    tilesEl.innerHTML = categories.map((c) => {
      const n = counts[c.name] || 0;
      const newest = sortDocs(DOCUMENTS.filter((d) => d.category === c.name), 'newest')[0];
      const image = c.image
        ? '<img src="' + escapeHTML(c.image) + '" alt="' + escapeHTML(c.imageAlt || ('Illustration for ' + c.name)) + '" width="600" height="400" loading="lazy" decoding="async">'
        : '';
      const topics = (c.topics || []).map((t) => '<span>' + escapeHTML(t) + '</span>').join('');
      return '<button type="button" class="category-tile reveal" data-category="' + escapeHTML(c.name) + '">' +
               '<span class="category-media">' + image +
                 '<span class="category-count">' + n + (n === 1 ? ' document' : ' documents') + '</span>' +
               '</span>' +
               '<span class="category-body">' +
                 '<span class="category-name">' + escapeHTML(c.name) + '</span>' +
                 '<span class="category-desc">' + escapeHTML(c.description) + '</span>' +
                 (topics ? '<span class="category-topics">' + topics + '</span>' : '') +
                 (newest ? '<span class="category-latest">Latest: ' + escapeHTML(newest.title) + '</span>' : '') +
                 '<span class="category-cta">Explore ' + escapeHTML(c.name) + ' <span aria-hidden="true">→</span></span>' +
               '</span>' +
             '</button>';
    }).join('');
    $$('.category-media img', tilesEl).forEach((img) => img.addEventListener('error', () => img.remove(), { once: true }));

    /* Filtering */
    function filtered() {
      const terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
      const list = DOCUMENTS.filter((doc) => {
        if (state.category !== 'All' && doc.category !== state.category) return false;
        if (!terms.length) return true;
        const haystack = [doc.title, doc.description, doc.category, (doc.tags || []).join(' ')].join(' ').toLowerCase();
        return terms.every((term) => haystack.includes(term));
      });
      return sortDocs(list, state.sort);
    }

    const isFiltered = () => state.query.trim() !== '' || state.category !== 'All' || state.sort !== 'newest';

    function syncURL() {
      try {
        const params = new URLSearchParams();
        if (state.query.trim()) params.set('q', state.query.trim());
        if (state.category !== 'All') params.set('category', state.category);
        if (state.sort !== 'newest') params.set('sort', state.sort);
        const qs = params.toString();
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
      } catch (err) { /* some file:// contexts block this; safe to ignore */ }
    }

    function render() {
      const list = filtered();
      const total = DOCUMENTS.length;

      renderCards(grid, list);
      grid.hidden = list.length === 0;
      emptyEl.hidden = list.length > 0;

      let message = 'Showing ' + list.length + ' of ' + total + (total === 1 ? ' document' : ' documents');
      if (state.category !== 'All') message += ' in ' + state.category;
      if (state.query.trim()) message += ' matching “' + state.query.trim() + '”';
      statusEl.textContent = total ? message : '';

      if (list.length === 0) {
        if (total === 0) {
          emptyTitle.textContent = 'The library is empty';
          emptyText.textContent = 'No documents have been published yet. Please check back soon.';
          emptyClear.hidden = true;
        } else if (state.query.trim()) {
          emptyTitle.textContent = 'No documents found';
          emptyText.textContent = 'Nothing matched “' + state.query.trim() + '”' +
            (state.category !== 'All' ? ' in ' + state.category : '') + '. Check the spelling or try a broader word.';
          emptyClear.hidden = false;
        } else {
          emptyTitle.textContent = 'Nothing in ' + state.category + ' yet';
          emptyText.textContent = 'New documents are added over time. Browse the full library in the meantime.';
          emptyClear.hidden = false;
        }
      }

      $$('.chip', chipsEl).forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.category === state.category)));
      clearBtn.disabled = !isFiltered();
      syncURL();
    }

    function setQuery(value, updateInput) {
      state.query = value;
      if (updateInput !== false) searchInput.value = value;
      render();
    }
    function setCategory(name) { state.category = name; render(); }
    function reset() {
      state.query = ''; state.category = 'All'; state.sort = 'newest';
      searchInput.value = ''; sortSelect.value = 'newest';
      render();
    }

    /* Events */
    let timer;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => setQuery(searchInput.value, false), 120);
    });
    form.addEventListener('submit', (e) => { e.preventDefault(); setQuery(searchInput.value, false); });
    sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; render(); });
    clearBtn.addEventListener('click', reset);
    emptyClear.addEventListener('click', () => { reset(); searchInput.focus(); });

    chipsEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (chip) setCategory(chip.dataset.category);
    });
    tilesEl.addEventListener('click', (e) => {
      const tile = e.target.closest('.category-tile');
      if (!tile) return;
      setCategory(tile.dataset.category);
      goToLibrary();
    });
    document.addEventListener('click', (e) => {
      const tagBtn = e.target.closest('[data-tag]');
      if (!tagBtn) return;
      state.category = 'All';
      setQuery(tagBtn.dataset.tag);
      goToLibrary();
    });
    $$('[data-focus-search]').forEach((link) => {
      link.addEventListener('click', () => {
        setTimeout(() => searchInput.focus({ preventScroll: true }), reduceMotion ? 0 : 450);
      });
    });

    /* Restore state from the address (?q=...&category=...&sort=...) */
    const params = new URLSearchParams(location.search);
    const wanted = params.get('category');
    if (wanted && chipItems.some((item) => item.name === wanted)) state.category = wanted;
    if (params.get('sort') === 'oldest') { state.sort = 'oldest'; sortSelect.value = 'oldest'; }
    if (params.get('q')) { state.query = params.get('q'); searchInput.value = state.query; }

    render();
    initScrollSpy();
    if ((params.get('q') || wanted) && !location.hash) setTimeout(goToLibrary, 60);
  }

  /* ---------- VIEWER PAGE ---------- */
  function initViewer() {
    const params = new URLSearchParams(location.search);
    const doc = DOCUMENTS.find((d) => d.id === params.get('id'));
    const content = $('#viewer-content');
    const missing = $('#viewer-missing');

    if (!doc) {
      missing.hidden = false;
      document.title = 'Document not found | ' + SITE.name;
      return;
    }

    const url = pdfUrl(doc);
    document.title = doc.title + ' | ' + SITE.name;
    const metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', doc.description);
    const ogTitle = $('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', doc.title + ' | ' + SITE.name);

    $('#viewer-category').textContent = doc.category;
    $('#viewer-title').textContent = doc.title;
    $('#viewer-desc').textContent = doc.description;
    const time = $('#viewer-date');
    time.textContent = formatDate(doc.date);
    time.setAttribute('datetime', doc.date);

    $('#viewer-open').setAttribute('href', url);
    const dl = $('#viewer-download');
    dl.setAttribute('href', url);
    dl.setAttribute('download', doc.filename);
    dl.setAttribute('aria-label', 'Download “' + doc.title + '” as a PDF file');

    const obj = $('#viewer-object');
    obj.setAttribute('data', url + '#view=FitH');
    obj.setAttribute('aria-label', 'PDF preview of ' + doc.title);

    content.hidden = false;
  }

  /* ---------- Start ---------- */
  function init() {
    setYear();
    initNav();
    const page = document.body.dataset.page;
    if (page === 'home') initHome();
    if (page === 'viewer') initViewer();
    /* Must run AFTER the page has built its dynamic content, so every .reveal element exists */
    initReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();