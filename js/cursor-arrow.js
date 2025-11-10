/* =========================
   âœ¨ ArrowPointer Cursor Logic âœ¨
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
    // .curzr ìš”ì†Œê°€ ìžˆëŠ”ì§€ í™•ì¸
    if (!el) {
      console.error('Cursor element ".curzr" not found.');
      return;
    }
    Object.assign(el.style, style);
    this.cursor.removeAttribute("hidden");
    // ê¸°ë³¸ ì‹œìŠ¤í…œ ì»¤ì„œë¥¼ ìˆ¨ê¹ë‹ˆë‹¤.
    this.root.style.cursor = "none";
  }

  move(event) {
    if (!this.cursor) return; // ì»¤ì„œ ìš”ì†Œê°€ ì—†ìœ¼ë©´ ì¤‘ë‹¨
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
    if (!this.cursor) return; // ì»¤ì„œ ìš”ì†Œê°€ ì—†ìœ¼ë©´ ì¤‘ë‹¨
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
      if (!this.cursor) return; // setTimeout ì½œë°± ì‹œì ì—ë„ í™•ì¸
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

  // ë¹„í–‰ê¸° ë’·ë¶€ë¶„ ìœ„ì¹˜ ê³„ì‚°
  getTailPosition() {
    const angleRad = ((this.angleDisplace + 180) * Math.PI) / 180;
    const offset = -1;
    return {
      x: this.position.pointerX + Math.cos(angleRad) * offset,
      y: this.position.pointerY + Math.sin(angleRad) * offset,
    };
  }
}

// âœ¨ ArrowPointer ì»¤ì„œ ì´ˆê¸°í™” âœ¨
let globalCursor = null;
(() => {
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
})();
