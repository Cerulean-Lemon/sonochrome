// ============================================
// 🎵 WORKS SECTION - JavaScript
// Swiper만 담당 (GLightbox는 works-music-integration.js에서 처리)
// ============================================

// ============================================
// 🎬 GSAP ScrollTrigger 등록
// ============================================
if (typeof gsap !== "undefined" && gsap.registerPlugin) {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// 🖱️ 마우스 휠 가로 스크롤 헬퍼 함수
// ============================================
function enableHorizontalWheelScroll(swiper, container) {
  let isInside = false;
  let accumulatedDelta = 0;
  const THRESHOLD = 100;
  let isScrolling = false;

  container.addEventListener("mouseenter", () => {
    isInside = true;
  });

  container.addEventListener("mouseleave", () => {
    isInside = false;
    accumulatedDelta = 0;
  });

  const wheelHandler = (e) => {
    if (!isInside) return;

    const currentSlide = swiper.activeIndex;
    const isAtStart = currentSlide === 0;
    const isAtEnd = currentSlide === swiper.slides.length - 1;
    const delta = e.deltaY;

    // ✅ 항상 세로 스크롤 차단 (첫 번째/마지막에서도)
    e.preventDefault();
    e.stopPropagation();

    if (isScrolling) return;

    accumulatedDelta += delta;

    if (Math.abs(accumulatedDelta) >= THRESHOLD) {
      isScrolling = true;

      if (accumulatedDelta > 0) {
        if (!isAtEnd) {
          swiper.slideNext();
        }
      } else if (accumulatedDelta < 0) {
        if (!isAtStart) {
          swiper.slidePrev();
        }
      }

      accumulatedDelta = 0;

      setTimeout(() => {
        isScrolling = false;
      }, 300);
    }
  };

  container.addEventListener("wheel", wheelHandler, { passive: false });
}

// ============================================
// 🎠 Swiper 초기화
// ============================================
function initWorkSwipers() {
  const workSwiper1 = new Swiper(".workSwiper1", {
    slidesPerView: "auto",
    spaceBetween: 30,
    centeredSlides: false,
    speed: 600,
    freeMode: {
      enabled: true,
      sticky: false,
      momentum: true,
      momentumRatio: 0.5,
      momentumVelocityRatio: 0.5,
    },
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      320: {
        spaceBetween: 20,
      },
      768: {
        spaceBetween: 25,
      },
      1024: {
        spaceBetween: 30,
      },
    },
    on: {
      init: function () {
        const swiperContainer = document.querySelector(
          ".works-carousel-wrapper"
        );
        if (swiperContainer) {
          requestAnimationFrame(() => {
            enableHorizontalWheelScroll(this, swiperContainer);
          });
        }
      },
    },
  });

  return workSwiper1;
}

// ============================================
// 🎴 Work Cards 애니메이션
// ============================================
function initWorksAnimation() {
  if (typeof gsap === "undefined") {
    console.warn("⚠️ GSAP not loaded, skipping animations");
    return;
  }

  const workCards = document.querySelectorAll(".work-card");

  workCards.forEach((card, index) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        end: "top 60%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power2.out",
    });
  });
}

// ============================================
// ✨ Movement Header 애니메이션
// ============================================
function initMovementHeaderAnimation() {
  if (typeof gsap === "undefined") {
    console.warn("⚠️ GSAP not loaded, skipping header animations");
    return;
  }

  const movementHeaders = document.querySelectorAll(".movement-header");

  movementHeaders.forEach((header) => {
    const children = Array.from(header.children);

    gsap.from(children, {
      scrollTrigger: {
        trigger: header,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
    });
  });
}

// ============================================
// 🚀 초기화 함수
// ============================================
function initWorksSection() {
  if (typeof Swiper === "undefined") {
    console.error("❌ Swiper library not loaded!");
    return;
  }

  try {
    initWorkSwipers();
    // ❌ GLightbox는 works-music-integration.js에서 초기화
    initWorksAnimation();
    initMovementHeaderAnimation();
  } catch (error) {
    console.error("❌ Error initializing Works Section:", error);
  }
}

// ============================================
// 🎯 자동 실행
// ============================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWorksSection);
} else {
  initWorksSection();
}

// ============================================
// 📤 Export
// ============================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initWorksSection,
    initWorkSwipers,
    initWorksAnimation,
    initMovementHeaderAnimation,
  };
}
