// ============================================
// 🎵 WORKS-MUSIC INTEGRATION - FINAL VERSION
// ✅ GLightbox 텍스트 완전 제거
// ✅ 음악 연동 디버깅 강화
// ✅ 플레이리스트 누적 로직 (클릭 순서대로 쌓임)
// ============================================

// ============================================
// 🎵 각 작품에 매칭되는 음악 데이터
// ============================================
const worksMusicData = {
  // 1번 위치: 전지적 사슴벌레 시점
  "work-section1.jpg": {
    id: "work_1",
    title: "전지적 사슴벌레 시점",
    artist: "2025.03.06",
    album: "Movement I: 정적",
    duration: "2:25",
    file: "music/Stairs.mp3",
    thumbnail: "images/work-section1.jpg",
    description: "",
  },
  // 2번 위치: 당신이 잠든 사이에
  "work-section2.jpg": {
    id: "work_2",
    title: "당신이 잠든 사이에",
    artist: "2024.03.21",
    album: "Movement I: 정적",
    duration: "4:48",
    file: "music/City of Stars.mp3",
    thumbnail: "images/work-section2.jpg",
    description: "",
  },
  // 3번 위치: 대기줄 (원래 9번)
  "work-section3.jpg": {
    id: "work_3",
    title: "대기줄",
    artist: "2024.05.07",
    album: "Movement I: 정적",
    duration: "4:25",
    file: "music/hesitate.mp3",
    thumbnail: "images/work-section3.jpg",
    description: "",
  },
  // 4번 위치: 어? (그대로)
  "work-section4.jpg": {
    id: "work_4",
    title: "어?",
    artist: "2024.09.04",
    album: "Movement I: 정적",
    duration: "4:19",
    file: "music/whoru.mp3",
    thumbnail: "images/work-section4.jpg",
    description: "",
  },
  // 5번 위치: 이지금
  "work-section5.jpg": {
    id: "work_5",
    title: "이지금",
    artist: "2024.03.10",
    album: "Movement I: 정적",
    duration: "3:20",
    file: "music/knee.mp3",
    thumbnail: "images/work-section5.jpg",
    description: "",
  },
  // 6번 위치: 터널
  "work-section6.jpg": {
    id: "work_6",
    title: "터널",
    artist: "2024.01.06",
    album: "Movement I: 정적",
    duration: "4:08",
    file: "music/tunnel.mp3",
    thumbnail: "images/work-section6.jpg",
    description: "",
  },
  // 7번 위치: 회상
  "work-section7.jpg": {
    id: "work_7",
    title: "회상",
    artist: "2024.03.28",
    album: "Movement I: 정적",
    duration: "4:26",
    file: "music/Reminiscence.mp3",
    thumbnail: "images/work-section7.jpg",
    description: "",
  },
  // 8번 위치: 漂亮
  "work-section8.jpg": {
    id: "work_8",
    title: "漂亮",
    artist: "2024.09.03",
    album: "Movement I: 정적",
    duration: "3:47",
    file: "music/beautiful.mp3",
    thumbnail: "images/work-section8.jpg",
    description: "",
  },
  // 9번 위치: HUSH
  "work-section9.jpg": {
    id: "work_9",
    title: "HUSH",
    artist: "2025.06.19",
    album: "Movement I: 정적",
    duration: "4:05",
    file: "music/Hush.mp3",
    thumbnail: "images/work-section9.jpg",
    description: "",
  },
  // 10번 위치: 정직한 사진
  "work-section10.jpg": {
    id: "work_10",
    title: "정직한 사진",
    artist: "2023.11.16",
    album: "Movement I: 정적",
    duration: "4:23",
    file: "music/Flower Dance.mp3",
    thumbnail: "images/work-section10.jpg",
    description: "",
  },
};

// ============================================
// 🎼 RHAPSODY SECTION - 음악 데이터 (단일 곡)
// ============================================
const rhapsodyMusicData = {
  id: "rhapsody_theme",
  title: "Rhapsody in Dream", // ⭐ 여기에 실제 곡 제목 입력
  artist: "SONOCHROME", // ⭐ 여기에 실제 아티스트명 입력
  album: "Movement III: 랩소디",
  duration: "5:30", // ⭐ 여기에 실제 재생 시간 입력
  file: "music/rhapsody-theme.mp3", // ⭐ 여기에 실제 음악 파일 경로 입력
  thumbnail: "images/rhapsody-section1.jpg", // 대표 이미지
  description: "자유로운 형식의 즉흥적 선율",
};

