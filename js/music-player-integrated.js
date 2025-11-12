/* music-player-integrated.js */
/* WHO I AM 볼륨 노브 + Home 드래그 플레이어 통합 버전 */

// 전역 오디오 상태 관리
const AudioManager = {
  audio: null,
  isPlaying: false,
  currentVolume: 0.3,
  currentTrackIndex: 0,
  isShuffleOn: false,
  isRepeatOn: false,
  playlist: [],

  init() {
    this.audio = document.getElementById("bgMusic");
    if (this.audio) {
      this.audio.volume = this.currentVolume;

      // 곡 종료 시 다음 곡 재생
      this.audio.addEventListener("ended", () => {
        if (this.isRepeatOn) {
          this.audio.currentTime = 0;
          this.play();
        } else {
          this.next();
        }
      });

      // 시간 업데이트
      this.audio.addEventListener("timeupdate", () => {
        this.updateProgress();
      });

      // 메타데이터 로드 완료
      this.audio.addEventListener("loadedmetadata", () => {
        this.updateDuration();
      });
    }
  },

  updateProgress() {
    const progressBar = document.querySelector(".progress-fill");
    const currentTimeEl = document.querySelector(
      ".progress-container .time-label:first-child"
    );

    if (this.audio && progressBar) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      progressBar.style.width = progress + "%";
    }

    if (this.audio && currentTimeEl) {
      currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
  },

  updateDuration() {
    const durationEl = document.querySelector(
      ".progress-container .time-label:last-child"
    );
    if (this.audio && durationEl) {
      durationEl.textContent = this.formatTime(this.audio.duration);
    }
  },

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  },

  play() {
    if (this.audio) {
      this.audio.play().catch((err) => console.log("재생 실패:", err));
      this.isPlaying = true;
      this.updateAllPlayButtons();
    }
  },

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.updateAllPlayButtons();
    }
  },

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },

  next() {
    if (this.isShuffleOn) {
      // 셔플: 랜덤 인덱스
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * this.playlist.length);
      } while (newIndex === this.currentTrackIndex && this.playlist.length > 1);
      this.currentTrackIndex = newIndex;
    } else {
      // 일반: 다음 곡
      this.currentTrackIndex =
        (this.currentTrackIndex + 1) % this.playlist.length;
    }
    this.loadTrack(this.currentTrackIndex, this.playlist);
    this.play();
    if (typeof updateNowPlaying === "function") updateNowPlaying();
    if (typeof updatePlaylistUI === "function") updatePlaylistUI();
  },

  prev() {
    // 3초 이상 재생되었으면 처음부터, 아니면 이전 곡
    if (this.audio && this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
    } else {
      this.currentTrackIndex =
        (this.currentTrackIndex - 1 + this.playlist.length) %
        this.playlist.length;
      this.loadTrack(this.currentTrackIndex, this.playlist);
      this.play();
      if (typeof updateNowPlaying === "function") updateNowPlaying();
      if (typeof updatePlaylistUI === "function") updatePlaylistUI();
    }
  },

  toggleShuffle() {
    this.isShuffleOn = !this.isShuffleOn;
    return this.isShuffleOn;
  },

  toggleRepeat() {
    this.isRepeatOn = !this.isRepeatOn;
    return this.isRepeatOn;
  },

  setVolume(volume) {
    this.currentVolume = volume;
    if (this.audio) {
      this.audio.volume = volume;
    }
    // 패널의 볼륨 슬라이더도 업데이트
    this.updateVolumeUI();
  },

  updateVolumeUI() {
    const volumeFill = document.querySelector(".volume-fill");
    if (volumeFill) {
      volumeFill.style.width = this.currentVolume * 100 + "%";
    }
  },

  loadTrack(index, playlist) {
    this.currentTrackIndex = index;
    this.playlist = playlist;
    const track = playlist[index];
    if (this.audio && track) {
      this.audio.src = track.file;
    }
  },

  updateAllPlayButtons() {
    // WHO I AM 볼륨 노브 버튼 업데이트
    const whoiamButton = document.getElementById("playPauseButton");
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");

    if (whoiamButton && playIcon && pauseIcon) {
      if (this.isPlaying) {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
      } else {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
      }
    }

    // Home 드래그 플레이어 버튼 업데이트
    const miniButton = document.querySelector(".mini-play-button");
    if (miniButton) {
      if (this.isPlaying) {
        miniButton.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
      } else {
        miniButton.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      }
    }

    // 사운드 바 애니메이션 업데이트
    const bars = document.querySelectorAll(".bar");
    bars.forEach((bar) => {
      if (this.isPlaying) {
        bar.classList.remove("paused");
      } else {
        bar.classList.add("paused");
      }
    });

    // 플레이리스트 패널 재생/일시정지 버튼 업데이트
    if (typeof updatePlayPauseButton === "function") {
      updatePlayPauseButton();
    }
  },
};

