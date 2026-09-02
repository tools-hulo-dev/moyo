(function () {

  // =============================================
  // 1. LARGE LOGO
  // =============================================
  document.addEventListener("DOMContentLoaded", function () {

    if (window.frameElement) return;

    const trigger = document.querySelector(".logo-lr");
    if (!trigger) return;

    const logoLinks = document.querySelectorAll(".header-title-logo a");
    if (!logoLinks.length) return;

    const logoSrc = "https://static1.squarespace.com/static/69e89163ac986f58254eb5b2/t/6a85527d44657959e4343362/1787122301347/b-logo.png";

    logoLinks.forEach((logoLink) => {

      if (logoLink.querySelector(".large-logo")) return;

      const img = document.createElement("img");

      img.className = "large-logo";
      img.src = logoSrc;
      img.alt = "Logo";

      logoLink.appendChild(img);

    });

  });

  // =============================================
  // 2. SERVICES SWITCHER
  // =============================================
  document.addEventListener("DOMContentLoaded", () => {
    const e = !0, t = "hover", n = !0, r = !1, a = !1,
          o = document.querySelector("#services-switcher");
    if (!o) return;

    const l = o.querySelectorAll(".list-item"),
          i = o.querySelector(".list-section-title p")?.textContent.trim() || "";
    let s = "", c = "", d = "";

    l.forEach((o, l) => {
      const u = l + 1,
            m = o.querySelector(".list-item-content__title")?.innerText || "",
            p = o.querySelector(".list-item-content__description")?.innerHTML || "",
            h = o.querySelector(".list-item-content__button-container a")?.getAttribute("href") || "#",
            w = o.querySelector(".list-item-content__button")?.getAttribute("href")?.trim() || "",
            g = o.querySelector(".list-item-media-inner img"),
            f = g?.dataset.src || g?.getAttribute("src") || "";

      a && f && (s += `<img src="${f}" data-num="${u}" alt="">`);

      const x = `<h2 data-num="${u}" tabindex="0" role="button" aria-selected="${1 === u}">${w ? `<a href="${w}">${m}</a>` : m}</h2>`;
      c += x;
      e && (d += `<div class="desc" data-num="${u}">${p}${r ? `<br><div class="split-buttons"><a class="btn dark tert" href="${h}"><span class="def-content">Explore</span><span class="copy-content" aria-hidden="true">Explore</span><div class="arrow-btn"><span class="arrow-sec"></span></div></a></div>` : ""}</div>`);
    });

    const u = `<div class="switcher-services">${a ? `<div class="left-part">${s}</div>` : ""}<div class="right-part">${n ? `<div class="top-title"><div class="featured-tech">${i}</div><div class="circle" data-num="1"></div></div>` : ""}<div class="titles-wrapper">${c}</div>${e ? `<div class="content-services-wrapper">${d}</div>` : ""}</div></div>`;
    o.insertAdjacentHTML("beforeend", u);

    const m = o.querySelector(".switcher-services");
    a || m.classList.add("one-column-switcher");

    const p = [...m.querySelectorAll(".titles-wrapper h2[data-num]")],
          h = m.querySelector(".circle"),
          g = a ? [...m.querySelectorAll(".left-part img")] : [],
          f = m.querySelector(".content-services-wrapper"),
          y = f ? [...f.querySelectorAll(".desc")] : [];

    let v = "1";
    p[0]?.classList.add("active-tab");
    h?.setAttribute("data-num", v);

    a && (
      gsap.set(g, { autoAlpha: 0, scale: 1.02 }),
      gsap.set(m.querySelector(`img[data-num="${v}"]`), { autoAlpha: 1, scale: 1 })
    );

    f && (
      gsap.set(y, { autoAlpha: 0, y: 0 }),
      gsap.set(m.querySelector(`.desc[data-num="${v}"]`), { autoAlpha: 1 }),
      m.querySelector(`.desc[data-num="${v}"]`)?.classList.add("active-tab")
    );

    m.dataset.active = "";

    function b(e) {
      if (e === m.dataset.active) return;
      const t = m.dataset.active;
      m.dataset.active = e;

      p.forEach(t => {
        t.classList.toggle("active-tab", t.dataset.num === e);
        t.setAttribute("aria-selected", t.dataset.num === e);
      });

      h?.setAttribute("data-num", e);

      a && (() => {
        const n = m.querySelector(`img[data-num="${t}"]`),
              r = m.querySelector(`img[data-num="${e}"]`);
        gsap.killTweensOf([n, r]);
        gsap.timeline({ defaults: { overwrite: "auto" } })
          .set(n, { zIndex: 1 })
          .set(r, { zIndex: 2, autoAlpha: 1 })
          .fromTo(r, { scale: .2 }, { scale: 1, duration: .65, ease: "power3.out" }, 0)
          .to(n, { autoAlpha: 0, duration: .2 }, ">");
      })();

      f && (() => {
        const t = m.querySelector(`.desc[data-num="${e}"]`);
        y.forEach(e => e.classList.remove("active-tab"));
        t?.classList.add("active-tab");
        gsap.set(y, { autoAlpha: 0 });
        gsap.set(t, { autoAlpha: 1 });
        const n = Array.from(t.children).filter(e => !e.classList.contains("split-buttons")),
              aBtn = t.querySelector(".split-buttons");
        gsap.fromTo(n, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .7, stagger: .06 });
        r && aBtn && gsap.fromTo(aBtn, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.1 });
      })();
    }

    const k = ".switcher-services .titles-wrapper h2";

    /* hover fade logic */
    m.addEventListener("mouseover", e => {
      const t = e.target.closest(k);
      if (!t) return;
      m.classList.add("is-titles-hover");
      p.forEach(e => e.classList.toggle("is-hovered", e === t));
    });

    // Reset the "already active" guard every time the mouse re-enters the
    // whole widget, so hovering tab 1 right after re-entering always runs
    // the full switch — this is what kept breaking after the first time.
    m.addEventListener("mouseenter", () => {
      m.dataset.active = "";
    });

    m.addEventListener("mouseleave", () => {
      m.classList.remove("is-titles-hover");
      p.forEach(e => {
        e.classList.remove("is-hovered");
      });
      // dataset.active / active-tab intentionally left alone here —
      // the mouseenter handler above takes care of the reset instead.

      if (f) {
        gsap.to(y, { autoAlpha: 0, duration: 0.25, overwrite: "auto" });
      }
    });

    /* existing trigger logic */
    "hover" === t
      ? (
          m.addEventListener("mousemove", e => {
            const t = e.target.closest(k);
            t && setTimeout(() => b(t.dataset.num), 80);
          }),
          document.addEventListener("click", e => {
            const t = e.target.closest(k);
            t && b(t.dataset.num);
          })
        )
      : (
          document.addEventListener("click", e => {
            const t = e.target.closest(k);
            t && b(t.dataset.num);
          }),
          m.addEventListener("keydown", e => {
            const t = e.target.closest(k);
            t && ("Enter" === e.key || " " === e.key) && (e.preventDefault(), b(t.dataset.num));
          })
        );
  });

  // =============================================
  // 3. SWIPER SLIDERS
  // =============================================
  (function () {
    const SLIDERS = [
      "#ub-slider",
      "#ub-slider-or",
      "#services-slider-ub"
    ];

    const MAX_TRIES = 40;
    const INTERVAL = 250;

    function buildSwiper(container, root) {
      if (container.classList.contains("ub-swiper-ready")) return;
      container.classList.add("ub-swiper-ready");

      /* Move description inside media */
      container.querySelectorAll(".list-item").forEach(item => {
        const desc = item.querySelector(".list-item-content__description");
        const media = item.querySelector(".list-item-media");
        if (desc && media) media.appendChild(desc);
      });

      /* Prepare Swiper structure */
      container.classList.add("swiper");
      container.querySelectorAll(".list-item").forEach(item =>
        item.classList.add("swiper-slide")
      );

      if (!container.querySelector(":scope > .swiper-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "swiper-wrapper";

        Array.from(container.children)
          .filter(el => el.classList.contains("list-item"))
          .forEach(el => wrapper.appendChild(el));

        container.prepend(wrapper);
      }

      /* Controls – different placement */
      if (!root.querySelector(".swiper-controls")) {
        const controls = document.createElement("div");
        controls.className = "swiper-controls";

        controls.innerHTML = `
          <div class="swiper-button-prev"></div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-next"></div>
        `;

        if (root.id === "services-slider-ub") {
          container.insertAdjacentElement("afterend", controls);
        } else {
          const wrapper = container.querySelector(":scope > .swiper-wrapper");
          if (wrapper) wrapper.insertAdjacentElement("afterend", controls);
        }
      }
    }

    function initSlider(root) {
      if (!root) return;

      const container = root.querySelector(".user-items-list-item-container");
      if (!container) return;

      buildSwiper(container, root);
      if (container.swiper) return;

      const isOr = root.id === "ub-slider-or";
      const isServicesOr = root.id === "services-slider-ub";

      const controls = root.querySelector(".swiper-controls");

      new Swiper(container, {
        speed: 600,
        loop: !isOr && !isServicesOr,
        slidesPerView: 2,
        spaceBetween: 20,

        navigation: {
          nextEl: controls?.querySelector(".swiper-button-next"),
          prevEl: controls?.querySelector(".swiper-button-prev")
        },

        pagination: {
          el: controls?.querySelector(".swiper-pagination"),
          type: "progressbar"
        },

        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 16
          },
          900: {
            slidesPerView: isServicesOr
              ? 2
              : isOr
              ? 3
              : 2.5,
            spaceBetween: isServicesOr
              ? 140
              : isOr
              ? 140
              : 24
          }
        }
      });
    }

    function tryInit(count = 0) {
      if (typeof window.Swiper !== "function") {
        if (count < MAX_TRIES) {
          setTimeout(() => tryInit(count + 1), INTERVAL);
        }
        return;
      }

      SLIDERS.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) initSlider(el);
      });
    }

    document.addEventListener("DOMContentLoaded", () => tryInit());
    window.addEventListener("popstate", () => setTimeout(() => tryInit(), 100));
    document.addEventListener("click", () => setTimeout(() => tryInit(), 100));
  })();

  // =============================================
  // 4. WRAP / SPLIT SECTIONS
  // =============================================
  document.addEventListener("DOMContentLoaded", () => {
    let splitIndex = 0;

    document.querySelectorAll(".wrap-sections").forEach(trigger => {
      const count = parseInt(trigger.getAttribute("data-split-count"), 10);
      if (!count || count < 1) return;

      const firstSection = trigger.closest(".page-section");
      if (!firstSection) return;

      splitIndex++;

      const wrapper = document.createElement("div");
      wrapper.className = "splitted-sections";
      wrapper.id = `splitted-sections-${splitIndex}`;

      // 🔹 Move section border if exists
      const border = firstSection.querySelector(".section-border");
      if (border) {
        wrapper.appendChild(border);
      }

      firstSection.parentNode.insertBefore(wrapper, firstSection);

      let current = firstSection;
      let i = 0;

      while (current && i <= count) {
        const next = current.nextElementSibling;
        if (current.classList.contains("page-section")) {
          wrapper.appendChild(current);
          i++;
        }
        current = next;
      }
    });
  });

  // =============================================
  // 5. CUSTOM MENU (MEGA MENU)
  // =============================================
  document.addEventListener("DOMContentLoaded", async () => {
    const menuDM = document.querySelector(".menu-dm");
    if (!menuDM) return;

    document.body.classList.add("custom-menu-opening");
    const header = document.querySelector("#header");
    const headerNavWrapper = document.querySelector(
      "#header .header-display-desktop .header-title-nav-wrapper"
    );

    const navWrapper = document.querySelector(
      ".header-display-desktop .header-nav-wrapper"
    );
    if (!navWrapper) return;

    /* ----------------------------------
       Add Menu Button
    ---------------------------------- */
    let menuBtn = navWrapper.querySelector(".menu-open");
    if (!menuBtn) {
      menuBtn = document.createElement("a");
      menuBtn.className = "menu-open";
      menuBtn.href = "javascript:void(0)";
      menuBtn.textContent = "Menu";
      navWrapper.appendChild(menuBtn);
    }

    let isOpen = false;

    /* ----------------------------------
       Preload menu content AFTER page load
    ---------------------------------- */
    try {
      const res = await fetch("/menu-page");
      const html = await res.text();

      const doc = new DOMParser().parseFromString(html, "text/html");
      //const sections = doc.querySelectorAll("#sections > .page-section");
      const sections = doc.querySelectorAll(
        "#page-regions > .region > .page-section"
      );

      if (sections.length) {
        sections.forEach(section => {
          menuDM.appendChild(section.cloneNode(true));
        });

        initCustomNav(menuDM);
        applyMenuPadding(); // initial padding
      }
    } catch (err) {
      console.error("Menu preload failed:", err);
    }

    /* ----------------------------------
       Toggle menu open / close
    ---------------------------------- */
    menuBtn.addEventListener("click", () => {
      isOpen = !isOpen;

      menuDM.classList.toggle("open", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
      header?.classList.toggle("open-mega-menu", isOpen);

      if (isOpen) applyMenuPadding();
    });

    /* ----------------------------------
       Close menu when clicking a link
    ---------------------------------- */
    menuDM.addEventListener("click", e => {
      if (e.target.closest("a")) {
        isOpen = false;
        menuDM.classList.remove("open");
        document.body.classList.remove("menu-open");
        header?.classList.remove("open-mega-menu");
      }
    });

    /* ----------------------------------
       Recalculate padding on resize
    ---------------------------------- */
    window.addEventListener("resize", () => {
      if (isOpen) applyMenuPadding();
    });

    /* ----------------------------------
       Set menu padding based on header height
    ---------------------------------- */
    function applyMenuPadding() {
      if (!headerNavWrapper) return;

      const height = headerNavWrapper.offsetHeight;
      const contentWrapper = menuDM.querySelector(".content-wrapper");

      if (contentWrapper) {
        contentWrapper.style.paddingTop = `${height}px`;
      }
    }

    /* ----------------------------------
       Clone nav + hover opacity logic
    ---------------------------------- */
    function initCustomNav(scope) {
      const customNav = scope.querySelector(".custom-nav");
      if (!customNav) return;

      const navList = document.querySelector(
        ".header-display-desktop .header-nav-list"
      );
      if (!navList) return;

      if (!customNav.querySelector(".header-nav-list")) {
        const navClone = navList.cloneNode(true);
        customNav.appendChild(navClone);
      }

      const items = customNav.querySelectorAll(".header-nav-item");
      if (!items.length) return;

      items.forEach(item => {
        item.addEventListener("mouseenter", () => {
          items.forEach(i => {
            i.style.opacity = i === item ? "1" : "0.3";
          });
        });

        item.addEventListener("mouseleave", () => {
          items.forEach(i => {
            i.style.opacity = "1";
          });
        });
      });
    }
  });

  // =============================================
  // 6. HEADER SHRINK — NAV ITEMS VISIBILITY
  // =============================================
  document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("#header");
    const items = document.querySelectorAll(
      "#header .header-display-desktop .header-nav-list > *:not(:last-child)"
    );
    if (!header || !items.length) return;

    const DELAY = 600;
    let t = null;
    let last = header.classList.contains("shrink");

    const showItems = () => items.forEach(el => el.classList.add("is-visible"));
    const hideItems = () => items.forEach(el => el.classList.remove("is-visible"));

    const applyShrink = () => {
      showItems();
      clearTimeout(t);
      t = setTimeout(() => {
        if (header.classList.contains("shrink")) header.style.overflow = "hidden";
      }, DELAY);
    };

    const removeShrink = () => {
      hideItems();
      clearTimeout(t);
      t = null;
      header.style.removeProperty("overflow");
      header.style.overflow = "visible";
    };

    const sync = () => {
      const now = header.classList.contains("shrink");
      if (now === last) return;
      last = now;
      now ? applyShrink() : removeShrink();
    };

    last ? applyShrink() : removeShrink();

    new MutationObserver(sync).observe(header, {
      attributes: true,
      attributeFilter: ["class"]
    });
  });

  // =============================================

   // 7. PORTFOLIO PAGE (hover + video + HLS + mobile 2-tap)
  // =============================================
  (function () {
    const isEditor = window !== window.parent;
    if (isEditor) return;

    const wrapper = document.querySelector('.portfolio-cust-wrapper');
    if (!wrapper) return;

    const titlesWrap = wrapper.querySelector('.portfolio-cust-titles');
    const linksWrap  = wrapper.querySelector('.portfolio-cust-links');
    if (!titlesWrap || !linksWrap) return;

    const header = document.querySelector('.header');
    if (header) {
      const h = header.getBoundingClientRect().height;
      titlesWrap.style.paddingTop = h + 'px';
    }

    const section = wrapper.closest('section');
    const sectionBg = section ? section.querySelector('.section-background') : null;
    if (!sectionBg) return;

    const PORTFOLIO_PATH = '/portfolio-1';
    const MAX_PAGES = 20;

    const pageCache = new Map();

    function absUrl(u) {
      if (!u) return '';
      if (/^https?:\/\//i.test(u)) return u;
      if (u.startsWith('//')) return location.protocol + u;
      if (u.startsWith('/')) return location.origin + u;
      return u;
    }

    function isDirectVideo(url) {
      return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || '');
    }

    function isYouTube(url) {
      return /youtu\.be|youtube\.com/i.test(url || '');
    }

    function isVimeo(url) {
      return /vimeo\.com/i.test(url || '');
    }

    function youtubeEmbed(url) {
      const u = url || '';
      const yt1 = u.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/i);
      const yt2 = u.match(/[?&]v=([A-Za-z0-9_-]{6,})/i);
      const yt3 = u.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i);
      const vid = (yt3 && yt3[1]) || (yt2 && yt2[1]) || (yt1 && yt1[1]) || '';
      if (!vid) return '';
      return `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${vid}&rel=0&modestbranding=1&fs=0&iv_load_policy=3&disablekb=1`;
    }

    function vimeoEmbed(url) {
      const m = (url || '').match(/vimeo\.com\/(\d+)/i);
      const id = m ? m[1] : '';
      if (!id) return '';
      return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&background=1&loop=1`;
    }

    function normalizeCategory(str) {
      return (str || '')
        .toLowerCase()
        .trim()
        .replace(/^category:\s*/i, '')
        .replace(/&/g, 'and')
        .replace(/\s+/g, '-');
    }

    function parseCategoriesFromText(text) {
      if (!text) return [];

      const cleaned = text.replace(/^category:\s*/i, '').trim();
      if (!cleaned) return [];

      return cleaned
        .split(',')
        .map(item => normalizeCategory(item))
        .filter(Boolean);
    }

    function getCategoryFromUrl() {
      try {
        const params = new URLSearchParams(window.location.search);
        return normalizeCategory(params.get('category') || '');
      } catch (e) {
        return '';
      }
    }

    function pickFirstMeaningfulText(root) {
      if (!root) return '';

      const candidates = root.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');

      for (const el of candidates) {
        if (el.closest('style, script')) continue;

        const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (t) return t;
      }

      return '';
    }

    function tryParseBlockJson(blockEl) {
      if (!blockEl) return null;
      const raw = blockEl.getAttribute('data-block-json');
      if (!raw) return null;
      try { return JSON.parse(raw); } catch (e) { return null; }
    }

    function resolvePosterFrom(sectionEl) {
      if (!sectionEl) return '';
      const posterEl = sectionEl.querySelector('[data-poster]') || sectionEl.querySelector('.plyr__poster');
      if (!posterEl) return '';

      const dp = posterEl.getAttribute('data-poster');
      if (dp) return absUrl(dp);

      if (posterEl.classList.contains('plyr__poster')) {
        const bg = posterEl.getAttribute('style') || '';
        const m = bg.match(/url\(["']?([^"')]+)["']?\)/i);
        if (m) return absUrl(m[1]);
      }
      return '';
    }

    function resolveSqspHostedHlsFrom(sectionEl) {
      if (!sectionEl) return null;

      const native = sectionEl.querySelector('.sqs-native-video') || sectionEl.querySelector('[data-config-video]');
      if (!native) return null;

      const raw = native.getAttribute('data-config-video');
      if (!raw) return null;

      let cfg = null;
      try { cfg = JSON.parse(raw); } catch (e) { return null; }

      const alex = cfg?.structuredContent?.alexandriaUrl || cfg?.alexandriaUrl || '';
      if (!alex || !alex.includes('{variant}')) return null;

      const hlsUrl = absUrl(alex.replace('{variant}', 'playlist.m3u8'));
      const posterUrl = resolvePosterFrom(sectionEl);

      return { hlsUrl, posterUrl };
    }

    function resolveExternalVideoFrom(sectionEl) {
      if (!sectionEl) return '';

      const iframe = sectionEl.querySelector('.sqs-block-video iframe, iframe[src*="youtube"], iframe[src*="vimeo"]');
      const src = iframe ? (iframe.getAttribute('src') || '') : '';
      if (src) return absUrl(src);

      const block = sectionEl.querySelector('.sqs-block-video, .video-block, .sqs-block.sqs-block-video');
      const bj = tryParseBlockJson(block);
      const url = bj && bj.url ? bj.url : '';
      if (url) return absUrl(url);

      return '';
    }

    async function resolvePortfolioSourceFromItemPage(fullUrl) {
      if (!fullUrl) return { linkText: 'View Item', video: null, categories: [] };

      if (pageCache.has(fullUrl)) return pageCache.get(fullUrl);

      const abs = absUrl(fullUrl);

      let html = '';
      try {
        const res = await fetch(abs, { credentials: 'same-origin' });
        if (!res.ok) {
          const out = { linkText: 'View Item', video: null, categories: [] };
          pageCache.set(fullUrl, out);
          return out;
        }
        html = await res.text();
      } catch (e) {
        const out = { linkText: 'View Item', video: null, categories: [] };
        pageCache.set(fullUrl, out);
        return out;
      }

      const doc = new DOMParser().parseFromString(html, 'text/html');
      const sourceSection = doc.querySelector('#portfolio-source');

      let linkText = 'View Item';
      let categories = [];

      if (sourceSection) {
        const htmlBlock = sourceSection.querySelector('.html-block');
        const txt = pickFirstMeaningfulText(htmlBlock);
        if (txt) linkText = txt;

        const markdownBlocks = sourceSection.querySelectorAll('.markdown-block');
        markdownBlocks.forEach(block => {
          const txt = pickFirstMeaningfulText(block);
          if (/^category:/i.test(txt || '')) {
            categories = parseCategoriesFromText(txt);
          }
        });
      }

      let video = null;
      if (sourceSection) {
        const hls = resolveSqspHostedHlsFrom(sourceSection);
        if (hls && hls.hlsUrl) {
          video = { type: 'hls', hlsUrl: hls.hlsUrl, posterUrl: hls.posterUrl || '' };
        } else {
          const ext = resolveExternalVideoFrom(sourceSection);
          if (ext) video = { type: 'external', url: ext };
        }
      }

      const out = { linkText, video, categories };
      pageCache.set(fullUrl, out);
      return out;
    }

    let activeHls = null;
    let activeReq = 0;

    function stopActiveMedia(bgsWrap) {
      bgsWrap.querySelectorAll('video.portfolio-cust-video').forEach(v => {
        try { v.pause(); } catch (e) {}
      });

      bgsWrap.querySelectorAll('iframe.portfolio-cust-iframe').forEach(fr => {
        if (fr.getAttribute('src')) fr.removeAttribute('src');
      });

      if (activeHls && activeHls.hls) {
        try { activeHls.hls.destroy(); } catch (e) {}
      }
      activeHls = null;
    }

    async function ensureBgMedia(bgItem, titleText) {
      if (!bgItem) return;

      if (bgItem.querySelector('iframe.portfolio-cust-iframe, video.portfolio-cust-video')) return;

      const videoType = (bgItem.dataset.videoType || '').trim();
      if (!videoType) return;

      if (videoType === 'external') {
        const raw = (bgItem.dataset.videoUrl || '').trim();
        if (!raw) return;

        let src = '';

        if (isYouTube(raw)) {
          src = youtubeEmbed(raw) || raw;
        } else if (isVimeo(raw)) {
          src = vimeoEmbed(raw) || raw;
        } else if (isDirectVideo(raw)) {
          bgItem.innerHTML = '';
          const v = document.createElement('video');
          v.className = 'portfolio-cust-video';
          v.muted = true;
          v.loop = true;
          v.playsInline = true;
          v.preload = 'metadata';
          v.setAttribute('data-src', raw);
          bgItem.appendChild(v);
          return;
        } else {
          src = raw;
        }

        if (src) {
          bgItem.innerHTML = '';
          const iframe = document.createElement('iframe');
          iframe.className = 'portfolio-cust-iframe';
          iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
          iframe.loading = 'lazy';
          iframe.setAttribute('data-src', src);
          iframe.setAttribute('tabindex', '-1');
          iframe.setAttribute('title', titleText || '');
          bgItem.appendChild(iframe);
        }
        return;
      }

      if (videoType === 'hls') {
        const hlsUrl = (bgItem.dataset.hlsUrl || '').trim();
        if (!hlsUrl) return;

        bgItem.innerHTML = '';
        const v = document.createElement('video');
        v.className = 'portfolio-cust-video';
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.autoplay = false;
        v.preload = 'metadata';

        const poster = (bgItem.dataset.posterUrl || '').trim();
        if (poster) v.poster = poster;

        v.setAttribute('data-hls', hlsUrl);
        bgItem.appendChild(v);
        return;
      }
    }

    async function playActiveMedia(bgItem) {
      if (!bgItem) return;

      const iframe = bgItem.querySelector('iframe.portfolio-cust-iframe');
      if (iframe) {
        const ds = iframe.getAttribute('data-src') || '';
        if (ds && !iframe.getAttribute('src')) iframe.setAttribute('src', ds);
        return;
      }

      const v = bgItem.querySelector('video.portfolio-cust-video');
      if (!v) return;

      const ds = v.getAttribute('data-src');
      if (ds && !v.getAttribute('src')) v.setAttribute('src', ds);

      const hlsUrl = v.getAttribute('data-hls');

      /*if (hlsUrl) {
        const canNative = v.canPlayType('application/vnd.apple.mpegurl') || v.canPlayType('application/x-mpegURL');
        if (canNative) {
          if (v.src !== hlsUrl) v.src = hlsUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          try {
            const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(hlsUrl);
            hls.attachMedia(v);
            activeHls = { hls, videoEl: v };
          } catch (e) {}
        }
      }*/

      if (hlsUrl) {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari && v.canPlayType('application/vnd.apple.mpegurl')) {
          if (v.src !== hlsUrl) v.src = hlsUrl;

        } else if (window.Hls && window.Hls.isSupported()) {
          try {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true
            });

            hls.loadSource(hlsUrl);
            hls.attachMedia(v);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              v.play().catch(() => {});
            });

            activeHls = { hls, videoEl: v };
            return;

          } catch (e) {
            console.warn('HLS init error:', e);
          }
        }
      }

      try {
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch (e) {}
    }

    async function setActiveNumber(n, bgsWrap) {
      const myReq = ++activeReq;

      stopActiveMedia(bgsWrap);

      titlesWrap.querySelectorAll('.portfolio-cust-title.is-active').forEach(el => el.classList.remove('is-active'));
      linksWrap.querySelectorAll('.portfolio-cust-link.is-active').forEach(el => el.classList.remove('is-active'));
      bgsWrap.querySelectorAll('.portfolio-cust-bgItem.is-active').forEach(el => el.classList.remove('is-active'));
      titlesWrap.classList.remove('has-hover');

      const t = titlesWrap.querySelector(`.portfolio-cust-title[data-item-number="${n}"]`);
      const l = linksWrap.querySelector(`.portfolio-cust-link[data-item-number="${n}"]`);
      const b = bgsWrap.querySelector(`.portfolio-cust-bgItem[data-item-number="${n}"]`);

      if (t) t.classList.add('is-active');
      if (l) l.classList.add('is-active');
      if (!b) return;

      b.classList.add('is-active');
      titlesWrap.classList.add('has-hover');

      const titleText = t ? (t.textContent || '').trim() : '';

      await ensureBgMedia(b, titleText);
      if (myReq !== activeReq) return;

      await playActiveMedia(b);
    }

    function clearActive(bgsWrap) {
      activeReq++;
      stopActiveMedia(bgsWrap);

      titlesWrap.querySelectorAll('.portfolio-cust-title.is-active').forEach(el => el.classList.remove('is-active'));
      linksWrap.querySelectorAll('.portfolio-cust-link.is-active').forEach(el => el.classList.remove('is-active'));
      bgsWrap.querySelectorAll('.portfolio-cust-bgItem.is-active').forEach(el => el.classList.remove('is-active'));
    }

    (async function init() {
      try {
        titlesWrap.innerHTML = '';
        linksWrap.innerHTML = '';

        const activeCategory = getCategoryFromUrl();

        const old = sectionBg.querySelector('.portfolio-cust-bgs');
        if (old) old.remove();

        const bgsWrap = document.createElement('div');
        bgsWrap.className = 'portfolio-cust-bgs';
        sectionBg.appendChild(bgsWrap);

        let pageUrl = location.origin + PORTFOLIO_PATH + '?format=json-pretty';
        const all = [];
        const seen = new Set();

        for (let i = 0; i < MAX_PAGES; i++) {
          const res = await fetch(pageUrl, { credentials: 'same-origin' });
          if (!res.ok) break;

          const data = await res.json();

          if (Array.isArray(data.items)) {
            data.items.forEach(it => {
              if (!it || !it.id || seen.has(it.id)) return;
              seen.add(it.id);
              all.push(it);
            });
          }

          if (data.pagination && data.pagination.nextPage && data.pagination.nextPageUrl) {
            pageUrl = location.origin + data.pagination.nextPageUrl + '&format=json-pretty';
          } else {
            break;
          }
        }

        all.sort((a, b) => (b.publishOn || 0) - (a.publishOn || 0));

        let itemsToRender = all;

        if (activeCategory) {
          const matched = [];
          const CONCURRENCY_FILTER = 6;
          let filterCursor = 0;

          async function filterWorker() {
            while (filterCursor < all.length) {
              const idx = filterCursor++;
              const it = all[idx];
              const info = await resolvePortfolioSourceFromItemPage(it.fullUrl || '');

              if (
                info &&
                Array.isArray(info.categories) &&
                info.categories.includes(activeCategory)
              ) {
                matched.push(it);
              }
            }
          }

          const filterWorkers = [];
          for (let i = 0; i < CONCURRENCY_FILTER; i++) {
            filterWorkers.push(filterWorker());
          }

          await Promise.all(filterWorkers);

          itemsToRender = matched.length ? matched : all;
        }

        const CONCURRENCY = 6;
        let cursor = 0;

        async function worker() {
          while (cursor < itemsToRender.length) {
            const idx = cursor++;
            const it = itemsToRender[idx];

            const n = String(idx + 1);
            const title = it.title || 'Untitled';
            const href  = it.fullUrl ? (location.origin + it.fullUrl) : '#';

            const imgUrl = it.assetUrl
              ? (it.assetUrl.includes('?format=') ? it.assetUrl : (it.assetUrl + '?format=2500w'))
              : '';

            const p = document.createElement('p');
            p.className = 'portfolio-cust-title';
            p.setAttribute('data-item-number', n);

            const aTitle = document.createElement('a');
            aTitle.href = href;
            aTitle.textContent = title;
            p.appendChild(aTitle);
            titlesWrap.appendChild(p);

            const panel = document.createElement('div');
            panel.className = 'portfolio-cust-link';
            panel.setAttribute('data-item-number', n);
            panel.innerHTML = `<a class="portfolio-cust-link__a" href="${href}">View Item</a>`;
            linksWrap.appendChild(panel);

            const bgItem = document.createElement('div');
            bgItem.className = 'portfolio-cust-bgItem';
            bgItem.setAttribute('data-item-number', n);

            if (imgUrl) {
              const img = document.createElement('img');
              img.className = 'portfolio-cust-bg';
              img.alt = '';
              img.decoding = 'async';

              if (idx < 2) {
                img.loading = 'eager';
                try { img.fetchPriority = 'high'; } catch (e) {}
              } else {
                img.loading = 'lazy';
              }

              img.src = imgUrl;
              bgItem.appendChild(img);
            }

            bgsWrap.appendChild(bgItem);

            const info = await resolvePortfolioSourceFromItemPage(it.fullUrl || '');
            const linkText = (info && info.linkText) ? info.linkText : 'View Item';

            const wordsBr = linkText.trim().split(/\s+/).join('<br>');
            panel.innerHTML = `<a class="portfolio-cust-link__a" href="${href}">${wordsBr || 'View Item'}</a>`;

            /*
            panel.innerHTML = `
              <a class="portfolio-cust-link__a" href="${href}">
                <span class="portfolio-cust-link__text">
                  ${wordsBr || 'View Item'}
                </span>
                <span class="portfolio-cust-link__arrow"></span>
              </a>
            `;
            */

            if (info && info.video) {
              if (info.video.type === 'hls' && info.video.hlsUrl) {
                bgItem.dataset.videoType = 'hls';
                bgItem.dataset.hlsUrl = info.video.hlsUrl;
                bgItem.dataset.posterUrl = info.video.posterUrl || '';
              } else if (info.video.type === 'external' && info.video.url) {
                bgItem.dataset.videoType = 'external';
                bgItem.dataset.videoUrl = info.video.url;
              }
            }
          }
        }

        const workers = [];
        for (let i = 0; i < CONCURRENCY; i++) workers.push(worker());
        await Promise.all(workers);

        function getNFromEl(el) {
          if (!el) return '';
          return el.getAttribute('data-item-number') || '';
        }

        function getNFromAny(el) {
          const item = el && el.closest && el.closest('.portfolio-cust-title, .portfolio-cust-link, .portfolio-cust-bgItem');
          return item ? (item.getAttribute('data-item-number') || '') : '';
        }

        const isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;

        titlesWrap.addEventListener('mouseenter', (e) => {
          if (isTouch) return;
          const item = e.target.closest('.portfolio-cust-title');
          const n = getNFromEl(item);
          if (n) setActiveNumber(n, bgsWrap);
        }, true);

        linksWrap.addEventListener('mouseenter', (e) => {
          if (isTouch) return;
          const item = e.target.closest('.portfolio-cust-link');
          const n = getNFromEl(item);
          if (n) setActiveNumber(n, bgsWrap);
        }, true);

        wrapper.addEventListener('focusin', (e) => {
          if (isTouch) return;
          const t = e.target.closest('.portfolio-cust-title, .portfolio-cust-link');
          const n = getNFromAny(t);
          if (n) setActiveNumber(n, bgsWrap);
        });

        wrapper.addEventListener('mouseleave', () => {
          if (isTouch) return;
          clearActive(bgsWrap);
        });

        if (!isTouch) {
          let prewarmTimer = null;

          function prewarm(n) {
            if (!n) return;
            if (prewarmTimer) clearTimeout(prewarmTimer);

            prewarmTimer = setTimeout(async () => {
              const t = titlesWrap.querySelector(`.portfolio-cust-title[data-item-number="${n}"]`);
              const b = bgsWrap.querySelector(`.portfolio-cust-bgItem[data-item-number="${n}"]`);
              if (!b) return;

              const titleText = t ? (t.textContent || '').trim() : '';

              await ensureBgMedia(b, titleText);

              const v = b.querySelector('video.portfolio-cust-video');
              if (v) {
                const ds = v.getAttribute('data-src');
                if (ds && !v.getAttribute('src')) {
                  v.setAttribute('src', ds);
                  try { v.load(); } catch (e) {}
                }
              }
            }, 200);
          }

          titlesWrap.addEventListener('pointerenter', (e) => {
            const item = e.target.closest('.portfolio-cust-title');
            const n = getNFromEl(item);
            if (n) prewarm(n);
          }, true);

          linksWrap.addEventListener('pointerenter', (e) => {
            const item = e.target.closest('.portfolio-cust-link');
            const n = getNFromEl(item);
            if (n) prewarm(n);
          }, true);

          titlesWrap.addEventListener('pointerleave', () => {
            if (prewarmTimer) clearTimeout(prewarmTimer);
            prewarmTimer = null;
          }, true);

          linksWrap.addEventListener('pointerleave', () => {
            if (prewarmTimer) clearTimeout(prewarmTimer);
            prewarmTimer = null;
          }, true);
        }

        if (isTouch) {
          let armedHref = '';

          function disarm() {
            armedHref = '';
          }

          function onLinkTapCapture(e) {
            const a = e.target.closest('.portfolio-cust-title a, .portfolio-cust-link__a');
            if (!a) return;

            const href = a.getAttribute('href') || '';
            if (!href) return;

            if (href === armedHref) {
              disarm();
              return;
            }

            e.preventDefault();
            e.stopPropagation();

            const n = getNFromAny(a);
            if (n) setActiveNumber(n, bgsWrap);

            armedHref = href;
          }

          function onContainerTap(e) {
            if (e.target.closest('.portfolio-cust-title a, .portfolio-cust-link__a')) return;

            const t = e.target.closest('.portfolio-cust-title, .portfolio-cust-link');
            if (!t) return;

            const n = getNFromAny(t);
            if (n) setActiveNumber(n, bgsWrap);

            disarm();
          }

          wrapper.addEventListener('click', onLinkTapCapture, true);
          wrapper.addEventListener('pointerdown', onContainerTap, { passive: true });

          document.addEventListener('pointerdown', (e) => {
            if (wrapper.contains(e.target)) return;
            disarm();
            clearActive(bgsWrap);
          }, { passive: true });
        }

      } catch (e) {
        console.error('Portfolio script error:', e);
      }
    })();

  })();

  // =============================================

   // 8. SCROLLING IMAGES — PORTFOLIO ITEM PAGE
  // =============================================
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[id^="scrolling-images"] .gallery-block .slide').forEach(slide => {

      const src = slide.querySelector('img')?.dataset.src || slide.querySelector('img')?.src;
      const next = slide.closest('.gallery-block')?.nextElementSibling;
      if (!src || !next) return;

      next.querySelectorAll('.scrolling-images .first, .scrolling-images .second')
        .forEach(t =>
          t.insertAdjacentHTML('beforeend',
            `<div class="image-wrapper"><img src="${src}"></div>`
          )
        );
    });
  });

  // =============================================
  // 9. POPUP FORM PAGE (Fancybox)
  // =============================================
  document.addEventListener("DOMContentLoaded", () => {
      const HASH_PREFIX = "#open-popup/";
      const CONTENT_SELECTOR = "#sections";

      function runSquarespaceAfterBodyLoad() {
        const sqs = window.Squarespace;
        if (sqs && typeof sqs.afterBodyLoad === "function") {
          try {
            sqs.AFTER_BODY_LOADED = false;
            sqs.afterBodyLoad();
          } catch (e) {
            console.warn("Squarespace afterBodyLoad() failed", e);
          }
        }
      }

      function preventAutoPlay(scope) {
        if (!scope) return;
        scope.querySelectorAll("video").forEach((v) => {
          try {
            v.autoplay = false;
            v.removeAttribute("autoplay");
            v.pause();
          } catch (_) {}
        });
      }

      function parsePopupHref(rawHref) {
        try {
          const u = new URL(rawHref, location.origin);
          const hash = (u.hash || "").trim();

          if (!hash.startsWith(HASH_PREFIX)) return null;

          const pathAfter = hash.slice(HASH_PREFIX.length).trim();
          if (!pathAfter) return null;

          return location.origin + "/" + pathAfter.replace(/^\/+/, "");
        } catch {
          return null;
        }
      }

      async function openPopup(url) {
        const slug = new URL(url).pathname
          .replace(/^\/+/, "")
          .replace(/\/+$/, "")
          .replace(/\//g, "-");

        Fancybox.show(
          [
            {
              src: url,
              type: "ajax",
            },
          ],
          {
            mainClass: `page-popup popup--${slug}`,
            closeButton: false,
            dragToClose: false,

            on: {
              done: (fb, slide) => {
                const root = slide.contentEl;

                if (!root) return;

                const sections = root.querySelector(CONTENT_SELECTOR);

                if (sections) {
                  const clone = sections.cloneNode(true);
                  root.innerHTML = "";
                  root.appendChild(clone);
                } else {
                  console.warn(`Fancybox: not found ${CONTENT_SELECTOR} on`, url);
                }

                runSquarespaceAfterBodyLoad();
                preventAutoPlay(root);
              },
            },
          }
        );
      }

      document.addEventListener("click", (e) => {
        const a = e.target.closest('a[href*="#open-popup/"]');
        if (!a) return;

        const url = parsePopupHref(a.getAttribute("href") || a.href);
        if (!url) return;

        e.preventDefault();
        e.stopPropagation();

        openPopup(url);
      });

      document.addEventListener("click", (e) => {
        if (e.target.closest(".exit-butt-popup")) {
          e.preventDefault();
          Fancybox.close();
        }
      });
    });

  // =============================================
  // 10. FAQ ACCORDION
  // =============================================
  (function () {
    function animate(el, open) {
      el.style.overflow = "hidden";
      el.style.transition = "height 0.4s ease";

      if (open) {
        el.style.display = "block";
        const h = el.scrollHeight;
        el.style.height = "0px";
        requestAnimationFrame(() => {
          el.style.height = h + "px";
        });
        el.addEventListener("transitionend", function end() {
          el.style.height = "auto";
          el.removeEventListener("transitionend", end);
        });
      } else {
        const h = el.scrollHeight;
        el.style.height = h + "px";
        requestAnimationFrame(() => {
          el.style.height = "0px";
        });
      }
    }

    function initFAQ() {
      const faqRoot = document.querySelector("#services-faq");
      if (!faqRoot || faqRoot.dataset.faqInitialized) return;
      faqRoot.dataset.faqInitialized = "true";

      const column = faqRoot.querySelector(".sqs-col-12, .sqs-col-9, .sqs-col-8");
      if (!column) return;

      const children = Array.from(column.children);
      let currentFaq = null;
      let currentContent = null;

      children.forEach(el => {
        if (el.classList.contains("markdown-block")) {
          currentFaq = document.createElement("div");
          currentFaq.className = "faq-sec";

          currentContent = document.createElement("div");
          currentContent.className = "faq-sec-content";
          currentContent.style.display = "none";

          column.insertBefore(currentFaq, el);
          currentFaq.appendChild(el);
          currentFaq.appendChild(currentContent);
        } else if (currentFaq && currentContent) {
          currentContent.appendChild(el);
        }
      });

      column.querySelectorAll(".faq-sec").forEach(sec => {
        const trigger = sec.querySelector(".markdown-block");
        const content = sec.querySelector(".faq-sec-content");
        if (!trigger || !content) return;

        trigger.style.cursor = "pointer";

        trigger.addEventListener("click", () => {
          const isOpen = sec.classList.contains("active");

          if (isOpen) {
            sec.classList.remove("active");
            animate(content, false);
          } else {
            sec.classList.add("active");
            animate(content, true);
          }
        });
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initFAQ, 300);
    });

    window.addEventListener("popstate", () => {
      setTimeout(initFAQ, 300);
    });
  })();

  // =============================================
  // 11. ARROW DOWN — SCROLL TO NEXT SECTION
  // =============================================
  (function () {
    const nextSection = s => {
      for (s = s?.nextElementSibling; s; s = s.nextElementSibling)
        if (s.classList?.contains("page-section")) return s;
    };

    const init = () => {
      document.querySelectorAll(".arrow-down").forEach(a => {
        if (a.dataset.scrollInit) return;
        a.dataset.scrollInit = "1";

        a.addEventListener("click", e => {
          e.preventDefault();
          nextSection(a.closest(".page-section"))
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    };

    ["DOMContentLoaded", "popstate", "click"].forEach(ev =>
      document.addEventListener(ev, () => setTimeout(init, 200))
    );
  })();

  // =============================================
  // 12. RESOURCES PAGE — HOVER BLOCK COLORS
  // =============================================
  document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector("#res-tools");
    if (!section) return;

    const container = section.querySelector(".user-items-list-item-container");
    if (!container) return;

    const items = container.querySelectorAll(".list-item");

    items.forEach(item => {

      const title = item.querySelector(".list-item-content__title");
      if (!title) return;

      const text = title.textContent.trim();
      if (!text) return;

      let color = null;

      if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(text)) {
        color = text;
      }

      else if (/^rgba?\(/i.test(text)) {
        color = text;
      }

      if (color) {
        item.style.background = color;
      }

    });

  });

  // =============================================
  // 13. SCROLL TO TOP
  // =============================================
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[href="#back-top"]');
    if (!btn) return;

    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // =============================================
  // 14. CART TEXT FIX ("Added!" → "Added")
  // =============================================
  document.addEventListener("DOMContentLoaded", function () {

    function fixTexts() {

      document.querySelectorAll('.cart-added-text').forEach(el => {
        if (el.textContent.trim() === 'Added!') {
          el.textContent = 'Added';
        }
      });

      document.querySelectorAll('.commerce-mini-cart-header-title .fs-unmask').forEach(el => {
        if (el.textContent.trim() === 'Added to cart!') {
          el.textContent = 'Added to cart';
        }
      });

    }

    fixTexts();

    const observer = new MutationObserver(() => {
      fixTexts();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

  });

  // =============================================
  // 15. ACTIVE NAV LINK HIGHLIGHTER
  // =============================================
  document.addEventListener("DOMContentLoaded", function () {
    try {
      function normalizePath(path) {
        if (!path) return "/";
        path = path.replace(/\/+$/, "");
        return path || "/";
      }

      function normalizeCategory(value) {
        return (value || "")
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-");
      }

      function getUrlKey(url) {
        if (!url) return "";

        if (
          url.startsWith("#") ||
          url.startsWith("mailto:") ||
          url.startsWith("tel:") ||
          url.startsWith("javascript:")
        ) {
          return "";
        }

        try {
          const u = new URL(url, window.location.origin);
          const path = normalizePath(u.pathname);
          const category = normalizeCategory(u.searchParams.get("category") || "");

          if (category) {
            return path + "?category=" + category;
          }

          return path;
        } catch (e) {
          return "";
        }
      }

      function getCurrentKey() {
        const path = normalizePath(window.location.pathname);
        const params = new URLSearchParams(window.location.search);
        const category = normalizeCategory(params.get("category") || "");

        if (category) {
          return path + "?category=" + category;
        }

        return path;
      }

      const currentKey = getCurrentKey();
      const currentPath = normalizePath(window.location.pathname);
      const navItems = document.querySelectorAll("#header .header-nav-list > .header-nav-item");

      if (!navItems.length) return;

      navItems.forEach(function (item) {
        item.classList.remove("active-link");

        const directLink = item.querySelector(":scope > a");
        const folderBtn = item.querySelector(":scope > .header-nav-folder-title");
        const folderLinks = item.querySelectorAll(".header-nav-folder-content a");

        folderLinks.forEach(function (link) {
          link.classList.remove("active-sublink");
        });

        let isActive = false;

        if (directLink) {
          const linkKey = getUrlKey(directLink.getAttribute("href"));
          if (linkKey === currentKey) {
            isActive = true;
          }
        }

        if (!isActive && folderBtn) {
          const folderKey = getUrlKey(folderBtn.getAttribute("data-href"));
          if (folderKey === currentKey) {
            isActive = true;
          }
        }

        if (folderLinks.length) {
          folderLinks.forEach(function (link) {
            const subKey = getUrlKey(link.getAttribute("href"));
            const subPath = normalizePath(
              new URL(
                link.getAttribute("href"),
                window.location.origin
              ).pathname
            );

            if (
              subKey === currentKey ||
              (
                subKey &&
                !subKey.includes("?") &&
                subPath !== "/" &&
                currentPath.startsWith(subPath + "/")
              )
            ) {
              item.classList.add("active-link");
              link.classList.add("active-sublink");
              isActive = true;
            }
          });
        }

        if (isActive) {
          item.classList.add("active-link");
        }
      });

    } catch (e) {
      console.warn("Active nav script error:", e);
    }
  });

})();