// ============================================
// 🎵 WORKS-MUSIC 통합 매니저
// ============================================
const WorksMusicManager = {
  currentWorkTrack: null,
  workPlaylist: [],
  isWorkMode: false,
  lightboxInstance: null,

  /**
   * ✨ Work 카드 클릭 시 음악 재생 및 플레이리스트 추가
   * 📝 클릭 순서대로 플레이리스트에 쌓이고, 중복된 곡은 해당 위치로 이동
   */
  playWorkMusic(imageUrl) {
    // 이미지 URL에서 파일명 추출
    const filename = imageUrl.split("/").pop().split("?")[0]; // 쿼리 파라미터 제거

    const musicData = worksMusicData[filename];

    if (!musicData) {
      console.warn("❌ No music data found for:", filename);
      console.warn("📋 Available files:", Object.keys(worksMusicData));
      return;
    }

    this.isWorkMode = true;
    this.currentWorkTrack = musicData;

    // AudioManager 확인
    if (typeof AudioManager === "undefined") {
      console.error("❌ AudioManager is not defined!");
      return;
    }

    // ✨ 플레이리스트에서 이미 존재하는지 확인
    const existingIndex = AudioManager.playlist.findIndex(
      (track) => track.id === musicData.id
    );

    if (existingIndex === -1) {
      // 🆕 새로운 트랙 → 현재 재생 중인 곡 바로 다음에 추가
      const insertPosition = AudioManager.currentTrackIndex + 1;
      AudioManager.playlist.splice(insertPosition, 0, musicData);
      AudioManager.currentTrackIndex = insertPosition;
    } else {
      // 🔄 이미 있는 트랙 → 해당 인덱스로 이동
      AudioManager.currentTrackIndex = existingIndex;
    }

    // 트랙 로드 및 재생
    AudioManager.loadTrack(
      AudioManager.currentTrackIndex,
      AudioManager.playlist
    );
    AudioManager.play();

    // UI 업데이트
    this.updatePlayerUI(musicData);
    this.showMiniPlayer();

    // 플레이리스트 패널 업데이트
    if (typeof updatePlaylistUI === "function") {
      updatePlaylistUI();
    }

    // 현재 재생 정보 업데이트
    if (typeof updateNowPlaying === "function") {
      updateNowPlaying();
    }
  },

  /**
   * 플레이어 UI 업데이트
   */
  updatePlayerUI(musicData) {
    const nowPlayingCard = document.querySelector(".now-playing-card");
    if (nowPlayingCard) {
      const trackInfo = nowPlayingCard.querySelector(".track-info");
      if (trackInfo) {
        trackInfo.innerHTML = `
          <h4>${musicData.title}</h4>
          <p>${musicData.artist} · ${musicData.album}</p>
        `;
      }

      const albumArt = nowPlayingCard.querySelector(".album-art");
      if (albumArt && musicData.thumbnail) {
        albumArt.style.backgroundImage = `url(${musicData.thumbnail})`;
        albumArt.style.backgroundSize = "cover";
        albumArt.style.backgroundPosition = "center";
        albumArt.innerHTML = "";
      }
    }
  },

  /**
   * 미니 플레이어 표시
   */
  showMiniPlayer() {
    const player = document.getElementById("draggable-player");
    if (player) {
      if (!player.classList.contains("visible")) {
        player.classList.add("visible");
        player.style.bottom = "30px";
      }

      player.classList.add("highlight");
      setTimeout(() => {
        player.classList.remove("highlight");
      }, 1000);
    }
  },

  /**
   * Works 섹션의 모든 음악을 플레이리스트에 추가
   */
  addAllWorksToPlaylist() {
    if (typeof AudioManager !== "undefined") {
      let addedCount = 0;
      Object.values(worksMusicData).forEach((track) => {
        const exists = AudioManager.playlist.some((t) => t.id === track.id);
        if (!exists) {
          AudioManager.playlist.push(track);
          addedCount++;
        }
      });

      if (typeof updatePlaylistUI === "function") {
        updatePlaylistUI();
      }
    }
  },

  /**
   * Crescendo 섹션의 모든 음악을 플레이리스트에 추가
   */
  addAllCrescendoToPlaylist() {
    if (
      typeof AudioManager !== "undefined" &&
      typeof crescendoMusicData !== "undefined"
    ) {
      let addedCount = 0;
      Object.values(crescendoMusicData).forEach((track) => {
        const exists = AudioManager.playlist.some((t) => t.id === track.id);
        if (!exists) {
          AudioManager.playlist.push(track);
          addedCount++;
        }
      });

      if (typeof updatePlaylistUI === "function") {
        updatePlaylistUI();
      }
    }
  },

  /**
   * 크레센도 섹션 음악 재생 (썸네일 클릭용)
   */
  playCrescendoMusic(musicKey) {
    if (typeof crescendoMusicData === "undefined") {
      console.error("❌ crescendoMusicData is not defined!");
      return;
    }

    const musicData = crescendoMusicData[musicKey];

    if (!musicData) {
      console.warn("❌ No music data found for:", musicKey);
      return;
    }

    if (typeof AudioManager === "undefined") {
      console.error("❌ AudioManager is not defined!");
      return;
    }

    // 플레이리스트에서 이미 존재하는지 확인
    const existingIndex = AudioManager.playlist.findIndex(
      (track) => track.id === musicData.id
    );

    if (existingIndex === -1) {
      // 새로운 트랙 → 현재 재생 중인 곡 바로 다음에 추가
      const insertPosition = AudioManager.currentTrackIndex + 1;
      AudioManager.playlist.splice(insertPosition, 0, musicData);
      AudioManager.currentTrackIndex = insertPosition;
    } else {
      // 이미 있는 트랙 → 해당 인덱스로 이동
      AudioManager.currentTrackIndex = existingIndex;
    }

    // 트랙 로드 및 재생
    AudioManager.loadTrack(
      AudioManager.currentTrackIndex,
      AudioManager.playlist
    );
    AudioManager.play();

    // UI 업데이트
    this.updatePlayerUI(musicData);
    this.showMiniPlayer();

    // 플레이리스트 패널 업데이트
    if (typeof updatePlaylistUI === "function") {
      updatePlaylistUI();
    }

    // 현재 재생 정보 업데이트
    if (typeof updateNowPlaying === "function") {
      updateNowPlaying();
    }
  },

  /**
   * Rhapsody 섹션의 음악을 플레이리스트에 추가 (단일 곡)
   */
  addRhapsodyToPlaylist() {
    if (
      typeof AudioManager !== "undefined" &&
      typeof rhapsodyMusicData !== "undefined"
    ) {
      const exists = AudioManager.playlist.some(
        (t) => t.id === rhapsodyMusicData.id
      );
      if (!exists) {
        AudioManager.playlist.push(rhapsodyMusicData);
      }

      if (typeof updatePlaylistUI === "function") {
        updatePlaylistUI();
      }
    }
  },

  /**
   * 랩소디 섹션 음악 재생 (전체 재생 버튼용)
   */
  playRhapsodyMusic() {
    if (typeof rhapsodyMusicData === "undefined") {
      console.error("❌ rhapsodyMusicData is not defined!");
      return;
    }

    if (typeof AudioManager === "undefined") {
      console.error("❌ AudioManager is not defined!");
      return;
    }

    const musicData = rhapsodyMusicData;

    // 플레이리스트에서 이미 존재하는지 확인
    const existingIndex = AudioManager.playlist.findIndex(
      (track) => track.id === musicData.id
    );

    if (existingIndex === -1) {
      // 새로운 트랙 → 현재 재생 중인 곡 바로 다음에 추가
      const insertPosition = AudioManager.currentTrackIndex + 1;
      AudioManager.playlist.splice(insertPosition, 0, musicData);
      AudioManager.currentTrackIndex = insertPosition;
    } else {
      // 이미 있는 트랙 → 해당 인덱스로 이동
      AudioManager.currentTrackIndex = existingIndex;
    }

    // 트랙 로드 및 재생
    AudioManager.loadTrack(
      AudioManager.currentTrackIndex,
      AudioManager.playlist
    );
    AudioManager.play();

    // UI 업데이트
    this.updatePlayerUI(musicData);
    this.showMiniPlayer();

    // 플레이리스트 패널 업데이트
    if (typeof updatePlaylistUI === "function") {
      updatePlaylistUI();
    }

    // 현재 재생 정보 업데이트
    if (typeof updateNowPlaying === "function") {
      updateNowPlaying();
    }
  },
};

