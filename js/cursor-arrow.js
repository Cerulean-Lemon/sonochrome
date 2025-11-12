/* =========================
   ✨ ArrowPointer Cursor Logic ✨
   ========================= */
class ArrowPointer {
  constructor() {
    this.root = document.body;
    this.cursor = document.querySelector(".curzr");

    (this.position = {
      distanceX: 0,
      distanceY: 0,
      distance: 0,
      pointerX: 0,
      pointerY: 0,
    }),
      (this.previousPointerX = 0);
    this.previousPointerY = 0;
    this.angle = 0;
    this.previousAngle = 0;
    this.angleDisplace = 0;
    this.degrees = 57.296;
    this.cursorSize = 20;

    this.cursorStyle = {
      boxSizing: "border-box",
      position: "fixed",
      top: "0px",
      left: `${-this.cursorSize / 2}px`,
      zIndex: "2147483647",
      width: `${this.cursorSize}px`,
      height: `${this.cursorSize}px`,
      transition: "250ms, transform 100ms",
      userSelect: "none",
      pointerEvents: "none",
    };

    this.init(this.cursor, this.cursorStyle);
  }

  init(el, style) {
    // .curzr 요소가 있는지 확인
    if (!el) {
      console.error('Cursor element ".curzr" not found.');
      return;
    }
    Object.assign(el.style, style);
    this.cursor.removeAttribute("hidden");
    // 기본 시스템 커서를 숨깁니다.
    this.root.style.cursor = "none";
  }

  move(event) {
    if (!this.cursor) return; // 커서 요소가 없으면 중단
    this.previousPointerX = this.position.pointerX;
    this.previousPointerY = this.position.pointerY;
    this.position.pointerX = event.pageX + this.root.getBoundingClientRect().x;
    this.position.pointerY = event.pageY + this.root.getBoundingClientRect().y;
    this.position.distanceX = this.previousPointerX - this.position.pointerX;
    this.position.distanceY = this.previousPointerY - this.position.pointerY;
    this.distance = Math.sqrt(
      this.position.distanceY ** 2 + this.position.distanceX ** 2
    );

    this.cursor.style.transform = `translate3d(${this.position.pointerX}px, ${this.position.pointerY}px, 0)`;

    if (this.distance > 1) {
      this.rotate(this.position);
    } else {
      this.cursor.style.transform += ` rotate(${this.angleDisplace}deg)`;
    }
  }

  rotate(position) {
    if (!this.cursor) return; // 커서 요소가 없으면 중단
    let unsortedAngle =
      Math.atan(Math.abs(position.distanceY) / Math.abs(position.distanceX)) *
      this.degrees;
    let modAngle;
    const style = this.cursor.style;
    this.previousAngle = this.angle;

    if (position.distanceX <= 0 && position.distanceY >= 0) {
      this.angle = 90 - unsortedAngle + 0;
    } else if (position.distanceX < 0 && position.distanceY < 0) {
      this.angle = unsortedAngle + 90;
    } else if (position.distanceX >= 0 && position.distanceY <= 0) {
      this.angle = 90 - unsortedAngle + 180;
    } else if (position.distanceX > 0 && position.distanceY > 0) {
      this.angle = unsortedAngle + 270;
    }

    if (isNaN(this.angle)) {
      this.angle = this.previousAngle;
    } else {
      if (this.angle - this.previousAngle <= -270) {
        this.angleDisplace += 360 + this.angle - this.previousAngle;
      } else if (this.angle - this.previousAngle >= 270) {
        this.angleDisplace += this.angle - this.previousAngle - 360;
      } else {
        this.angleDisplace += this.angle - this.previousAngle;
      }
    }
    style.transform += ` rotate(${this.angleDisplace}deg)`;

    setTimeout(() => {
      if (!this.cursor) return; // setTimeout 콜백 시점에도 확인
      modAngle =
        this.angleDisplace >= 0
          ? this.angleDisplace % 360
          : 360 + (this.angleDisplace % 360);
      if (modAngle >= 45 && modAngle < 135) {
        style.left = `${-this.cursorSize}px`;
        style.top = `${-this.cursorSize / 2}px`;
      } else if (modAngle >= 135 && modAngle < 225) {
        style.left = `${-this.cursorSize / 2}px`;
        style.top = `${-this.cursorSize}px`;
      } else if (modAngle >= 225 && modAngle < 315) {
        style.left = "0px";
        style.top = `${-this.cursorSize / 2}px`;
      } else {
        style.left = `${-this.cursorSize / 2}px`;
        style.top = "0px";
      }
    }, 0);
  }

  remove() {
    if (this.cursor) {
      this.cursor.remove();
    }
  }

  // 비행기 뒷부분 위치 계산
  getTailPosition() {
    const angleRad = ((this.angleDisplace + 180) * Math.PI) / 180;
    const offset = -1;
    return {
      x: this.position.pointerX + Math.cos(angleRad) * offset,
      y: this.position.pointerY + Math.sin(angleRad) * offset,
    };
  }
}

// ✨ ArrowPointer 커서 초기화 ✨
let globalCursor = null;

// 인트로 완료 후 호출될 초기화 함수
function initArrowCursor() {
  const cursor = new ArrowPointer();
  globalCursor = cursor;
  if (
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    document.onmousemove = function (event) {
      cursor.move(event);
    };
  } else {
    cursor.remove();
    globalCursor = null;
  }
  
  // 커서 페이드인 효과
  if (cursor.cursor) {
    cursor.cursor.style.opacity = '0';
    setTimeout(() => {
      cursor.cursor.style.transition = 'opacity 0.5s ease-out';
      cursor.cursor.style.opacity = '1';
    }, 100);
  }
}

// 자동 실행하지 않고 대기