// 초기화
AudioManager.init();

/* =========================
   🎵 WHO I AM 패널 - 볼륨 노브 컨트롤
   ========================= */

// 🎯 초기화 여부를 추적하는 플래그
let isWhoIAmMusicControlInitialized = false;

function initWhoIAmMusicControl() {
  // 🔧 이미 초기화되었으면 스킵 (이벤트 리스너 중복 방지)
  if (isWhoIAmMusicControlInitialized) {
    console.log("WHO I AM Music Control already initialized");
    return;
  }

  const musicButton = document.getElementById("music-control-button");
  const volumeRing = document.getElementById("volumeRing");
  const playPauseButton = document.getElementById("playPauseButton");
  const tickContainer = document.getElementById("tickContainer");

  if (!musicButton) return;

  // 🎯 초기 아이콘 상태 설정 - 중요!
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  if (playIcon && pauseIcon) {
    // 초기에는 플레이 아이콘만 보이도록
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  }

  let isDragging = false;
  let volumeSetting = 30;
  let boundingRectangle;

  // 초기 틱 생성
  createTicks(27, 8);

  // 재생/일시정지 버튼
  if (playPauseButton) {
    playPauseButton.addEventListener("click", (e) => {
      e.stopPropagation();
      AudioManager.toggle();
    });
  }

  // 볼륨 드래그
  function detectMobile() {
    return /iPhone|iPad|iPod|Android|BlackBerry|Windows Phone/i.test(
      navigator.userAgent
    )
      ? "mobile"
      : "desktop";
  }

  function getMouseDown() {
    return detectMobile() === "desktop" ? "mousedown" : "touchstart";
  }

  function getMouseUp() {
    return detectMobile() === "desktop" ? "mouseup" : "touchend";
  }

  function getMouseMove() {
    return detectMobile() === "desktop" ? "mousemove" : "touchmove";
  }

  function onMouseDown(event) {
    if (event.target.closest(".play-pause-center")) return;

    isDragging = true;
    boundingRectangle = volumeRing.getBoundingClientRect();
    document.addEventListener(getMouseMove(), onMouseMove);
    event.preventDefault();
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener(getMouseMove(), onMouseMove);
  }

  function onMouseMove(event) {
    if (!isDragging) return;

    const knobPositionX = boundingRectangle.left;
    const knobPositionY = boundingRectangle.top;

    let mouseX, mouseY;
    if (detectMobile() === "desktop") {
      mouseX = event.pageX;
      mouseY = event.pageY;
    } else {
      mouseX = event.touches[0].pageX;
      mouseY = event.touches[0].pageY;
    }

    const knobCenterX = boundingRectangle.width / 2 + knobPositionX;
    const knobCenterY = boundingRectangle.height / 2 + knobPositionY;

    const adjacentSide = knobCenterX - mouseX;
    const oppositeSide = knobCenterY - mouseY;

    const currentRadiansAngle = Math.atan2(adjacentSide, oppositeSide);
    const getRadiansInDegrees = (currentRadiansAngle * 180) / Math.PI;
    const finalAngleInDegrees = -(getRadiansInDegrees - 135);

    if (finalAngleInDegrees >= 0 && finalAngleInDegrees <= 270) {
      volumeSetting = Math.floor(finalAngleInDegrees / (270 / 100));
      const tickHighlightPosition = Math.round((volumeSetting * 2.7) / 10);

      createTicks(27, tickHighlightPosition);
      AudioManager.setVolume(volumeSetting / 100);
    }
  }

  function createTicks(numTicks, highlightNumTicks) {
    if (!tickContainer) return;

    while (tickContainer.firstChild) {
      tickContainer.removeChild(tickContainer.firstChild);
    }

    let angle = -135;
    for (let i = 0; i < numTicks; i++) {
      const tick = document.createElement("div");
      tick.className = i < highlightNumTicks ? "tick activetick" : "tick";
      tickContainer.appendChild(tick);
      tick.style.transform = `rotate(${angle}deg)`;
      angle += 10;
    }
  }

  if (volumeRing) {
    volumeRing.addEventListener(getMouseDown(), onMouseDown);
    document.addEventListener(getMouseUp(), onMouseUp);
  }

  // 전역에서 볼륨 노브 업데이트할 수 있도록 함수 노출
  window.updateWhoIAmVolumeKnob = function (volume) {
    volumeSetting = Math.floor(volume * 100);
    const tickHighlightPosition = Math.round((volumeSetting * 2.7) / 10);
    createTicks(27, tickHighlightPosition);
  };

  // 🎯 초기화 완료 플래그 설정
  isWhoIAmMusicControlInitialized = true;
  console.log("WHO I AM Music Control initialized successfully");
}

