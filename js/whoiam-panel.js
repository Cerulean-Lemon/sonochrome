/* whoiam-panel-integrated.js */
/* WHO I AM 패널 + 통합 음악 플레이어 연동 */

let isPanelOpen = false;
let scrollYBeforeLock = 0;
let originalTextHTML = ""; // 원본 HTML 저장
let textAnimationReady = false; // 텍스트 애니메이션 준비 완료 여부

// MARGIN 형성 애니메이션 함수
function initFallingTextAnimation() {
  const textElement = document.querySelector(".panel-text-left h2");
  if (!textElement) return;

  // 원본 HTML 저장 (처음 한 번만)
  if (!originalTextHTML) {
    originalTextHTML = textElement.innerHTML.trim();
  }
  
  // 원본 HTML로 복구
  textElement.innerHTML = originalTextHTML;
  
  console.log("Original HTML:", originalTextHTML);
  
  // 줄바꿈으로 분리
  const lines = originalTextHTML.split(/<br\s*\/?>/i);
  
  console.log("Lines:", lines);
  
  textElement.innerHTML = "";
  
  let lineIndex = 0;
  
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    const lineDiv = document.createElement("div");
    lineDiv.className = "text-line";
    
    // "안녕하세요!" 줄 처리
    if (trimmed.includes('panel-intro-text')) {
      // 안녕하세요! 추출
      const introMatch = trimmed.match(/>(.*?)</);
      const introText = introMatch ? introMatch[1] : "안녕하세요!";
      
      const introSpan = document.createElement("span");
      introSpan.className = "panel-intro-text";
      
      for (let char of introText) {
        const span = document.createElement("span");
        span.className = "intro-letter";
        span.textContent = char;
        span.setAttribute("data-line", "intro");
        introSpan.appendChild(span);
      }
      
      lineDiv.appendChild(introSpan);
      
      // "I AM" 추출 (</span> 뒤의 텍스트)
      const afterSpan = trimmed.split('</span>')[1];
      if (afterSpan && afterSpan.trim()) {
        const iamText = afterSpan.trim();
        console.log("I AM text:", iamText);
        
        for (let char of iamText) {
          if (char === " ") {
            const space = document.createElement("span");
            space.className = "letter-space";
            space.innerHTML = "&nbsp;";
            lineDiv.appendChild(space);
          } else {
            const span = document.createElement("span");
            span.className = "letter";
            span.textContent = char;
            span.setAttribute("data-char", char);
            span.setAttribute("data-line", lineIndex);
            lineDiv.appendChild(span);
          }
        }
        lineIndex++;
      }
    } 
    // 일반 줄 처리 (SUNG, MIN, PARK)
    else {
      for (let char of trimmed) {
        if (char === " ") {
          const space = document.createElement("span");
          space.className = "letter-space";
          space.innerHTML = "&nbsp;";
          lineDiv.appendChild(space);
        } else {
          const span = document.createElement("span");
          span.className = "letter";
          span.textContent = char;
          span.setAttribute("data-char", char);
          span.setAttribute("data-line", lineIndex);
          lineDiv.appendChild(span);
        }
      }
      lineIndex++;
    }
    
    textElement.appendChild(lineDiv);
  });

  textAnimationReady = true;
}

