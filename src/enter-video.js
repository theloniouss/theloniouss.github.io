let enterVideo = () => {
    let scene = document.querySelector('a-scene');
    let videoEl = document.querySelector('#environment');

    scene.exitVR();

    document.querySelector('a-videosphere').setAttribute('visible', 'true');
    document.querySelector('#animatedDoor').setAttribute('visible', 'false');
    
    videoEl.play();
}
