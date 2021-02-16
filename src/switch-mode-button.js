let switchARMode = event => {
    if (!window.AR_MODE_SUPPORTED) return;

    let scene = document.querySelector('a-scene');

    if (scene.is('ar-mode')) {
        // Exit AR Mode
        document.getElementById('overlay').style.display = 'none';
        scene.style.display = 'none';
        scene.exitVR();
        document.getElementById('loadingScreen').style.display = 'flex';
    } else if (window.isPlayingVideo) {
        // Exit Video playback
        scene.enterAR();
        document.querySelector('#environment').pause();
        document.querySelector('#environment').currentTime = 0;
        document.querySelector('a-videosphere').setAttribute('visible', 'false');
        document.querySelector('#animatedDoor').setAttribute('visible', 'true');
        window.isPlayingVideo = false;
    } else {
        // Enter AR Mode
        document.getElementById('loadingScreen').style.display = 'none';
        scene.enterAR();
        scene.style.display = 'block';
        document.getElementById('overlay').style.display = 'flex';

        let videoEl = document.getElementById('environment');
        if (videoEl.readyState < 2) {     // Download has not started
            videoEl.load();
            videoEl.addEventListener('canplaythrough', () => {
                var videosphere = document.createElement('a-videosphere');
                scene.appendChild(videosphere);
                videosphere.setAttribute('src', '#environment');
                videosphere.setAttribute('visible', 'false');
                videosphere.setAttribute('hide-in-ar-mode');
            });
        }
    }

    if (event && (typeof event.cancelable !== 'boolean' || event.cancelable)) {
        event.preventDefault();
    }
}
