/* intro-integrated.js */
/* Home 드래그 플레이어 초기화 포함 */

// 🚫 인트로 시작 시 기본 마우스 커서 숨기기
document.body.style.cursor = "none";
document.documentElement.style.cursor = "none";
document.body.classList.add("intro-active"); // 인트로 진행 중 표시

const cards = document.querySelectorAll(".card");
const images = document.querySelectorAll(".card img");
const totalCards = cards.length;

// 모든 카드와 stage에도 커서 숨기기 적용
const stage = document.querySelector("#stage");
if (stage) stage.style.cursor = "none";
cards.forEach((card) => {
  card.style.cursor = "none";
  const img = card.querySelector("img");
  if (img) img.style.cursor = "none";
});

const masterTimeline = gsap.timeline({
  defaults: { ease: "power1.inOut" },
});

cards.forEach((card, index) => {
  if (index === 0) {
    masterTimeline.to({}, { duration: 0.3 });
    return;
  }

  if (index < totalCards - 1) {
    masterTimeline
      .to(
        card,
        {
          clipPath: "inset(0%)",
          duration: 0.5,
          ease: "power2.out",
        },
        `-=0.2`
      )
      .fromTo(
        images[index],
        { scale: 0.25 },
        { scale: 1, duration: 0.5, ease: "power2.out" },
        `<`
      )
      .to({}, { duration: 0.15 });
  } else {
    const stage = document.querySelector("#stage");

    masterTimeline
      .to(
        card,
        {
          clipPath: "inset(0%)",
          duration: 0.5,
          ease: "power2.out",
        },
        `-=0.2`
      )
      .fromTo(
        images[index],
        { scale: 0.25 },
        { scale: 1, duration: 0.5, ease: "power2.out" },
        `<`
      )
      .to(
        stage,
        {
          width: "100vw",
          height: "100vh",
          border: "none",
          duration: 1.5,
          ease: "power1.inOut",
        },
        "+=0.1"
      )
      .to(
        card,
        {
          width: "100%",
          height: "100%",
          duration: 1.5,
          ease: "power1.inOut",
        },
        "<"
      )
      .call(() => {
        const loadingBar = document.getElementById("loading-bar");
        const lastImage = images[totalCards - 1];

        loadingBar.classList.add("active");

        gsap.to(loadingBar, {
          width: "100%",
          duration: 3.5,
          ease: "power1.inOut",
          onUpdate: function () {
            const progress = this.progress();
            const adjustedProgress = Math.min(progress + 0.35, 1);
            const grayscaleValue = 100 - adjustedProgress * 100;
            lastImage.style.filter = `grayscale(${grayscaleValue}%)`;
          },
          onComplete: () => {
            gsap.to(loadingBar, {
              opacity: 0,
              duration: 0.5,
              onComplete: () => {
                loadingBar.remove();

                document.body.style.overflow = "auto";
                // 인트로 완료 - 클래스 제거 (하지만 cursor: none은 유지)
                document.body.classList.remove("intro-active");

                const navBar = document.getElementById("nav-bar");
                const whoAmIButton = document.getElementById("whoiam-button");

                function startFloatingAnimation() {
                  let startTimeButton = 0;
                  let startTimeNav = 0;
                  let isHome = true;

                  window.addEventListener(
                    "scroll",
                    () => {
                      isHome = window.scrollY < 100;
                    },
                    { passive: true }
                  );

                  function floatingLoopButton(timestamp) {
                    if (!startTimeButton) startTimeButton = timestamp;
                    const elapsedTime = timestamp - startTimeButton;
                    const yOffset = Math.sin(elapsedTime * 0.0008) * 2.5;

                    if (
                      typeof isPanelOpen !== "undefined" &&
                      !isPanelOpen &&
                      whoAmIButton
                    ) {
                      whoAmIButton.style.transform = `translateY(${yOffset}px)`;
                    }
                    requestAnimationFrame(floatingLoopButton);
                  }

                  function floatingLoopNav(timestamp) {
                    if (!startTimeNav) startTimeNav = timestamp;
                    const elapsedTime = timestamp - startTimeNav;

                    if (isHome) {
                      const yOffset = Math.sin(elapsedTime * 0.0008) * 2.5;
                      if (navBar)
                        navBar.style.transform = `translateX(-50%) translateY(${
                          10 + yOffset
                        }px)`;
                    } else {
                      if (navBar)
                        navBar.style.transform = `translateX(-50%) translateY(10px)`;
                    }
                    requestAnimationFrame(floatingLoopNav);
                  }

                  if (whoAmIButton) requestAnimationFrame(floatingLoopButton);
                  if (navBar) requestAnimationFrame(floatingLoopNav);
                }

                if (navBar) {
                  gsap.to(navBar, {
                    opacity: 1,
                    y: 10,
                    duration: 1.2,
                    ease: "power2.out",
                  });
                }

                if (whoAmIButton) {
                  gsap.to(whoAmIButton, {
                    opacity: 1,
                    duration: 1.2,
                    ease: "power2.out",
                    onComplete: () => {
                      startFloatingAnimation();
                    },
                  });
                }

                if (typeof initWaterEffect === "function") {
                  initWaterEffect();
                }

                // ✨ 커서 효과 초기화 (인트로 완료 후)
                if (typeof initArrowCursor === "function") {
                  initArrowCursor();
                }

                if (typeof initCursorTrail === "function") {
                  initCursorTrail();
                }

                // 🎵 통합 음악 플레이어 초기화
                if (typeof initHomeDraggablePlayer === "function") {
                  initHomeDraggablePlayer();

                  const draggablePlayer =
                    document.getElementById("draggable-player");
                  if (draggablePlayer) {
                    gsap.to(draggablePlayer, {
                      opacity: 1,
                      duration: 1.2,
                      ease: "power2.out",
                      delay: 0.3,
                      onStart: () => {
                        draggablePlayer.classList.add("visible");
                      },
                    });
                  }
                }
              },
            });
          },
        });
      });
  }
});

masterTimeline.play();

let isMobile = window.matchMedia("(max-width: 767px)").matches;
window.addEventListener("resize", () => {
  const nowMobile = window.matchMedia("(max-width: 767px)").matches;
  if (isMobile !== nowMobile) {
    location.reload();
  }
});
