import { WEBGL } from 'https://unpkg.com/three@0.125.0/examples/jsm/WebGL.js';

// Check if WebXR / HitTest / WebGL are available on this device
window.addEventListener('load', () => {
    let button = document.querySelector('#enter-ar-button');

    const WEBXR_SUPPORTED = navigator.xr && navigator.xr.isSessionSupported;
    const HIT_TEST_SUPPORTED = window.XRSession && window.XRSession.prototype.requestHitTestSource;
    const AR_SUPPORTED = navigator.xr.isSessionSupported('immersive-ar');

    if (!WEBXR_SUPPORTED) {
        button.innerText = 'WEBXR NOT AVAILABLE';
        window.AR_MODE_SUPPORTED = false;
    } else if (!HIT_TEST_SUPPORTED) {
        button.innerText = 'HIT-TEST NOT AVAILABLE';
        window.AR_MODE_SUPPORTED = false;
    } else if (!AR_SUPPORTED) {
        button.innerText = 'AR-IMMERSIVE SESSION NOT AVAILABLE';
        window.AR_MODE_SUPPORTED = false;
    } else {
        if (WEBGL.isWebGLAvailable()) {
            const event = new Event('appSupported');
            window.dispatchEvent(event);
            button.innerText = 'ENTER AR';
            window.AR_MODE_SUPPORTED = true;
        } else {
            console.log(WEBGL.getWebGLErrorMessage());
            button.innerText = 'WEBGL NOT AVAILABLE';
            window.AR_MODE_SUPPORTED = false;
        }
    }

    button.style.display = 'block';
    console.log('truc');
});
