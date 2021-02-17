let switchARMode = event => {
    if (!window.AR_MODE_SUPPORTED) return;

    let scene = document.querySelector('a-scene');

    if (scene.is('ar-mode')) {
        // Exit AR Mode
        // document.getElementById('overlay').style.display = 'none';
        scene.style.display = 'none';
        scene.exitVR();
        document.getElementById('loadingScreen').style.display = 'flex';
    } else {
        // Enter AR Mode
        document.getElementById('loadingScreen').style.display = 'none';
        scene.enterAR();
        scene.style.display = 'block';
        // document.getElementById('overlay').style.display = 'flex';
    }

    if (event) event.stopPropagation();
}
