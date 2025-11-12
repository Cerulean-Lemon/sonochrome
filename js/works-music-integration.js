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
  "snapshot7.jpg": {
    id: "work_1",
    title: "마음",
    artist: "IU",
    album: "Movement I: 정적",
    duration: "2:56",
    file: "Heart Piano.mp3",
    thumbnail: "images/snapshot7.jpg",
    description: ""
  },
  "snapshot8.jpg": {
    id: "work_2",
    title: "Empty Street",
    artist: "SONOCHROME",
    album: "Movement I: 정적",
    duration: "3:42",
    file: "music/empty-street.mp3", 
    thumbnail: "images/work1-2.jpg",
    description: "텅 빈 거리의 적막함을 담은 음악"
  },
  "work1-3.jpg": {
    id: "work_3",
    title: "Foggy Morning",
    artist: "SONOCHROME",
    album: "Movement I: 정적",
    duration: "5:10",
    file: "music/foggy-morning.mp3",
    thumbnail: "images/work1-3.jpg",
    description: "안개 낀 아침의 몽환적인 사운드스케이프"
  },
  "work1-4.jpg": {
    id: "work_4",
    title: "Silent Harbor",
    artist: "SONOCHROME",
    album: "Movement I: 정적",
    duration: "4:30",
    file: "music/silent-harbor.mp3",
    thumbnail: "images/work1-4.jpg",
    description: "고요한 항구의 파도 소리와 함께"
  },
  "work1-5.jpg": {
    id: "work_5",
    title: "Winter Solitude",
    artist: "SONOCHROME",
    album: "Movement I: 정적",
    duration: "3:55",
    file: "music/winter-solitude.mp3",
    thumbnail: "images/work1-5.jpg",
    description: "겨울의 고독을 담은 차가운 선율"
  },
  "work1-6.jpg": {
    id: "work_6",
    title: "Quiet Alley",
    artist: "SONOCHROME",
    album: "Movement I: 정적",
    duration: "3:20",
    file: "music/quiet-alley.mp3",
    thumbnail: "images/work1-6.jpg",
    description: "조용한 골목길의 발자국 소리"
  },
  "work1-7.jpg": {
    id: "work_7",
    title: "Abandoned Station",
    artist: "SONOCHROME",
    album: "Movement I: 정적",
    duration: "4:48",
    file: "music/abandoned-station.mp3",
    thumbnail: "images/work1-7.jpg",
    description: "버려진 역의 메아리치는 공간감"
  },
  "work1-8.jpg": {
    id: "work_8",
    title: "Still Water",
    artist: "SONOCHROME",
    album: "Movement I: 정적",
    duration: "4:05",
    file: "music/still-water.mp3",
    thumbnail: "images/work1-8.jpg",
    description: "잔잔한 물결의 명상적 사운드"
  }
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
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎵 playWorkMusic 호출됨!');
    console.log('📸 Image URL:', imageUrl);
    
    // 이미지 URL에서 파일명 추출
    const filename = imageUrl.split('/').pop().split('?')[0]; // 쿼리 파라미터 제거
    console.log('📁 Extracted filename:', filename);
    
    const musicData = worksMusicData[filename];
    
    if (!musicData) {
      console.warn('❌ No music data found for:', filename);
      console.warn('📋 Available files:', Object.keys(worksMusicData));
      return;
    }
    
    console.log('✅ Music data found:', musicData);
    
    this.isWorkMode = true;
    this.currentWorkTrack = musicData;
    
    // AudioManager 확인
    if (typeof AudioManager === 'undefined') {
      console.error('❌ AudioManager is not defined!');
      return;
    }
    
    console.log('✅ AudioManager found');
    console.log('📊 Current playlist length:', AudioManager.playlist.length);
    
    // ✨ 플레이리스트에서 이미 존재하는지 확인
    const existingIndex = AudioManager.playlist.findIndex(
      track => track.id === musicData.id
    );
    
    if (existingIndex === -1) {
      // 🆕 새로운 트랙 → 플레이리스트 끝에 추가
      console.log('🆕 Adding new track to playlist');
      AudioManager.playlist.push(musicData);
      AudioManager.currentTrackIndex = AudioManager.playlist.length - 1;
      console.log('📊 New playlist length:', AudioManager.playlist.length);
    } else {
      // 🔄 이미 있는 트랙 → 해당 인덱스로 이동
      console.log('🔄 Track already in playlist, moving to index:', existingIndex);
      AudioManager.currentTrackIndex = existingIndex;
    }
    
    console.log('🎯 Current track index:', AudioManager.currentTrackIndex);
    console.log('🎵 Loading track...');
    
    // 트랙 로드 및 재생
    AudioManager.loadTrack(AudioManager.currentTrackIndex, AudioManager.playlist);
    AudioManager.play();
    
    console.log('▶️ Play command sent');
    
    // UI 업데이트
    this.updatePlayerUI(musicData);
    this.showMiniPlayer();
    
    // 플레이리스트 패널 업데이트
    if (typeof updatePlaylistUI === 'function') {
      updatePlaylistUI();
      console.log('✅ Playlist UI updated');
    }
    
    // 현재 재생 정보 업데이트
    if (typeof updateNowPlaying === 'function') {
      updateNowPlaying();
      console.log('✅ Now Playing updated');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  },
  
  /**
   * 플레이어 UI 업데이트
   */
  updatePlayerUI(musicData) {
    const nowPlayingCard = document.querySelector('.now-playing-card');
    if (nowPlayingCard) {
      const trackInfo = nowPlayingCard.querySelector('.track-info');
      if (trackInfo) {
        trackInfo.innerHTML = `
          <h4>${musicData.title}</h4>
          <p>${musicData.artist} · ${musicData.album}</p>
        `;
      }
      
      const albumArt = nowPlayingCard.querySelector('.album-art');
      if (albumArt && musicData.thumbnail) {
        albumArt.style.backgroundImage = `url(${musicData.thumbnail})`;
        albumArt.style.backgroundSize = 'cover';
        albumArt.style.backgroundPosition = 'center';
        albumArt.innerHTML = '';
      }
    }
  },
  
  /**
   * 미니 플레이어 표시
   */
  showMiniPlayer() {
    const player = document.getElementById('draggable-player');
    if (player) {
      if (!player.classList.contains('visible')) {
        player.classList.add('visible');
        player.style.bottom = '30px';
      }
      
      player.classList.add('highlight');
      setTimeout(() => {
        player.classList.remove('highlight');
      }, 1000);
    }
  },
  
  /**
   * Works 섹션의 모든 음악을 플레이리스트에 추가
   */
  addAllWorksToPlaylist() {
    if (typeof AudioManager !== 'undefined') {
      let addedCount = 0;
      Object.values(worksMusicData).forEach(track => {
        const exists = AudioManager.playlist.some(t => t.id === track.id);
        if (!exists) {
          AudioManager.playlist.push(track);
          addedCount++;
        }
      });
      
      if (typeof updatePlaylistUI === 'function') {
        updatePlaylistUI();
      }
      
      console.log(`🎵 Added ${addedCount} new tracks. Total: ${AudioManager.playlist.length}`);
    }
  }
};

