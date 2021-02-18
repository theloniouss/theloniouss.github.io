function switchARMode (sessionFeatures = {requiredFeatures: ['hit-test']}) {
    if (!window.AR_MODE_SUPPORTED) return;

    if (GLOBAL_VAR.currentSession === null) {
        navigator.xr.requestSession('immersive-ar', sessionFeatures).then(onSessionStarted);
    } else {
        GLOBAL_VAR.currentSession.end();
    }


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