// 텍스트 호버 애니메이션 활성화
function activateTextHoverAnimation() {
  const textElement = document.querySelector(".panel-text-left h2");
  if (!textElement || !textAnimationReady) return;

  let hasAnimated = false;

  // 안내 문구 생성
  const hintElement = document.createElement("div");
  hintElement.className = "hover-hint";
  hintElement.innerHTML = "텍스트에 마우스를 올려보세요!";
  textElement.parentElement.appendChild(hintElement);
  
  // 안내 문구 애니메이션
  gsap.fromTo(hintElement, 
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      ease: "power3.out",
      delay: 0.3
    }
  );

  // 호버 이벤트
  const hoverHandler = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    // 안내 문구 사라지기
    gsap.to(hintElement, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        hintElement.remove();
      }
    });

    const allLetters = textElement.querySelectorAll(".letter");
    const introLetters = textElement.querySelectorAll(".intro-letter");
    
    // 라인별로 분류
    // 0: I AM, 1: SUNG, 2: MIN, 3: PARK
    const lineLetters = {
      intro: Array.from(introLetters),
      0: [],
      1: [],
      2: [],
      3: []
    };
    
    allLetters.forEach(letter => {
      const lineNum = letter.getAttribute("data-line");
      if (lineNum !== null && lineNum !== "intro") {
        const idx = parseInt(lineNum);
        if (!isNaN(idx) && lineLetters[idx]) {
          lineLetters[idx].push(letter);
        }
      }
    });

    console.log("Line distribution:", {
      intro: lineLetters.intro.length,
      0: lineLetters[0].map(l => l.textContent).join(""),
      1: lineLetters[1].map(l => l.textContent).join(""),
      2: lineLetters[2].map(l => l.textContent).join(""),
      3: lineLetters[3].map(l => l.textContent).join("")
    });

    const timeline = gsap.timeline();

    // 1단계: "안녕하세요!" 떨어뜨리기
    timeline.to(lineLetters.intro, {
      y: "150vh",
      rotation: () => gsap.utils.random(-720, 720),
      duration: 1.5,
      stagger: 0.05,
      ease: "power2.in",
    }, 0);

    // 2단계: "I AM" 떨어뜨리기
    timeline.to(lineLetters[0], {
      y: "150vh",
      rotation: () => gsap.utils.random(-720, 720),
      duration: 1.5,
      stagger: 0.03,
      ease: "power2.in",
    }, 0.3);

    // 글자 찾기
    let S, U, N, G, M, I, Nchar, P, A, R, K;
    
    // SUNG
    lineLetters[1].forEach(letter => {
      const char = letter.textContent;
      if (char === "S") S = letter;
      else if (char === "U") U = letter;
      else if (char === "N") N = letter;
      else if (char === "G") G = letter;
    });
    
    // MIN
    lineLetters[2].forEach(letter => {
      const char = letter.textContent;
      if (char === "M") M = letter;
      else if (char === "I") I = letter;
      else if (char === "N") Nchar = letter;
    });
    
    // PARK
    lineLetters[3].forEach(letter => {
      const char = letter.textContent;
      if (char === "P") P = letter;
      else if (char === "A") A = letter;
      else if (char === "R") R = letter;
      else if (char === "K") K = letter;
    });

    console.log("Found letters:", {S, U, N, G, M, I, Nchar, P, A, R, K});

    // 위치 저장
    const getPos = (el) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { x: rect.left, y: rect.top, w: rect.width };
    };

    const posG = getPos(G);
    const posK = getPos(K);
    const posM = getPos(M);
    const posP = getPos(P);
    const posI = getPos(I);
    const posN = getPos(Nchar);

    // 3단계: SUNG의 S, U, N 떨어뜨리기
    if (S) timeline.to(S, { y: "150vh", rotation: () => gsap.utils.random(-720, 720), duration: 1.5, ease: "power2.in" }, 0.8);
    if (U) timeline.to(U, { y: "150vh", rotation: () => gsap.utils.random(-720, 720), duration: 1.5, ease: "power2.in" }, 0.85);
    if (N) timeline.to(N, { y: "150vh", rotation: () => gsap.utils.random(-720, 720), duration: 1.5, ease: "power2.in" }, 0.9);

    // G가 K 위치로 이동, K는 밀려남
    if (G && K && posK && posG) {
      timeline.to(G, {
        x: posK.x - posG.x,
        y: posK.y - posG.y,
        duration: 0.8,
        ease: "power2.inOut",
      }, 1.1);

      timeline.to(K, {
        x: 100,
        y: "150vh",
        rotation: () => gsap.utils.random(-720, 720),
        duration: 1.2,
        ease: "power2.in",
      }, 1.1);
    }

    // 4단계: M이 P 위치로 이동, P는 밀려남
    if (M && P && posP && posM) {
      timeline.to(M, {
        x: posP.x - posM.x,
        y: posP.y - posM.y,
        duration: 0.8,
        ease: "power2.inOut",
      }, 1.4);

      timeline.to(P, {
        x: -100,
        y: "150vh",
        rotation: () => gsap.utils.random(-720, 720),
        duration: 1.2,
        ease: "power2.in",
      }, 1.4);
    }

    // 5단계: A, R은 그대로 유지!

    // 6단계: I가 G 옆으로
    if (I && posK && posI && posG) {
      const targetX = posK.x - posI.x + (posG.w || 80) + 10;
      const targetY = posK.y - posI.y;
      
      timeline.to(I, {
        x: targetX,
        y: targetY,
        duration: 0.8,
        ease: "power2.inOut",
      }, 1.7);
    }
    
    // N이 I 옆으로
    if (Nchar && posK && posN && posG && posI) {
      const targetX = posK.x - posN.x + (posG.w || 80) + (posI.w || 40) + 20;
      const targetY = posK.y - posN.y;
      
      timeline.to(Nchar, {
        x: targetX,
        y: targetY,
        duration: 0.8,
        ease: "power2.inOut",
      }, 1.8);
    }

    // 7단계: MARGIN 완성 - 빨간색!
    const marginLetters = [M, A, R, G, I, Nchar].filter(Boolean);
    if (marginLetters.length > 0) {
      timeline.to(marginLetters, {
        color: "#ff3333",
        scale: 1.15,
        duration: 0.5,
        ease: "back.out(1.7)",
      }, 2.5);

      // 8단계: MARGIN도 떨어뜨리기
      timeline.to(marginLetters, {
        y: "150vh",
        rotation: () => gsap.utils.random(-720, 720),
        duration: 1.8,
        stagger: 0.1,
        ease: "power2.in",
      }, 4.0);
      
      // 9단계: 모든 텍스트가 떨어진 후
      timeline.call(() => {
        // 왼쪽 텍스트 컨테이너가 마우스 이벤트 방해하지 않도록 처리
        const leftText = document.querySelector(".panel-text-left");
        if (leftText) {
          leftText.style.pointerEvents = "none";
          leftText.style.visibility = "hidden"; // 완전히 숨김
        }
        
        // 이미지 왼쪽으로 이동
        moveImageToLeft();
      }, null, 5.8); // MARGIN 떨어지기 끝난 직후
    }
  };

  textElement.addEventListener("mouseenter", hoverHandler, { once: true });
}

