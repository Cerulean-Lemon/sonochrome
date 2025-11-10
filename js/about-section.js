// about-section.js - SONOCHROME Story Animations

gsap.registerPlugin(ScrollTrigger);

// 🎯 섹션 1: SONO + MONOCHROME 개념 애니메이션
const conceptTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".section-concept",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
  },
});

conceptTimeline
  .to(".scroll-indicator", {
    opacity: 0,
    y: -20,
    duration: 0.6,
    ease: "power2.out",
  })
  .fromTo(
    ".concept-eng",
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" },
    "-=0.3"
  )
  .fromTo(
    ".concept-plus",
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
    "-=0.8"
  )
  .fromTo(
    ".concept-kor",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out" },
    "-=0.6"
  )
  .fromTo(
    ".hero-title",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
    "-=0.4"
  )
  .fromTo(
    ".hero-subtitle",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    "-=0.6"
  );

// 🎯 섹션 2: 순간의 빛 - 좌측 정렬
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-light",
      start: "top 70%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".section-light .section-heading",
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }
  )
  .fromTo(
    ".section-light .section-subtext",
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
    "-=0.6"
  );

// 🎯 섹션 3: 음악 결합 - 우측 정렬
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-music",
      start: "top 70%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".section-music .section-heading",
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }
  )
  .fromTo(
    ".section-music .section-subtext",
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
    "-=0.6"
  );

// 🎯 섹션 4: 새로운 의미 - 좌측 정렬
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-meaning",
      start: "top 70%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".section-meaning .section-heading",
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }
  )
  .fromTo(
    ".section-meaning .section-subtext",
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
    "-=0.6"
  );

// 🎯 섹션 5: 4개의 악장 - 우측 정렬
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-symphony",
      start: "top 70%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".section-symphony .section-heading",
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }
  )
  .fromTo(
    ".section-symphony .section-subtext",
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
    "-=0.6"
  );

// 🎯 섹션 6: 클로징 - 중앙 정렬
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-closing",
      start: "top 70%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".closing-title",
    { opacity: 0, scale: 0.95, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" }
  );

// 🎯 SCROLL 인디케이터 페이드 아웃
ScrollTrigger.create({
  trigger: ".section-concept",
  start: "top top",
  end: "bottom top",
  onEnter: () =>
    gsap.to(".scroll-indicator", {
      opacity: 0,
      y: -20,
      duration: 0.5,
    }),
  onLeaveBack: () =>
    gsap.to(".scroll-indicator", {
      opacity: 1,
      y: 0,
      duration: 0.5,
    }),
});

console.log("✅ About Section - SONOCHROME Story Animations Loaded");
