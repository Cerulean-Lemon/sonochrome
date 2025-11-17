/**
 * SONOCHROME - Movement IV: ECHO Section (개선판)
 * 청춘의 메아리 - 무한 슬라이드 갤러리
 * 스크롤 문제 해결 및 레이아웃 개선
 */

// ============================================
// 전역 변수
// ============================================
let originalBodyOverflow = "";
let isModalOpen = false;

// ============================================
// 초기화
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎵 ECHO Section - 청춘의 메아리 시작");

  initInfiniteScroll();
  initImageLazyLoading();
  initHoverEffects();
  initResponsiveAdjustments();
  initImageClickHandler();

  // 스크롤 이벤트 방지 해제 확인
  checkScrollability();
});

// ============================================
// 스크롤 가능 여부 확인
// ============================================
function checkScrollability() {
  // 초기 body overflow 저장
  originalBodyOverflow = document.body.style.overflow || "";

  // 페이지 로드 시 스크롤이 막혀있다면 해제
  if (document.body.style.overflow === "hidden" && !isModalOpen) {
    document.body.style.overflow = originalBodyOverflow;
    console.log("⚠️ 스크롤 잠금 해제됨");
  }
}

// ============================================
// 무한 스크롤 초기화
// ============================================
function initInfiniteScroll() {
  const tracks = document.querySelectorAll(".scroll-track");

  tracks.forEach((track, index) => {
    const content = track.querySelector(".scroll-content");
    const cloneContainer = track.querySelector(".scroll-content-clone");

    if (content && cloneContainer) {
      // 원본 콘텐츠 복제
      const clonedItems = content.cloneNode(true);
      cloneContainer.innerHTML = clonedItems.innerHTML;

      // 트랙별 다른 애니메이션 속도 적용 (CSS에서 처리)
      track.classList.add(`track-${index + 1}`);

      // 이미지 로드 완료 후 애니메이션 시작
      const images = track.querySelectorAll("img");
      let loadedImages = 0;

      images.forEach((img) => {
        if (img.complete) {
          loadedImages++;
        } else {
          img.addEventListener("load", () => {
            loadedImages++;
            if (loadedImages === images.length) {
              track.classList.add("loaded");
            }
          });
        }
      });

      // 모든 이미지가 이미 로드된 경우
      if (loadedImages === images.length) {
        track.classList.add("loaded");
      }
    }
  });

  console.log("✅ 무한 스크롤 초기화 완료");
}

// ============================================
// 이미지 지연 로딩
// ============================================
function initImageLazyLoading() {
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // data-src가 있으면 사용, 없으면 현재 src 사용
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }

          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.01,
    }
  );

  // 모든 이미지 관찰
  const images = document.querySelectorAll(".echo-item img");
  images.forEach((img) => {
    imageObserver.observe(img);
  });

  console.log(`📸 ${images.length}개 이미지 지연 로딩 설정`);
}

// ============================================
// 호버 효과 개선
// ============================================
function initHoverEffects() {
  const echoItems = document.querySelectorAll(".echo-item");

  echoItems.forEach((item) => {
    // 마우스 진입
    item.addEventListener("mouseenter", function (e) {
      // 주변 아이템 살짝 흐리게
      const siblings = getSiblings(this);
      siblings.forEach((sibling) => {
        sibling.style.opacity = "0.7";
        sibling.style.filter = "brightness(0.8)";
      });

      // 현재 아이템 강조
      this.style.zIndex = "20";
    });

    // 마우스 이탈
    item.addEventListener("mouseleave", function (e) {
      // 모든 아이템 원래대로
      const siblings = getSiblings(this);
      siblings.forEach((sibling) => {
        sibling.style.opacity = "1";
        sibling.style.filter = "brightness(1)";
      });

      this.style.zIndex = "1";
    });

    // 터치 디바이스 대응
    item.addEventListener(
      "touchstart",
      function (e) {
        this.classList.add("touch-hover");
      },
      { passive: true }
    );

    item.addEventListener(
      "touchend",
      function (e) {
        setTimeout(() => {
          this.classList.remove("touch-hover");
        }, 500);
      },
      { passive: true }
    );
  });

  console.log("✨ 호버 효과 초기화 완료");
}

// ============================================
// 형제 요소 가져오기
// ============================================
function getSiblings(elem) {
  const siblings = [];
  let sibling = elem.parentNode.firstChild;

  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }

  return siblings;
}