// 이미지를 왼쪽으로 이동하는 애니메이션
function moveImageToLeft() {
  const imageContainer = document.querySelector(".panel-image-center");
  const portraitDiv = document.querySelector(".portrait-no-bg");
  
  if (!imageContainer) return;
  
  console.log("✨ 여백 생성! 이미지 왼쪽으로 이동!");
  
  // 이미지 중앙(48%) → 왼쪽(23%)으로 스윽 이동
  gsap.to(imageContainer, {
    left: "23%",
    duration: 1.5,
    ease: "power3.inOut",
    onComplete: () => {
      // 🎉 이동 완료 후 톡톡 바운스! (만화 캐릭터처럼 빠르게!)
      if (portraitDiv) {
        const bounceTimeline = gsap.timeline();
        
        // 첫 번째 통! (같은 높이, 빠르게)
        bounceTimeline.to(portraitDiv, {
          y: -18,
          duration: 0.15,
          ease: "power1.out",
        })
        .to(portraitDiv, {
          y: 0,
          duration: 0.15,
          ease: "power1.in",
        })
        // 두 번째 통! (같은 높이, 빠르게)
        .to(portraitDiv, {
          y: -18,
          duration: 0.15,
          ease: "power1.out",
        })
        .to(portraitDiv, {
          y: 0,
          duration: 0.15,
          ease: "power1.in",
          onComplete: () => {
            // 바운스 완료 후 안내 문구 표시
            showImagePaintHint();
            // 그리고 스킬 게이지 등장!
            showSkillGauges();
          }
        });
      } else {
        // portraitDiv가 없으면 바로 스킬 게이지
        showSkillGauges();
      }
    }
  });
}

