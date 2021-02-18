import { Button } from "/src/button.js";

// Singleton
let ui = new function () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.uiElements = [];
    this.uiScene = new THREE.Scene();

    this.uiDOM = document.querySelector('#ui');
    this.uiContext = this.uiDOM.getContext('2d');
    this.uiRenderer = new THREE.WebGLRenderer(this.uiDOM);
    this.uiCamera = new THREE.OrthographicCamera(-this.width/2, this.width/2, this.height/2, -this.height/2, 0, 1);

    let uiTexture = new THREE.CanvasTexture(this.uiDOM);
    let material = new THREE.MeshBasicMaterial({ map: uiTexture });
    material.transparent = true;

    let planeGeometry = new THREE.PlaneGeometry(this.width, this.height);
    let plane = new THREE.Mesh(planeGeometry, material);
    this.uiScene.add(plane);

    this.addElement = (elem) => {
        this.uiElements.push(elem);
    };

    this.updateSize = () => {
        if (window.innerWidth !== this.width
            || window.innerHeight !== this.height) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.uiCamera.left = -this.width / 2;
            this.uiCamera.right = this.width / 2;
            this.uiCamera.top = this.height / 2;
            this.uiCamera.bottom = -this.height / 2;
            this.uiCamera.updateProjectionMatrix();
        }
    };

    this.render = () => {
        this.updateSize();
        this.uiElements.forEach(elem => {
            elem.update();
            elem.draw();
        });
        this.uiRenderer.render(this.uiScene, this.uiCamera);
        requestAnimationFrame(this.render);
    };
}


function displayUI () {
    document.querySelector('#ui').style.display = 'block';
}


function hideUI () {
    document.querySelector('#ui').style.display = 'none';
}


document.querySelector('a-scene').addEventListener('enter-vr', displayUI);
document.querySelector('a-scene').addEventListener('exit-vr', hideUI);
document.querySelector('#ui').addEventListener('touchstart', () => {
    window.SCREEN_IS_TOUCHED = true;
});
document.querySelector('#ui').addEventListener('touchend', () => {
    window.SCREEN_IS_TOUCHED = false;
});

var playButton = new Button(50, 50, 100, 50, ui.uiContext, 'Play',
    {
        'default': {
            top: '#1879BD',
            bottom: '#084D79'
        },
        'hover': {
            top: '#678834',
            bottom: '#093905'
        },
        'active': {
            top: '#EB7723',
            bottom: '#A80000'
        }
    }, function() {
        console.log('Button clicked');
    }
);

ui.addElement(playButton);
requestAnimationFrame(ui.render);