/* =========================
   🎵 Home 섹션 - 드래그 가능한 플레이어
   ========================= */
const playlist = [
  {
    id: 1,
    title: "Heart Piano",
    artist: "Instrumental",
    duration: "3:45",
    file: "Heart Piano.mp3",
    thumbnail: "images/thumbnail-piano.jpg", // 썸네일 추가
  },
  {
    id: 2,
    title: "BLUE",
    artist: "BIGBANG",
    duration: "3:30",
    file: "music/blue.mp3",
    thumbnail: "images/thumbnail-bigbang.jpg",
  },
  {
    id: 3,
    title: "High High",
    artist: "GD&TOP",
    duration: "4:02",
    file: "music/highhigh.mp3",
    thumbnail: "images/thumbnail-gdtop.jpg",
  },
  {
    id: 4,
    title: "눈, 코, 입",
    artist: "태양",
    duration: "4:28",
    file: "music/eyes-nose-lips.mp3",
    thumbnail: "images/thumbnail-taeyang.jpg",
  },
  {
    id: 5,
    title: "크레용 (Crayon)",
    artist: "G-DRAGON",
    duration: "3:32",
    file: "music/crayon.mp3",
    thumbnail: "images/thumbnail-gd.jpg",
  },
  {
    id: 6,
    title: "DOOM DADA",
    artist: "T.O.P",
    duration: "3:48",
    file: "music/doomdada.mp3",
    thumbnail: "images/thumbnail-top.jpg",
  },
  {
    id: 7,
    title: "Spring Day",
    artist: "방탄소년단",
    duration: "4:35",
    file: "music/springday.mp3",
    thumbnail: "images/thumbnail-bts.jpg",
  },
  {
    id: 8,
    title: "하루하루",
    artist: "BIGBANG",
    duration: "4:20",
    file: "music/haruharu.mp3",
    thumbnail: "images/thumbnail-bigbang2.jpg",
  },
];

let isPlaylistPanelOpen = false;
let scrollYBeforePanelLock = 0;

