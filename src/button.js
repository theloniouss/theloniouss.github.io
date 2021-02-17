function Button(x, y, w, h, canvas, text, colors, clickCB) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.colors = colors;
    this.text = text;
    this.ctx = canvas;

    this.state = 'default';

    var mousePosition = {x: 0, y: 0};
    var isClicking = false;

    /**
     * Check to see if the user is hovering over or clicking on the button.
     */
    this.update = function() {
        // check for hover
        if (mousePosition.x >= this.x && mousePosition.x <= this.x + this.width &&
            mousePosition.y >= this.y && mousePosition.y <= this.y + this.height) {
            this.state = 'hover';

            // check for click
            if (mousePressed) {
                this.state = 'active';
                if (typeof clickCB === 'function' && !isClicking) {
                    clickCB();
                    isClicking = true;
                }
            } else {
                isClicking = false;
            }
        } else {
            this.state = 'default';
        }
    };

    /**
     * Draw the button.
     */
    this.draw = function() {
        this.ctx.save();

        var colors = this.colors[this.state];
        var halfH = this.height / 2;

        // button
        this.ctx.fillStyle = colors.top;
        this.ctx.fillRect(this.x, this.y, this.width, halfH);
        this.ctx.fillStyle = colors.bottom;
        this.ctx.fillRect(this.x, this.y + halfH, this.width, halfH);

        // text
        var size = this.ctx.measureText(this.text);
        var x = this.x + (this.width - size.width) / 2;
        var y = this.y + (this.height - 15) / 2 + 12;

        this.ctx.fillStyle = '#FFF';
        this.ctx.fillText(this.text, x, y);

        this.ctx.restore();
    };
}

export { Button }