// ============================================
// 🎵 GLightbox 초기화 (텍스트 완전 제거 버전)
// ============================================
function initWorksMusicIntegration() {
  // 1. Work 카드 설정
  const workCards = document.querySelectorAll(".work-card");

  workCards.forEach((card, index) => {
    const imageUrl = card.getAttribute("href");
    if (!imageUrl) {
      console.warn(`⚠️ Card ${index} has no href`);
      return;
    }

    const filename = imageUrl.split("/").pop();
    const musicData = worksMusicData[filename];

    if (musicData) {
      // GLightbox 클래스 확인
      if (!card.classList.contains("glightbox")) {
        card.classList.add("glightbox");
      }

      // ✅ data-description 제거 - 텍스트 완전 삭제
      card.removeAttribute("data-description");

      // Gallery 속성만 설정 (같은 앨범끼리 그룹화)
      card.setAttribute("data-gallery", musicData.album);
    } else {
      console.warn(`⚠️ No music data for: ${filename}`);
    }
  });

  // 2. GLightbox 초기화
  if (typeof GLightbox === "undefined") {
    console.error("❌ GLightbox library not found!");
    return;
  }

  WorksMusicManager.lightboxInstance = GLightbox({
    selector: ".work-card",
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
    closeButton: true,
    closeOnOutsideClick: true,
    skin: "clean",
    slideEffect: "fade",
    openEffect: "zoom",
    closeEffect: "fade",
    zoomable: true,
    draggable: true,
    preload: true,
    moreLength: 0, // ✅ "더보기" 텍스트 제거

    // ✅ 라이트박스 열릴 때
    onOpen: () => {
      setTimeout(() => {
        // 현재 활성 슬라이드 찾기 (여러 방법 시도)
        let activeSlide = document.querySelector(
          ".glightbox-container .gslide.current .gslide-image img"
        );
        if (!activeSlide) {
          activeSlide = document.querySelector(
            ".glightbox-container .gslide.current img"
          );
        }
        if (!activeSlide) {
          activeSlide = document.querySelector(
            ".glightbox-container .current .gslide-image"
          );
        }

        if (activeSlide) {
          const imageSrc = activeSlide.getAttribute("src") || activeSlide.src;

          if (imageSrc) {
            WorksMusicManager.playWorkMusic(imageSrc);
          } else {
            console.warn("⚠️ Image src is empty");
          }
        } else {
          console.error("❌ Could not find current slide image");
        }
      }, 150); // 약간 더 긴 딜레이로 DOM 완전 로드 보장
    },

    // ✅ 슬라이드 변경 시
    onSlideChange: () => {
      setTimeout(() => {
        let activeSlide = document.querySelector(
          ".glightbox-container .gslide.current .gslide-image img"
        );
        if (!activeSlide) {
          activeSlide = document.querySelector(
            ".glightbox-container .gslide.current img"
          );
        }
        if (!activeSlide) {
          activeSlide = document.querySelector(
            ".glightbox-container .current .gslide-image"
          );
        }

        if (activeSlide) {
          const imageSrc = activeSlide.getAttribute("src") || activeSlide.src;

          if (imageSrc) {
            WorksMusicManager.playWorkMusic(imageSrc);
          }
        }
      }, 150);
    },
  });

  // 3. "전체 재생" 버튼 추가
  addPlayAllButton();

  // 4. 플레이리스트 드래그 앤 드롭 초기화
  setTimeout(() => {
    initPlaylistDragAndDrop();
  }, 1000); // 플레이리스트 UI가 완전히 렌더링된 후 초기화
}