function initHomeDraggablePlayer() {
  const player = document.getElementById("draggable-player");
  const handle = document.querySelector(".player-handle");
  const dragIndicator = document.querySelector(".drag-indicator");
  const playButton = document.querySelector(".mini-play-button");
  const panel = document.getElementById("playlist-panel");
  const closeBtn = document.getElementById("close-playlist-panel");

  if (!player || !handle || !panel) return;

  // 플레이어 위치 (오른쪽 벽 고정, Y축만 관리)
  let playerY = window.innerHeight / 2 - 70;

  // 드래그 관련 변수
  let dragStartY = 0;
  let dragStartX = 0;
  let isDragging = false;
  let swipeStartX = 0;
  let swipeDistance = 0;
  let isSwipeGesture = false;

  // 초기 위치 설정
  updatePlayerPosition();

  function updatePlayerPosition() {
    const maxY = window.innerHeight - 140;
    playerY = Math.max(0, Math.min(maxY, playerY));

    // 항상 오른쪽 벽에 고정
    player.style.right = "0px";
    player.style.top = playerY + "px";
    player.style.left = "auto";
    player.style.transform = "none";
  }

  // 이벤트 위치 가져오기
  function getEventPos(e) {
    return {
      x: e.type.includes("touch") ? e.touches[0].clientX : e.clientX,
      y: e.type.includes("touch") ? e.touches[0].clientY : e.clientY,
    };
  }

  // 드래그 시작
  function onDragStart(e) {
    // 재생 버튼 클릭은 무시
    if (e.target.closest(".mini-play-button")) return;

    // 햄버거 메뉴 클릭 시 패널 열기
    if (e.target.closest(".drag-indicator")) {
      togglePlaylistPanel();
      return;
    }

    isDragging = true;
    isSwipeGesture = false;

    const pos = getEventPos(e);
    dragStartY = pos.y - playerY;
    swipeStartX = pos.x;
    dragStartX = pos.x;

    handle.style.cursor = "grabbing";
    handle.style.transition = "none";
    e.preventDefault();
  }

  // 드래그 중
  function onDragMove(e) {
    if (!isDragging) return;

    const pos = getEventPos(e);

    // 스와이프 거리 계산
    swipeDistance = pos.x - swipeStartX;

    // 왼쪽으로 50px 이상 드래그하면 스와이프 제스처로 인식
    if (swipeDistance < -50 && !isSwipeGesture) {
      isSwipeGesture = true;
    }

    // 스와이프 제스처가 아니면 상하 드래그
    if (!isSwipeGesture && Math.abs(pos.y - (dragStartY + playerY)) > 3) {
      playerY = pos.y - dragStartY;
      updatePlayerPosition();
    }

    // 스와이프 시각적 피드백 (선택사항)
    if (isSwipeGesture) {
      const pullDistance = Math.max(-100, swipeDistance);
      player.style.transform = `translateX(${pullDistance}px)`;
    }

    e.preventDefault();
  }

  // 드래그 종료
  function onDragEnd(e) {
    if (!isDragging) return;

    isDragging = false;
    handle.style.cursor = "grab";
    handle.style.transition = "transform 0.3s ease";

    // 스와이프 제스처 확인
    if (isSwipeGesture && swipeDistance < -80) {
      // 충분히 당겼으면 패널 열기
      togglePlaylistPanel();
    }

    // 위치 복원
    player.style.transform = "none";
    swipeDistance = 0;
    isSwipeGesture = false;

    e.preventDefault();
  }

  // 이벤트 리스너 등록
  handle.addEventListener("mousedown", onDragStart);
  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup", onDragEnd);

  handle.addEventListener("touchstart", onDragStart, { passive: false });
  document.addEventListener("touchmove", onDragMove, { passive: false });
  document.addEventListener("touchend", onDragEnd);

  // 창 크기 변경 시 위치 재조정
  window.addEventListener("resize", () => {
    updatePlayerPosition();
  });

  // 재생 버튼
  if (playButton) {
    playButton.addEventListener("click", (e) => {
      e.stopPropagation();
      AudioManager.toggle();
    });
  }

  // 플레이리스트 패널 토글
  function togglePlaylistPanel() {
    isPlaylistPanelOpen = !isPlaylistPanelOpen;
    panel.classList.toggle("active", isPlaylistPanelOpen);
  }

  // 닫기 버튼
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      togglePlaylistPanel();
    });
  }

  // 플레이어 컨트롤 버튼 초기화
  initPlayerControls();

  // ✨ 초기 플레이리스트를 AudioManager.playlist에 복사
  if (AudioManager.playlist.length === 0) {
    AudioManager.playlist = [...playlist];
    console.log('🎵 Initialized AudioManager.playlist with', AudioManager.playlist.length, 'tracks');
  }

  // 플레이리스트 렌더링
  renderPlaylist();

  // 첫 곡 로드
  AudioManager.loadTrack(0, AudioManager.playlist);
  updateNowPlaying();
}

