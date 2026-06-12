/**
 * BIJALDOSHI Architects - Interactive Script
 * Handles custom loader, custom cursor, full-screen menu, horizontal scroll, and accordion reveals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Wrap each init in its own try/catch so one failure never silently
  // prevents the remaining init functions from running.
  [initLoader, initMobileMenu, initScrollAnimations,
   initAboutSwiper, initProjectsSplit, initHorizontalScroll,
   initProjectDrawer, initHeroScroll, initNavigation
  ].forEach(fn => {
    try { fn(); } catch (e) { console.error(`[BIJALDOSHI] ${fn.name} failed:`, e); }
  });
});

/* 1. Page Loader Counter */
function initLoader() {
  const loader = document.getElementById('loader');
  const progressText = document.getElementById('loading-progress');
  if (!loader || !progressText) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 300);
    }
    progressText.textContent = progress;
  }, 60);
}



/* 3. Fullscreen Menu & Scroll Trigger */
function initMobileMenu() {
  const btnMenu = document.getElementById('bt-menu');
  const overlay = document.querySelector('.menu-overlay');
  
  if (!btnMenu || !overlay) return;

  btnMenu.addEventListener('click', () => {
    const isActive = overlay.classList.toggle('active');
    document.body.classList.toggle('menu-active', isActive);
  });

  // Close menu and smooth scroll when links are clicked
  const menuLinks = overlay.querySelectorAll('.menu-list a');
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.remove('active');
      document.body.classList.remove('menu-active');

      const targetSelector = link.getAttribute('data-scrollto');
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 500); // Wait for menu close transition
      }
    });
  });
}

/* 4. Intersection Observer for Scroll Reveals */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* 5. Simple About Swiper Carousel */
function initAboutSwiper() {
  // Selector corrected to match the actual HTML class (.swiper-carousel)
  const slides = document.querySelectorAll('.swiper-carousel .swiper-slide-img');
  if (slides.length === 0) return;

  let activeIndex = 0;
  const intervalTime = 4000;

  function rotateSlides() {
    slides[activeIndex].classList.remove('active');
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add('active');
  }

  setInterval(rotateSlides, intervalTime);
}

/* 6. Projects Split-Screen List & Category Filter */
function initProjectsSplit() {
  const filterBtns = document.querySelectorAll('.projects-filter-btn');
  const rows = document.querySelectorAll('.project-list-row');
  const showcaseImg = document.getElementById('showcase-img-primary');
  const showcaseTitle = document.getElementById('showcase-title');
  const showcaseSubtitle = document.getElementById('showcase-subtitle');
  const showcasePrinciple = document.getElementById('showcase-principle');

  if (rows.length === 0) return;

  // Showcase Update Helper
  const updateShowcase = (row) => {
    if (!row || !showcaseImg) return;
    const title = row.getAttribute('data-title');
    const subtitle = row.getAttribute('data-subtitle');
    const img = row.getAttribute('data-img');
    const principle = row.getAttribute('data-principle');
    const principleText = row.getAttribute('data-principle-text');

    // Fade out and scale image slightly
    showcaseImg.classList.add('transition-effect');
    
    // Update texts and source during the fade transition
    setTimeout(() => {
      showcaseImg.src = img;
      showcaseImg.alt = title;
      if (showcaseTitle) showcaseTitle.textContent = title;
      if (showcaseSubtitle) showcaseSubtitle.textContent = subtitle;
      if (showcasePrinciple) showcasePrinciple.textContent = principle;
      
      // Hook up removal of fade classes
      showcaseImg.onload = () => {
        showcaseImg.classList.remove('transition-effect');
      };
      
      // Fallback for cached images
      if (showcaseImg.complete) {
        showcaseImg.classList.remove('transition-effect');
      }
    }, 150);
  };

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      rows.forEach(row => {
        const category = row.getAttribute('data-get-category');
        if (filter === 'all' || category === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });

      // Automatically highlight and showcase the first visible project after filtering
      const visibleRows = Array.from(rows).filter(r => r.style.display !== 'none');
      if (visibleRows.length > 0) {
        rows.forEach(r => r.classList.remove('active'));
        visibleRows[0].classList.add('active');
        updateShowcase(visibleRows[0]);
      }
    });
  });

  // Hover interactions (Desktop only)
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      if (window.innerWidth > 1024) {
        rows.forEach(r => r.classList.remove('active'));
        row.classList.add('active');
        updateShowcase(row);
      }
    });
  });
}

