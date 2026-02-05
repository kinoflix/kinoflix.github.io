// 🔽 MAHNILAR 🔽
    const tracks = [
      { title: "Ahdım olsun", file: "../../FILES/MP3/ahdimolsun.mp3" },
      { title: "Sensizim", file: "../../FILES/MP3/sensizim.mp3" },
      { title: "Akıllı ol", file: "../../FILES/MP3/akilliol.mp3" },
      { title: "Seni seviyorum", file: "../../FILES/MP3/seniseviyorum.mp3" },
      { title: "Telafi", file: "../../FILES/MP3/telafi.mp3" },
      { title: "Senin olmaya geldim", file: "../../FILES/MP3/seninolmayageldim.mp3" },
      { title: "Sevdim inkar etmedim", file: "../../FILES/MP3/sevdiminkaretmedim.mp3" },
      { title: "Sabahlar uzak", file: "../../FILES/MP3/sabahlaruzak.mp3" },
      { title: "Kaybedenler", file: "../../FILES/MP3/kaybedenler.mp3" },
      { title: "Allah seninle olsun", file: "../../FILES/MP3/allahseninleolsun.mp3" },
      { title: "Vazgeçmem", file: "../../FILES/MP3/vazgecmem.mp3" },
      { title: "Vazgeçmem (Remix)", file: "../../FILES/MP3/vazgecmemremix.mp3" },
      { title: "Benim dünyam", file: "../../FILES/MP3/benimdunyam.mp3" },
      { title: "Bir inat uğruna", file: "../../FILES/MP3/birinatugruna.mp3" }
    ];
    const trackList = document.getElementById('track-list');
    const playPauseBtn = document.getElementById('play-pause');
    const progress = document.getElementById('progress');
    const progressContainer = document.getElementById('progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    let audio = new Audio();
    let currentTrackIndex = -1;
    let isPlaying = false;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60) || 0;
      const secs = Math.floor(seconds % 60) || 0;
      return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    }

    function loadTrack(index) {
      if(index < 0 || index >= tracks.length) return;
      if(currentTrackIndex === index) return;
      currentTrackIndex = index;
      audio.src = tracks[index].file;
      audio.load();
      updateActiveTrack();
    }

    function updateActiveTrack() {
      [...trackList.children].forEach((li, idx) => {
        if(idx === currentTrackIndex) {
          li.style.backgroundColor = "var(--accent)";
          li.style.color = "#000";
          li.classList.remove('inactive');
          const playBtn = li.querySelector('.play-btn i');
          if (playBtn) playBtn.className = "fa-solid fa-pause";
        } else {
          li.style.backgroundColor = "var(--track-bg)";
          li.style.color = "var(--text-color)";
          li.classList.add('inactive');
          const playBtn = li.querySelector('.play-btn i');
          if (playBtn) playBtn.className = "fa-solid fa-play";
        }
      });
    }

    function playAudio() {
      if(currentTrackIndex === -1) return;
      audio.play();
      isPlaying = true;

      // Digər mahnıları solğunlaşdır
      [...trackList.children].forEach((li, idx) => {
        if (idx !== currentTrackIndex) li.classList.add('inactive');
      });

      playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      const activeLi = trackList.children[currentTrackIndex];
      if (activeLi) {
        const btn = activeLi.querySelector('.play-btn i');
        if (btn) btn.className = "fa-solid fa-pause";
      }
    }

    function pauseAudio() {
      audio.pause();
      isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      if (currentTrackIndex !== -1) {
        const activeLi = trackList.children[currentTrackIndex];
        if (activeLi) {
          const btn = activeLi.querySelector('.play-btn i');
          if (btn) btn.className = "fa-solid fa-play";
        }
      }
      // İnaktiv sətri:
      [...trackList.children].forEach(li => li.classList.remove('inactive'));
    }

    playPauseBtn.addEventListener('click', () => {
      if (currentTrackIndex === -1) {
        loadTrack(0); // Boş olan Play butonuna ilk mahnı
        playAudio();
        return;
      }

      isPlaying ? pauseAudio() : playAudio();
    });

    audio.addEventListener('timeupdate', () => {
      if(audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
      }
    });

    progressContainer.addEventListener('click', e => {
      const width = progressContainer.clientWidth;
      const clickX = e.offsetX;
      if(audio.duration) audio.currentTime = (clickX / width) * audio.duration;
    });

    // Mahnılara click etdikdə toggle play/pause
    tracks.forEach((track, index) => {
      const li = document.createElement('li');
      li.className = 'track';

      const playBtn = document.createElement('button');
      playBtn.className = 'play-btn';
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      playBtn.addEventListener('click', e => {
        e.stopPropagation();
        // Eyni mahnıda toggle pause/play
        if(currentTrackIndex === index) {
          if(isPlaying) {
            pauseAudio();
          } else {
            playAudio();
          }
        } else {
          loadTrack(index);
          playAudio();
        }
      });
      li.appendChild(playBtn);

      const span = document.createElement('span');
      span.textContent = track.title;
      span.style.flex = '1';
      span.style.textAlign = 'center';
      li.appendChild(span);

      const dl = document.createElement('a');
      dl.href = track.file;
      dl.download = '';
      dl.className = 'download-icon';
      dl.innerHTML = '<i class="fa-solid fa-download"></i>';
      li.appendChild(dl);

      // Mahnıya click etdikdə eyni toggle işləsin
      li.addEventListener('click', e => {
        if(!e.target.closest('a.download-icon') && !e.target.closest('button.play-btn')) {
          if(currentTrackIndex === index) {
            if(isPlaying) {
              pauseAudio();
            } else {
              playAudio();
            }
          } else {
            loadTrack(index);
            playAudio();
          }
        }
      });

      trackList.appendChild(li);
    });

    // Mahnı bitdikdə butonlar ve opasity sıfırlanacaq,
    // amma bitən mahnı aktiv (yaşıl hover) qalacaq
    audio.addEventListener('ended', () => {
      isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      // Bitən mahnı üçün pause ikonu play olacaq, opacity normala dönəcək
      [...trackList.children].forEach((li, idx) => {
        li.style.backgroundColor = "var(--track-bg)";
        li.style.color = "var(--text-color)";
        li.classList.remove('inactive');
        const playBtnIcon = li.querySelector('.play-btn i');
        if(playBtnIcon) playBtnIcon.className = "fa-solid fa-play";
      });
      // Bitən mahnı üçün aktiv görünümü qoru
      if(currentTrackIndex !== -1) {
        const endedLi = trackList.children[currentTrackIndex];
        endedLi.style.backgroundColor = "var(--accent)";
        endedLi.style.color = "#000";
        endedLi.classList.remove('inactive');
      }
      progress.style.width = '0%';
      currentTimeEl.textContent = '0:00';
    });

    document.getElementById('toggle-theme').addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const icon = document.getElementById('toggle-theme');
      icon.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    });