// ============================================
// 반응형 조정
// ============================================
function initResponsiveAdjustments() {
  let resizeTimer;

  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const vw = window.innerWidth;
      const tracks = document.querySelectorAll(".scroll-track");

      // 화면 크기에 따라 애니메이션 속도 조정
      tracks.forEach((track, index) => {
        const content = track.querySelector(".scroll-content");
        const clone = track.querySelector(".scroll-content-clone");

        if (vw < 768) {
          // 모바일: 더 빠르게
          adjustAnimationSpeed(content, 25 + index * 3);
          adjustAnimationSpeed(clone, 25 + index * 3);
        } else if (vw < 1024) {
          // 태블릿: 중간 속도
          adjustAnimationSpeed(content, 30 + index * 5);
          adjustAnimationSpeed(clone, 30 + index * 5);
        } else {
          // 데스크톱: 기본 속도
          adjustAnimationSpeed(content, 40 + index * 5);
          adjustAnimationSpeed(clone, 40 + index * 5);
        }
      });

      console.log(`📱 반응형 조정: ${vw}px`);
    }, 250);
  }

  window.addEventListener("resize", handleResize);
  handleResize(); // 초기 실행
}

// ============================================
// 애니메이션 속도 조정
// ============================================
function adjustAnimationSpeed(element, duration) {
  if (element) {
    element.style.animationDuration = `${duration}s`;
  }
}

// ============================================
// 이미지 클릭 핸들러
// ============================================
function initImageClickHandler() {
  const echoItems = document.querySelectorAll(".echo-item");
  const modal = createImageModal();

  echoItems.forEach((item, index) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const img = this.querySelector("img");
      if (img) {
        openImageModal(img.src, img.alt, index);
      }
    });
  });

  console.log("🖱️ 이미지 클릭 핸들러 설정 완료");
}

