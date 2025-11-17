/* =========================
   ✅ 커서 궤적 효과 - 비행기 꼬리에서 시작
   ========================= */

let trailAnimationId = null;

// 인트로 완료 후 호출될 초기화 함수
function initCursorTrail() {
  // 이미 초기화되었다면 중복 실행 방지
  if (trailAnimationId) return;

  const canvas = document.getElementById("trail-canvas");

  if (!canvas) {
    console.warn("Cursor trail canvas (#trail-canvas) not found.");
    return;
  }

  const ctx = canvas.getContext("2d");

  let mouseMoved = false;

  const pointer = {
    x: 0.5 * window.innerWidth,
    y: 0.5 * window.innerHeight,
  };
  const params = {
    pointsNumber: 40,
    widthFactor: 0.3,
    mouseThreshold: 0.6,
    spring: 0.4,
    friction: 0.5,
  };

  const trail = new Array(params.pointsNumber);
  for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
      x: pointer.x,
      y: pointer.y,
      dx: 0,
      dy: 0,
    };
  }

  window.addEventListener("click", (e) => {
    mouseMoved = true;
  });
  window.addEventListener("mousemove", (e) => {
    mouseMoved = true;
  });
  window.addEventListener("touchmove", (e) => {
    mouseMoved = true;
  });

  // ✅ 캔버스 초기 상태 설정
  canvas.style.opacity = "1";
  canvas.style.pointerEvents = "none";

  setupCanvas();
  update(0);
  window.addEventListener("resize", setupCanvas);

  function update(t) {
    // ⭐ 비행기 꼬리 위치를 천천히 따라가도록 수정
    if (
      mouseMoved &&
      typeof globalCursor !== "undefined" &&
      globalCursor &&
      globalCursor.cursor
    ) {
      const tailPos = globalCursor.getTailPosition();
      pointer.x += (tailPos.x - pointer.x) * 0.03; // 0.03 = 지연 속도 (조절 가능)
      pointer.y += (tailPos.y - pointer.y) * 0.03;
    }

    if (!mouseMoved) {
      pointer.x =
        (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
        window.innerWidth;
      pointer.y =
        (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) *
        window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, pIdx) => {
      const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
      const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
      p.dx += (prev.x - p.x) * spring;
      p.dy += (prev.y - p.y) * spring;
      p.dx *= params.friction;
      p.dy *= params.friction;
      p.x += p.dx;
      p.y += p.dy;
    });

    const gradient = ctx.createLinearGradient(
      trail[0].x,
      trail[0].y,
      trail[trail.length - 1].x,
      trail[trail.length - 1].y
    );
    gradient.addColorStop(0, "rgba(255, 51, 51, 0.8)");
    gradient.addColorStop(0.5, "rgba(255, 102, 102, 0.5)");
    gradient.addColorStop(1, "rgba(255, 51, 51, 0)");

    ctx.strokeStyle = gradient;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
      const xc = 0.5 * (trail[i].x + trail[i + 1].x);
      const yc = 0.5 * (trail[i].y + trail[i + 1].y);
      ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
      ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();

    trailAnimationId = window.requestAnimationFrame(update);
  }

  function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

// 인트로가 진행 중이 아닐 때만 즉시 실행 (개발 중 편의를 위해)
if (!document.body.classList.contains("intro-active")) {
  initCursorTrail();
}
