/**
 * 🎵 Movement II - Crescendo Section (v5 - 슬라이더 완벽 수정)
 * ✅ 썸네일 클릭 → 음악 재생 연동
 * ✅ Comparison Slider 가운데(50%)에서 시작
 * ✅ 슬라이더 전체 범위 자유롭게 이동 가능
 * ✅ 썸네일 변경 시 50%로 리셋
 * ✅ 왼쪽 흑백, 오른쪽 컬러
 */

class CrescendoSection {
  constructor() {
    this.initialized = false;
    this.currentCategory = "all";
    this.currentImageIndex = 0;
    this.isDragging = false;
    this.sliderPosition = 50;
    this.swiperInstance = null;

    // DOM 요소들
    this.elements = {};
  }

  /**
   * 초기화
   */
  init() {
    if (this.initialized) {
      return;
    }

    // DOM 요소 캐싱
    this.cacheElements();

    if (!this.elements.section) {
      return;
    }

    // 썸네일 초기 가시성 설정
    this.ensureThumbnailsVisible();

    // Swiper 초기화
    this.initSwiper();

    // 이벤트 리스너 설정
    this.setupEventListeners();

    // ⭐ 첫 번째 이미지 로드 (슬라이더도 함께 초기화)
    this.loadFirstImage();

    // 스크롤 애니메이션 설정
    this.setupScrollAnimations();

    // 키보드 단축키 설정
    this.setupKeyboardShortcuts();

    this.initialized = true;
  }

  /**
   * DOM 요소 캐싱
   */
  cacheElements() {
    this.elements = {
      section: document.querySelector(".movement-crescendo"),
      categoryBtns: document.querySelectorAll(".category-btn"),
      thumbnails: document.querySelectorAll(".thumbnail-item"),
      thumbnailContainer: document.getElementById("thumbnails-container"),
      mainImages: document.querySelectorAll(".main-image"),
      slider: document.getElementById("comparison-slider"),
      colorLayer: document.querySelector(".color-layer"),
      viewerContainer: document.querySelector(".viewer-container"),
      trackTitle: document.querySelector(".crescendo-main-viewer .track-title"),
      trackArtist: document.querySelector(
        ".crescendo-main-viewer .track-artist"
      ),
    };
  }

  /**
   * ⭐ 슬라이더 초기 위치 설정 (50%)
   */
  initializeSliderPosition() {
    if (
      !this.elements.slider ||
      !this.elements.colorLayer ||
      !this.elements.viewerContainer
    ) {
      console.warn("⚠️ Slider elements not ready");
      return;
    }

    // 슬라이더 위치 50%로 설정
    this.sliderPosition = 50;
    this.updateSliderVisual(50);
  }

  /**
   * ⭐ 슬라이더 시각적 업데이트 (위치 계산 개선)
   */
  updateSliderVisual(position) {
    const { slider, colorLayer, viewerContainer } = this.elements;

    if (!slider || !colorLayer || !viewerContainer) return;

    // 컨테이너 너비 가져오기
    const containerWidth = viewerContainer.getBoundingClientRect().width;
    const sliderWidth = 80; // CSS에서 설정한 슬라이더 너비
    const sliderHalfWidth = sliderWidth / 2; // 40px

    // 슬라이더 중심이 position% 위치에 오도록 계산
    // left: 0 기준으로 transform 적용
    const targetPosition = (containerWidth * position) / 100 - sliderHalfWidth;

    // 슬라이더 위치 업데이트
    slider.style.left = "0";
    slider.style.transform = `translateX(${targetPosition}px)`;

    // 컬러 레이어 클리핑: position%부터 오른쪽 끝까지
    // = 왼쪽(0~position%)은 흑백, 오른쪽(position%~100%)은 컬러
    colorLayer.style.clipPath = `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)`;
  }