// 플레이어 컨트롤 버튼 초기화
function initPlayerControls() {
  const playPauseBtn = document.getElementById("play-pause-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const shuffleBtn = document.getElementById("shuffle-btn");
  const repeatBtn = document.getElementById("repeat-btn");

  // 재생/일시정지
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      AudioManager.toggle();
      updatePlayPauseButton();
    });
  }

  // 이전 곡
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      AudioManager.prev();
    });
  }

  // 다음 곡
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      AudioManager.next();
    });
  }

  // 셔플
  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      const isOn = AudioManager.toggleShuffle();
      shuffleBtn.classList.toggle("active", isOn);
    });
  }

  // 반복
  if (repeatBtn) {
    repeatBtn.addEventListener("click", () => {
      const isOn = AudioManager.toggleRepeat();
      repeatBtn.classList.toggle("active", isOn);
    });
  }

  // 초기 버튼 상태 업데이트
  updatePlayPauseButton();

  // 볼륨 컨트롤 초기화
  initVolumeControl();

  // 전체화면 버튼 초기화
  initFullscreenButton();

  // 프로그레스 바 초기화
  initProgressBar();
}

// 프로그레스 바 클릭/드래그 기능
function initProgressBar() {
  const progressContainer = document.querySelector(".progress-container");
  const progressBar = document.querySelector(".progress-bar");

  if (!progressContainer || !progressBar) return;

  let isSeeking = false;

  function seekToPosition(e) {
    const rect = progressBar.getBoundingClientRect();
    const x =
      (e.type.includes("mouse") ? e.clientX : e.touches[0].clientX) - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

    if (AudioManager.audio && !isNaN(AudioManager.audio.duration)) {
      AudioManager.audio.currentTime =
        (percent / 100) * AudioManager.audio.duration;
    }
  }

  // 마우스 이벤트
  progressBar.addEventListener("mousedown", (e) => {
    isSeeking = true;
    seekToPosition(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isSeeking) {
      seekToPosition(e);
    }
  });

  document.addEventListener("mouseup", () => {
    isSeeking = false;
  });

  // 터치 이벤트
  progressBar.addEventListener(
    "touchstart",
    (e) => {
      isSeeking = true;
      seekToPosition(e);
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (isSeeking) {
        seekToPosition(e);
      }
    },
    { passive: true }
  );

  document.addEventListener("touchend", () => {
    isSeeking = false;
  });
}

