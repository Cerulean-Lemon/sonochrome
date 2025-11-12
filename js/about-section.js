// about-section.js - SONOCHROME Story Animations

gsap.registerPlugin(ScrollTrigger);

// ========================================
// 🎬 About Intro - 2 Cards Merge Effect
// ========================================

const introTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#about-intro",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5,
    pin: ".intro-container",
    anticipatePin: 1,
  },
});

introTimeline
  // 🎬 Phase 1: 카드들이 아래에서 위로 올라오며 등장
  .fromTo(
    ".intro-card",
    {
      y: "60vh",
      opacity: 0,
      rotateY: -180,
    },
    {
      y: "0vh",
      opacity: 1,
      rotateY: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power2.out",
    },
    0
  )
  
  // 🎬 Phase 2: 한글 텍스트 페이드 인
  .to(
    ".intro-text-subtitle",
    {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    },
    0.8
  )
  
  // 🎬 Phase 2 유지 (한글 텍스트 표시)
  .to({}, { duration: 0.7 })
  
  // 🎬 Phase 3: 한글 텍스트 페이드 아웃
  .to(
    ".intro-text-subtitle",
    {
      opacity: 0,
      y: -30,
      duration: 0.7,
      ease: "power2.in",
    },
    ">"
  )
  
  // 🎬 Phase 4: 두 카드가 중앙으로 이동
  .to(
    ".intro-card[data-card='photo']",
    {
      left: "50%",
      xPercent: -50,
      scale: 1.05,
      duration: 1.8,
      ease: "power2.inOut",
    },
    "-=0.5"
  )
  .to(
    ".intro-card[data-card='music']",
    {
      left: "50%",
      right: "auto",
      xPercent: -50,
      scale: 1.05,
      duration: 1.8,
      ease: "power2.inOut",
    },
    "-=1.8"
  )
  
  // 🎬 Phase 4: 포개지면서 블렌드 효과
  .to(
    ".intro-card[data-card='photo']",
    {
      opacity: 0.7,
      duration: 0.8,
      ease: "power2.inOut",
    },
    "-=1"
  )
  
  // 🎬 Phase 4 유지
  .to({}, { duration: 0.7 })
  
  // 🎬 Phase 5: 카드들이 위로 올라가며 사라짐
  .to(
    ".intro-card",
    {
      y: "-120vh",
      opacity: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "power2.in",
    },
    ">"
  );

// 카드 초기 상태 설정
gsap.set(".intro-card", {
  y: "60vh",
  opacity: 0,
  rotateY: -180,
  transformPerspective: 1000,
});

gsap.set(".intro-card[data-card='photo']", {
  left: "10vw",
  top: "50%",
  y: "60vh",
});

gsap.set(".intro-card[data-card='music']", {
  right: "10vw",
  top: "50%",
  y: "60vh",
});

gsap.set(".intro-text-subtitle", {
  opacity: 0,
});

// ========================================
// 📖 About Section - Story Animations
// ========================================

// 🎯 섹션 1: SONO + MONOCHROME 개념
const conceptTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".section-concept",
    start: "top 75%",
    end: "top 20%",
    toggleActions: "play none none reverse",
  },
});

conceptTimeline
  .fromTo(
    ".concept-eng",
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
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

// 🎯 섹션 2: 순간의 빛
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-light",
      start: "top 75%",
      end: "top 20%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".section-light .section-heading",
    { opacity: 0, x: -120 },
    { opacity: 1, x: 0, duration: 1.3, ease: "power3.out" }
  )
  .fromTo(
    ".section-light .section-subtext",
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
    "-=0.6"
  );

// 🎯 섹션 3: 음악 결합
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-music",
      start: "top 75%",
      end: "top 20%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".section-music .section-heading",
    { opacity: 0, x: 120 },
    { opacity: 1, x: 0, duration: 1.3, ease: "power3.out" }
  )
  .fromTo(
    ".section-music .section-subtext",
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
    "-=0.6"
  );

// 🎯 섹션 4: 새로운 의미
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-meaning",
      start: "top 75%",
      end: "top 20%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".section-meaning .section-heading",
    { opacity: 0, x: -120 },
    { opacity: 1, x: 0, duration: 1.3, ease: "power3.out" }
  )
  .fromTo(
    ".section-meaning .section-subtext",
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
    "-=0.6"
  );

// 🎯 섹션 5: 4개의 악장
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-symphony",
      start: "top 75%",
      end: "top 20%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".section-symphony .section-heading",
    { opacity: 0, x: 120 },
    { opacity: 1, x: 0, duration: 1.3, ease: "power3.out" }
  )
  .fromTo(
    ".section-symphony .section-subtext",
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
    "-=0.6"
  );

// 🎯 섹션 6: 클로징
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".section-closing",
      start: "top 75%",
      end: "top 20%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".closing-title",
    { opacity: 0, scale: 0.95, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" }
  );

console.log("✅ About Section - SONOCHROME Story Animations Loaded");
console.log("🎬 Korean subtitle appears after cards");
console.log("📸 Left: Grayscale Photo | 🎵 Right: Color Music");

// ========================================

// ========================================
// 📸 Story Images - Unified Reveal Animations
// ========================================

// 🎨 오른쪽 이미지들: 왼쪽에서 오른쪽으로 스르륵 등장 (1, 3번)
gsap.utils.toArray(".reveal-right").forEach((element, index) => {
  const section = element.closest(".story-section");
  
  gsap.fromTo(element, 
    {
      opacity: 0,
      clipPath: "inset(0% 0% 0% 100%)", // 시작: 왼쪽 완전히 가림
    },
    {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)", // 끝: 모두 보임
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // 추가 Parallax 효과
  gsap.to(element.querySelector(".story-image"), {
    x: 30,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
});

// 🎨 왼쪽 이미지들: 왼쪽에서 오른쪽으로 스르륵 등장 (2, 4번)
gsap.utils.toArray(".reveal-left").forEach((element, index) => {
  const section = element.closest(".story-section");
  
  gsap.fromTo(element, 
    {
      opacity: 0,
      clipPath: "inset(0% 100% 0% 0%)", // 시작: 오른쪽 완전히 가림 - 왼쪽에서 오른쪽으로 나타남
    },
    {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)", // 끝: 모두 보임
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // 추가 Parallax 효과
  gsap.to(element.querySelector(".story-image"), {
    x: -30,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
});

// 🎯 호버 효과 (마우스 오버 시 추가 애니메이션)
const imageWrappers = document.querySelectorAll(".story-image-wrapper");

imageWrappers.forEach((wrapper) => {
  const image = wrapper.querySelector(".story-image");

  wrapper.addEventListener("mouseenter", () => {
    gsap.to(image, {
      scale: 1.05,
      duration: 0.6,
      ease: "power2.out",
    });
  });

  wrapper.addEventListener("mouseleave", () => {
    gsap.to(image, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  });
});

console.log("📸 Story Images - Unified Reveal Animations Loaded");
console.log("✨ Right Images: Reveal from Right → Left");
console.log("✨ Left Images: Reveal from Left → Right");