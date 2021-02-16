AFRAME.registerComponent('ar-hit-test', {
    schema: {
        hasAPose: {type: 'boolean', default: false},
        poseLocation: {type: 'vec3', default: {x: NaN, y: NaN, z: NaN}}
    },

    init: function () {
        this.el.sceneEl.renderer.xr.addEventListener('sessionstart', async () => {
            const renderer = this.el.sceneEl.renderer;
            const xrSession = this.session = renderer.xr.getSession();

            // xrSession.addEventListener('select', () => {
            //     let doorObj = document.getElementById('animatedDoor');
            //     if (!this.data.hasAPose) {
            //         this.data.hasAPose = true;
            //         this.data.poseLocation = doorObj.object3D.position;
            //         doorObj.setAttribute('animation-mixer', 'timeScale: 1');
            //         doorObj.setAttribute('model-opacity', 1);
            //     } else {
            //         this.data.hasAPose = false;
            //         this.data.poseLocation = {x: NaN, y: NaN, z: NaN};
            //         doorObj.components['animation-mixer'].mixer.setTime(0);
            //         doorObj.setAttribute('animation-mixer', 'timeScale: 0');
            //         doorObj.setAttribute('model-opacity', 0.5);
            //     }
            // });

            xrSession.addEventListener('crossDoor', () => {
                let doorObj = document.getElementById('animatedDoor');
                this.data.hasAPose = false;
                this.data.poseLocation = {x: NaN, y: NaN, z: NaN};
                doorObj.components['animation-mixer'].mixer.setTime(0);
                doorObj.setAttribute('animation-mixer', 'timeScale: 0');
                doorObj.setAttribute('model-opacity', 0.5);
            });

            xrSession.requestReferenceSpace('viewer').then((viewerSpace) => {
                this.xrViewerSpace = viewerSpace;
                xrSession.requestHitTestSource({space: this.xrViewerSpace}).then((hitTestSource) => {
                    this.xrHitTestSource = hitTestSource;
                });
            });

            xrSession.requestReferenceSpace('local-floor').then((localSpace) => {
                this.xrRefSpace = localSpace;
            });
        });

        this.el.sceneEl.renderer.xr.addEventListener('sessionend', async () => {
            this.xrRefSpace = null;
            this.xrViewerSpace = null;
            this.xrHitTestSource = null;
        })
    },

    tick: function (time, deltaTime) {
        if (this.el.sceneEl.is('ar-mode')) {
            const xrFrame = this.el.sceneEl.frame;

            if (!this.xrViewerSpace) return;
            if (!xrFrame) return;

            let xrViewerPose = xrFrame.getViewerPose(this.xrRefSpace);

            if (this.xrHitTestSource && xrViewerPose)  {
                let hitTestResults = xrFrame.getHitTestResults(this.xrHitTestSource);
                if (hitTestResults.length > 0) {
                    let pose = hitTestResults[0].getPose(this.xrRefSpace);

                    let poseMatrix = new THREE.Matrix4();
                    poseMatrix.fromArray(pose.transform.matrix);
                    let newPos = new THREE.Vector3();
                    newPos.setFromMatrixPosition(poseMatrix);

                    if (!this.data.hasAPose) {
                        document.getElementById('animatedDoor').object3D.position.copy(newPos);
                        document.getElementById('animatedDoor').object3D.quaternion.copy(pose.transform.orientation);
                    } else {
                        var dist_x = (xrViewerPose.transform.position.x - this.data.poseLocation.x)**2;
                        var dist_z = (xrViewerPose.transform.position.z - this.data.poseLocation.z)**2;
                        let dist = Math.sqrt(dist_x + dist_z);
                        if (dist <= 0.1) {  // 0.1 = 10cm
                            // Start VR experience with videosphere
                            window.isPlayingVideo = true;
                            enterVideo();
                            const event = new Event('crossDoor');
                            this.session.dispatchEvent(event);
                        }
                    }
                }
            }
        }
    }
});
