function switchARMode () {
    if (!window.AR_MODE_SUPPORTED) return;

    if (currentSession !== null) {
        // Exit AR Mode
        currentSession.end();
        document.querySelector('#renderCanvas').style.display = 'none';
        document.querySelector('#loadingScreen').style.display = 'flex';
    } else {
        // Enter AR Mode
        document.querySelector('#loadingScreen').style.display = 'none';
        document.querySelector('#renderCanvas').style.display = 'block';
        let xrInit = { requiredFeatures: ['hit-test'] };
        navigator.xr.requestSession('immersive-ar', xrInit)
                    .then(onXRSessionStart);
    }
}


async function onXRSessionStart (xrSession) {
    xrSession.addEventListener('end', onXRSessionEnd);
    renderer.xr.setReferenceSpaceType('local');
    await renderer.xr.setSession(xrSession);
    currentSession = xrSession;
}


function onXRSessionEnd () {
    currentSession.removeEventListener('end', onXRSessionEnd);
    currentSession = null;
    xrHitTestSource = null;
}
