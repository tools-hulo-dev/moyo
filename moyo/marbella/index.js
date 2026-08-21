document.querySelectorAll('[id^="partners"] .gallery-block .slide').forEach(function(slide) {

  const img = slide.querySelector('img');
  if (!img) return;

  const getSrc = img.getAttribute('data-src');
  if (!getSrc) return;

  const galleryBlock = slide.closest('.gallery-block');
  if (!galleryBlock) return;

  const nextElement = galleryBlock.nextElementSibling;
  if (!nextElement) return;

  const targets = nextElement.querySelectorAll(
    '.scrolling-images .first, .scrolling-images .second'
  );

  targets.forEach(function(target) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-wrapper';

    const newImg = document.createElement('img');
    newImg.src = getSrc;

    wrapper.appendChild(newImg);
    target.appendChild(wrapper);
  });

});


document.addEventListener("DOMContentLoaded", function () {

  if (document.body.classList.contains('sqs-edit-mode')) return;

  const splitSections = document.querySelectorAll('.split-sections');
  if (!splitSections.length) return;

  let wrapperIndex = 1;

  splitSections.forEach(function (splitEl) {

    const sticky = splitEl.getAttribute('data-sticky');
    const splitCount = parseInt(splitEl.getAttribute('split-count'), 10);

    if (!splitCount || splitCount < 2) return;

    const firstSection = splitEl.closest('.page-section');
    if (!firstSection) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'sections-split-wrapper';
    wrapper.id = `split-sections-${wrapperIndex}`;

    // Insert wrapper before first section
    firstSection.parentNode.insertBefore(wrapper, firstSection);

    // Collect correct number of sections
    let currentSection = firstSection;
    const sections = [];

    for (let i = 0; i < splitCount; i++) {
      if (!currentSection || !currentSection.classList.contains('page-section')) break;
      sections.push(currentSection);
      currentSection = currentSection.nextElementSibling;
    }

    // Move sections inside wrapper
    sections.forEach(section => wrapper.appendChild(section));

    // 🔎 Check if custom width exists (only checking first is enough)
    const hasCustomWidth = splitEl.getAttribute('data-1-width');

    if (hasCustomWidth) {

      // Apply custom widths
      sections.forEach((section, index) => {
        const customWidth = splitEl.getAttribute(`data-${index + 1}-width`);
        if (customWidth) {
          section.style.width = `calc(${customWidth} + 0px)`;
        }
      });

    } else {

      // 👇 Add fallback class like two-cols, three-cols etc.
      const numberNames = {
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
        6: 'six'
      };

      if (numberNames[splitCount]) {
        wrapper.classList.add(`${numberNames[splitCount]}-cols`);
      } else {
        wrapper.classList.add(`cols-${splitCount}`);
      }

    }

    // Sticky logic
    const stickyIndex = parseInt(sticky, 10);
    if (!isNaN(stickyIndex) && stickyIndex > 0 && sections[stickyIndex - 1]) {
      sections[stickyIndex - 1].classList.add('sticky-section');
    }

    wrapperIndex++;

  });

});


const items = document.querySelectorAll(
  '[data-section-id="69a6ab1374d4661cee017c9f"] .html-block, #testim-vert .html-block'
);
  
function updateOpacity() {
  const viewportCenter = window.innerHeight / 2;
  const holdZone = 120; // 👈 pixels around center that stay full opacity

  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(viewportCenter - itemCenter);

    let opacity;

    if (distance < holdZone) {
      // Stay fully visible inside center zone
      opacity = 1;
    } else {
      const maxDistance = window.innerHeight / 2;
      opacity = Math.max(0.3, 1 - ((distance - holdZone) / maxDistance));
    }

    item.style.opacity = opacity;
  });

  requestAnimationFrame(updateOpacity);
}

updateOpacity();


