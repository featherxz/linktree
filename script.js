document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const appContainer = document.querySelector('.app-container'); // NEW
    const menuToggleBtn = document.getElementById('menu-toggle-btn'); // NEW

    // Music Player Elements
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = document.querySelector('#play-pause-btn i');
    const volumeSlider = document.getElementById('music-volume');
    const volumeIcon = document.getElementById('volume-icon');
    const timeline = document.getElementById('music-timeline');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    // CORRECT PATH: References the audio file inside the 'audio' folder
    const audio = new Audio('audio/music.mp3'); 
    audio.loop = true;
    
    // Set initial volume
    audio.volume = 0.5; 

    // --- Helper Function ---
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // --- Music Control Functions ---
    function togglePlayPause() {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    function updateVolumeIcon() {
        if (audio.muted || audio.volume === 0) {
            volumeIcon.className = 'fas fa-volume-off';
        } else if (audio.volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }
    
    // --- Transition Function ---
    function proceed() {
        // 1. Start the music playback
        audio.play().then(() => {
            console.log("Music started successfully from the /audio directory.");
            playPauseIcon.className = 'fas fa-pause'; 
        }).catch(error => {
            console.warn("Audio playback was blocked or the file was not found.", error);
            playPauseIcon.className = 'fas fa-play'; 
        });

        // 2. Start the CSS fade-out animation
        splashScreen.classList.add('fade-out');

        // 3. Remove the element completely after the 1-second transition ends
        setTimeout(() => {
            splashScreen.remove();
        }, 1000); 
        
        // 4. Clean up event listeners
        window.removeEventListener('keydown', handleKeyPress);
        splashScreen.removeEventListener('click', proceed);
    }

    // --- NEW: Menu Toggle Functionality ---
    if (menuToggleBtn && appContainer) {
        menuToggleBtn.addEventListener('click', () => {
            // Toggles the class that controls the sidebar visibility via CSS
            appContainer.classList.toggle('menu-open');
        });
    }
    
    // --- Event Listeners for Splash Screen (EXISTING) ---
    splashScreen.addEventListener('click', proceed);

    function handleKeyPress(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            proceed();
        }
    }
    
    window.addEventListener('keydown', handleKeyPress);
    
    // --- Event Listeners for Music Player (EXISTING) ---

    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    // Audio events to update the button icon
    audio.addEventListener('play', () => {
        playPauseIcon.className = 'fas fa-pause';
    });

    audio.addEventListener('pause', () => {
        playPauseIcon.className = 'fas fa-play';
    });

    // Volume control
    if (volumeSlider) {
        volumeSlider.value = audio.volume;
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value;
            updateVolumeIcon();
        });
        
        // Initial volume icon set
        updateVolumeIcon(); 
    }
    
    // Timeline Update - When audio metadata is loaded (get duration)
    audio.addEventListener('loadedmetadata', () => {
        if (timeline && durationEl) {
            timeline.max = audio.duration;
            durationEl.textContent = formatTime(audio.duration);
        }
    });

    // Timeline Update - As music plays
    audio.addEventListener('timeupdate', () => {
        if (timeline && currentTimeEl) {
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            
            // Update the timeline slider position
            if (!isNaN(duration)) {
                if (timeline.max !== duration) {
                    timeline.max = duration;
                    durationEl.textContent = formatTime(duration);
                }
                timeline.value = currentTime;
            }

            // Update the time display
            currentTimeEl.textContent = formatTime(currentTime);
        }
    });

    // Seek functionality (user interacts with the timeline slider)
    if (timeline) {
        timeline.addEventListener('input', (e) => {
            audio.currentTime = e.target.value;
        });
    }
});