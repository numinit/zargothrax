goog.provide('zx.Visualize');
zx.Visualize = function(pos, neg){

// "1" color, rgba
this.positive_color = pos || "#fdf7c7"; // "cream"

// "0" color, rgba
this.negative_color = neg || "#001a41"; // "blue"
};

zx.Visualize.prototype.visualize = function(mat, canvas) {
  var xmax = mat[0].length;
  var ymax = mat.length;

  var ctx = canvas.getContext('2d');
  if (canvas.width === undefined || canvas.height === undefined) {
    ctx.scale(200 / xmax, 200 / ymax);
  } else {
    ctx.scale(canvas.width / xmax, canvas.height / ymax);
  }

  for (var i=0; i<ymax; i++) {
    for (var j=0; j<xmax; j++) {
      ctx.beginPath();
      ctx.rect(j,i,1,1);
      if (mat[i][j] === 1) {
        ctx.fillStyle = this.positive_color;
      } else {
        ctx.fillStyle = this.negative_color;
      }
      ctx.fill();
    }
  }
};
