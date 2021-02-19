import * as THREE from 'https://unpkg.com/three@0.125.0/build/three.module.js';
import { Button } from "./ui-elements.js";


function init () {
    let container = document.createElement('div');
    container.setAttribute('id', 'renderCanvas');
    container.style.display = 'none';
    document.body.appendChild(container);

    let width = window.innerWidth || container.clientWidth;
    let height = window.innerHeight || container.clientHeight;

    initScene(width, height);
    initUserInterface(width, height);

    scene.userData.element = container;

    window.addEventListener('resize', updateSize, false);

    renderer = new THREE.WebGLRenderer({container, antialias: true, alpha: true, premultipliedAlpha: false});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.autoClear = false;
    renderer.xr.enabled = true;

    GLrenderer = new THREE.WebGLRenderer({container, antialias: true, alpha: true, premultipliedAlpha: false});
    GLrenderer.setPixelRatio(window.devicePixelRatio);
    GLrenderer.setSize(width, height);
    GLrenderer.autoClear = false;

    let controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    renderer.xr.addEventListener('sessionstart', () => {
        let xrSession = renderer.xr.getSession();
        xrSession.requestReferenceSpace('viewer').then(xrViewerSpace => {
            xrSession.requestHitTestSource({space: xrViewerSpace}).then(src => {
                xrHitTestSource = src;
            });
        });
    });
}


function initScene (width, height) {
    scene = new THREE.Scene();
    const scCamera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);
    scene.userData.camera = scCamera;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    let reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    reticle.name = 'xrReticle';
    scene.add(reticle);
}


function initUserInterface (width, height) {
    // User Interface
    ui = new THREE.Scene();
    const uiCamera = new THREE.OrthographicCamera(-width/2, width/2,
                                                  height/2, -height/2, 0, 1);
    uiCamera.position.set(0, 0, 0);
    uiCamera.lookAt(0, 0, -0.5);

    // UI elements
    const group = new THREE.Group();
    group.name = 'uiElements';
    group.position.set(0, 0, -0.5);

    let button = Button(0.1, 0.1);
    group.add(button);

    let button2 = Button(0.1, 0.1);
    button2.position.set(0, 0.2, 0);
    group.add(button2);

    let button3 = Button(0.1, 0.1);
    button3.position.set(0, -0.2, 0);
    group.add(button3);

    let button4 = Button(0.1, 0.1);
    button4.position.set(-0.2, 0, 0);
    group.add(button4);

    let button5 = Button(0.1, 0.1);
    button5.position.set(0.2, 0, 0);
    group.add(button5);

    ui.add(group);

    ui.userData.camera = uiCamera;
}


function updateSize () {
    const wWidth = window.innerWidth || scene.userData.element.clientWidth;
    const wHeight = window.innerHeight || scene.userData.element.clientHeight;

    renderer.setSize(wWidth, wHeight, false);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

    scene.userData.camera.aspect = wWidth / wHeight;
    scene.userData.camera.updateProjectionMatrix();

    // ui.userData.camera.left = -wWidth / 2;
    // ui.userData.camera.right = wWidth / 2;
    // ui.userData.camera.top = wHeight / 2;
    // ui.userData.camera.bottom = -wHeight / 2;
    // ui.userData.camera.updateProjectionMatrix();
}


function onSelect () {
    let reticle = scene.getObjectByName('xrReticle');
    if (reticle.visible) {
        const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.setFromMatrixPosition(reticle.matrix);
        mesh.scale.y = Math.random() * 2 + 1;
        scene.add(mesh);
    }
}


function render (currentFrameTime, frame) {
    const xrRefSpace = renderer.xr.getReferenceSpace();
    const xrHitTestResults = frame.getHitTestResults(xrHitTestSource);
    let reticle = scene.getObjectByName('xrReticle');

    if (xrHitTestResults.length > 0) {
        const hit = xrHitTestResults[0];
        reticle.matrix.fromArray(hit.getPose(xrRefSpace).transform.matrix);
        reticle.visible = true;
    } else {
        reticle.visible = false;
    }

    // render scene
    renderer.clear();
    renderer.render(scene, scene.userData.camera);

    // renderer.clearDepth();

    // render ui
    GLrenderer.clear();
    GLrenderer.render(ui, ui.userData.camera);
}


function animate (currentFrameTime, frame) {
    if (xrHitTestSource !== null && renderer.xr.isPresenting) {
        // Update UI position/rotation
        // ui.userData.camera.position.copy(scene.userData.camera.position);
        // ui.getObjectByName('uiElements').quaternion.copy(scene.userData.camera.quaternion);
        // ui.getObjectByName('uiElements').position.copy(scene.userData.camera.position);
        // ui.getObjectByName('uiElements').translateZ(-1);

        render(currentFrameTime, frame);
    }
}


window.addEventListener('appSupported', () => {
    init();
    // animate();
    renderer.setAnimationLoop(animate);
});