// 이미지 색칠 안내 문구 표시
function showImagePaintHint() {
  const portraitDiv = document.querySelector(".portrait-no-bg");
  if (!portraitDiv) return;
  
  // 안내 문구 생성
  const hintElement = document.createElement("div");
  hintElement.className = "image-paint-hint";
  hintElement.innerHTML = "";
  portraitDiv.appendChild(hintElement);
  
  // 안내 문구 애니메이션
  gsap.to(hintElement, {
    opacity: 1,
    y: -5,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.3
  });
}

// 이미지 설명 문구 표시
function showImageDescription() {
  const portraitDiv = document.querySelector(".portrait-no-bg");
  if (!portraitDiv) return;
  
  // 이미 설명이 있으면 추가하지 않음
  if (document.querySelector(".image-description")) return;
  
  // 설명 문구 생성
  const descElement = document.createElement("div");
  descElement.className = "image-description";
  descElement.innerHTML = "Photoshop으로 복원한 컬러 버전입니다";
  portraitDiv.appendChild(descElement);
  
  // 설명 문구 애니메이션
  gsap.to(descElement, {
    opacity: 1,
    y: 5,
    duration: 0.8,
    ease: "power3.out"
  });
}

// 스킬 게이지 생성 및 애니메이션
function showSkillGauges() {
  const panel = document.querySelector(".panel-content-center-image");
  if (!panel) return;
  
  // 스킬 컨테이너 생성
  const skillsContainer = document.createElement("div");
  skillsContainer.className = "skills-container";
  panel.appendChild(skillsContainer);
  
  // 스킬 데이터
  const skills = [
    { name: "Communication", percent: 80, color: "#ff3333" },
    { name: "Design", percent: 65, color: "#ff3333" },
    { name: "Creativity", percent: 99, color: "#ff3333" }
  ];
  
  // 스킬 게이지들을 담을 래퍼
  const gaugesWrapper = document.createElement("div");
  gaugesWrapper.className = "gauges-wrapper";
  skillsContainer.appendChild(gaugesWrapper);
  
  // 각 스킬 게이지 생성
  skills.forEach((skill, index) => {
    const skillItem = document.createElement("div");
    skillItem.className = "skill-item";
    
    // SVG 원형 게이지
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    
    skillItem.innerHTML = `
      <div class="skill-gauge" data-skill="${skill.name}">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <!-- 배경 원 -->
          <circle
            cx="90"
            cy="90"
            r="${radius}"
            fill="none"
            stroke="#e0e0e0"
            stroke-width="12"
          />
          <!-- 진행 원 (반시계 방향) -->
          <circle
            class="skill-progress"
            cx="90"
            cy="90"
            r="${radius}"
            fill="none"
            stroke="${skill.color}"
            stroke-width="12"
            stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference}"
            transform="rotate(90 90 90)"
          />
        </svg>
        <div class="skill-percent">0%</div>
      </div>
      <div class="skill-name">${skill.name}</div>
    `;
    
    gaugesWrapper.appendChild(skillItem);
    
    // 초기 상태 설정 (투명하고 아래에서 시작)
    gsap.set(skillItem, { opacity: 0, y: 50 });
    
    // 순차적 등장 애니메이션
    const delay = 0.5 + (index * 0.3);
    
    gsap.to(skillItem, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: delay,
      ease: "power3.out",
      onComplete: () => {
        // 게이지 채우기 애니메이션
        animateGauge(skillItem, skill.percent, circumference, true);
      }
    });
  });
  
  // 설명 텍스트 추가
  const descText = document.createElement("div");
  descText.className = "skills-description";
  descText.innerHTML = `
    <p class="desc-line">시각적 스토리텔링으로 인터랙티브한 경험을 디자인합니다!</p>
  `;
  skillsContainer.appendChild(descText);
  
  // 텍스트 초기 상태
  const lines = descText.querySelectorAll(".desc-line");
  gsap.set(lines, { opacity: 0, y: 30 });
  
  // 텍스트 순차 등장
  gsap.to(lines, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 2.5,
    ease: "power3.out",
    onComplete: () => {
      // 모든 애니메이션이 완료된 후 마퀴 텍스트 표시
      showMarqueeText();
    }
  });
}

