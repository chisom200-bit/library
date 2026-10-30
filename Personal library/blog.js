/* ==========================================================================
   Personal Knowledge Library — blog.js
   Powers: the blog preview on the home page, the blog list (blog.html),
   the article page with comments (post.html) and the Blog Studio (write.html).
   Your blog content and settings live in posts.js.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ESC[c]);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* localStorage can be blocked (private windows etc.), so every access is wrapped */
  const LS = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };
  const KEY_WORK = 'pkl-blog-working-copy-v1';
  const KEY_SETTINGS = 'pkl-blog-settings-v1';
  const KEY_OWNER = 'pkl-owner';
  const KEY_PREVIEW_OFF = 'pkl-preview-off';
  const KEY_COMMENTS = 'pkl-comments-v1';

  function readJSON(key) {
    const raw = LS.get(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  const readWorking = () => { const a = readJSON(KEY_WORK); return Array.isArray(a) ? a : null; };

  /* ---------- Data: published posts.js, or the owner's unpublished working copy ---------- */
  const HAS_POSTS = typeof POSTS !== 'undefined' && Array.isArray(POSTS);
  const BASE_POSTS = HAS_POSTS ? POSTS : [];
  const BASE_AUTHOR = (typeof BLOG_AUTHOR !== 'undefined') ? BLOG_AUTHOR : '';
  const BASE_COMMENTS = (typeof BLOG_COMMENTS !== 'undefined' && BLOG_COMMENTS) ? BLOG_COMMENTS : { provider: 'local' };
  const CATEGORY_NAMES = (typeof CATEGORIES !== 'undefined') ? CATEGORIES.map((c) => c.name) : [];

  /* Owner mode is switched on by visiting write.html. Visitors never have it. */
  const OWNER = LS.get(KEY_OWNER) === '1';
  const WORK = OWNER ? readWorking() : null;
  const HAS_DRAFT_CHANGES = !!WORK && JSON.stringify(WORK) !== JSON.stringify(BASE_POSTS);
  const PREVIEWING = HAS_DRAFT_CHANGES && LS.get(KEY_PREVIEW_OFF) !== '1';
  const SOURCE = PREVIEWING ? WORK : BASE_POSTS;
  const SETTINGS = PREVIEWING ? readJSON(KEY_SETTINGS) : null;
  const AUTHOR = (SETTINGS && SETTINGS.author != null) ? SETTINGS.author : BASE_AUTHOR;
  const COMMENTS_CFG = (SETTINGS && SETTINGS.comments) ? SETTINGS.comments : BASE_COMMENTS;

  const published = () => SOURCE.filter((p) => !p.draft);

  function parseDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(NaN);
  }
  function formatDate(iso) {
    const d = parseDate(iso);
    return isNaN(d) ? 'Undated' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  const timeOf = (p) => parseDate(p.date).getTime() || 0;
  const sortPosts = (list, dir) => list.slice().sort((a, b) => (timeOf(a) - timeOf(b)) * (dir === 'oldest' ? 1 : -1) || a.title.localeCompare(b.title));
  const readMinutes = (text) => Math.max(1, Math.round(String(text || '').trim().split(/\s+/).length / 200));
  const postUrl = (p) => 'post.html?id=' + encodeURIComponent(p.id);
  const showAuthor = () => AUTHOR && AUTHOR !== 'Your Name';

  /* ---------- Tiny Markdown renderer (safe: everything is escaped first) ---------- */
  function inline(text) {
    let t = esc(text);
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    t = t.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => {
      if (/^https?:\/\//i.test(url)) return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
      if (/^(mailto:|#|\/|[\w./-]+$)/i.test(url)) return '<a href="' + url + '">' + label + '</a>';
      return label;
    });
    return t;
  }

  function renderMarkdown(src) {
    const lines = String(src || '').replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    const isUl = (l) => /^\s*[-*]\s+/.test(l);
    const isOl = (l) => /^\s*\d+[.)]\s+/.test(l);
    const isQuote = (l) => /^>\s?/.test(l);
    const isHeading = (l) => /^#{2,3}\s+\S/.test(l);
    const isRule = (l) => /^(-{3,}|\*{3,})\s*$/.test(l);
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      if (isHeading(line)) {
        const m = /^(#{2,3})\s+(.+)$/.exec(line);
        out.push('<h' + m[1].length + '>' + inline(m[2]) + '</h' + m[1].length + '>');
        i++; continue;
      }
      if (isRule(line)) { out.push('<hr>'); i++; continue; }
      if (isUl(line)) {
        const items = [];
        while (i < lines.length && isUl(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, '')); i++; }
        out.push('<ul>' + items.map((t) => '<li>' + inline(t) + '</li>').join('') + '</ul>');
        continue;
      }
      if (isOl(line)) {
        const items = [];
        while (i < lines.length && isOl(lines[i])) { items.push(lines[i].replace(/^\s*\d+[.)]\s+/, '')); i++; }
        out.push('<ol>' + items.map((t) => '<li>' + inline(t) + '</li>').join('') + '</ol>');
        continue;
      }
      if (isQuote(line)) {
        const q = [];
        while (i < lines.length && isQuote(lines[i])) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
        out.push('<blockquote><p>' + inline(q.join(' ')) + '</p></blockquote>');
        continue;
      }
      const para = [];
      while (i < lines.length && lines[i].trim() && !isHeading(lines[i]) && !isRule(lines[i]) && !isUl(lines[i]) && !isOl(lines[i]) && !isQuote(lines[i])) {
        para.push(lines[i]); i++;
      }
      if (!para.length) { para.push(line); i++; }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  /* ---------- Post cards ---------- */
  function coverHTML(p) {
    if (!p.cover) return '';
    const alt = p.coverAlt || ('Cover illustration for “' + p.title + '”');
    return '<img src="' + esc(p.cover) + '" alt="' + esc(alt) + '" width="600" height="400" loading="lazy" decoding="async">';
  }

  function cardHTML(p, i, opts) {
    const feature = opts && opts.feature;
    return (
      '<article class="post-card' + (feature ? ' is-feature' : '') + '" style="--i:' + (i || 0) + '">' +
        '<div class="post-cover">' + coverHTML(p) + '</div>' +
        '<div class="post-body">' +
          (feature ? '<span class="badge-featured">Featured post</span>' : '') +
          '<div class="post-meta">' +
            '<span class="badge">' + esc(p.category) + '</span>' +
            '<time datetime="' + esc(p.date) + '">' + esc(formatDate(p.date)) + '</time>' +
            '<span>' + readMinutes(p.content) + ' min read</span>' +
          '</div>' +
          '<h3 class="post-title"><a href="' + postUrl(p) + '">' + esc(p.title) + '</a></h3>' +
          '<p class="post-excerpt">' + esc(p.excerpt) + '</p>' +
          '<span class="post-more" aria-hidden="true">Read article →</span>' +
        '</div>' +
      '</article>'
    );
  }

  function bindImgErrors(root) {
    $$('img', root).forEach((img) => img.addEventListener('error', () => img.remove(), { once: true }));
  }
  function paintCards(container, posts, opts) {
    container.innerHTML = posts.map((p, i) => cardHTML(p, i, opts)).join('');
    bindImgErrors(container);
  }

  /* ---------- Owner bar (only shown to you, after you have opened write.html) ---------- */
  function initOwnerBar() {
    if (!OWNER) return;
    const header = $('.site-header');
    if (!header) return;
    const bar = document.createElement('div');
    bar.className = 'owner-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Owner tools');
    let msg, actions;
    if (PREVIEWING) {
      msg = '<strong>Previewing your unpublished changes.</strong> Only you can see this version of the blog.';
      actions = '<a class="btn btn-sm btn-light" href="write.html">Open Blog Studio</a>' +
                '<button type="button" class="btn btn-sm btn-ghost-light" data-owner="stop">Stop previewing</button>';
    } else if (HAS_DRAFT_CHANGES) {
      msg = '<strong>You have unpublished changes.</strong> Visitors still see the published blog.';
      actions = '<button type="button" class="btn btn-sm btn-light" data-owner="start">Preview my changes</button>' +
                '<a class="btn btn-sm btn-ghost-light" href="write.html">Open Blog Studio</a>';
    } else {
      msg = '<strong>Owner mode.</strong> You are viewing the published blog.';
      actions = '<a class="btn btn-sm btn-light" href="write.html">Write a new post</a>' +
                '<a class="btn btn-sm btn-ghost-light" href="write.html">Manage posts</a>';
    }
    bar.innerHTML = '<div class="container owner-inner"><p>' + msg + '</p><div class="owner-actions">' + actions +
      '<button type="button" class="btn btn-sm btn-ghost-light" data-owner="exit" aria-label="Leave owner mode">Hide</button></div></div>';
    header.insertAdjacentElement('afterend', bar);
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('[data-owner]');
      if (!b) return;
      if (b.dataset.owner === 'stop') LS.set(KEY_PREVIEW_OFF, '1');
      if (b.dataset.owner === 'start') LS.del(KEY_PREVIEW_OFF);
      if (b.dataset.owner === 'exit') LS.del(KEY_OWNER);
      location.reload();
    });
  }

  /* ---------- HOME PAGE: blog section ---------- */
  function initHomePreview() {
    const grid = $('#home-blog-grid'), featEl = $('#home-blog-feature');
    if (!grid || !featEl) return;
    const all = published();
    const latest = sortPosts(all, 'newest');

    /* topic links */
    const counts = {};
    all.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    const topics = $('#home-blog-topics');
    topics.innerHTML = Object.keys(counts).map((c) =>
      '<a class="topic-link" href="blog.html?category=' + encodeURIComponent(c) + '">' + esc(c) + ' <span>' + counts[c] + '</span></a>'
    ).join('');
    topics.hidden = !all.length;

    /* decorative collage built from your newest covers */
    const art = $('#home-blog-art');
    const covers = latest.filter((p) => p.cover).slice(0, 3);
    if (covers.length) {
      art.innerHTML =
        '<img class="art-main" src="' + esc(covers[0].cover) + '" alt="" width="600" height="450">' +
        (covers[1] ? '<img class="art-mini art-mini-1" src="' + esc(covers[1].cover) + '" alt="" width="300" height="200">' : '') +
        (covers[2] ? '<img class="art-mini art-mini-2" src="' + esc(covers[2].cover) + '" alt="" width="300" height="200">' : '') +
        '<span class="art-chip art-chip-1">' + all.length + (all.length === 1 ? ' essay' : ' essays') + '</span>' +
        '<span class="art-chip art-chip-2">5-minute reads</span>';
      bindImgErrors(art);
    } else {
      art.hidden = true;
      art.closest('.blog-home-head').classList.add('no-art');
    }

    if (!latest.length) {
      featEl.innerHTML = '';
      grid.innerHTML = '<p class="inline-empty">New posts are on the way. Please check back soon.</p>';
      return;
    }
    const feature = latest.find((p) => p.featured) || latest[0];
    const rest = latest.filter((p) => p !== feature).slice(0, 2);
    featEl.innerHTML = cardHTML(feature, 0, { feature: true });
    bindImgErrors(featEl);
    grid.hidden = rest.length === 0;
    paintCards(grid, rest);
  }

  /* ---------- BLOG LIST PAGE ---------- */
  function initBlog() {
    const grid = $('#blog-grid'), featureEl = $('#blog-feature');
    const form = $('#blog-form'), input = $('#blog-search'), sortSel = $('#blog-sort');
    const chipsEl = $('#blog-chips'), statusEl = $('#blog-status'), emptyEl = $('#blog-empty');
    const clearBtn = $('#blog-clear'), emptyClear = $('#blog-empty-clear');
    const all = published();
    const state = { q: '', category: 'All', sort: 'newest' };

    const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v); };
    const usedCategories = Array.from(new Set(all.map((p) => p.category)));
    setText('blog-stat-posts', all.length);
    setText('blog-stat-topics', usedCategories.length);
    setText('blog-stat-latest', all.length ? formatDate(sortPosts(all, 'newest')[0].date) : '—');

    const ordered = CATEGORY_NAMES.filter((n) => usedCategories.includes(n)).concat(usedCategories.filter((n) => !CATEGORY_NAMES.includes(n)));
    const counts = {};
    all.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    chipsEl.innerHTML = [{ name: 'All', count: all.length }].concat(ordered.map((n) => ({ name: n, count: counts[n] }))).map((c) =>
      '<button type="button" class="chip" data-category="' + esc(c.name) + '" aria-pressed="false">' +
        esc(c.name) + ' <span class="chip-count">' + c.count + '</span></button>'
    ).join('');

    const isFiltered = () => state.q.trim() !== '' || state.category !== 'All' || state.sort !== 'newest';

    function matches() {
      const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      return sortPosts(all.filter((p) => {
        if (state.category !== 'All' && p.category !== state.category) return false;
        if (!terms.length) return true;
        const hay = [p.title, p.excerpt, p.category, (p.tags || []).join(' '), p.content].join(' ').toLowerCase();
        return terms.every((t) => hay.includes(t));
      }), state.sort);
    }

    function syncURL() {
      try {
        const params = new URLSearchParams();
        if (state.q.trim()) params.set('q', state.q.trim());
        if (state.category !== 'All') params.set('category', state.category);
        if (state.sort !== 'newest') params.set('sort', state.sort);
        const qs = params.toString();
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
      } catch (e) { /* ignore */ }
    }

    function render() {
      let list = matches();
      let feature = null;
      if (!isFiltered() && list.length > 2) {
        feature = list.find((p) => p.featured) || list[0];
        list = list.filter((p) => p !== feature);
      }
      featureEl.innerHTML = feature ? cardHTML(feature, 0, { feature: true }) : '';
      bindImgErrors(featureEl);
      paintCards(grid, list);

      const shown = list.length + (feature ? 1 : 0);
      grid.hidden = list.length === 0;
      emptyEl.hidden = shown > 0;
      let msg = 'Showing ' + shown + ' of ' + all.length + (all.length === 1 ? ' post' : ' posts');
      if (state.category !== 'All') msg += ' in ' + state.category;
      if (state.q.trim()) msg += ' matching “' + state.q.trim() + '”';
      statusEl.textContent = all.length ? msg : '';

      if (!shown) {
        const none = all.length === 0;
        $('#blog-empty-title').textContent = none ? 'No posts published yet' : 'No posts found';
        $('#blog-empty-text').textContent = none
          ? 'Fresh essays are on the way. Please check back soon.'
          : 'Try a different word or choose another category.';
        emptyClear.hidden = none;
      }
      $$('.chip', chipsEl).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.category === state.category)));
      clearBtn.disabled = !isFiltered();
      syncURL();
    }

    function reset() {
      state.q = ''; state.category = 'All'; state.sort = 'newest';
      input.value = ''; sortSel.value = 'newest'; render();
    }

    let timer;
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { state.q = input.value; render(); }, 120); });
    form.addEventListener('submit', (e) => { e.preventDefault(); state.q = input.value; render(); });
    sortSel.addEventListener('change', () => { state.sort = sortSel.value; render(); });
    chipsEl.addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (c) { state.category = c.dataset.category; render(); } });
    clearBtn.addEventListener('click', reset);
    emptyClear.addEventListener('click', () => { reset(); input.focus(); });

    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat && (cat === 'All' || ordered.includes(cat))) state.category = cat;
    if (params.get('sort') === 'oldest') { state.sort = 'oldest'; sortSel.value = 'oldest'; }
    if (params.get('q')) { state.q = params.get('q'); input.value = state.q; }
    render();
  }

  /* ---------- Comments ---------- */
  function readComments() { const o = readJSON(KEY_COMMENTS); return (o && typeof o === 'object' && !Array.isArray(o)) ? o : {}; }
  function writeComments(all) { LS.set(KEY_COMMENTS, JSON.stringify(all)); }

  function initComments(post) {
    const wrap = $('#comments');
    if (!wrap) return;
    const cfg = COMMENTS_CFG || { provider: 'local' };

    if (cfg.provider === 'off') { wrap.remove(); return; }

    /* Shared public comments through Giscus (free, uses GitHub Discussions) */
    const g = cfg.giscus || {};
    if (cfg.provider === 'giscus' && g.repo && g.repoId && g.category && g.categoryId) {
      $('#comments-local').remove();
      $('#comment-count').remove();
      const s = document.createElement('script');
      s.src = 'https://giscus.app/client.js';
      const attrs = {
        'data-repo': g.repo, 'data-repo-id': g.repoId, 'data-category': g.category, 'data-category-id': g.categoryId,
        'data-mapping': 'specific', 'data-term': post.id, 'data-strict': '0', 'data-reactions-enabled': '1',
        'data-emit-metadata': '0', 'data-input-position': 'top', 'data-theme': 'light', 'data-lang': 'en', 'crossorigin': 'anonymous'
      };
      Object.keys(attrs).forEach((k) => s.setAttribute(k, attrs[k]));
      s.async = true;
      $('#comments-giscus').appendChild(s);
      return;
    }
    $('#comments-giscus').remove();

    /* Browser-only comments (this device) */
    const listEl = $('#comment-list'), form = $('#comment-form'), countEl = $('#comment-count');
    const nameEl = $('#c-name'), textEl = $('#c-text'), statusEl = $('#comment-status');
    $('#comment-note').textContent = OWNER
      ? 'Comments are currently saved in this browser only, so other readers cannot see them. To enable shared public comments, set up Giscus (see the README) and switch the comment provider in Blog Studio.'
      : 'Your comment is saved in this browser only.';

    const stored = readComments();
    const mine = () => (stored[post.id] || []);

    function render() {
      const list = mine();
      countEl.textContent = String(list.length);
      if (!list.length) {
        listEl.innerHTML = '<li class="comment-empty">No comments yet. Be the first to share a thought.</li>';
        return;
      }
      listEl.innerHTML = list.slice().reverse().map((c) =>
        '<li class="comment" data-cid="' + esc(c.id) + '">' +
          '<span class="avatar" aria-hidden="true">' + esc((c.name || '?').trim().charAt(0).toUpperCase() || '?') + '</span>' +
          '<div class="comment-body">' +
            '<div class="comment-head"><strong>' + esc(c.name) + '</strong>' +
              '<time datetime="' + esc(new Date(c.ts).toISOString()) + '">' + esc(new Date(c.ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })) + '</time>' +
              '<button type="button" class="comment-del" aria-label="Delete comment by ' + esc(c.name) + '">Delete</button></div>' +
            '<p>' + esc(c.text).replace(/\n/g, '<br>') + '</p>' +
          '</div>' +
        '</li>'
      ).join('');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameEl.value.trim(), text = textEl.value.trim();
      if (!name) { statusEl.textContent = 'Please add your name.'; statusEl.classList.add('is-error'); nameEl.focus(); return; }
      if (!text) { statusEl.textContent = 'Please write a comment.'; statusEl.classList.add('is-error'); textEl.focus(); return; }
      const all = readComments();
      (all[post.id] = all[post.id] || []).push({ id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: name.slice(0, 40), text: text.slice(0, 1000), ts: Date.now() });
      writeComments(all);
      stored[post.id] = all[post.id];
      textEl.value = '';
      statusEl.textContent = 'Comment posted.'; statusEl.classList.remove('is-error');
      render();
    });
    listEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.comment-del');
      if (!btn) return;
      const li = btn.closest('[data-cid]');
      if (!window.confirm('Delete this comment?')) return;
      const all = readComments();
      all[post.id] = (all[post.id] || []).filter((c) => c.id !== li.dataset.cid);
      writeComments(all);
      stored[post.id] = all[post.id];
      statusEl.textContent = 'Comment deleted.'; statusEl.classList.remove('is-error');
      render();
    });
    render();
  }

  /* ---------- ARTICLE PAGE ---------- */
  function initPost() {
    const id = new URLSearchParams(location.search).get('id');
    const pool = OWNER ? SOURCE : published();           /* the owner may also open drafts */
    const post = pool.find((p) => p.id === id);
    const article = $('#article'), missing = $('#post-missing');
    if (!post) {
      missing.hidden = false;
      document.title = 'Post not found | Personal Knowledge Library';
      return;
    }

    document.title = post.title + ' | Personal Knowledge Library';
    const setMeta = (sel, val) => { const el = $(sel); if (el) el.setAttribute('content', val); };
    setMeta('meta[name="description"]', post.excerpt);
    setMeta('meta[property="og:title"]', post.title);
    setMeta('meta[property="og:description"]', post.excerpt);

    $('#post-category').textContent = post.category + (post.draft ? ' · Draft (hidden from visitors)' : '');
    $('#post-title').textContent = post.title;
    $('#post-excerpt').textContent = post.excerpt;
    const time = $('#post-date');
    time.textContent = formatDate(post.date); time.setAttribute('datetime', post.date);
    $('#post-read').textContent = readMinutes(post.content) + ' min read';
    const by = $('#post-author');
    if (showAuthor()) by.textContent = 'By ' + AUTHOR; else by.remove();

    const fig = $('#post-cover');
    if (post.cover) {
      const img = $('img', fig);
      img.src = post.cover;
      img.alt = post.coverAlt || ('Cover illustration for “' + post.title + '”');
      img.addEventListener('error', () => fig.remove(), { once: true });
    } else fig.remove();

    $('#post-body').innerHTML = renderMarkdown(post.content);

    const tags = $('#post-tags');
    tags.innerHTML = (post.tags || []).map((t) => '<a class="tag-btn" href="blog.html?q=' + encodeURIComponent(t) + '">#' + esc(t) + '</a>').join('');
    if (!(post.tags || []).length) tags.remove();

    /* owner actions: edit / delete this post */
    const ownerBox = $('#owner-actions');
    if (OWNER && ownerBox) {
      ownerBox.hidden = false;
      $('#owner-edit').setAttribute('href', 'write.html?edit=' + encodeURIComponent(post.id));
      $('#owner-delete').addEventListener('click', () => {
        if (!window.confirm('Delete “' + post.title + '”?\n\nIt is removed from your working copy now, and from the live site once you download posts.js and replace the old file.')) return;
        const current = readWorking() || clone(BASE_POSTS);
        LS.set(KEY_WORK, JSON.stringify(current.filter((p) => p.id !== post.id)));
        LS.del(KEY_PREVIEW_OFF);
        location.href = 'blog.html';
      });
    } else if (ownerBox) ownerBox.remove();

    initComments(post);

    /* previous / next (by date) */
    const list = sortPosts(published(), 'newest');
    const idx = list.findIndex((p) => p.id === post.id);
    const newer = idx > -1 ? list[idx - 1] : undefined, older = idx > -1 ? list[idx + 1] : list[0];
    const nav = $('#post-nav');
    nav.innerHTML =
      (older ? '<a href="' + postUrl(older) + '"><small>← Older post</small><strong>' + esc(older.title) + '</strong></a>' : '<span></span>') +
      (newer ? '<a class="is-next" href="' + postUrl(newer) + '"><small>Newer post →</small><strong>' + esc(newer.title) + '</strong></a>' : '');
    if (!older && !newer) nav.remove();

    /* related */
    const others = list.filter((p) => p.id !== post.id);
    const related = others.filter((p) => p.category === post.category).concat(others.filter((p) => p.category !== post.category)).slice(0, 3);
    const relSec = $('#related');
    if (related.length) paintCards($('#related-grid'), related); else relSec.remove();

    /* share */
    const status = $('#share-status');
    const copyBtn = $('#share-copy'), nativeBtn = $('#share-native');
    copyBtn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); status.textContent = 'Link copied.'; }
      catch (e) { status.textContent = 'Copy this address from the browser bar.'; }
    });
    if (navigator.share) {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener('click', () => { navigator.share({ title: post.title, text: post.excerpt, url: location.href }).catch(() => {}); });
    }

    /* reading progress */
    const bar = $('#read-progress');
    if (bar && !reduceMotion) {
      const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
    }

    article.hidden = false;
  }

  /* ---------- BLOG STUDIO (write.html) ---------- */
  function initWrite() {
    LS.set(KEY_OWNER, '1');                               /* turns on the owner bar and preview on the blog pages */

    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    let working = readWorking();
    if (!working) working = clone(BASE_POSTS);
    let editingId = null;
    let unsaved = false;
    let coverData = '';                                   /* an uploaded, compressed cover image (data URL) */

    /* settings: author name and comment provider */
    const defaults = { provider: 'local', giscus: { repo: '', repoId: '', category: '', categoryId: '' } };
    let settings = readJSON(KEY_SETTINGS);
    if (!settings) settings = { author: BASE_AUTHOR, comments: clone(BASE_COMMENTS) };
    settings.comments = Object.assign({}, defaults, settings.comments || {});
    settings.comments.giscus = Object.assign({}, defaults.giscus, settings.comments.giscus || {});

    const f = {
      title: $('#f-title'), id: $('#f-id'), category: $('#f-category'), date: $('#f-date'), excerpt: $('#f-excerpt'),
      content: $('#f-content'), cover: $('#f-cover'), coverAlt: $('#f-coveralt'), tags: $('#f-tags'),
      featured: $('#f-featured'), draft: $('#f-draft'), file: $('#f-file'), coverFile: $('#f-coverfile')
    };
    const s = {
      author: $('#f-author'), provider: $('#c-provider'), repo: $('#c-repo'), repoId: $('#c-repoid'),
      category: $('#c-category'), categoryId: $('#c-categoryid'), giscusBox: $('#giscus-fields')
    };
    const statusEl = $('#form-status'), listEl = $('#manage-list'), outEl = $('#file-output');
    const bannerEl = $('#banner'), countEl = $('#manage-count'), previewEl = $('#preview');
    const formHeading = $('#form-heading'), coverBox = $('#cover-preview'), sizeEl = $('#file-size');

    const cats = CATEGORY_NAMES.length ? CATEGORY_NAMES : ['General Knowledge'];
    f.category.innerHTML = cats.map((c) => '<option>' + esc(c) + '</option>').join('');
    $('#cover-list').innerHTML = Array.from(new Set(BASE_POSTS.map((p) => p.cover).filter((c) => c && c.indexOf('data:') !== 0)))
      .map((c) => '<option value="' + esc(c) + '"></option>').join('');

    const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    const slug = (v) => String(v).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
    const setStatus = (msg, bad) => { statusEl.textContent = msg; statusEl.classList.toggle('is-error', !!bad); };

    function persist() {
      LS.set(KEY_WORK, JSON.stringify(working));
      LS.set(KEY_SETTINGS, JSON.stringify(settings));
    }

    /* ----- settings fields ----- */
    function fillSettings() {
      s.author.value = settings.author || '';
      s.provider.value = settings.comments.provider;
      s.repo.value = settings.comments.giscus.repo; s.repoId.value = settings.comments.giscus.repoId;
      s.category.value = settings.comments.giscus.category; s.categoryId.value = settings.comments.giscus.categoryId;
      s.giscusBox.hidden = settings.comments.provider !== 'giscus';
    }
    function readSettingsFields() {
      settings.author = s.author.value.trim();
      settings.comments.provider = s.provider.value;
      settings.comments.giscus = { repo: s.repo.value.trim(), repoId: s.repoId.value.trim(), category: s.category.value.trim(), categoryId: s.categoryId.value.trim() };
      s.giscusBox.hidden = settings.comments.provider !== 'giscus';
    }
    [s.author, s.provider, s.repo, s.repoId, s.category, s.categoryId].forEach((el) => {
      el.addEventListener('input', () => { readSettingsFields(); unsaved = true; refresh(); });
      el.addEventListener('change', () => { readSettingsFields(); unsaved = true; refresh(); });
    });

    /* ----- file generation ----- */
    const q = (v) => JSON.stringify(String(v == null ? '' : v));
    const tpl = (v) => '`' + String(v || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
    const HEADER = [
      '/* Personal Knowledge Library - posts.js (generated by Blog Studio)',
      '   To add, edit or remove posts: open write.html, make your changes, download a new',
      '   posts.js and replace this file. Set draft: true to hide a post without deleting it.',
      '   COMMENTS: provider "local" = saved in each visitor\'s own browser only;',
      '             provider "giscus" = shared public comments (fill in the four giscus values);',
      '             provider "off" = no comments. */',
      ''
    ].join('\n');

    function serialize() {
      const body = working.map((p) =>
        '  {\n' +
        '    id: ' + q(p.id) + ',\n' +
        '    title: ' + q(p.title) + ',\n' +
        '    excerpt: ' + q(p.excerpt) + ',\n' +
        '    category: ' + q(p.category) + ',\n' +
        '    date: ' + q(p.date) + ',\n' +
        '    cover: ' + q(p.cover || '') + ',\n' +
        '    coverAlt: ' + q(p.coverAlt || '') + ',\n' +
        '    tags: [' + (p.tags || []).map(q).join(', ') + '],\n' +
        '    featured: ' + (p.featured ? 'true' : 'false') + ',\n' +
        '    draft: ' + (p.draft ? 'true' : 'false') + ',\n' +
        '    content: ' + tpl(p.content) + '\n' +
        '  }'
      ).join(',\n');
      const g = settings.comments.giscus;
      return HEADER +
        '\nconst BLOG_AUTHOR = ' + q(settings.author || 'Your Name') + ';\n' +
        '\nconst BLOG_COMMENTS = {\n' +
        '  provider: ' + q(settings.comments.provider) + ',\n' +
        '  giscus: { repo: ' + q(g.repo) + ', repoId: ' + q(g.repoId) + ', category: ' + q(g.category) + ', categoryId: ' + q(g.categoryId) + ' }\n' +
        '};\n' +
        '\nconst POSTS = [\n' + body + '\n];\n';
    }

    function renderOutput() {
      const text = serialize();
      outEl.value = text;
      const kb = Math.round(new Blob([text]).size / 1024);
      sizeEl.textContent = 'posts.js size: ' + kb + ' KB' + (kb > 700 ? '. This is getting large; uploaded cover images are embedded in the file, so consider smaller images or paths to files in assets/blog/.' : '.');
      sizeEl.classList.toggle('is-error', kb > 700);
    }

    /* ----- list ----- */
    function renderList() {
      const sorted = sortPosts(working, 'newest');
      countEl.textContent = String(working.length);
      if (!sorted.length) {
        listEl.innerHTML = '<li class="inline-empty">No posts yet. Write your first one below.</li>';
      } else {
        listEl.innerHTML = sorted.map((p) =>
          '<li class="manage-item' + (p.id === editingId ? ' is-editing' : '') + '" data-id="' + esc(p.id) + '">' +
            (p.cover ? '<img class="manage-thumb" src="' + esc(p.cover) + '" alt="" width="84" height="56">' : '<span class="manage-thumb" aria-hidden="true"></span>') +
            '<div class="manage-info">' +
              '<strong>' + esc(p.title) + '</strong>' +
              '<span>' + esc(p.category) + ' · ' + esc(formatDate(p.date)) + '</span>' +
              '<span class="manage-flags">' +
                (p.draft ? '<span class="badge badge-draft">Draft (hidden)</span>' : '<span class="badge">Published</span>') +
                (p.featured ? '<span class="badge">Featured</span>' : '') +
              '</span>' +
            '</div>' +
            '<div class="manage-actions">' +
              '<a class="btn btn-ghost btn-sm" href="post.html?id=' + encodeURIComponent(p.id) + '" aria-label="View ' + esc(p.title) + ' on the blog">View</a>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-act="edit" aria-label="Edit ' + esc(p.title) + '">Edit</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-act="toggle" aria-label="' + (p.draft ? 'Publish ' : 'Hide ') + esc(p.title) + '">' + (p.draft ? 'Publish' : 'Hide') + '</button>' +
              '<button type="button" class="btn btn-ghost btn-sm btn-danger" data-act="remove" aria-label="Remove ' + esc(p.title) + '">Remove</button>' +
            '</div>' +
          '</li>'
        ).join('');
        $$('img.manage-thumb', listEl).forEach((img) => img.addEventListener('error', () => { img.style.visibility = 'hidden'; }, { once: true }));
      }
      bannerEl.hidden = HAS_POSTS && same(working, POSTS);
    }

    function renderPreview() {
      const t = f.title.value.trim();
      const html = (t ? '<h2>' + esc(t) + '</h2>' : '') + renderMarkdown(f.content.value);
      previewEl.innerHTML = html || '<p class="inline-empty">Your formatted post appears here as you type.</p>';
    }

    function refresh() { LS.del(KEY_PREVIEW_OFF); renderList(); renderOutput(); persist(); }

    /* ----- cover image upload ----- */
    function renderCoverPreview() {
      const src = coverData || f.cover.value.trim();
      if (!src) { coverBox.hidden = true; coverBox.innerHTML = ''; return; }
      coverBox.hidden = false;
      coverBox.innerHTML = '<img src="' + esc(src) + '" alt="Preview of the chosen cover image" width="120" height="80">' +
        '<div><strong>' + (coverData ? 'Uploaded image (' + Math.round(coverData.length * 0.75 / 1024) + ' KB, embedded in posts.js)' : 'Image from your assets folder') + '</strong>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="cover-remove">Remove cover</button></div>';
      const img = $('img', coverBox);
      img.addEventListener('error', () => { img.style.visibility = 'hidden'; }, { once: true });
    }
    coverBox.addEventListener('click', (e) => {
      if (!e.target.closest('#cover-remove')) return;
      coverData = ''; f.cover.value = ''; f.coverFile.value = ''; renderCoverPreview();
    });
    f.cover.addEventListener('input', () => { if (f.cover.value.trim()) coverData = ''; renderCoverPreview(); });

    function imageToDataURL(file) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          const max = 1200, scale = Math.min(1, max / img.width);
          const w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That file could not be read as an image.')); };
        img.src = url;
      });
    }
    f.coverFile.addEventListener('change', async () => {
      const file = f.coverFile.files && f.coverFile.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type)) return setStatus('Please choose an image file (JPG, PNG, WebP or SVG).', true);
      if (file.size > 12 * 1024 * 1024) return setStatus('That image is over 12 MB. Please choose a smaller one.', true);
      try {
        coverData = await imageToDataURL(file);
        f.cover.value = '';
        renderCoverPreview();
        setStatus('Cover image added and compressed. Remember to describe it in the cover description field.');
      } catch (err) { setStatus(err.message, true); }
    });

    /* ----- write-up file import (.md / .txt) ----- */
    f.file.addEventListener('change', async () => {
      const file = f.file.files && f.file.files[0];
      if (!file) return;
      if (file.size > 1024 * 1024) return setStatus('That file is over 1 MB. Please choose a smaller text file.', true);
      if (!/\.(md|markdown|txt)$/i.test(file.name) && !/^text\//.test(file.type)) {
        return setStatus('Please choose a .md or .txt file. For a Word document, copy the text and paste it into the box below.', true);
      }
      let text = '';
      try { text = await file.text(); } catch (err) { return setStatus('That file could not be read.', true); }
      let body = text.replace(/\r\n?/g, '\n').replace(/^﻿/, '').trim();
      const h1 = /^#\s+(.+)\n+/.exec(body);
      if (h1) { if (!f.title.value.trim()) f.title.value = h1[1].trim(); body = body.slice(h1[0].length).trim(); }
      else if (!f.title.value.trim()) f.title.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
      f.content.value = body;
      if (!f.excerpt.value.trim()) {
        const firstPara = (body.split(/\n\s*\n/).find((b) => b.trim() && !/^#{1,6}\s/.test(b.trim())) || '').replace(/[#*_`>\[\]()-]/g, '').replace(/\s+/g, ' ').trim();
        f.excerpt.value = firstPara.length > 200 ? firstPara.slice(0, 197).replace(/\s+\S*$/, '') + '…' : firstPara;
      }
      if (!editingId && !f.id.dataset.touched) f.id.value = slug(f.title.value);
      renderPreview();
      setStatus('Write-up loaded from “' + file.name + '”. Check the title, excerpt and category, then click Add post.');
      f.file.value = '';
    });

    /* ----- form ----- */
    function fillForm(p) {
      coverData = (p.cover && p.cover.indexOf('data:') === 0) ? p.cover : '';
      f.title.value = p.title || ''; f.id.value = p.id || ''; f.category.value = p.category || cats[0];
      f.date.value = p.date || today(); f.excerpt.value = p.excerpt || ''; f.content.value = p.content || '';
      f.cover.value = coverData ? '' : (p.cover || ''); f.coverAlt.value = p.coverAlt || ''; f.tags.value = (p.tags || []).join(', ');
      f.featured.checked = !!p.featured; f.draft.checked = !!p.draft;
      f.id.readOnly = !!editingId; delete f.id.dataset.touched;
      formHeading.textContent = editingId ? 'Edit post' : 'Write a new post';
      $('#btn-save').textContent = editingId ? 'Save changes' : 'Add post';
      renderCoverPreview(); renderPreview();
    }
    function newPost() { editingId = null; fillForm({ date: today(), category: cats[0] }); renderList(); setStatus(''); f.title.focus(); }

    $('#post-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = f.title.value.trim(), excerpt = f.excerpt.value.trim(), content = f.content.value.trim();
      if (!title) return setStatus('Please add a title.', true);
      if (!excerpt) return setStatus('Please add a short excerpt.', true);
      if (!content) return setStatus('Please write the post content, or upload a write-up file.', true);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date.value)) return setStatus('Please choose a date.', true);

      let id = editingId || slug(f.id.value || title);
      if (!id) return setStatus('The post ID needs letters or numbers.', true);
      if (!editingId) { let n = 2; const base = id; while (working.some((p) => p.id === id)) id = base + '-' + n++; }

      const post = {
        id, title, excerpt, category: f.category.value, date: f.date.value,
        cover: coverData || f.cover.value.trim(), coverAlt: f.coverAlt.value.trim(),
        tags: f.tags.value.split(',').map((t) => t.trim()).filter(Boolean),
        featured: f.featured.checked, draft: f.draft.checked, content
      };
      const at = working.findIndex((p) => p.id === editingId);
      if (editingId && at > -1) working[at] = post; else working.unshift(post);
      editingId = id; f.id.value = id; f.id.readOnly = true;
      formHeading.textContent = 'Edit post'; $('#btn-save').textContent = 'Save changes';
      unsaved = true; refresh();
      setStatus('Saved. It now appears on your blog as a private preview. Download posts.js to make it public.');
    });

    listEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]'); if (!btn) return;
      const li = btn.closest('[data-id]'); const post = working.find((p) => p.id === li.dataset.id); if (!post) return;
      if (btn.dataset.act === 'edit') {
        editingId = post.id; fillForm(post); renderList(); setStatus('Editing “' + post.title + '”.');
        $('#post-form').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); f.title.focus({ preventScroll: true });
      } else if (btn.dataset.act === 'toggle') {
        post.draft = !post.draft; unsaved = true; refresh();
        setStatus('“' + post.title + '” is now ' + (post.draft ? 'hidden (draft).' : 'published.') + ' Download posts.js to apply it for visitors.');
      } else if (btn.dataset.act === 'remove') {
        if (!window.confirm('Remove “' + post.title + '” from your working copy?\n\nIt is only removed from the live site after you download posts.js and replace the old file.')) return;
        working = working.filter((p) => p.id !== post.id);
        if (editingId === post.id) { editingId = null; fillForm({ date: today(), category: cats[0] }); }
        unsaved = true; refresh(); setStatus('Post removed from your working copy. Download posts.js to apply it for visitors.');
      }
    });

    $('#btn-new').addEventListener('click', newPost);
    f.title.addEventListener('input', () => { if (!editingId && !f.id.dataset.touched) f.id.value = slug(f.title.value); renderPreview(); });
    f.id.addEventListener('input', () => { f.id.dataset.touched = '1'; });
    f.content.addEventListener('input', renderPreview);

    $('#btn-download').addEventListener('click', () => {
      const blob = new Blob([serialize()], { type: 'text/javascript;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'posts.js';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      unsaved = false; setStatus('posts.js downloaded. Replace the file in your project folder, then redeploy.');
    });
    $('#btn-copy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(serialize()); setStatus('posts.js copied to the clipboard.'); unsaved = false; }
      catch (e) { outEl.focus(); outEl.select(); setStatus('Press Ctrl+C (or Cmd+C) to copy the selected text.'); }
    });
    $('#btn-preview').addEventListener('click', () => { persist(); LS.del(KEY_PREVIEW_OFF); location.href = 'blog.html'; });
    $('#btn-discard').addEventListener('click', () => {
      if (!window.confirm('Discard your working copy and go back to the posts currently in posts.js?')) return;
      working = clone(BASE_POSTS); unsaved = false; editingId = null;
      settings = { author: BASE_AUTHOR, comments: clone(BASE_COMMENTS) };
      settings.comments = Object.assign({}, defaults, settings.comments); settings.comments.giscus = Object.assign({}, defaults.giscus, settings.comments.giscus || {});
      fillSettings(); fillForm({ date: today(), category: cats[0] }); refresh(); setStatus('Working copy reset to the published posts.');
    });

    window.addEventListener('beforeunload', (e) => { if (unsaved) { e.preventDefault(); e.returnValue = ''; } });

    fillSettings();
    fillForm({ date: today(), category: cats[0] });
    refresh();

    /* write.html?edit=post-id opens that post for editing (used by the Edit button on post pages) */
    const wanted = new URLSearchParams(location.search).get('edit');
    const target = wanted && working.find((p) => p.id === wanted);
    if (target) { editingId = target.id; fillForm(target); renderList(); setStatus('Editing “' + target.title + '”.'); }
  }

  /* ---------- Start ---------- */
  function init() {
    const page = document.body.dataset.page;
    if (page === 'home' || page === 'blog' || page === 'post') initOwnerBar();
    if (page === 'home') initHomePreview();
    if (page === 'blog') initBlog();
    if (page === 'post') initPost();
    if (page === 'write') initWrite();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();