  /**
   * ⭐ 썸네일 초기 가시성 확보
   */
  ensureThumbnailsVisible() {
    let visibleCount = 0;
    this.elements.thumbnails.forEach((thumb) => {
      thumb.classList.remove("hidden");
      thumb.style.opacity = "1";
      thumb.style.transform = "scale(1)";
      thumb.style.width = "180px";
      thumb.style.minWidth = "180px";
      visibleCount++;
    });
  }

  /**
   * 🎨 Swiper 초기화
   */
  initSwiper() {
    if (typeof Swiper === "undefined") {
      console.warn("⚠️ Swiper library not loaded");
      return;
    }

    const swiperContainer = this.elements.thumbnailContainer;
    if (!swiperContainer) {
      console.warn("⚠️ Swiper container not found");
      return;
    }

    this.swiperInstance = new Swiper(swiperContainer, {
      slidesPerView: "auto",
      spaceBetween: 20,
      grabCursor: true,
      freeMode: {
        enabled: true,
        sticky: false,
        momentum: true,
        momentumRatio: 0.5,
        momentumVelocityRatio: 0.5,
      },
      mousewheel: {
        forceToAxis: true,
        sensitivity: 1,
        releaseOnEdges: true,
      },
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
          spaceBetween: 15,
        },
        768: {
          spaceBetween: 20,
        },
        1024: {
          spaceBetween: 20,
        },
      },
    });
  }

  /**
   * 이벤트 리스너 설정
   */
  setupEventListeners() {
    // 카테고리 버튼 이벤트
    this.elements.categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filterByCategory(btn.dataset.category);
      });
    });

    // ⭐ 썸네일 클릭 → 음악 재생 연동
    this.elements.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener("click", (e) => {
        if (this.swiperInstance && this.swiperInstance.animating) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        this.selectImage(thumb, index);
        this.playCrescendoMusic(thumb);
      });

      thumb.addEventListener("pointerdown", () => {
        thumb.style.transform = "scale(0.95)";
      });

      thumb.addEventListener("pointerup", () => {
        thumb.style.transform = "scale(1)";
      });

      thumb.addEventListener("pointerleave", () => {
        thumb.style.transform = "scale(1)";
      });
    });

    // ✅ Before/After 슬라이더 이벤트
    if (this.elements.slider && this.elements.viewerContainer) {
      this.setupSliderEvents();
    }
  }

  /**
   * 🎵 Crescendo 음악 재생
   */
  playCrescendoMusic(thumbnail) {
    const musicFile = thumbnail.dataset.music;

    if (!musicFile) {
      console.warn("⚠️ No music file specified for this thumbnail");
      return;
    }

    if (!window.crescendoMusicData) {
      console.error("❌ crescendoMusicData not loaded!");
      return;
    }

    const musicData = window.crescendoMusicData[musicFile];

    if (!musicData) {
      console.warn("❌ No music data found for:", musicFile);
      console.warn(
        "📋 Available files:",
        Object.keys(window.crescendoMusicData)
      );
      return;
    }

    if (!window.AudioManager) {
      console.error("❌ AudioManager not found!");
      return;
    }

    const existingIndex = window.AudioManager.playlist.findIndex(
      (track) => track.id === musicData.id
    );

    if (existingIndex === -1) {
      const insertPosition = window.AudioManager.currentTrackIndex + 1;
      window.AudioManager.playlist.splice(insertPosition, 0, musicData);
      window.AudioManager.currentTrackIndex = insertPosition;
    } else {
      window.AudioManager.currentTrackIndex = existingIndex;
    }

    window.AudioManager.loadTrack(
      window.AudioManager.currentTrackIndex,
      window.AudioManager.playlist
    );
    window.AudioManager.play();

    if (typeof updatePlaylistUI === "function") {
      updatePlaylistUI();
    }

    if (typeof updateNowPlaying === "function") {
      updateNowPlaying();
    }

    const player = document.getElementById("draggable-player");
    if (player) {
      if (!player.classList.contains("visible")) {
        player.classList.add("visible");
        player.style.bottom = "30px";
      }
    }
  }

  /**
   * ✅ Before/After 슬라이더 이벤트 설정 (개선된 버전)
   */
  setupSliderEvents() {
    const slider = this.elements.slider;
    const colorLayer = this.elements.colorLayer;
    const container = this.elements.viewerContainer;

    if (!slider || !colorLayer || !container) {
      console.warn("⚠️ Slider elements not found");
      return;
    }

    const startDrag = (clientX) => {
      this.isDragging = true;
      container.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      this.updateSliderPosition(clientX);
    };

    const endDrag = () => {
      if (this.isDragging) {
        this.isDragging = false;
        container.style.cursor = "crosshair";
        document.body.style.userSelect = "";
      }
    };

    const onDrag = (clientX) => {
      if (this.isDragging) {
        this.updateSliderPosition(clientX);
      }
    };

    // 마우스 이벤트
    slider.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      startDrag(e.clientX);
    });

    document.addEventListener("mousemove", (e) => {
      onDrag(e.clientX);
    });

    document.addEventListener("mouseup", endDrag);

    // 터치 이벤트
    slider.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.touches.length > 0) {
          startDrag(e.touches[0].clientX);
        }
      },
      { passive: false }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (this.isDragging && e.touches.length > 0) {
          e.preventDefault();
          onDrag(e.touches[0].clientX);
        }
      },
      { passive: false }
    );

    document.addEventListener("touchend", endDrag);
    document.addEventListener("touchcancel", endDrag);

    // 컨테이너 클릭으로 슬라이더 이동
    container.addEventListener("click", (e) => {
      if (e.target.closest(".comparison-slider")) {
        return;
      }

      this.updateSliderPosition(e.clientX);
    });
  }

  /**
   * ✅ 슬라이더 위치 업데이트 (개선된 계산)
   * 왼쪽 = 흑백, 오른쪽 = 컬러
   */
  updateSliderPosition(clientX) {
    const container = this.elements.viewerContainer;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let position = ((clientX - rect.left) / rect.width) * 100;

    // 범위 제한 (0% ~ 100%)
    position = Math.max(0, Math.min(100, position));
    this.sliderPosition = position;

    // 시각적 업데이트
    this.updateSliderVisual(position);
  }

  /**
   * 카테고리 필터링
   */
  filterByCategory(category) {
    this.currentCategory = category;

    this.elements.categoryBtns.forEach((btn) => {
      if (btn.dataset.category === category) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    let visibleCount = 0;
    if (this.swiperInstance) {
      this.swiperInstance.slides.forEach((slide) => {
        const thumb = slide.querySelector(".thumbnail-item");
        if (!thumb) return;

        const thumbCategory = thumb.dataset.category;
        const shouldShow = category === "all" || thumbCategory === category;

        if (shouldShow) {
          slide.style.display = "";
          thumb.classList.remove("hidden");
          visibleCount++;
        } else {
          slide.style.display = "none";
          thumb.classList.add("hidden");
        }
      });

      this.swiperInstance.update();
    } else {
      this.elements.thumbnails.forEach((thumb) => {
        const thumbCategory = thumb.dataset.category;
        const shouldShow = category === "all" || thumbCategory === category;

        if (shouldShow) {
          thumb.classList.remove("hidden");
          visibleCount++;
        } else {
          thumb.classList.add("hidden");
        }
      });
    }
  }

  /**
   * 이미지 선택 (슬라이더 리셋 포함)
   */
  selectImage(thumbnail, index) {
    this.elements.thumbnails.forEach((t) => t.classList.remove("active"));
    thumbnail.classList.add("active");

    const imageSrc = thumbnail.dataset.image;
    const title = thumbnail.dataset.title;
    const subtitle = thumbnail.dataset.subtitle;

    this.elements.mainImages.forEach((img, idx) => {
      img.src = imageSrc;

      img.onerror = () => {
        console.error(`❌ Failed to load image ${idx + 1}:`, imageSrc);
      };
    });

    if (this.elements.trackTitle) {
      this.elements.trackTitle.textContent = title;
    }
    if (this.elements.trackArtist) {
      this.elements.trackArtist.textContent = subtitle;
    }

    // ⭐ 이미지 변경 시 슬라이더는 50%로 리셋
    this.resetSliderTo50();

    this.centerThumbnail(thumbnail);

    this.currentImageIndex = index;
  }

  /**
   * ⭐ 슬라이더를 50%로 리셋
   */
  resetSliderTo50() {
    this.sliderPosition = 50;
    this.updateSliderVisual(50);
  }

  /**
   * 썸네일 중앙 정렬
   */
  centerThumbnail(thumbnail) {
    if (!this.swiperInstance) return;

    const slideIndex = Array.from(this.swiperInstance.slides).findIndex(
      (slide) => {
        return slide.querySelector(".thumbnail-item") === thumbnail;
      }
    );

    if (slideIndex !== -1) {
      this.swiperInstance.slideTo(slideIndex, 300);
    }
  }

  /**
   * 첫 번째 이미지 로드
   */
  loadFirstImage() {
    const firstThumbnail = this.elements.thumbnails[0];
    if (firstThumbnail) {
      this.selectImage(firstThumbnail, 0);
    }
  }

  /**
   * 스크롤 애니메이션 설정
   */
  setupScrollAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    gsap.from(".movement-crescendo .movement-header", {
      scrollTrigger: {
        trigger: ".movement-crescendo",
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".category-btn", {
      scrollTrigger: {
        trigger: ".crescendo-categories",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });

    gsap.from(".crescendo-main-viewer", {
      scrollTrigger: {
        trigger: ".crescendo-main-viewer",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: "power2.out",
    });

    gsap.from(".thumbnail-item", {
      scrollTrigger: {
        trigger: ".crescendo-thumbnails",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: {
        amount: 0.8,
        from: "start",
      },
      ease: "power2.out",
    });
  }

  /**
   * 키보드 단축키 설정
   */
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (!this.elements.section) return;

      const rect = this.elements.section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (!inView) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          this.navigateImages("prev");
          break;
        case "ArrowRight":
          e.preventDefault();
          this.navigateImages("next");
          break;
        case " ":
          e.preventDefault();
          this.togglePlayPause();
          break;
      }
    });
  }

  /**
   * 이미지 네비게이션
   */
  navigateImages(direction) {
    const visibleThumbs = Array.from(this.elements.thumbnails).filter(
      (t) => !t.classList.contains("hidden")
    );

    const currentIndex = visibleThumbs.findIndex((t) =>
      t.classList.contains("active")
    );
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : visibleThumbs.length - 1;
    } else {
      newIndex = currentIndex < visibleThumbs.length - 1 ? currentIndex + 1 : 0;
    }

    if (visibleThumbs[newIndex]) {
      visibleThumbs[newIndex].click();
    }
  }

  /**
   * 재생/일시정지 토글
   */
  togglePlayPause() {
    if (window.AudioManager && window.AudioManager.toggle) {
      window.AudioManager.toggle();
    }
  }
}

// 전역 인스턴스 생성
window.CrescendoSection = new CrescendoSection();

// DOM 로드 완료 시 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      window.CrescendoSection.init();
    }, 500);
  });
} else {
  setTimeout(() => {
    window.CrescendoSection.init();
  }, 500);
}

// 스크롤 시 레이지 로딩
let crescendoInitialized = false;
window.addEventListener("scroll", () => {
  if (crescendoInitialized) return;

  const section = document.querySelector(".movement-crescendo");
  if (!section) return;

  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    window.CrescendoSection.init();
    crescendoInitialized = true;
  }
});