// ============================================
// 🎯 드래그 앤 드롭 플레이리스트 초기화
// ============================================
function initPlaylistDragAndDrop() {
  const playlistContainer = document.querySelector(".playlist-tracks");

  if (!playlistContainer) {
    console.warn("⚠️ Playlist container not found, retrying...");
    setTimeout(initPlaylistDragAndDrop, 500);
    return;
  }

  if (typeof Sortable === "undefined") {
    console.warn("⚠️ Sortable.js not loaded, retrying...");
    setTimeout(initPlaylistDragAndDrop, 500);
    return;
  }

  // Sortable.js로 드래그 앤 드롭 활성화
  const sortable = new Sortable(playlistContainer, {
    animation: 200,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    handle: ".track-item", // 전체 트랙 아이템을 드래그 핸들로
    draggable: ".track-item",
    ghostClass: "track-ghost",
    chosenClass: "track-chosen",
    dragClass: "track-dragging",

    // 드래그 시작
    onStart: function (evt) {
      evt.item.classList.add("dragging");
    },

    // 드래그 종료 및 순서 업데이트
    onEnd: function (evt) {
      evt.item.classList.remove("dragging");

      if (evt.oldIndex === evt.newIndex) {
        return;
      }

      // AudioManager.playlist 배열 업데이트
      if (typeof AudioManager !== "undefined" && AudioManager.playlist) {
        const movedTrack = AudioManager.playlist[evt.oldIndex];

        // 1. 원래 위치에서 제거
        AudioManager.playlist.splice(evt.oldIndex, 1);

        // 2. 새 위치에 삽입
        AudioManager.playlist.splice(evt.newIndex, 0, movedTrack);

        // 3. currentTrackIndex 업데이트
        if (evt.oldIndex === AudioManager.currentTrackIndex) {
          // 현재 재생 중인 곡을 이동한 경우
          AudioManager.currentTrackIndex = evt.newIndex;
        } else if (
          evt.oldIndex < AudioManager.currentTrackIndex &&
          evt.newIndex >= AudioManager.currentTrackIndex
        ) {
          // 현재 곡보다 앞에 있던 곡을 뒤로 이동
          AudioManager.currentTrackIndex--;
        } else if (
          evt.oldIndex > AudioManager.currentTrackIndex &&
          evt.newIndex <= AudioManager.currentTrackIndex
        ) {
          // 현재 곡보다 뒤에 있던 곡을 앞으로 이동
          AudioManager.currentTrackIndex++;
        }

        // UI 업데이트
        if (typeof updatePlaylistUI === "function") {
          updatePlaylistUI();
        }
      }
    },
  });
}