// 상단 마퀴 텍스트 표시
function showMarqueeText() {
  // 이미 마퀴가 있으면 추가하지 않음
  if (document.querySelector(".whoiam-marquee")) return;
  
  // 마퀴 컨테이너 생성
  const marquee = document.createElement("div");
  marquee.className = "whoiam-marquee";
  
  // 마퀴 내부 애니메이션 div
  const marqueeInner = document.createElement("div");
  marqueeInner.className = "whoiam-marquee-inner";
  
  // 마퀴 텍스트 (2개 - 끊김없는 스크롤을 위해)
  const marqueeText1 = document.createElement("div");
  marqueeText1.className = "whoiam-marquee-text";
  marqueeText1.innerHTML = `
    <span>종아하는 가수: 아이유</span>

    <span>취미: 사진찍기, 노래듣기</span>

    <span>장래희망: 사진 전시 큐레이터</span>
 
    <span>좋아하는 폰트: SUIT</span>

    <span>디자인 작업기간: 25.08 ~ 25.11</span>

    <span>사이트 제작 목적: 사진에 음악을 결합한 작품을 만들어보자!</span>

 
  `;
  
  const marqueeText2 = marqueeText1.cloneNode(true);
  
  marqueeInner.appendChild(marqueeText1);
  marqueeInner.appendChild(marqueeText2);
  marquee.appendChild(marqueeInner);
  
  // body에 추가
  document.body.appendChild(marquee);
  
  // 마퀴 등장 애니메이션
  gsap.to(marquee, {
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    delay: 0.5
  });
}

// 게이지 채우기 애니메이션 및 드래그 기능
function animateGauge(skillItem, targetPercent, circumference, enableDrag = false) {
  const progressCircle = skillItem.querySelector(".skill-progress");
  const percentText = skillItem.querySelector(".skill-percent");
  const gaugeElement = skillItem.querySelector(".skill-gauge");
  
  const offset = circumference - (targetPercent / 100) * circumference;
  
  // 퍼센트 숫자 애니메이션
  gsap.to({ value: 0 }, {
    value: targetPercent,
    duration: 1.5,
    ease: "power2.out",
    onUpdate: function() {
      percentText.textContent = Math.round(this.targets()[0].value) + "%";
    }
  });
  
  // 원형 게이지 애니메이션
  gsap.to(progressCircle, {
    strokeDashoffset: offset,
    duration: 1.5,
    ease: "power2.out",
    onComplete: () => {
      if (enableDrag) {
        // 애니메이션 끝나면 드래그 가능하게!
        makeDraggable(gaugeElement, progressCircle, percentText, circumference);
      }
    }
  });
}

