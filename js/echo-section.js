/**
 * SONOCHROME - Movement IV: ECHO Section (완전 수정)
 * reverse 방향 완벽하게 작동!
 */

// ============================================
// 전역 변수
// ============================================
let originalBodyOverflow = "";
let isModalOpen = false;
let currentModalIndex = 0;
let allImages = [];

// 무한 스크롤 관련
const scrollers = [];

// ============================================
// 화면 크기에 따른 최적 복제 개수 계산
// ============================================
function getOptimalCloneCount(track, itemWidth, gap, originalItemCount) {
  const screenWidth = window.innerWidth;
  const singleSetWidth = (itemWidth + gap) * originalItemCount;
  
  // 화면을 최소 3번 이상 채울 수 있는 복제 개수 계산
  const minSets = Math.ceil((screenWidth * 3) / singleSetWidth);
  
  // 최소 4세트, 최대 8세트
  const cloneCount = Math.max(4, Math.min(8, minSets));
  
  console.log(`📐 화면: ${screenWidth}px, 1세트: ${Math.round(singleSetWidth)}px → ${cloneCount}세트 복제`);
  
  return cloneCount;
}

// ============================================
// 초기화
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎵 ECHO Section - 완벽한 무한 스크롤 시작 (완전 수정)");

  initPerfectInfiniteScroll();
  initImageArray();
  initImageLazyLoading();
  initHoverEffects();
  initImageClickHandler();
  checkScrollability();
});

// ============================================
// 완벽한 무한 스크롤 초기화 (화면 크기 대응 개선!)
// ============================================
function initPerfectInfiniteScroll() {
  const tracks = document.querySelectorAll(".scroll-track");

  tracks.forEach((track, trackIndex) => {
    const inner = track.querySelector(".scroll-track-inner");
    const items = Array.from(inner.querySelectorAll(".echo-item"));

    if (items.length === 0) return;

    // 속도 설정
    const speed = Math.abs(parseFloat(track.dataset.speed) || 0.5);
    const direction = track.dataset.direction || "normal";

    // 원본 HTML 저장 (복제 전)
    const originalHTML = inner.innerHTML;
    const originalItemCount = items.length;

    // 임시로 크기 측정을 위해 원본 렌더링
    const tempItem = items[0];
    const itemWidth = tempItem.offsetWidth;
    const gap = parseFloat(getComputedStyle(inner).gap.replace("px", "")) || 0;

    // 화면 크기에 따라 최적 복제 개수 계산
    const cloneCount = getOptimalCloneCount(track, itemWidth, gap, originalItemCount);

    // 동적으로 복제
    let clonedHTML = originalHTML;
    for (let i = 1; i < cloneCount; i++) {
      clonedHTML += originalHTML;
    }
    inner.innerHTML = clonedHTML;

    // 모든 아이템 다시 가져오기
    const allItems = Array.from(inner.querySelectorAll(".echo-item"));

    // 스크롤러 객체 생성
    const scroller = {
      track: track,
      inner: inner,
      speed: speed,
      direction: direction,
      position: 0,
      isPaused: false,
      items: allItems,
      originalItemCount: originalItemCount,
      originalHTML: originalHTML,  // 리사이즈 시 재사용
      cloneCount: cloneCount,      // 현재 복제 개수 저장
    };

    // 크기 계산
    if (allItems[0]) {
      scroller.itemWidth = allItems[0].offsetWidth;
      scroller.gap =
        parseFloat(getComputedStyle(inner).gap.replace("px", "")) || 0;
      scroller.totalWidth =
        (scroller.itemWidth + scroller.gap) * originalItemCount;
    }

    // 초기 위치 설정
    if (direction === "reverse") {
      // reverse: 중간에서 시작 (절반 위치)
      scroller.position = -scroller.totalWidth * Math.floor(cloneCount / 2);
    } else {
      // normal: 처음에서 시작
      scroller.position = 0;
    }

    scrollers.push(scroller);

    // 호버 이벤트
    track.addEventListener("mouseenter", () => {
      scroller.isPaused = true;
    });

    track.addEventListener("mouseleave", () => {
      scroller.isPaused = false;
    });

    console.log(`✅ Track ${trackIndex + 1} 무한 스크롤 초기화 완료`);
    console.log(`   속도: ${speed}, 방향: ${direction}, 복제: ${cloneCount}세트`);
    console.log(`   totalWidth: ${scroller.totalWidth}px, 초기 position: ${scroller.position}px`);
  });

  // 애니메이션 시작
  requestAnimationFrame(animateScrollers);
}

