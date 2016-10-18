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
    var xmax = mat.getNumCols();
    var ymax = mat.getNumRows();
    var width = 0, height = 0;
    var posColor = this._posColor;
    var negColor = this._negColor;

    var ctx = canvas.getContext('2d');
    if (!canvas.width || !canvas.height) {
        width = this._scale / xmax;
        height = this._scale / ymax;
    } else {
        width = canvas.width / xmax;
        height = canvas.height / ymax;
    }

    // Fill the background
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = negColor;
    ctx.fill();

    // Fill set bits
    ctx.scale(width, height);
    mat.eachSet(function(i, j) {
        ctx.beginPath();
        ctx.rect(j, i, 1, 1);
        ctx.fillStyle = posColor;
        ctx.fill();
    });
};
