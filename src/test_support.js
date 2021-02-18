import { WEBGL } from 'https://unpkg.com/three@0.125.0/examples/jsm/WebGL.js';

// Check if WebXR / HitTest / WebGL are available on this device
window.addEventListener('load', () => {
    const WEBXR_SUPPORTED = navigator.xr && navigator.xr.isSessionSupported;
    const HIT_TEST_SUPPORTED = window.XRSession && window.XRSession.prototype.requestHitTestSource;
    if (!WEBXR_SUPPORTED) {
        // document.getElementById('enter-ar-button').innerText = 'WEBXR NOT AVAILABLE';
        window.AR_MODE_SUPPORTED = false;
    } else if (!HIT_TEST_SUPPORTED) {
        // document.getElementById('enter-ar-button').innerText = 'HIT-TEST NOT AVAILABLE';
        window.AR_MODE_SUPPORTED = false;
    } else {
        if (WEBGL.isWebGLAvailable()) {
            const event = new Event('appSupported');
            window.dispatchEvent(event);
            // document.querySelector('#enter-ar-button').innerText = 'ENTER AR';
            window.AR_MODE_SUPPORTED = true;
        } else {
            console.log(WEBGL.getWebGLErrorMessage());
            // document.getElementById('enter-ar-button').innerText = 'WEBGL NOT AVAILABLE';
            window.AR_MODE_SUPPORTED = false;
        }
    }
});
