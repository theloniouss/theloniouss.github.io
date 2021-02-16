let showEnterButton = () => {
    document.querySelector('a-scene').style.display = 'none';
    let button = document.getElementById('enter-ar-button');
    button.style.display = 'inline-block';
    button.onclick = switchARMode;
}

document.addEventListener('renderstart', showEnterButton);