// 심플 볼륨 컨트롤 초기화
function initVolumeControl() {
  const volumeSlider = document.querySelector(".volume-slider-simple");
  const volumeFill = document.querySelector(".volume-fill-simple");
  const volumeHandle = document.querySelector(".volume-handle");
  const muteBtn = document.getElementById("volume-mute-btn");

  if (!volumeSlider || !volumeFill || !volumeHandle) return;

  let isDragging = false;
  let lastVolume = AudioManager.currentVolume;

  // 초기 볼륨 설정
  updateVolumeDisplay();

  function updateVolumeDisplay() {
    const percent = AudioManager.currentVolume * 100;
    volumeFill.style.width = percent + "%";
    volumeHandle.style.left = percent + "%";

    // WHO I AM 볼륨 노브도 업데이트
    if (typeof window.updateWhoIAmVolumeKnob === "function") {
      window.updateWhoIAmVolumeKnob(AudioManager.currentVolume);
    }

    // 아이콘 변경
    if (muteBtn) {
      const volumeOn = muteBtn.querySelector(".volume-on");
      const volumeOff = muteBtn.querySelector(".volume-off");
      if (AudioManager.currentVolume === 0) {
        volumeOn.style.display = "none";
        volumeOff.style.display = "block";
      } else {
        volumeOn.style.display = "block";
        volumeOff.style.display = "none";
      }
    }
  }

  function setVolumeFromEvent(e) {
    const rect = volumeSlider.getBoundingClientRect();
    const x =
      (e.type.includes("mouse") ? e.clientX : e.touches[0].clientX) - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const volume = percent / 100;

    AudioManager.setVolume(volume);
    updateVolumeDisplay();
  }

  // 클릭으로 볼륨 조절
  volumeSlider.addEventListener("mousedown", (e) => {
    isDragging = true;
    setVolumeFromEvent(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      setVolumeFromEvent(e);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // 터치 이벤트
  volumeSlider.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      setVolumeFromEvent(e);
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (isDragging) {
        setVolumeFromEvent(e);
      }
    },
    { passive: true }
  );

  document.addEventListener("touchend", () => {
    isDragging = false;
  });

  // 음소거 토글
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      if (AudioManager.currentVolume > 0) {
        lastVolume = AudioManager.currentVolume;
        AudioManager.setVolume(0);
      } else {
        AudioManager.setVolume(lastVolume || 0.3);
      }
      updateVolumeDisplay();
    });
  }

  // AudioManager.updateVolumeUI 재정의
  AudioManager.updateVolumeUI = updateVolumeDisplay;
}

// 전체화면 버튼 초기화
function initFullscreenButton() {
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const panel = document.getElementById("playlist-panel");

  if (!fullscreenBtn || !panel) return;

  let isFullscreen = false;

  fullscreenBtn.addEventListener("click", () => {
    isFullscreen = !isFullscreen;
    panel.classList.toggle("fullscreen", isFullscreen);

    const enterIcon = fullscreenBtn.querySelector(".fullscreen-enter");
    const exitIcon = fullscreenBtn.querySelector(".fullscreen-exit");

    if (isFullscreen) {
      enterIcon.style.display = "none";
      exitIcon.style.display = "block";
      fullscreenBtn.setAttribute("data-tooltip", "전체화면 종료");
    } else {
      enterIcon.style.display = "block";
      exitIcon.style.display = "none";
      fullscreenBtn.setAttribute("data-tooltip", "전체화면");
    }
  });
}

// 재생/일시정지 버튼 UI 업데이트
function updatePlayPauseButton() {
  const playPauseBtn = document.getElementById("play-pause-btn");
  if (!playPauseBtn) return;

  const playIcon = playPauseBtn.querySelector(".play-icon");
  const pauseIcon = playPauseBtn.querySelector(".pause-icon");

  if (AudioManager.isPlaying) {
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  } else {
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  }
}

// ✨ 플레이리스트 UI 업데이트 - 전체 재렌더링으로 수정
function updatePlaylistUI() {
  console.log('🔄 updatePlaylistUI called - Rendering full playlist');
  console.log('📊 AudioManager.playlist length:', AudioManager.playlist.length);
  renderPlaylist();
}