// ============================================
// 🎵 전체 재생 버튼 추가 (재생/일시정지 토글)
// ============================================
// ============================================
// 🎵 전체 재생 버튼 추가 (재생/일시정지 토글)
// ✅ Rhapsody 섹션 지원 추가
// ============================================
function addPlayAllButton() {
  // 🎯 Works, Crescendo 섹션 헤더
  const movementHeaders = document.querySelectorAll(".movement-header");
  // 🎯 Rhapsody 섹션 헤더
  const rhapsodyHeaders = document.querySelectorAll(".rhapsody-header");

  // 모든 헤더를 배열로 합침
  const allHeaders = [...movementHeaders, ...rhapsodyHeaders];

  allHeaders.forEach((header) => {
    if (header.querySelector(".play-all-btn")) return;

    // 🎯 섹션 타입 감지
    const isCrescendoSection = header.closest(".movement-crescendo") !== null;
    const isRhapsodySection = header.closest(".movement-rhapsody") !== null;

    let sectionType;
    if (isCrescendoSection) {
      sectionType = "crescendo";
    } else if (isRhapsodySection) {
      sectionType = "rhapsody";
    } else {
      sectionType = "works";
    }

    const playAllBtn = document.createElement("button");
    playAllBtn.className = "play-all-btn";
    playAllBtn.setAttribute("data-section", sectionType);
    playAllBtn.setAttribute("data-loaded", "false"); // 플레이리스트 로드 여부 추적
    playAllBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M8 5v14l11-7z" fill="currentColor"/>
      </svg>
      <span>전체 재생</span>
    `;

    playAllBtn.addEventListener("click", function () {
      const sectionType = this.getAttribute("data-section");
      const isLoaded = this.getAttribute("data-loaded") === "true";

      if (!isLoaded) {
        // 🎵 첫 클릭: 섹션에 따라 다른 플레이리스트 추가 및 재생
        if (sectionType === "crescendo") {
          WorksMusicManager.addAllCrescendoToPlaylist();

          // 크레센도 섹션 첫 번째 곡 재생
          const firstMusicKey = "crescendo-1.mp3";
          WorksMusicManager.playCrescendoMusic(firstMusicKey);
        } else if (sectionType === "rhapsody") {
          // 🎼 랩소디 섹션: 단일 곡 추가 및 재생
          WorksMusicManager.addRhapsodyToPlaylist();
          WorksMusicManager.playRhapsodyMusic();
        } else {
          // Works 섹션
          WorksMusicManager.addAllWorksToPlaylist();

          // 워크 섹션 첫 번째 카드 재생
          const firstCard = header.parentElement.querySelector(".work-card");
          if (firstCard) {
            const imageUrl = firstCard.getAttribute("href");
            WorksMusicManager.playWorkMusic(imageUrl);
          }
        }

        // 플레이리스트 로드 완료 표시
        this.setAttribute("data-loaded", "true");
        this.classList.add("playing");
        this.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
          </svg>
          <span>일시정지</span>
        `;
      } else {
        // 🔄 두 번째 클릭 이후: 재생/일시정지 토글
        if (typeof AudioManager !== "undefined") {
          if (AudioManager.isPlaying) {
            // 현재 재생 중 → 일시정지
            AudioManager.pause();
            this.classList.remove("playing");
            this.innerHTML = `
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M8 5v14l11-7z" fill="currentColor"/>
              </svg>
              <span>재생</span>
            `;
          } else {
            // 현재 일시정지 → 재생
            AudioManager.play();
            this.classList.add("playing");
            this.innerHTML = `
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
              </svg>
              <span>일시정지</span>
            `;
          }
        }
      }
    });

    header.appendChild(playAllBtn);
  });

  // 🔄 AudioManager의 재생 상태 변경 시 버튼 업데이트
  updatePlayAllButtonsOnStateChange();
}

