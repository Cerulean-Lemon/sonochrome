/* lenis-scroll.js */
/* 🚫 Lenis 제거 - 기본 스크롤 사용 */

function initSmoothScroll() {
  // 앵커 링크 부드럽게 스크롤 (기본 CSS scroll-behavior 사용)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return; // # 단독은 무시

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  console.log("✅ Smooth scroll initialized (CSS scroll-behavior)");
}

// 페이지 로드 후 실행
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSmoothScroll);
} else {
  initSmoothScroll();
}