// ============================================
// 🎵 GLightbox 초기화 (텍스트 완전 제거 버전)
// ============================================
function initWorksMusicIntegration() {
  console.log('🎵 Initializing Works-Music Integration...');
  
  // 1. Work 카드 설정
  const workCards = document.querySelectorAll('.work-card');
  console.log(`📊 Found ${workCards.length} work cards`);
  
  workCards.forEach((card, index) => {
    const imageUrl = card.getAttribute('href');
    if (!imageUrl) {
      console.warn(`⚠️ Card ${index} has no href`);
      return;
    }
    
    const filename = imageUrl.split('/').pop();
    const musicData = worksMusicData[filename];
    
    if (musicData) {
      // GLightbox 클래스 확인
      if (!card.classList.contains('glightbox')) {
        card.classList.add('glightbox');
      }
      
      // ✅ data-description 제거 - 텍스트 완전 삭제
      card.removeAttribute('data-description');
      
      // Gallery 속성만 설정 (같은 앨범끼리 그룹화)
      card.setAttribute('data-gallery', musicData.album);
      
      console.log(`✅ Configured card ${index}: ${filename} → ${musicData.title}`);
    } else {
      console.warn(`⚠️ No music data for: ${filename}`);
    }
  });
  
  // 2. GLightbox 초기화
  if (typeof GLightbox === 'undefined') {
    console.error('❌ GLightbox library not found!');
    return;
  }
  
  console.log('🔄 Initializing GLightbox...');
  
  WorksMusicManager.lightboxInstance = GLightbox({
    selector: '.work-card',
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
    closeButton: true,
    closeOnOutsideClick: true,
    skin: 'clean',
    slideEffect: 'fade',
    openEffect: 'zoom',
    closeEffect: 'fade',
    zoomable: true,
    draggable: true,
    preload: true,
    moreLength: 0, // ✅ "더보기" 텍스트 제거
    
    // ✅ 라이트박스 열릴 때
    onOpen: () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📸 GLightbox opened');
      
      setTimeout(() => {
        // 현재 활성 슬라이드 찾기 (여러 방법 시도)
        let activeSlide = document.querySelector('.glightbox-container .gslide.current .gslide-image img');
        if (!activeSlide) {
          activeSlide = document.querySelector('.glightbox-container .gslide.current img');
        }
        if (!activeSlide) {
          activeSlide = document.querySelector('.glightbox-container .current .gslide-image');
        }
        
        if (activeSlide) {
          const imageSrc = activeSlide.getAttribute('src') || activeSlide.src;
          console.log('📸 Current slide found:', imageSrc);
          
          if (imageSrc) {
            WorksMusicManager.playWorkMusic(imageSrc);
          } else {
            console.warn('⚠️ Image src is empty');
          }
        } else {
          console.error('❌ Could not find current slide image');
          console.log('🔍 Available elements:', 
            document.querySelectorAll('.glightbox-container .gslide').length,
            'slides');
        }
      }, 150); // 약간 더 긴 딜레이로 DOM 완전 로드 보장
    },
    
    // ✅ 슬라이드 변경 시
    onSlideChange: () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔄 Slide changed');
      
      setTimeout(() => {
        let activeSlide = document.querySelector('.glightbox-container .gslide.current .gslide-image img');
        if (!activeSlide) {
          activeSlide = document.querySelector('.glightbox-container .gslide.current img');
        }
        if (!activeSlide) {
          activeSlide = document.querySelector('.glightbox-container .current .gslide-image');
        }
        
        if (activeSlide) {
          const imageSrc = activeSlide.getAttribute('src') || activeSlide.src;
          console.log('📸 Changed to:', imageSrc);
          
          if (imageSrc) {
            WorksMusicManager.playWorkMusic(imageSrc);
          }
        }
      }, 150);
    }
  });
  
  console.log('✅ GLightbox initialized successfully');
  
  // 3. "전체 재생" 버튼 추가
  addPlayAllButton();
  
  console.log('✅ Works-Music Integration fully initialized');
}