// ============================================
// 🔄 AudioManager 상태 변경 시 모든 전체 재생 버튼 동기화
// ============================================
function updatePlayAllButtonsOnStateChange() {
  // AudioManager 상태 변경 감지를 위한 리스너
  if (typeof AudioManager !== "undefined") {
    const originalPlay = AudioManager.play;
    const originalPause = AudioManager.pause;

    AudioManager.play = function () {
      originalPlay.call(this);
      updateAllPlayAllButtons(true);
    };

    AudioManager.pause = function () {
      originalPause.call(this);
      updateAllPlayAllButtons(false);
    };
  }
}

function updateAllPlayAllButtons(isPlaying) {
  const playAllButtons = document.querySelectorAll(
    ".play-all-btn[data-loaded='true']"
  );

  playAllButtons.forEach((btn) => {
    if (isPlaying) {
      btn.classList.add("playing");
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
        </svg>
        <span>일시정지</span>
      `;
    } else {
      btn.classList.remove("playing");
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M8 5v14l11-7z" fill="currentColor"/>
        </svg>
        <span>재생</span>
      `;
    }
  });
}

// ============================================
// 🎵 추가 스타일 삽입
// ============================================
function injectWorksMusicStyles() {
  const style = document.createElement("style");
  style.textContent = `
    /* ✅ GLightbox description 완전 숨김 */
    .glightbox-container .gslide-description,
    .glightbox-container .gdesc-inner,
    .glightbox-container .gslide-desc {
      display: none !important;
      visibility: hidden !important;
    }
    
    /* 미니 플레이어 하이라이트 */
    #draggable-player.highlight {
      animation: pulse 0.5s ease 2;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    /* 전체 재생 버튼 */
    .play-all-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 20px;
      padding: 12px 24px;
      background: #ff3333;
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .play-all-btn:hover {
      background: #e62222;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 51, 51, 0.3);
    }
    
    .play-all-btn.playing {
      background: #1d1d1f;
    }
    
    /* 🎯 드래그 앤 드롭 스타일 */
    .playlist-tracks {
      cursor: default;
    }
    
    .track-item {
      cursor: grab;
      transition: all 0.2s ease;
      user-select: none;
    }
    
    .track-item:active {
      cursor: grabbing;
    }
    
    /* 드래그 중인 아이템 */
    .track-item.dragging {
      opacity: 0.5;
      transform: scale(0.95);
    }
    
    /* 선택된 아이템 */
    .track-item.track-chosen {
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    /* 고스트 (드래그 위치 표시) */
    .track-item.track-ghost {
      opacity: 0.3;
      background: rgba(255, 51, 51, 0.1);
      border: 2px dashed #ff3333;
    }
    
    /* 드래그 중 애니메이션 */
    .track-item.track-dragging {
      opacity: 0.8;
      transform: rotate(2deg) scale(1.02);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      z-index: 1000;
    }
    
    /* 드래그 가능 힌트 - 호버 시 표시 */
    .track-item:hover::before {
      content: '⋮⋮';
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.3);
      font-size: 16px;
      letter-spacing: -2px;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// 🎯 자동 실행
// ============================================
function waitAndInit() {
  if (typeof GLightbox !== "undefined" && typeof Swiper !== "undefined") {
    injectWorksMusicStyles();
    initWorksMusicIntegration();
  } else {
    setTimeout(waitAndInit, 100);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(waitAndInit, 500);
  });
} else {
  setTimeout(waitAndInit, 500);
}

// ============================================
// 📤 Export
// ============================================
window.WorksMusicManager = WorksMusicManager;
window.worksMusicData = worksMusicData;
window.rhapsodyMusicData = rhapsodyMusicData;
