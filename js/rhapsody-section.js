// ============================================
// 🎼 MOVEMENT III - RHAPSODY SECTION (v3.0)
// 세로로 긴 스크롤 기반 갤러리
// ============================================

// GSAP 플러그인 등록
if (typeof gsap !== "undefined" && gsap.registerPlugin) {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// 🎨 랩소디 갤러리 초기화
// ============================================
function initRhapsodySection() {
  console.log("🚀 Rhapsody Section v3.0 초기화");

  const rhapsodySection = document.querySelector(".movement-rhapsody");
  if (!rhapsodySection) return;

  // 이미지 데이터 - 다양한 크기와 애니메이션 타입
  const rhapsodyImages = [
    {
      src: "images/rhapsody-section1.jpg",
      title: "자유로운 순간",
      date: "24.03.15",
      size: "size-large",
      animation: "reveal-left", // 왼쪽에서 오른쪽으로 reveal
    },
    {
      src: "images/rhapsody-section2.jpg",
      title: "빛의 흔적",
      date: "24.04.22",
      size: "size-medium",
      animation: "scale-up", // 작게 시작해서 커지며 등장
    },
    {
      src: "images/rhapsody-section3.jpg",
      title: "도시의 리듬",
      date: "24.05.10",
      size: "size-wide",
      animation: "reveal-left", // 오른쪽에서 왼쪽으로 reveal
    },
    {
      src: "images/rhapsody-section4.jpg",
      title: "침묵의 소리",
      date: "24.06.03",
      size: "size-tall",
      animation: "fade-in", // 단순 페이드인
    },
    {
      src: "images/rhapsody-section5.jpg",
      title: "색의 대화",
      date: "24.07.18",
      size: "size-medium",
      animation: "reveal-bottom", // 아래에서 위로 reveal
    },
    {
      src: "images/rhapsody-section6.jpg",
      title: "시간의 층",
      date: "24.08.25",
      size: "size-large",
      animation: "scale-rotate", // 확대 + 회전
    },
    {
      src: "images/rhapsody-section7.jpg",
      title: "공간의 춤",
      date: "24.09.12",
      size: "size-wide",
      animation: "reveal-left", // 왼쪽에서 오른쪽으로 reveal
    },
    {
      src: "images/rhapsody-section8.jpg",
      title: "기억의 조각",
      date: "24.10.07",
      size: "size-medium",
      animation: "scale-up", // 작게 시작해서 커지며 등장
    },
    {
      src: "images/rhapsody-section9.jpg",
      title: "감정의 스펙트럼",
      date: "24.11.20",
      size: "size-large",
      animation: "reveal-left", // 오른쪽에서 왼쪽으로 reveal
    },
    {
      src: "images/rhapsody-section10.jpg",
      title: "무한의 경계",
      date: "24.12.15",
      size: "size-tall",
      animation: "fade-in", // 단순 페이드인
    },
    {
      src: "images/rhapsody-section11.jpg",
      title: "",
      date: "",
      size: "size-large",
      animation: "reveal-left", //
    },
    {
      src: "images/rhapsody-section12.jpg",
      title: "",
      date: "",
      size: "size-wide",
      animation: "scale-up", //
    },
    {
      src: "images/rhapsody-section13.jpg",
      title: "",
      date: "",
      size: "size-tall",
      animation: "fade-in", //
    },
    {
      src: "images/rhapsody-section14.jpg",
      title: "",
      date: "",
      size: "size-tall",
      animation: "reveal-right", //
    },
    {
      src: "images/rhapsody-section15.jpg",
      title: "",
      date: "",
      size: "size-large",
      animation: "scale-rotate", //
    },
  ];

  // ============================================
  // 🖼️ HTML 구조 생성
  // ============================================
  function createGalleryStructure() {
    // 기존 갤러리 제거
    const existingGallery = rhapsodySection.querySelector(
      ".rhapsody-gallery-flow"
    );
    if (existingGallery) {
      existingGallery.remove();
    }

    // 갤러리 컨테이너 생성
    const galleryFlow = document.createElement("div");
    galleryFlow.className = "rhapsody-gallery-flow";

    // 각 이미지를 위한 섹션 생성
    rhapsodyImages.forEach((image, index) => {
      const section = document.createElement("div");
      section.className = "rhapsody-item-section";

      // 배경 텍스트 (선택적)
      const bgText = document.createElement("div");
      bgText.className = "rhapsody-item-text";
      bgText.textContent = String(index + 1).padStart(2, "0");

      // 이미지 컨테이너
      const container = document.createElement("div");
      container.className = `rhapsody-image-container ${image.size} ${image.animation}`;

      container.innerHTML = `
        <div class="rhapsody-image-wrap">
          <img src="${image.src}" alt="${image.title}" loading="lazy">
          <div class="rhapsody-image-info">
            <h4>${image.title}</h4>
            <span>${image.date}</span>
          </div>
        </div>
      `;

      section.appendChild(bgText);
      section.appendChild(container);
      galleryFlow.appendChild(section);
    });

    rhapsodySection.appendChild(galleryFlow);
  }

  createGalleryStructure();

  // ============================================
  // 🎬 GSAP 애니메이션 설정 - 다양한 reveal 효과
  // ============================================

  // 헤더 애니메이션
  gsap.to(".rhapsody-header", {
    scrollTrigger: {
      trigger: ".rhapsody-header",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out",
  });

  // 각 이미지 섹션별 애니메이션 적용
  const imageSections = document.querySelectorAll(".rhapsody-item-section");

  imageSections.forEach((section, index) => {
    const imageContainer = section.querySelector(".rhapsody-image-container");
    const bgText = section.querySelector(".rhapsody-item-text");
    const animationType = imageContainer.classList.contains("reveal-right")
      ? "reveal-right"
      : imageContainer.classList.contains("reveal-left")
      ? "reveal-left"
      : imageContainer.classList.contains("reveal-bottom")
      ? "reveal-bottom"
      : imageContainer.classList.contains("scale-up")
      ? "scale-up"
      : imageContainer.classList.contains("scale-rotate")
      ? "scale-rotate"
      : "fade-in";

    // ============================================
    // 🎨 애니메이션 타입별 처리
    // ============================================

    if (animationType === "reveal-right") {
      // 왼쪽에서 오른쪽으로 reveal
      gsap.fromTo(
        imageContainer,
        {
          opacity: 0,
          clipPath: "inset(0% 0% 0% 100%)",
        },
        {
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
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

      // Parallax 효과
      gsap.to(imageContainer, {
        x: 40,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    } else if (animationType === "reveal-left") {
      // 오른쪽에서 왼쪽으로 reveal
      gsap.fromTo(
        imageContainer,
        {
          opacity: 0,
          clipPath: "inset(0% 100% 0% 0%)",
        },
        {
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
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

      // Parallax 효과 (반대 방향)
      gsap.to(imageContainer, {
        x: -40,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    } else if (animationType === "reveal-bottom") {
      // 아래에서 위로 reveal
      gsap.fromTo(
        imageContainer,
        {
          opacity: 0,
          clipPath: "inset(100% 0% 0% 0%)",
        },
        {
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
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

      // Parallax 효과
      gsap.to(imageContainer, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    } else if (animationType === "scale-up") {
      // 작게 시작해서 커지며 등장
      gsap.fromTo(
        imageContainer,
        {
          opacity: 0,
          scale: 0.6,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 스크롤에 따라 살짝 더 커지는 효과
      gsap.to(imageContainer, {
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    } else if (animationType === "scale-rotate") {
      // 확대 + 회전 효과
      gsap.fromTo(
        imageContainer,
        {
          opacity: 0,
          scale: 0.7,
          rotation: -15,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Parallax 효과
      gsap.to(imageContainer, {
        y: -30,
        rotation: 3,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    } else {
      // 기본 fade-in
      gsap.fromTo(
        imageContainer,
        {
          opacity: 0,
          y: 80,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // 배경 텍스트 애니메이션
    if (bgText) {
      gsap.fromTo(
        bgText,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 배경 텍스트 Parallax (부드럽게 움직임)
      gsap.to(bgText, {
        y: 50,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
  });

  console.log("✅ Rhapsody Section v3.0 초기화 완료");

  // ============================================
  // 🎯 추가 스크롤 인터랙션
  // ============================================

  // 일부 이미지에 대한 추가 zoom 효과
  document
    .querySelectorAll(".rhapsody-item-section:nth-child(3n)")
    .forEach((section) => {
      const img = section.querySelector(".rhapsody-image-wrap img");
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "center center",
              scrub: 1,
            },
          }
        );
      }
    });

  // 배경 텍스트 blur 효과
  document.querySelectorAll(".rhapsody-item-text").forEach((text) => {
    gsap.to(text, {
      filter: "blur(10px)",
      ease: "none",
      scrollTrigger: {
        trigger: text.closest(".rhapsody-item-section"),
        start: "top 50%",
        end: "bottom 50%",
        scrub: 1,
      },
    });
  });
}

// ============================================
// 🎯 자동 실행
// ============================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRhapsodySection);
} else {
  initRhapsodySection();
}

// ============================================
// 📤 Export
// ============================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = { initRhapsodySection };
}