/* 7. Concepts Horizontal Scroll translate */
function initHorizontalScroll() {
  const section = document.querySelector('.home-things-that-inspire');
  const container = document.querySelector('.horizontal-scroll-container');
  if (!section || !container) return;

  const handleScroll = () => {
    // Only run horizontal translate scroll on desktop (> 768px)
    if (window.innerWidth > 768) {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const scrollableHeight = sectionHeight - window.innerHeight;
      
      if (rect.top <= 0 && rect.top >= -scrollableHeight) {
        // Calculate scroll progress (0 to 1)
        const progress = -rect.top / scrollableHeight;
        const maxScroll = container.offsetWidth - window.innerWidth;
        const translateX = -progress * maxScroll;
        
        container.style.transform = `translateX(${translateX}px)`;
      } else if (rect.top > 0) {
        container.style.transform = 'translateX(0px)';
      } else {
        const maxScroll = container.offsetWidth - window.innerWidth;
        container.style.transform = `translateX(${-maxScroll}px)`;
      }
    } else {
      // Clear transform on mobile so vertical stacking styling works
      container.style.transform = '';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  
  // Run once initially
  handleScroll();
}

/* 8. Project Details Drawer overlay */
function initProjectDrawer() {
  const projectRows = document.querySelectorAll('.project-list-row');
  const projectCards = document.querySelectorAll('.project-card');
  const drawer = document.querySelector('.project-drawer');
  const closeBtns = document.querySelectorAll('.drawer-close');

  if (!drawer || closeBtns.length === 0) return;

  // Pool of category-specific premium images
  const categoryImagesMap = {
    'infrastructure': [
      'random_images/institutional-02.jpg',
      'random_images/institutional-04.jpg',
      'generated_images/inflatable_pavilion.png',
      'random_images/banner-02.jpg',
      'random_images/banner-04.jpg',
      'random_images/banner-05.jpg'
    ],
    'interior-design': [
      'random_images/sample-flats-05.jpg',
      'random_images/sample-flats-06.jpg',
      'random_images/about-img.jpg',
      'generated_images/hero_concrete.png',
      'generated_images/interior_light.png'
    ],
    'housing': [
      'random_images/residential-02.jpg',
      'random_images/residential-03.jpg',
      'random_images/residential-04.jpg',
      'random_images/residential-05.jpg',
      'random_images/residential-06.jpg'
    ],
    'masterplan': [
      'random_images/commercial-02.jpg',
      'random_images/commercial-03.jpg',
      'random_images/commercial-04.jpg',
      'random_images/commercial-05.jpg',
      'random_images/commercial-06.jpg',
      'random_images/commercial-07.jpg'
    ]
  };

  let currentSlideIndex = 0;
  let totalSlides = 0;

  const slidesContainer = drawer.querySelector('#slider-slides');
  const dotsContainer = drawer.querySelector('#slider-dots');
  const prevBtn = drawer.querySelector('.prev-btn');
  const nextBtn = drawer.querySelector('.next-btn');

  const goToSlide = (index) => {
    if (totalSlides === 0) return;
    currentSlideIndex = (index + totalSlides) % totalSlides;
    if (slidesContainer) {
      slidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    
    // Update active dot
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentSlideIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  };

  // Bind click events to the slider navigation buttons once
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlideIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlideIndex + 1);
    });
  }

  const populateAndOpen = (element) => {
    const title = element.getAttribute('data-title');
    const subtitle = element.getAttribute('data-subtitle');
    const year = element.getAttribute('data-year');
    const location = element.getAttribute('data-location');
    const desc = element.getAttribute('data-desc');
    const img = element.getAttribute('data-img');
    const principle = element.getAttribute('data-principle');
    const principleText = element.getAttribute('data-principle-text');
    const category = element.getAttribute('data-get-category') || 'housing';

    drawer.querySelector('#drawer-title').textContent = title || "";
    drawer.querySelector('#drawer-subtitle').textContent = subtitle || "";
    drawer.querySelector('#drawer-year').textContent = year || "";
    drawer.querySelector('#drawer-location').textContent = location || "";
    drawer.querySelector('#drawer-description').textContent = desc || "";
    drawer.querySelector('#drawer-principle').textContent = principle || "";
    drawer.querySelector('#drawer-principle-text').textContent = principleText || "";

    // Clear and dynamically populate drawer gallery slider
    if (slidesContainer && dotsContainer) {
      slidesContainer.innerHTML = '';
      dotsContainer.innerHTML = '';
      
      const pool = categoryImagesMap[category] || [];
      // Filter out main image from category pool to prevent duplicates
      const extraImages = pool.filter(src => src !== img);
      const allImages = [img, ...extraImages];
      
      totalSlides = allImages.length;
      currentSlideIndex = 0;
      
      allImages.forEach((imgSrc, idx) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'slider-slide';
        
        const imgEl = document.createElement('img');
        imgEl.src = imgSrc;
        imgEl.alt = `${title || 'Project'} view ${idx + 1}`;
        
        slide.appendChild(imgEl);
        slidesContainer.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('button');
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(idx);
        });
        dotsContainer.appendChild(dot);
      });
      
      // Reset position
      slidesContainer.style.transform = 'translateX(0)';
      
      // Hide buttons if there's only 1 image
      const displayStyle = totalSlides <= 1 ? 'none' : 'flex';
      if (prevBtn) prevBtn.style.display = displayStyle;
      if (nextBtn) nextBtn.style.display = displayStyle;
      dotsContainer.style.display = totalSlides <= 1 ? 'none' : 'flex';
    }

    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Open triggers
  projectRows.forEach(row => {
    row.addEventListener('click', () => {
      populateAndOpen(row);
    });
  });

  // Showcase Explore button trigger
  const exploreBtn = document.getElementById('showcase-explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const activeRow = document.querySelector('.project-list-row.active');
      if (activeRow) {
        populateAndOpen(activeRow);
      }
    });
  }

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      populateAndOpen(card);
    });
  });

  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      populateAndOpen(card);
    });
  });

  // Close triggers
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* 9. Scroll-Driven Hero Sequence */
function initHeroScroll() {
  const introSection = document.querySelector('.home-intro');
  if (!introSection) return;

  const handleScroll = () => {
    if (window.innerWidth <= 1024) {
      return;
    }

    const rect = introSection.getBoundingClientRect();
    const scrollTop = -rect.top;
    const scrollHeight = rect.height - window.innerHeight;

    let scrollSvh = 0;
    if (scrollTop > 0) {
      const scrollFraction = Math.min(1, Math.max(0, scrollTop / scrollHeight));
      scrollSvh = scrollFraction * 400; // Map total scroll track to 400svh
    }

    introSection.style.setProperty('--scroll-svh', scrollSvh.toFixed(2));
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', handleScroll);
  
  // Run initially
  handleScroll();
}

/* 10. Navigation Bar (Desktop links & Mobile Floating Tab Bar with ScrollSpy) */
function initNavigation() {
  const sections = document.querySelectorAll('section[id], footer');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-links a[data-scrollto]');
  const mobileLinks = document.querySelectorAll('.mobile-tab-bar .tab-item[data-scrollto]');
  const mobileTabBar = document.querySelector('.mobile-tab-bar');

  // 1. General Smooth Scroll click handler for all nav links
  const allScrollLinks = document.querySelectorAll('[data-scrollto]');
  allScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();



      const targetSelector = link.getAttribute('data-scrollto');
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        // Close menu overlay if open
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
          overlay.classList.remove('active');
          document.body.classList.remove('menu-active');
        }

        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 2. ScrollSpy handler
  const handleScrollSpy = () => {
    let currentSectionId = "";
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const sectionTop = rect.top;
      
      // Calculate section active threshold
      // Section is considered active if it covers the center of the viewport (40% mark)
      if (sectionTop <= window.innerHeight * 0.4 && (sectionTop + sectionHeight) >= window.innerHeight * 0.4) {
        currentSectionId = section.getAttribute('id') || section.tagName.toLowerCase();
      }
    });

    if (!currentSectionId) return;

    // Update desktop nav links
    desktopLinks.forEach(link => {
      const target = link.getAttribute('data-scrollto');
      if (target === `#${currentSectionId}` || (target === 'footer' && currentSectionId === 'footer')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update mobile floating tab bar items
    mobileLinks.forEach(link => {
      const target = link.getAttribute('data-scrollto');
      if (target === `#${currentSectionId}` || (target === 'footer' && currentSectionId === 'footer')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  // 3. Mobile Tab Bar Auto-Hide on Scroll Down / Show on Scroll Up
  let lastScrollTop = 0;
  const handleTabBarHide = () => {
    if (window.innerWidth <= 1024 && mobileTabBar) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll down - hide bar using GPU-accelerated translation
        mobileTabBar.style.transform = 'translateX(-50%) translateY(6rem)';
      } else {
        // Scroll up - show bar
        mobileTabBar.style.transform = 'translateX(-50%) translateY(0)';
      }
      lastScrollTop = Math.max(0, scrollTop);
    }
  };

  // Bind event listeners
  let spyTicking = false;
  let hideTicking = false;

  window.addEventListener('scroll', () => {
    if (!spyTicking) {
      window.requestAnimationFrame(() => {
        handleScrollSpy();
        spyTicking = false;
      });
      spyTicking = true;
    }

    if (!hideTicking) {
      window.requestAnimationFrame(() => {
        handleTabBarHide();
        hideTicking = false;
      });
      hideTicking = true;
    }
  });

  window.addEventListener('resize', handleScrollSpy);

  // Initialize scrollspy state on mount
  handleScrollSpy();
}


