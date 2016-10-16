goog.provide('zx.CanvasVisualizer');

zx.CanvasVisualizer = function(pos, neg, scale) {
    // "1" color, rgba
    this._posColor = pos || "#fdf7c7"; // "cream"

    // "0" color, rgba
    this._negColor = neg || "#001a41"; // "blue"

    // The scale
    this._scale = scale || 200;
};

zx.CanvasVisualizer.prototype.visualize = function(mat, canvas) {
    var xmax = mat[0].length;
    var ymax = mat.length;

    var ctx = canvas.getContext('2d');
    if (!canvas.width || !canvas.height) {
        ctx.scale(this._scale / xmax, this._scale / ymax);
    } else {
        ctx.scale(canvas.width / xmax, canvas.height / ymax);
    }

    for (var i = 0; i < ymax; i++) {
        for (var j = 0; j < xmax; j++) {
            ctx.beginPath();
            ctx.rect(j, i, 1, 1);
            if (parseInt(mat[i][j]) !== 0) {
                ctx.fillStyle = this._posColor;
            } else {
                ctx.fillStyle = this._negColor;
            }
            ctx.fill();
        }
    }
};