// 드래그로 퍼센트 조절 가능하게 만들기
function makeDraggable(gaugeElement, progressCircle, percentText, circumference) {
  let isDragging = false;
  let currentPercent = parseInt(percentText.textContent);
  
  gaugeElement.style.cursor = "grab";
  
  function updatePercent(e) {
    const rect = gaugeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    // 각도 계산 (12시 방향이 0도)
    let angle = Math.atan2(clientY - centerY, clientX - centerX);
    angle = angle * (180 / Math.PI); // 라디안을 도로 변환
    angle = (angle + 90 + 360) % 360; // 12시 방향을 0도로 조정
    
    // 각도를 퍼센트로 변환 (시계방향)
    const percent = Math.round((angle / 360) * 100);
    const clampedPercent = Math.max(0, Math.min(100, percent));
    
    currentPercent = clampedPercent;
    percentText.textContent = clampedPercent + "%";
    
    const offset = circumference - (clampedPercent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }
  
  function onStart(e) {
    isDragging = true;
    gaugeElement.style.cursor = "grabbing";
    updatePercent(e);
  }
  
  function onMove(e) {
    if (isDragging) {
      e.preventDefault();
      updatePercent(e);
    }
  }
  
  function onEnd() {
    isDragging = false;
    gaugeElement.style.cursor = "grab";
  }
  
  // 마우스 이벤트
  gaugeElement.addEventListener("mousedown", onStart);
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);
  
  // 터치 이벤트
  gaugeElement.addEventListener("touchstart", onStart, { passive: false });
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("touchend", onEnd);
}

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

    scrollYBeforeLock = window.scrollY || window.pageYOffset;
    whoAmIButton.classList.add("panel-active");
    whoAmIButton.style.transform = "translateY(0px)";

    whoAmIPanel.classList.add("active");
    whoAmIPanel.setAttribute("aria-hidden", "false");
    whoAmIButton.setAttribute("aria-expanded", "true");

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

    // 순차적 등장 애니메이션
    const leftText = document.querySelector(".panel-text-left");
    
    // 초기 상태 설정
    gsap.set(portraitDiv, { opacity: 0, y: 30 });
    gsap.set(leftText, { opacity: 0, x: -50 });
    
    // 패널이 완전히 열린 후 순차 애니메이션
    const enterTimeline = gsap.timeline({ delay: 1.0 });
    
    // 1. 이미지 등장
    enterTimeline.to(portraitDiv, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: "power3.out",
    }, 0);
    
    // 2. 왼쪽 텍스트 등장
    enterTimeline.to(leftText, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power3.out",
    }, 0.4);
    
    // 3. 텍스트 애니메이션 준비 및 호버 활성화
    enterTimeline.call(() => {
      initFallingTextAnimation();
      // 약간의 딜레이 후 호버 활성화
      setTimeout(() => {
        activateTextHoverAnimation();
      }, 300);
    }, null, 1.5);

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
      y: 30,
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
        whoAmIButton.classList.remove("panel-active");
        
        // 텍스트를 원본 HTML로 복구
        const textElement = document.querySelector(".panel-text-left h2");
        if (textElement && originalTextHTML) {
          textElement.innerHTML = originalTextHTML;
        }
        
        // 이미지와 텍스트 위치 원래대로 복구
        const imageContainer = document.querySelector(".panel-image-center");
        const leftText = document.querySelector(".panel-text-left");
        
        if (imageContainer) {
          gsap.set(imageContainer, { left: "48%" });
        }
        if (leftText) {
          gsap.set(leftText, { left: "11vw" });
          // 텍스트 영역 다시 보이게 하고 이벤트 활성화
          leftText.style.pointerEvents = "";
          leftText.style.visibility = "";
        }
        
        // 스킬 게이지 제거
        const skillsContainer = document.querySelector(".skills-container");
        if (skillsContainer) {
          skillsContainer.remove();
        }
        
        // 안내 문구가 남아있다면 제거
        const hintElement = document.querySelector(".hover-hint");
        if (hintElement) {
          hintElement.remove();
        }
        
        // 이미지 안내 문구 제거
        const imagePaintHint = document.querySelector(".image-paint-hint");
        if (imagePaintHint) {
          imagePaintHint.remove();
        }
        
        // 이미지 설명 문구 제거
        const imageDescription = document.querySelector(".image-description");
        if (imageDescription) {
          imageDescription.remove();
        }
        
        // 마퀴 텍스트 제거
        const marquee = document.querySelector(".whoiam-marquee");
        if (marquee) {
          marquee.remove();
        }
        
        // 이미지 색칠 상태 초기화
        window.imagePaintStarted = false;
        
        // 애니메이션 상태 초기화
        textAnimationReady = false;
      },
    });

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

    // 두 이미지의 원본 크기 확인
    console.log("Grayscale image size:", grayscaleImg.width, "x", grayscaleImg.height);
    console.log("Color image size:", colorImg.width, "x", colorImg.height);

    // 흑백 이미지 기준으로 크기 계산
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

    // 흑백 이미지를 정확한 크기로 그리기
    ctx.drawImage(grayscaleImg, 0, 0, drawWidth, drawHeight);

    // 컬러 캔버스 생성 및 정확히 같은 크기로 그리기
    colorCanvas = document.createElement("canvas");
    colorCanvas.width = drawWidth;
    colorCanvas.height = drawHeight;
    const colorCtx = colorCanvas.getContext("2d");
    
    // 컬러 이미지도 정확히 같은 크기와 위치로 그리기
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
      
      // 첫 색칠 감지 - 설명 문구만 추가
      if (!window.imagePaintStarted) {
        window.imagePaintStarted = true;
        showImageDescription();
      }
    }

    canvas.addEventListener("mousemove", (e) => {
      revealColor(e);
    });

    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        revealColor(e.touches[0]);
      },
      { passive: false }
    );

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