document.addEventListener("DOMContentLoaded", function () {

  const blogHub = document.querySelector('#blog-hub');
  if (!blogHub) return;

  const list = blogHub.querySelector('.summary-item-list');
  if (!list) return;

  if (blogHub.querySelector('.swiper')) return;

  // Create outer wrapper
  const sliderWrapper = document.createElement('div');
  sliderWrapper.classList.add('blog-slider-wrapper');

  // Create swiper container
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper');

  // Navigation wrapper
  const navWrapper = document.createElement('div');
  navWrapper.classList.add('blog-slider-nav');

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('blog-prev');

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('blog-next');

  navWrapper.appendChild(prevBtn);
  navWrapper.appendChild(nextBtn);

  // Insert wrapper
  list.parentNode.insertBefore(sliderWrapper, list);

  // Move swiper container
  sliderWrapper.appendChild(swiperContainer);

  // Move list inside swiper
  swiperContainer.appendChild(list);

  // Insert nav after slider
  sliderWrapper.parentNode.insertBefore(navWrapper, sliderWrapper.nextSibling);

  // Structure classes
  list.classList.add('swiper-wrapper');

  const slides = list.querySelectorAll('.summary-item');

  slides.forEach(slide => {
    slide.classList.add('swiper-slide');

    // remove squarespace inline layout styles
    slide.style.removeProperty('width');
    slide.style.removeProperty('margin-right');
    slide.style.removeProperty('clear');
  });

  // Delay swiper init (fixes blink)
  requestAnimationFrame(() => {

    setTimeout(() => {

      const swiper = new Swiper(swiperContainer, {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 600,
        grabCursor: true,
        watchOverflow: true,

        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },

        breakpoints: {
          540:{
            slidesPerView: 2,
            spaceBetween: 24,
          },
          767: {
            slidesPerView: 3,
            spaceBetween: 32,
          }
        }
      });

      swiper.update();

    }, 500);

  });

});


document.addEventListener('DOMContentLoaded', () => {
  const isEditor = window !== window.parent;
  if (isEditor) return;

  const SOURCE_PATH = '/page-for-navigation-menu';
  const SOURCE_URL  = `${SOURCE_PATH}?nocache=${Date.now()}`;
  const TARGET_SEL  = '#header .header-menu-nav';
  const SECTION_SEL = '#custom-menu';

  const target = document.querySelector(TARGET_SEL);
  if (!target) return;

  if (target.querySelector('[data-injected-custom-menu="1"]')) return;

  (async () => {
    try {
      const res = await fetch(SOURCE_URL, {
        credentials: 'same-origin',
        headers: { 'Accept': 'text/html' }
      });

      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const section = doc.querySelector(SECTION_SEL);

      if (!section) {
        const idx = html.indexOf('custom-menu');
        if (idx !== -1)
        return;
      }

      const clone = section.cloneNode(true);
      clone.setAttribute('data-injected-custom-menu', '1');
      target.appendChild(clone);

      clone.querySelectorAll('[data-animation-role]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.add('animate');
        el.classList.add('animation-loaded');
      });

      clone.querySelectorAll('img[data-src]').forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.setAttribute('src', src);
          img.setAttribute('data-load', 'true');
          img.classList.add('loaded');
        }
      });

      if (window.Squarespace && window.Squarespace.initializePageModules) {
        window.Squarespace.initializePageModules(clone);
      }

      document.body.classList.add('has-injected-custom-menu');
    } catch (e) {
      console.error('failed:', e);
    }
  })();
});


document.addEventListener('click', function(e) {
  const arrow = e.target.closest('.arrow-down, .arrow-down-dk');
  if (!arrow) return;

  const currentSection = arrow.closest('section');
  if (!currentSection) return;

  const nextSection = currentSection.nextElementSibling;
  if (!nextSection || nextSection.tagName !== 'SECTION') return;

  nextSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});