// ============================================
// 스크롤 애니메이션 (완전 수정!)
// ============================================
function animateScrollers() {
  scrollers.forEach((scroller) => {
    if (!scroller.isPaused) {
      if (scroller.direction === "reverse") {
        // 오른쪽으로 (position 증가)
        scroller.position += scroller.speed;

        // 범위 체크: 1세트만큼 오른쪽으로 이동했으면 리셋
        if (scroller.position >= -scroller.totalWidth) {
          scroller.position -= scroller.totalWidth;
        }
      } else {
        // 왼쪽으로 (position 감소)
        scroller.position -= scroller.speed;

        // 범위 체크: 1세트만큼 왼쪽으로 이동했으면 리셋
        if (scroller.position <= -scroller.totalWidth) {
          scroller.position += scroller.totalWidth;
        }
      }

      // transform 적용
      scroller.inner.style.transform = `translateX(${scroller.position}px)`;
    }
  });

  // 다음 프레임 요청
  requestAnimationFrame(animateScrollers);
}

// ============================================
// 이미지 배열 초기화
// ============================================
function initImageArray() {
  const tracks = document.querySelectorAll(".scroll-track");
  allImages = [];

  tracks.forEach((track) => {
    const inner = track.querySelector(".scroll-track-inner");
    const items = Array.from(inner.querySelectorAll(".echo-item"));

    const originalCount = Math.floor(items.length / 4);

    for (let i = 0; i < originalCount; i++) {
      const img = items[i].querySelector("img");
      if (img) {
        allImages.push({
          src: img.src,
          alt: img.alt,
        });
      }
    }
  });

  console.log(`📸 총 ${allImages.length}개 원본 이미지 발견`);
}

// ============================================
// 스크롤 가능 여부 확인
// ============================================
function checkScrollability() {
  originalBodyOverflow = document.body.style.overflow || "";

  if (document.body.style.overflow === "hidden" && !isModalOpen) {
    document.body.style.overflow = "";
    console.log("⚠️ 스크롤 잠금 해제됨");
  }
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
      rootMargin: "100px 0px",
      threshold: 0.01,
    }
  );

  const images = document.querySelectorAll(".echo-item img");
  images.forEach((img) => {
    imageObserver.observe(img);
  });

  console.log(`📸 ${images.length}개 이미지 지연 로딩 설정`);
}

// ============================================
// 호버 효과
// ============================================
function initHoverEffects() {
  const echoItems = document.querySelectorAll(".echo-item");

  echoItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const siblings = getSiblings(this);
      siblings.forEach((sibling) => {
        sibling.style.opacity = "0.7";
        sibling.style.filter = "brightness(0.8)";
      });

      this.style.zIndex = "20";
    });

    item.addEventListener("mouseleave", function () {
      const siblings = getSiblings(this);
      siblings.forEach((sibling) => {
        sibling.style.opacity = "1";
        sibling.style.filter = "brightness(1)";
      });

      this.style.zIndex = "1";
    });

    item.addEventListener(
      "touchstart",
      function () {
        this.classList.add("touch-hover");
      },
      { passive: true }
    );

    item.addEventListener(
      "touchend",
      function () {
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
// 이미지 클릭 핸들러
// ============================================
function initImageClickHandler() {
  createImageModal();

  const tracks = document.querySelectorAll(".scroll-track");

  tracks.forEach((track) => {
    const inner = track.querySelector(".scroll-track-inner");
    const items = Array.from(inner.querySelectorAll(".echo-item"));
    const originalCount = Math.floor(items.length / 4);

    for (let i = 0; i < originalCount; i++) {
      items[i].addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const trackIndex = Array.from(tracks).indexOf(track);
        let globalIndex = 0;

        for (let j = 0; j < trackIndex; j++) {
          const prevInner = tracks[j].querySelector(".scroll-track-inner");
          const prevItems = Array.from(
            prevInner.querySelectorAll(".echo-item")
          );
          globalIndex += Math.floor(prevItems.length / 4);
        }

        globalIndex += i;

        const img = this.querySelector("img");
        if (img) {
          openImageModal(img.src, img.alt, globalIndex);
        }
      });
    }
  });

  console.log("🖱️ 이미지 클릭 핸들러 설정 완료");
}

