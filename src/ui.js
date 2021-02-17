import { Button } from "/src/button.js";

function UI () {
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
}

UI.prototype.addElement = function (elem) {
    this.uiElements.push(elem);
};

UI.prototype.updateSize = function () {
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

UI.prototype.render = function () {
    console.log(this);
    this.updateSize();
    this.uiElements.forEach(elem => {
        elem.update();
        elem.draw();
    });
    this.uiRenderer.render(this.uiScene, this.uiCamera);
    requestAnimationFrame(window.ui.render);
};


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

window.ui = new UI();

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

console.log(window.ui);
window.ui.addElement(playButton);
requestAnimationFrame(window.ui.render);
