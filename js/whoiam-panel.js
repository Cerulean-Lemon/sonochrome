/* whoiam-panel-integrated.js */
/* WHO I AM 패널 + 통합 음악 플레이어 연동 */

let isPanelOpen = false;
let scrollYBeforeLock = 0;

function initWhoIAmButton() {
  const whoAmIButton = document.getElementById("whoiam-button");
  const whoAmIPanel = document.getElementById("whoiam-panel");
  const closePanel = document.getElementById("close-panel");
  const navBar = document.getElementById("nav-bar");
  const portraitDiv = document.querySelector(".portrait-no-bg");

  if (!whoAmIButton || !whoAmIPanel || !closePanel || !navBar || !portraitDiv) {
    console.warn("필요한 UI 요소 중 일부를 찾을 수 없습니다.");
    return;
  }

  gsap.set(portraitDiv, { opacity: 0, scale: 1.1 });

  // 열기
  whoAmIButton.addEventListener("click", () => {
    if (isPanelOpen) return;
    isPanelOpen = true;

    // 현재 스크롤 위치 저장
    scrollYBeforeLock = window.scrollY || window.pageYOffset;

    // panel-active 클래스 추가 (position을 fixed로 전환)
    whoAmIButton.classList.add("panel-active");

    whoAmIButton.style.transform = "translateY(0px)";

    whoAmIPanel.classList.add("active");
    whoAmIPanel.setAttribute("aria-hidden", "false");
    whoAmIButton.setAttribute("aria-expanded", "true");

    gsap.to(portraitDiv, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.4,
    });

    navBar.classList.add("hidden");

    document.body.classList.add("lock-scroll");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYBeforeLock}px`;
    document.body.style.width = "100%";

    gsap.to(whoAmIButton, {
      top: "calc(100vh - 140px)",
      duration: 0.7,
      ease: "none",
    });

    // 🎵 WHO I AM 볼륨 노브 표시
    if (typeof window.showWhoIAmMusicControl === "function") {
      window.showWhoIAmMusicControl();
    }
  });

  // 닫기
  closePanel.addEventListener("click", () => {
    if (!isPanelOpen) return;
    isPanelOpen = false;

    gsap.to(portraitDiv, {
      opacity: 0,
      scale: 1.1,
      duration: 0.5,
      ease: "power2.in",
    });

    whoAmIPanel.classList.remove("active");
    whoAmIPanel.setAttribute("aria-hidden", "true");
    whoAmIButton.setAttribute("aria-expanded", "false");

    document.body.classList.remove("lock-scroll");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollYBeforeLock);

    navBar.classList.remove("hidden");

    gsap.to(whoAmIButton, {
      top: "30px",
      duration: 0.7,
      ease: "none",
      onComplete: () => {
        whoAmIButton.style.transform = "translateY(0px)";
        // panel-active 클래스 제거 (다시 absolute로 복원)
        whoAmIButton.classList.remove("panel-active");
      },
    });

    // 🎵 WHO I AM 볼륨 노브 숨김
    if (typeof window.hideWhoIAmMusicControl === "function") {
      window.hideWhoIAmMusicControl();
    }
  });
}

setTimeout(() => {
  initWhoIAmButton();
}, 100);

// 마우스 hover로 흑백→컬러 효과
function initPortraitCanvas() {
  const canvas = document.getElementById("portrait-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  const grayscaleImg = new Image();
  const colorImg = new Image();

  grayscaleImg.src = "images/WHOIAM.png";
  colorImg.src = "images/WHOIAM3.png";

  let imagesLoaded = 0;
  let colorCanvas = null;

  function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
      setupCanvas();
    }
  }

  grayscaleImg.onload = onImageLoad;
  colorImg.onload = onImageLoad;

  function setupCanvas() {
    const container = canvas.parentElement;
    if (!container) return;

    const maxWidth = container.clientWidth;
    const maxHeight = container.clientHeight;

    if (maxWidth === 0 || maxHeight === 0) {
      setTimeout(setupCanvas, 100);
      return;
    }

    const imgRatio = grayscaleImg.width / grayscaleImg.height;
    const containerRatio = maxWidth / maxHeight;

    let drawWidth, drawHeight;

    if (imgRatio > containerRatio) {
      drawWidth = maxWidth;
      drawHeight = maxWidth / imgRatio;
    } else {
      drawHeight = maxHeight;
      drawWidth = maxHeight * imgRatio;
    }

    canvas.width = drawWidth;
    canvas.height = drawHeight;

    ctx.drawImage(grayscaleImg, 0, 0, drawWidth, drawHeight);

    colorCanvas = document.createElement("canvas");
    colorCanvas.width = drawWidth;
    colorCanvas.height = drawHeight;
    const colorCtx = colorCanvas.getContext("2d");
    colorCtx.drawImage(colorImg, 0, 0, drawWidth, drawHeight);

    function getMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }

    function revealColor(e) {
      if (!colorCanvas) return;

      const pos = getMousePos(e);
      const revealRadius = 50;

      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, revealRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(colorCanvas, 0, 0);
      ctx.restore();
    }

    // 마우스 호버만으로 색칠 효과 (클릭 불필요)
    canvas.addEventListener("mousemove", (e) => {
      revealColor(e);
    });

    // 터치 디바이스용 (터치 이동 시 색칠)
    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        revealColor(e.touches[0]);
      },
      { passive: false }
    );

    // 터치 시작 시에도 즉시 색칠
    canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        revealColor(e.touches[0]);
      },
      { passive: false }
    );
  }
}

setTimeout(() => {
  const whoAmIButton = document.getElementById("whoiam-button");
  const panel = document.getElementById("whoiam-panel");

  if (whoAmIButton && panel) {
    whoAmIButton.addEventListener(
      "click",
      () => {
        setTimeout(() => {
          initPortraitCanvas();
        }, 600);
      },
      { once: true }
    );
  }
}, 150);