// ============================================
// 이미지 모달 생성
// ============================================
function createImageModal() {
  // 모달이 이미 존재하면 반환
  const existingModal = document.getElementById("echo-modal");
  if (existingModal) {
    return existingModal;
  }

  // 모달 HTML 생성
  const modalHTML = `
        <div id="echo-modal" class="echo-modal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <img src="" alt="" class="modal-image">
                <div class="modal-info">
                    <p class="modal-caption"></p>
                    <span class="modal-index"></span>
                </div>
                <button class="modal-close">✕</button>
                <button class="modal-prev">‹</button>
                <button class="modal-next">›</button>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("echo-modal");
  const closeBtn = modal.querySelector(".modal-close");
  const overlay = modal.querySelector(".modal-overlay");
  const prevBtn = modal.querySelector(".modal-prev");
  const nextBtn = modal.querySelector(".modal-next");

  // 닫기 이벤트
  closeBtn.addEventListener("click", closeImageModal);
  overlay.addEventListener("click", closeImageModal);

  // 키보드 이벤트
  document.addEventListener("keydown", function (e) {
    if (isModalOpen) {
      if (e.key === "Escape") {
        closeImageModal();
      } else if (e.key === "ArrowLeft") {
        navigateModal("prev");
      } else if (e.key === "ArrowRight") {
        navigateModal("next");
      }
    }
  });

  // 네비게이션 버튼
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigateModal("prev");
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigateModal("next");
  });

  return modal;
}

// ============================================
// 이미지 모달 열기
// ============================================
function openImageModal(src, alt, index) {
  const modal = document.getElementById("echo-modal");

  if (!modal) {
    console.error("❌ 모달을 찾을 수 없습니다");
    return;
  }

  const modalImg = modal.querySelector(".modal-image");
  const modalCaption = modal.querySelector(".modal-caption");
  const modalIndex = modal.querySelector(".modal-index");

  // 이전 body overflow 저장
  originalBodyOverflow = document.body.style.overflow || "";

  modalImg.src = src;
  modalImg.alt = alt;
  modalCaption.textContent = alt || "청춘의 기록";

  // 현재 인덱스 저장
  modal.dataset.currentIndex = index;

  // 전체 이미지 개수
  const totalImages = document.querySelectorAll(".echo-item").length;
  modalIndex.textContent = `${index + 1} / ${totalImages}`;

  // 모달 열기
  modal.classList.add("active");
  isModalOpen = true;

  // body 스크롤 방지
  document.body.style.overflow = "hidden";

  console.log(`🖼️ 이미지 모달 열기: ${index + 1}번째 이미지`);
}

// ============================================
// 이미지 모달 닫기 (개선)
// ============================================
function closeImageModal() {
  const modal = document.getElementById("echo-modal");

  if (!modal || !isModalOpen) {
    return;
  }

  // 모달 닫기
  modal.classList.remove("active");
  isModalOpen = false;

  // body 스크롤 복원 - 강제로 스크롤 가능하게
  document.body.style.overflow = "";
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";

  // 약간의 지연 후 다시 한번 확인
  setTimeout(() => {
    if (!isModalOpen) {
      document.body.style.overflow = "";
      document.body.style.overflow = "auto";
      console.log("✅ 스크롤 복원 완료");
    }
  }, 100);

  console.log("🖼️ 이미지 모달 닫기");
}

// ============================================
// 모달 네비게이션
// ============================================
function navigateModal(direction) {
  const modal = document.getElementById("echo-modal");

  if (!modal || !isModalOpen) {
    return;
  }

  const currentIndex = parseInt(modal.dataset.currentIndex);
  const allItems = document.querySelectorAll(".echo-item");
  const totalImages = allItems.length;

  let newIndex;

  if (direction === "prev") {
    newIndex = currentIndex > 0 ? currentIndex - 1 : totalImages - 1;
  } else {
    newIndex = currentIndex < totalImages - 1 ? currentIndex + 1 : 0;
  }

  const newItem = allItems[newIndex];
  const newImg = newItem.querySelector("img");

  if (newImg) {
    // 모달 내용만 업데이트 (스크롤 상태는 유지)
    const modalImg = modal.querySelector(".modal-image");
    const modalCaption = modal.querySelector(".modal-caption");
    const modalIndex = modal.querySelector(".modal-index");

    modalImg.src = newImg.src;
    modalImg.alt = newImg.alt;
    modalCaption.textContent = newImg.alt || "청춘의 기록";
    modal.dataset.currentIndex = newIndex;
    modalIndex.textContent = `${newIndex + 1} / ${totalImages}`;
  }
}

// ============================================
// 스크롤 퍼포먼스 최적화
// ============================================
let ticking = false;

function requestTick() {
  if (!ticking) {
    window.requestAnimationFrame(updateAnimation);
    ticking = true;
  }
}

function updateAnimation() {
  // 애니메이션 업데이트 로직
  ticking = false;
}

// 스크롤 이벤트에 throttle 적용
window.addEventListener("scroll", requestTick, { passive: true });

// ============================================
// 페이지 이탈 시 스크롤 복원
// ============================================
window.addEventListener("beforeunload", function () {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
});

// ============================================
// 디버그 모드 (개발용)
// ============================================
if (window.location.hash === "#debug") {
  console.log("🔧 디버그 모드 활성화");

  // 스크롤 상태 모니터링
  setInterval(() => {
    console.log("Body overflow:", document.body.style.overflow);
    console.log("Modal open:", isModalOpen);
  }, 5000);
}

// ============================================
// 모듈 내보내기
// ============================================
window.EchoSection = {
  init: () => {
    initInfiniteScroll();
    initImageLazyLoading();
    initHoverEffects();
    initResponsiveAdjustments();
    initImageClickHandler();
    checkScrollability();
  },

  addImage: (src, alt, orientation = "landscape") => {
    // 동적으로 이미지 추가하는 함수
    const tracks = document.querySelectorAll(".scroll-content");
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];

    const item = document.createElement("div");
    item.className = `echo-item ${orientation}`;
    item.innerHTML = `<img src="${src}" alt="${alt}">`;

    randomTrack.appendChild(item);

    // 클론에도 추가
    const trackParent = randomTrack.closest(".scroll-track");
    const clone = trackParent.querySelector(".scroll-content-clone");
    if (clone) {
      clone.appendChild(item.cloneNode(true));
    }

    console.log(`➕ 새 이미지 추가: ${alt}`);
  },

  // 스크롤 잠금 해제 함수 (디버그용)
  unlockScroll: () => {
    document.body.style.overflow = "";
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    console.log("🔓 스크롤 강제 해제");
  },
};

console.log("🎵 ECHO Section 스크립트 로드 완료");