function renderPlaylist() {
  const container = document.querySelector(".playlist-tracks");
  if (!container) {
    console.warn('⚠️ playlist-tracks container not found');
    return;
  }

  // ✨ AudioManager.playlist 사용 (동적으로 추가된 곡들 포함)
  const playlistToRender = AudioManager.playlist.length > 0 ? AudioManager.playlist : playlist;
  
  console.log('🎵 Rendering playlist with', playlistToRender.length, 'tracks');

  container.innerHTML = playlistToRender
    .map(
      (track, index) => `
        <div class="track-item ${
          index === AudioManager.currentTrackIndex ? "active" : ""
        }" data-index="${index}">
            <div class="track-album-thumb">
                ${
                  track.thumbnail
                    ? `<img src="${track.thumbnail}" alt="${track.title}" onerror="this.style.display='none'">`
                    : ""
                }
            </div>
            <div class="track-details">
                <p class="track-name">${track.title}</p>
                <p class="track-artist">${track.artist}</p>
            </div>
            <div class="track-duration">${track.duration}</div>
        </div>
    `
    )
    .join("");

  container.querySelectorAll(".track-item").forEach((item) => {
    item.addEventListener("click", () => {
      const index = parseInt(item.dataset.index);
      playTrack(index);
    });
  });
  
  console.log('✅ Playlist rendered with', container.querySelectorAll('.track-item').length, 'items');
}

function playTrack(index) {
  AudioManager.loadTrack(index, AudioManager.playlist);
  AudioManager.play();

  document.querySelectorAll(".track-item").forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });

  updateNowPlaying();
}

function updateNowPlaying() {
  const track = AudioManager.playlist[AudioManager.currentTrackIndex];
  if (!track) return;

  // Now Playing 카드 정보 업데이트
  const titleEl = document.querySelector(".now-playing-card .track-info h4");
  const artistEl = document.querySelector(".now-playing-card .track-info p");
  const albumArt = document.querySelector(".now-playing-card .album-art");

  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = track.artist;

  // 썸네일이 있으면 앨범 아트 업데이트
  if (albumArt && track.thumbnail) {
    albumArt.innerHTML = `<img src="${track.thumbnail}" alt="${track.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;" onerror="this.parentElement.innerHTML='<svg viewBox=\\'0 0 24 24\\'><path d=\\'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z\\' fill=\\'white\\'/></svg>'">`;
  }
}

// WHO I AM 패널과의 연동
window.showWhoIAmMusicControl = function () {
  const musicButton = document.getElementById("music-control-button");
  if (musicButton) {
    musicButton.classList.add("visible");
    gsap.to(musicButton, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.5,
    });
    
    // 🎯 패널을 다시 열 때 현재 재생 상태에 맞춰 아이콘 업데이트
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");
    if (playIcon && pauseIcon) {
      if (AudioManager.isPlaying) {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
      } else {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
      }
    }
  }
  
  // 🔧 초기화는 한 번만 수행
  if (!isWhoIAmMusicControlInitialized) {
    initWhoIAmMusicControl();
  }
};

window.hideWhoIAmMusicControl = function () {
  const musicButton = document.getElementById("music-control-button");
  if (musicButton) {
    gsap.to(musicButton, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        musicButton.classList.remove("visible");
      },
    });
  }
};

// 🎯 페이지 로드 시 WHO I AM Music Control 초기화
document.addEventListener("DOMContentLoaded", function() {
  // WHO I AM 패널이 열려있지 않아도 미리 초기화
  // 이렇게 하면 패널을 처음 열 때도 바로 작동합니다
  setTimeout(() => {
    if (!isWhoIAmMusicControlInitialized) {
      console.log("Initializing WHO I AM Music Control on page load...");
      initWhoIAmMusicControl();
    }
  }, 500); // GSAP 등 다른 라이브러리 로드 대기
});

// ============================================
// 🌍 전역 객체 노출 (다른 스크립트에서 사용 가능)
// ============================================
window.AudioManager = AudioManager;
window.updateNowPlaying = updateNowPlaying;
window.updatePlaylistUI = updatePlaylistUI;
window.updatePlayPauseButton = updatePlayPauseButton;