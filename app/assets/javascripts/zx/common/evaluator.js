goog.provide('zx.Evaluator');

zx.Evaluator = function() {
};

zx.Evaluator.prototype.compile = function(code) {
    return new zx.Evaluator.Block(code);
};

zx.Evaluator.Block = function(code) {
    this._fn = new Function(code);
};

zx.Evaluator.Block.prototype.call = function(ctx, args) {
    return this._fn.apply(ctx, args);
};