// ============================================
// 이미지 모달 생성
// ============================================
function createImageModal() {
  const existingModal = document.getElementById("echo-modal");
  if (existingModal) {
    return existingModal;
  }

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

  closeBtn.addEventListener("click", closeImageModal);
  overlay.addEventListener("click", closeImageModal);

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

  originalBodyOverflow = document.body.style.overflow || "";

  modalImg.src = src;
  modalImg.alt = alt;
  modalCaption.textContent = alt || "청춘의 기록";

  currentModalIndex = index;
  modalIndex.textContent = `${index + 1} / ${allImages.length}`;

  modal.classList.add("active");
  isModalOpen = true;

  document.body.style.overflow = "hidden";

  console.log(`🖼️ 이미지 모달 열기: ${index + 1}번째 이미지`);
}

// ============================================
// 이미지 모달 닫기
// ============================================
function closeImageModal() {
  const modal = document.getElementById("echo-modal");

  if (!modal || !isModalOpen) {
    return;
  }

  modal.classList.remove("active");
  isModalOpen = false;

  document.body.style.overflow = "";
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";

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
  if (!isModalOpen) return;

  const totalImages = allImages.length;
  let newIndex;

  if (direction === "prev") {
    newIndex = currentModalIndex > 0 ? currentModalIndex - 1 : totalImages - 1;
  } else {
    newIndex = currentModalIndex < totalImages - 1 ? currentModalIndex + 1 : 0;
  }

  const newImage = allImages[newIndex];

  if (newImage) {
    const modal = document.getElementById("echo-modal");
    const modalImg = modal.querySelector(".modal-image");
    const modalCaption = modal.querySelector(".modal-caption");
    const modalIndex = modal.querySelector(".modal-index");

    modalImg.src = newImage.src;
    modalImg.alt = newImage.alt;
    modalCaption.textContent = newImage.alt || "청춘의 기록";
    currentModalIndex = newIndex;
    modalIndex.textContent = `${newIndex + 1} / ${totalImages}`;
  }
}

// ============================================
// 속도 조절 함수
// ============================================
function setScrollSpeed(trackIndex, newSpeed) {
  if (scrollers[trackIndex]) {
    scrollers[trackIndex].speed = Math.abs(newSpeed);
    console.log(`⚡ Track ${trackIndex + 1} 속도 변경: ${Math.abs(newSpeed)}`);
  }
}

// ============================================
// 방향 변경 함수 (cloneCount 대응!)
// ============================================
function setScrollDirection(trackIndex, direction) {
  if (scrollers[trackIndex]) {
    const oldDirection = scrollers[trackIndex].direction;
    scrollers[trackIndex].direction = direction;

    // 방향 변경 시 position 재설정 (핵심!)
    if (direction === "reverse") {
      // reverse로 변경: 중간 위치에서 시작
      scrollers[trackIndex].position = 
        -scrollers[trackIndex].totalWidth * Math.floor(scrollers[trackIndex].cloneCount / 2);
    } else {
      // normal로 변경: 시작 위치로
      scrollers[trackIndex].position = 0;
    }

    console.log(
      `🔄 Track ${trackIndex + 1} 방향 변경: ${oldDirection} → ${direction}`
    );
    console.log(`   새 position: ${scrollers[trackIndex].position}px`);

    return true;
  }
  return false;
}

