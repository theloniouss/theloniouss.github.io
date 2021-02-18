import * as THREE from 'https://unpkg.com/three@0.125.0/build/three.module.js';

let GLOBAL_VAR = {xrHitTestSource: null, currentSession: null};


function init () {
    let container = document.createElement('div');
    document.body.appendChild(container);

    let width = window.innerWidth || container.clientWidth;
    let height = window.innerHeight || container.clientHeight;

    initScene(width, height);
    initUserInterface(width, height);

    GLOBAL_VAR.scene.userData.element = container;

    window.addEventListener('resize', updateSize, false);

    GLOBAL_VAR.renderer = new THREE.WebGLRenderer({container, antialias: true, alpha: true, premultipliedAlpha: false});
    GLOBAL_VAR.renderer.setPixelRatio(window.devicePixelRatio);
    GLOBAL_VAR.renderer.setSize(width, height);
    GLOBAL_VAR.renderer.autoClear = false;
    GLOBAL_VAR.renderer.xr.enabled = true;

    xrFeatures = {
        requiredFeatures: ['hit-test'],
        optionalFeatures: []
    };
    navigator.xr.requestSession('immersive-ar', xrFeatures).then(xrSession => {
        // GLOBAL_VAR.renderer.xr.setReferenceSpaceType('local');
        xrSession.addEventListener('end', function () {
            GLOBAL_VAR.currentSession.removeEventListener('end');
            GLOBAL_VAR.currentSession = null;
            GLOBAL_VAR.xrHitTestSource = null;
        });
        await renderer.xr.setSession(xrSession);
        GLOBAL_VAR.currentSession = xrSession;
    });

    let controller = GLOBAL_VAR.renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    GLOBAL_VAR.scene.add(controller);

    async function onSessionStarted(session) {
        session.addEventListener('end', onSessionEnded );
        renderer.xr.setReferenceSpaceType( 'local' );
        await renderer.xr.setSession( session );
        GLOBAL_VAR.currentSession = session;
    }

    GLOBAL_VAR.renderer.xr.addEventListener('sessionstart', _ => {
        console.log('yas');
        let xrSession = GLOBAL_VAR.renderer.xr.getSession();
        xrSession.requestReferenceSpace('viewer').then(xrViewerSpace => {
            xrSession.requestHitTestSource({space: xrViewerSpace}).then(src => {
                xrHitTestSource = src;
            });
        });


    });
}


function initScene (width, height) {
    GLOBAL_VAR.scene = new THREE.Scene();
    const scCamera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);
    GLOBAL_VAR.scene.userData.camera = scCamera;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    GLOBAL_VAR.scene.add(light);

    let reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    reticle.name = 'xrReticle';
    GLOBAL_VAR.scene.add(reticle);
}


function initUserInterface (width, height) {
    // User Interface
    // ui = new THREE.Scene();
    // const uiCamera = new THREE.OrthographicCamera(-width/2, width/2,
    //                                               height/2, -height/2, 0, 1);
}


function updateSize () {
    const wWidth = window.innerWidth || GLOBAL_VAR.scene.userData.element.clientWidth;
    const wHeight = window.innerHeight || GLOBAL_VAR.scene.userData.element.clientHeight;

    GLOBAL_VAR.renderer.setSize(wWidth, wHeight, false);

    GLOBAL_VAR.scene.userData.camera.aspect = wWidth / wHeight;
    GLOBAL_VAR.scene.userData.camera.updateProjectionMatrix();

    GLOBAL_VAR.ui.userData.camera.left = -wWidth / 2;
    GLOBAL_VAR.ui.userData.camera.right = wWidth / 2;
    GLOBAL_VAR.ui.userData.camera.top = wHeight / 2;
    GLOBAL_VAR.ui.userData.camera.bottom = -wHeight / 2;
    GLOBAL_VAR.ui.userData.camera.updateProjectionMatrix();
}


function onSelect () {
    let reticle = GLOBAL_VAR.scene.getObjectByName('xrReticle');
    if (reticle.visible) {
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.setFromMatrixPosition(reticle.matrix);
        mesh.scale.y = Math.random() * 2 + 1;
        GLOBAL_VAR.scene.add(mesh);
    }
}


function render (currentFrameTime, frame) {
    // console.log(GLOBAL_VAR.xrHitTestSource, GLOBAL_VAR.renderer.xr.isPresenting);
    if (GLOBAL_VAR.xrHitTestSource !== null && GLOBAL_VAR.renderer.xr.isPresenting) {
        const xrRefSpace = GLOBAL_VAR.renderer.xr.getReferenceSpace();
        const xrHitTestResults = frame.getHitTestResults(GLOBAL_VAR.xrHitTestSource);
        let reticle = GLOBAL_VAR.scene.getObjectByName('xrReticle');

        if (xrHitTestResults.length > 0) {
            const hit = xrHitTestResults[0];
            reticle.matrix.fromArray(hit.getPose(xrRefSpace).transform.matrix);
            reticle.visible = true;
        } else {
            reticle.visible = false;
        }

        GLOBAL_VAR.renderer.clear();
        GLOBAL_VAR.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

        // render scene
        GLOBAL_VAR.renderer.render(GLOBAL_VAR.scene, GLOBAL_VAR.scene.userData.camera);

        GLOBAL_VAR.renderer.clearDepth();

        // render ui
        // GLOBAL_VAR.renderer.render(GLOBAL_VAR.ui, GLOBAL_VAR.ui.userData.camera);
    }
}


function animate () {
    GLOBAL_VAR.renderer.setAnimationLoop(render);
}


window.addEventListener('appSupported', _ => {
    init();
    animate();
});
