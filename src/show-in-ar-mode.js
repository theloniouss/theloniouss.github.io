AFRAME.registerComponent('show-in-ar-mode', {
    init: function () {
        // 'enter-vr' and 'exit-vr' are the events for both AR & VR
        // Check scene's property to identify which mode is selected        
        this.showOnEnterARMode = () => {
            if (this.el.sceneEl.is('ar-mode')) {
                this.el.setAttribute('visible', true);
            }
        }
        this.showOnExitARMode = () => {
            this.el.setAttribute('visible', false);
        }
        this.el.sceneEl.addEventListener('enter-vr', this.showOnEnterARMode);
        this.el.sceneEl.addEventListener('exit-vr', this.showOnExitARMode);

        if (!this.el.sceneEl.is('ar-mode')) {
            this.el.setAttribute('visible', false);
        }
    },

    remove: function () {
        this.el.sceneEl.removeEventListener('enter-vr', this.showOnEnterARMode);
        this.el.sceneEl.removeEventListener('exit-vr', this.showOnExitARMode);
    }
});