// Counter
(() => {
  const LINK_SELECTOR = 'a[href*="#count-num"]';

  const getCSSVar = (el, name) =>
    getComputedStyle(el).getPropertyValue(name).trim();

  const decimalsCount = (numStr, locale) => {
    const decSep = (1.1).toLocaleString(locale).charAt(1);
    const parts = String(numStr).split(decSep);
    if (!parts[1]) return 0;
    const m = parts[1].match(/^\d+/);
    return m ? m[0].length : 0;
  };

  const parseLocaleNumber = (numStr, locale) => {
    const thousandSep = (1000).toLocaleString(locale).charAt(1);
    const escaped = thousandSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    let s = String(numStr)
      .replace(new RegExp(escaped, "g"), "")
      .replace(/\u00A0/g, " ")
      .replace(/\s/g, "");

    s = s.replace(/[.,]/, ".");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  const formatNumber = (value, locale, decimals) => {
    return value.toLocaleString(locale, {
      useGrouping: false,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const findFirstTextNodeWithNumber = (root) => {
    if (!root) return null;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return /\d/.test(node.nodeValue || "")
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }
      }
    );

    return walker.nextNode();
  };

  const splitNumberFromTextNode = (text) => {
    const str = String(text || "");
    const match = str.match(/([-+]?\d[\d\s.,]*)/);

    if (!match) return null;

    const numStr = match[1];
    const index = match.index;

    return {
      before: str.slice(0, index),
      numStr,
      after: str.slice(index + numStr.length)
    };
  };

  const animateCount = (
    target,
    { start, end, duration, fps, locale, decimals }
  ) => {
    const interval = 1000 / fps;
    const steps = Math.max(1, Math.round(duration / interval));
    let frame = 0;

    const render = (value) => {
      target.textContent = formatNumber(
        Number(value.toFixed(decimals)),
        locale,
        decimals
      );
    };

    render(start);

    const timer = setInterval(() => {
      frame++;
      const progress = frame / steps;
      const eased = Math.sin(progress * Math.PI / 2);
      const val = start + (end - start) * eased;

      render(val);

      if (frame >= steps) {
        clearInterval(timer);
        render(end);
      }
    }, interval);
  };

  const links = document.querySelectorAll(LINK_SELECTOR);

  links.forEach((a) => {
    if (a.dataset.counterInit === "1") return;

    const href = a.getAttribute("href") || "";
    const qIndex = href.indexOf("?");
    const params = new URLSearchParams(qIndex >= 0 ? href.slice(qIndex + 1) : "");

    const speed = parseInt(params.get("speed") || "", 10) || 3000;
    const startParam = params.get("start");

    const locale =
      a.dataset.counterLocale ||
      getCSSVar(a, "--counter-locale") ||
      "en-US";

    const fps =
      (a.dataset.counterFps ? parseInt(a.dataset.counterFps, 10) : 0) ||
      parseInt(getCSSVar(a, "--counter-fps"), 10) ||
      60;

    const lightAccentEl = a.querySelector(".sqsrte-text-color--lightAccent");
    const hasEm = !!a.querySelector("em");

    let numberColor = "";
    if (lightAccentEl) {
      numberColor = getComputedStyle(lightAccentEl).color;
    }

    const wrapper = document.createElement("span");
    wrapper.className = a.className;
    wrapper.style.cssText = a.style.cssText;
    wrapper.innerHTML = a.innerHTML;
    wrapper.dataset.counterInit = "1";

    const numberTextNode = findFirstTextNodeWithNumber(wrapper);
    if (!numberTextNode) return;

    const parts = splitNumberFromTextNode(numberTextNode.nodeValue);
    if (!parts) return;

    const end = parseLocaleNumber(parts.numStr, locale);
    const decimals = decimalsCount(parts.numStr, locale);

    const start =
      startParam !== null
        ? parseFloat(startParam)
        : (a.dataset.counterStart ? parseFloat(a.dataset.counterStart) : 0);

    const fragment = document.createDocumentFragment();

    if (parts.before) {
      fragment.appendChild(document.createTextNode(parts.before));
    }

    const animatedNumber = document.createElement("span");
    animatedNumber.className = "counter-animated-number";

    if (numberColor) {
      animatedNumber.style.color = numberColor;
    }

    if (hasEm) {
      animatedNumber.style.fontStyle = "italic";
    }

    animatedNumber.textContent = formatNumber(
      Number(start.toFixed(decimals)),
      locale,
      decimals
    );

    fragment.appendChild(animatedNumber);

    if (parts.after) {
      fragment.appendChild(document.createTextNode(parts.after));
    }

    numberTextNode.parentNode.replaceChild(fragment, numberTextNode);

    a.dataset.counterInit = "1";
    a.replaceWith(wrapper);

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCount(animatedNumber, {
          start,
          end,
          duration: speed,
          fps,
          locale,
          decimals
        });

        obs.unobserve(wrapper);
      });
    });

    io.observe(wrapper);
  });
})();


