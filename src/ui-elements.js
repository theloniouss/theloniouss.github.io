import * as THREE from 'https://unpkg.com/three@0.125.0/build/three.module.js';


function Button (width=1, height=1, wSegments=1, hSegments=1, material=null) {
    let geometry = new THREE.PlaneGeometry(width, height, wSegments, hSegments);
    if (material === null) {
        material = new THREE.MeshBasicMaterial({
            color: 0xffffff * Math.random(),
            side: THREE.DoubleSide
        });
    }
    return new THREE.Mesh(geometry, material);
}

export { Button }