// ============================================
// 페이지 이탈 시 정리
// ============================================
window.addEventListener("beforeunload", function () {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
});

// ============================================
// 윈도우 리사이즈 처리 (개선!)
// ============================================
let resizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    scrollers.forEach((scroller, index) => {
      const items = Array.from(
        scroller.inner.querySelectorAll(".echo-item")
      );

      if (items[0] && scroller.originalItemCount) {
        const oldItemWidth = scroller.itemWidth;
        const oldTotalWidth = scroller.totalWidth;
        
        scroller.itemWidth = items[0].offsetWidth;
        scroller.gap =
          parseFloat(getComputedStyle(scroller.inner).gap.replace("px", "")) ||
          0;
        scroller.totalWidth =
          (scroller.itemWidth + scroller.gap) * scroller.originalItemCount;

        // 새로운 최적 복제 개수 계산
        const newCloneCount = getOptimalCloneCount(
          scroller.track, 
          scroller.itemWidth, 
          scroller.gap, 
          scroller.originalItemCount
        );

        // 복제 개수가 변경되었다면 다시 복제
        if (newCloneCount !== scroller.cloneCount) {
          console.log(`🔄 복제 개수 변경: ${scroller.cloneCount} → ${newCloneCount}`);
          
          let clonedHTML = scroller.originalHTML;
          for (let i = 1; i < newCloneCount; i++) {
            clonedHTML += scroller.originalHTML;
          }
          scroller.inner.innerHTML = clonedHTML;
          scroller.cloneCount = newCloneCount;
          
          // position 재조정
          const positionRatio = scroller.position / oldTotalWidth;
          if (scroller.direction === "reverse") {
            scroller.position = -scroller.totalWidth * Math.floor(newCloneCount / 2);
          } else {
            scroller.position = positionRatio * scroller.totalWidth;
          }
        } else {
          // 크기만 변경된 경우 position 비율 유지
          const positionRatio = scroller.position / oldTotalWidth;
          scroller.position = positionRatio * scroller.totalWidth;
        }

        console.log(`📐 Track ${index + 1} 리사이즈: totalWidth = ${Math.round(scroller.totalWidth)}px`);
      }
    });

    console.log("📐 리사이즈 후 트랙 재계산 완료");
  }, 250);
});

// ============================================
// 모듈 내보내기
// ============================================
window.EchoSection = {
  init: () => {
    initPerfectInfiniteScroll();
    initImageArray();
    initImageLazyLoading();
    initHoverEffects();
    initImageClickHandler();
    checkScrollability();
  },

  setSpeed: (trackIndex, speed) => {
    setScrollSpeed(trackIndex, speed);
  },

  setDirection: (trackIndex, direction) => {
    return setScrollDirection(trackIndex, direction);
  },

  pause: (trackIndex) => {
    if (scrollers[trackIndex]) {
      scrollers[trackIndex].isPaused = true;
    }
  },

  resume: (trackIndex) => {
    if (scrollers[trackIndex]) {
      scrollers[trackIndex].isPaused = false;
    }
  },

  pauseAll: () => {
    scrollers.forEach((s) => (s.isPaused = true));
  },

  resumeAll: () => {
    scrollers.forEach((s) => (s.isPaused = false));
  },

  unlockScroll: () => {
    document.body.style.overflow = "";
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    console.log("🔓 스크롤 강제 해제");
  },

  // 디버그용
  getStatus: () => {
    scrollers.forEach((s, i) => {
      console.log(`Track ${i + 1}:`, {
        speed: s.speed,
        direction: s.direction,
        position: Math.round(s.position),
        totalWidth: s.totalWidth,
        isPaused: s.isPaused,
      });
    });
  },
};

console.log("🎵 ECHO Section 완벽한 무한 스크롤 로드 완료 (화면 크기 대응!)");
console.log("💡 속도 조절: EchoSection.setSpeed(0, 0.8)");
console.log("💡 방향 변경: EchoSection.setDirection(1, 'reverse')");
console.log("💡 상태 확인: EchoSection.getStatus()");