// ============================================
// 🎵 전체 재생 버튼 추가
// ============================================
function addPlayAllButton() {
  const movementHeaders = document.querySelectorAll('.movement-header');
  
  movementHeaders.forEach(header => {
    if (header.querySelector('.play-all-btn')) return;
    
    const playAllBtn = document.createElement('button');
    playAllBtn.className = 'play-all-btn';
    playAllBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M8 5v14l11-7z" fill="currentColor"/>
      </svg>
      <span>전체 재생</span>
    `;
    
    playAllBtn.addEventListener('click', function() {
      console.log('🎵 Play All button clicked');
      WorksMusicManager.addAllWorksToPlaylist();
      
      const firstCard = header.parentElement.querySelector('.work-card');
      if (firstCard) {
        const imageUrl = firstCard.getAttribute('href');
        WorksMusicManager.playWorkMusic(imageUrl);
      }
      
      this.classList.add('playing');
      this.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
        </svg>
        <span>재생 중</span>
      `;
    });
    
    header.appendChild(playAllBtn);
  });
}

// ============================================
// 🎵 추가 스타일 삽입
// ============================================
function injectWorksMusicStyles() {
  const style = document.createElement('style');
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
  `;
  document.head.appendChild(style);
}

// ============================================
// 🎯 자동 실행
// ============================================
function waitAndInit() {
  if (typeof GLightbox !== 'undefined' && typeof Swiper !== 'undefined') {
    console.log('✅ All libraries loaded');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    injectWorksMusicStyles();
    initWorksMusicIntegration();
  } else {
    console.log('⏳ Waiting for libraries...');
    console.log('  GLightbox:', typeof GLightbox !== 'undefined' ? '✅' : '❌');
    console.log('  Swiper:', typeof Swiper !== 'undefined' ? '✅' : '❌');
    setTimeout(waitAndInit, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
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