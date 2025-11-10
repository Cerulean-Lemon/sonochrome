/* =========================
   페이지 초기화 스크립트
   - 새로고침 시 최상단으로 이동
   - 스크롤 위치 초기화
   ========================= */

// 페이지 로드/새로고침 시 무조건 최상단으로
(function () {
  "use strict";

  // 1. 히스토리 스크롤 복원 비활성화
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // 2. 즉시 최상단으로 이동 (가장 빠르게)
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // 3. DOM 로드 전에도 실행
  window.addEventListener("beforeunload", function () {
    window.scrollTo(0, 0);
  });

  // 4. DOM 로드 완료 후에도 한 번 더 확인
  window.addEventListener("DOMContentLoaded", function () {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });

  // 5. 페이지 완전 로드 후 최종 확인
  window.addEventListener("load", function () {
    setTimeout(function () {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  });
})();