// POPUP FORM PAGE
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

    async function getPopupContent(url) {
      try {
        const response = await fetch(url, {
          credentials: "same-origin",
          headers: {
            "X-Requested-With": "XMLHttpRequest"
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch popup page: ${response.status}`);
        }

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        const sections = doc.querySelector(CONTENT_SELECTOR);

        if (!sections) {
          console.warn(`Popup content not found: ${CONTENT_SELECTOR} on`, url);
          return null;
        }

        return sections.outerHTML;
      } catch (error) {
        console.warn("Popup fetch/parse failed:", error);
        return null;
      }
    }

    async function openPopup(url) {
      const slug = new URL(url).pathname
        .replace(/^\/+/, "")
        .replace(/\/+$/, "")
        .replace(/\//g, "-");

      const popupHtml = await getPopupContent(url);
      if (!popupHtml) return;

      Fancybox.show(
        [
          {
            src: `
              <div class="popup-page-content">
                ${popupHtml}
              </div>
            `,
            type: "html"
          }
        ],
        {
          mainClass: `page-popup popup--${slug}`,
          closeButton: false,
          dragToClose: false,

          on: {
            done: (fb, slide) => {
              const root = slide.contentEl;
              if (!root) return;

              runSquarespaceAfterBodyLoad();
              preventAutoPlay(root);
            }
          }
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


(() => {
  const SECTION_SELECTOR = '[id*="scrolling-buttons"]';
  const LIST_SELECTOR = '.user-items-list-item-container';
  const ITEM_SELECTOR = '.list-item';

  function isEditorMode() {
    return document.body.classList.contains('sqs-is-page-editing')
      || document.body.classList.contains('sqs-edit-mode')
      || window.frameElement !== null;
  }

  function buildScrollingButtons(section) {
    if (!section || section.dataset.scrollingButtonsInit === 'true') return;

    const originalList = section.querySelector(LIST_SELECTOR);
    if (!originalList) return;

    const originalItems = Array.from(
      originalList.querySelectorAll(`:scope > ${ITEM_SELECTOR}`)
    );
    if (!originalItems.length) return;

    section.dataset.scrollingButtonsInit = 'true';

    const marquee = document.createElement('div');
    marquee.className = 'scrolling-buttons-marquee';

    const track = document.createElement('div');
    track.className = 'scrolling-buttons-track';

    const group1 = document.createElement('div');
    group1.className = 'scrolling-buttons-group';

    const group2 = document.createElement('div');
    group2.className = 'scrolling-buttons-group';

    originalItems.forEach(item => {
      group1.appendChild(item.cloneNode(true));
      group2.appendChild(item.cloneNode(true));
    });

    track.appendChild(group1);
    track.appendChild(group2);
    marquee.appendChild(track);

    originalList.insertAdjacentElement('afterend', marquee);
  }

  function initScrollingButtons() {
    if (isEditorMode()) return;

    document.querySelectorAll(SECTION_SELECTOR).forEach(section => {
      buildScrollingButtons(section);
    });
  }

  const observer = new MutationObserver(() => {
    if (!isEditorMode()) {
      initScrollingButtons();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    initScrollingButtons();

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  });
})();


document.addEventListener('DOMContentLoaded', () => {
  const DESKTOP_BREAKPOINT = 768;
  let rafId = null;
  let resizeObserver = null;

  function isDesktop() {
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  }

  function getTopSection() {
    return document.querySelector('#top-stack-section');
  }

  function getStackSections() {
    return [...document.querySelectorAll('[id^="stack-section"]')]
      .filter(section => section.querySelector('.stack-header'));
  }

  function ensureStackGroup() {
    const topSection = getTopSection();
    const stackSections = getStackSections();

    if (!topSection || !stackSections.length) return null;

    const existingGroup = topSection.closest('.stack-group');
    if (existingGroup) return existingGroup;

    const group = document.createElement('div');
    group.className = 'stack-group';

    const parent = topSection.parentNode;
    parent.insertBefore(group, topSection);

    group.appendChild(topSection);

    stackSections.forEach(section => {
      group.appendChild(section);
    });

    return group;
  }

  function updateStackLayout() {
    const topSection = getTopSection();
    const stackSections = getStackSections();

    if (!topSection || !stackSections.length) return;

    if (!isDesktop()) {
      topSection.style.top = '';

      stackSections.forEach(section => {
        section.style.top = '';
      });

      return;
    }

    const topSectionHeight = Math.ceil(topSection.getBoundingClientRect().height);

    topSection.style.top = '0px';

    let accumulatedTop = topSectionHeight;

    stackSections.forEach(section => {
      const header = section.querySelector('.stack-header');
      if (!header) return;

      const headerHeight = Math.ceil(header.getBoundingClientRect().height);

      section.style.top = `${accumulatedTop}px`;

      accumulatedTop += headerHeight;
    });
  }

  function scheduleUpdate() {
    if (rafId !== null) return;

    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      updateStackLayout();
    });
  }

  function initStackObservers() {
    const topSection = getTopSection();
    const stackSections = getStackSections();

    if (!topSection || !('ResizeObserver' in window)) return;

    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });

    resizeObserver.observe(topSection);

    stackSections.forEach(section => {
      const header = section.querySelector('.stack-header');
      if (header) resizeObserver.observe(header);
    });
  }

  ensureStackGroup();
  updateStackLayout();
  initStackObservers();

  window.addEventListener('load', scheduleUpdate);
  window.addEventListener('resize', scheduleUpdate);

  window.addEventListener('beforeunload', () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {

  if (window.frameElement) return;

  const trigger = document.querySelector(".logo-lr");
  if (!trigger) return;

  const logoLinks = document.querySelectorAll(".header-title-logo a");
  if (!logoLinks.length) return;

  const header = document.querySelector("#header");

  const lightLogo = "https://static1.squarespace.com/static/6997f50ee34be41d58c58dd6/t/69b404cd9aa7a15fc1b71928/1773405390229/logo-lr.png";
  const darkLogo  = "https://static1.squarespace.com/static/6997f50ee34be41d58c58dd6/t/69b40b794b4199499b9e5cd3/1773407098028/logo-lr-w.png";

  const logoSrc = (header && header.classList.contains("black")) ? darkLogo : lightLogo;

  logoLinks.forEach((logoLink) => {

    if (logoLink.querySelector(".large-logo")) return;

    const img = document.createElement("img");
    img.className = "large-logo";
    img.src = logoSrc;
    img.alt = "Logo";

    logoLink.appendChild(img);

  });

});


document.addEventListener("DOMContentLoaded", () => {
  if (window.frameElement) return;

  const sections = Array.from(
    document.querySelectorAll('#main-stacked-card, [id^="stacked-card"]')
  );

  if (!sections.length) return;

  const filteredSections = sections.filter((section, index, arr) => {
    return arr.indexOf(section) === index;
  });

  if (!filteredSections.length) return;

  if (filteredSections[0].parentElement?.classList.contains("stacked-cards-group")) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "stacked-cards-group";

  const firstSection = filteredSections[0];
  firstSection.parentNode.insertBefore(wrapper, firstSection);

  filteredSections.forEach(section => {
    wrapper.appendChild(section);
  });

  /* Get background image from first section */
  const firstPageSection = wrapper.querySelector(".page-section:nth-child(1)");
  if (!firstPageSection) return;

  const img = firstPageSection.querySelector(".section-background img");
  if (!img) return;

  const src = img.getAttribute("src");

  wrapper.style.backgroundImage = `url(${src})`;
  wrapper.style.backgroundSize = "cover";
  wrapper.style.backgroundPosition = "center";
});


document.addEventListener("DOMContentLoaded", () => {

  const cards = [
    document.querySelector("#stacked-card-1"),
    document.querySelector("#stacked-card-2"),
    document.querySelector("#stacked-card-3"),
    document.querySelector("#stacked-card-4")
  ].filter(Boolean);

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function onScroll(){
    const vh = window.innerHeight;

    for(let i=0;i<cards.length-1;i++){
      const prev = cards[i];
      const next = cards[i+1];

      const rect = next.getBoundingClientRect();
      const start = vh * 0.7;
      const end   = vh * 0.2;

      const progress = clamp((start - rect.top) / (start - end), 0, 1);

      //prev.style.opacity = (1 - progress).toFixed(3);
      prev.style.opacity = Math.pow(1 - progress, 1.5).toFixed(3);
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", onScroll);
});


document.addEventListener("DOMContentLoaded", () => {
  if (window.frameElement) return;

  const section = document.querySelector("#blog-hub-v2");
  if (!section) return;

  const wrapper = section.querySelector(".blog-hub-wrapper");
  const summary = section.querySelector(".sqs-block-summary-v2");
  if (!wrapper || !summary) return;

  const items = summary.querySelectorAll(".summary-item");
  if (!items.length) return;

  const slides = Array.from(items).map(item => {
    const link = item.querySelector(".summary-title-link, .summary-thumbnail-container");
    const img = item.querySelector(".summary-thumbnail-image");
    const titleEl = item.querySelector(".summary-title-link");
    const excerptEl = item.querySelector(".summary-excerpt");

    const href = link?.getAttribute("href") || "#";
    const title = titleEl?.textContent.trim() || "";
    const imgSrc = img?.getAttribute("src") || img?.getAttribute("data-src") || "";
    const excerptHTML = excerptEl ? excerptEl.outerHTML : "";

    return `
      <div class="swiper-slide">
        <a href="${href}" class="blog-card">
          ${imgSrc ? `
            <div class="blog-card-img">
              <img src="${imgSrc}" alt="">
            </div>
          ` : ""}

          <div class="blog-card-content">
            ${title ? `<p class="blog-hub-title">${title}</p>` : ""}
            ${excerptHTML}
          </div>
        </a>
      </div>
    `;
  }).join("");

  wrapper.innerHTML = `
    <div class="blog-slider">

      <div class="swiper blog-swiper">
        <div class="swiper-wrapper">
          ${slides}
        </div>
      </div>

      <div class="blog-slider-nav">
        <div class="blog-prev">
          <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 4.45824L15 5.53047L3.04348 5.53047L7.54005 9.61625L7.254 10L4.19353e-07 5.20316L4.55861e-07 4.78555L7.25401 -6.77176e-07L7.54005 0.383746L3.04348 4.45824L15 4.45824Z" fill="black"/>
          </svg>
        </div>

        <div class="blog-next">
          <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 5.54176L0 4.46953L11.9565 4.46953L7.45995 0.383747L7.746 0L15 4.79684V5.21445L7.746 10L7.45995 9.61625L11.9565 5.54176L0 5.54176Z" fill="black"/>
          </svg>
        </div>
      </div>

    </div>
  `;

  const swiperContainer = wrapper.querySelector(".blog-swiper");

  const swiper = new Swiper(swiperContainer, {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    speed: 600,
    grabCursor: true,
    watchOverflow: true,

    navigation: {
      nextEl: wrapper.querySelector(".blog-next"),
      prevEl: wrapper.querySelector(".blog-prev"),
    },

    breakpoints: {
      540:{
        slidesPerView: 2,
        spaceBetween: 24,
      },
      767: {
        slidesPerView: 3,
        spaceBetween: 32,
      }
    }
  });

  swiper.update();
});


//scroll top
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[href="#back-top"]');
      if (!btn) return;

      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.sqs-button-element--primary, .sqs-button-element--tertiary').forEach(btn => {
    const textNodes = [...btn.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
    
    textNodes.forEach(node => {
      const span = document.createElement('span');
      span.className = 'btn-text';
      span.textContent = node.textContent;
      node.replaceWith(span);
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[id^="podcasts-list"]').forEach(carousel => {

      carousel.querySelectorAll('.list-item').forEach(item => {
        const title = item.querySelector('.list-item-content__title');
        const media = item.querySelector(
          '.user-items-list-carousel__media-container, .list-item-media'
        );
        if (title && media) media.appendChild(title);
      });

      function updateArrowHeight() {
        const mediaContainer = carousel.querySelector(
          '.user-items-list-carousel__media-container'
        );
        if (!mediaContainer) return;

        const mediaHeight = mediaContainer.offsetHeight;
        carousel.querySelectorAll('.user-items-list-carousel__arrow-icon-holder').forEach(arrow => {
          arrow.style.height = mediaHeight + 'px';
          arrow.style.top = '0';
        });
      }

      updateArrowHeight();
      window.addEventListener('resize', updateArrowHeight);
    });
});


(function () {
  if (window !== window.parent) return;

  const first = document.getElementById('top-stack-section-v2');
  if (!first) return;

  const parent = first.parentElement;
  const wrapper = document.createElement('div');
  wrapper.className = 'st-outer-wrapper';

  parent.insertBefore(wrapper, first);
  wrapper.appendChild(first);

  let next = wrapper.nextElementSibling;
  while (next && next.id.startsWith('stack-section-v2')) {
    const after = next.nextElementSibling;
    wrapper.appendChild(next);
    next = after;
  }

  const topSection = first;
  const stackSections = [...document.querySelectorAll('[id^="stack-section-v2"]')];
  if (!stackSections.length) return;

  const originalPaddingTop = parseFloat(getComputedStyle(topSection).paddingTop);

  function calcStickyTop() {
    const topHeight = topSection.offsetHeight;
    const vpHeight = window.innerHeight;

    stackSections.forEach((section, i) => {
      const sectionHeight = section.offsetHeight;

      let stickyTop;
      if (sectionHeight <= vpHeight - topHeight) {
        stickyTop = topHeight;
      } else {
        stickyTop = vpHeight - sectionHeight;
      }

      section.style.top = `${stickyTop}px`;

      const isLast = i === stackSections.length - 1;
      const topZIndex = parseInt(getComputedStyle(topSection).zIndex) || 100;
      section.style.zIndex = isLast ? topZIndex + 1 : i + 1;
    });
  }

  function handleScroll() {
    const wrapperTop = wrapper.getBoundingClientRect().top;
    if (wrapperTop < 0) {
      topSection.style.paddingTop = '0px';
    } else {
      topSection.style.paddingTop = `${originalPaddingTop}px`;
    }
  }

  calcStickyTop();
  window.addEventListener('resize', calcStickyTop);
  window.addEventListener('scroll', handleScroll, { passive: true });
})();
