goog.provide('zx.WorkUnit');

zx.WorkUnit = function(id, script, timeout, nonce, args) {
    this._id = id;
    this._script = script;
    this._timeout = timeout;
    this._nonce = nonce;
    this._args = args;
};

zx.WorkUnit.unpack = function(obj) {
    return new zx.WorkUnit(obj['id'], obj['script'], obj['timeout'], obj['nonce'], obj['arguments']);
};

zx.WorkUnit.prototype.getId = function() {
    return this._id;
};

zx.WorkUnit.prototype.getScript = function() {
    return this._script;
};

zx.WorkUnit.prototype.getTimeout = function() {
    return this._timeout;
};

zx.WorkUnit.prototype.getNonce = function() {
    return this._nonce;
};

zx.WorkUnit.prototype.getArguments = function() {
    return this._args;
};

zx.WorkUnit.prototype.pack = function() {
    return {
        'id': this.getId(),
        'script': this.getScript(),
        'timeout': this.getTimeout(),
        'nonce': this.getNonce(),
        'arguments': this.getArguments()
    };
};
