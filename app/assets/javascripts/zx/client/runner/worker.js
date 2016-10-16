goog.provide('zx.Runner.Worker');

goog.require('zx.Runner.WorkerMessage');

zx.Runner.Worker = function(uri) {
    this._worker = new Worker(uri);
    this._worker.addEventListener('message', zx.Runner.Worker.prototype.onResponse_.bind(this));
    this._workerUri = uri;
    this._inflight = Object.create(null);
};

zx.Runner.Worker.prototype.postWorkUnit = function(code, args) {
    var params = new zx.Runner.WorkerMessage.WorkUnitParams(code, Array.isArray(args) ? args : [args]);
    return this.post_(zx.Runner.WorkerMessage.Op.WORK_UNIT,
                      zx.Runner.WorkerMessage.WorkUnitResult.unpack, params);
};

zx.Runner.Worker.prototype.post_ = function(op, unpack, params) {
    var message = new zx.Runner.WorkerMessage(null, op, params.pack());
    var inflight = new zx.Runner.Worker.InflightMessage(unpack);
    this._inflight[message.getId()] = inflight;
    this._worker.postMessage(message.pack());
    return inflight.getPromise();
}

zx.Runner.Worker.prototype.onResponse_ = function(ev) {
    var message = zx.Runner.WorkerMessage.unpack(ev.data);
    var inflight = this._inflight[message.getId()];
    if (!inflight) {
        throw new Error('no inflight message with given ID `' + message.getId().toString() + '`, this is a bug');
    } else {
        delete this._inflight[message.getId()];
        if (message.isSuccess()) {
            message.setData(inflight.getUnpack()(message.getData()));
            inflight.resolve(message);
        } else {
            inflight.reject(message);
        }
    }
};

zx.Runner.Worker.InflightMessage = function(unpack) {
    var ref = this;
    this._promise = new Promise(function(resolve, reject) {
        ref._resolve = resolve;
        ref._reject = reject;
    });
    this._unpack = unpack;
};

zx.Runner.Worker.InflightMessage.prototype.getUnpack = function() {
    return this._unpack;
};

zx.Runner.Worker.InflightMessage.prototype.getPromise = function() {
    return this._promise;
};

zx.Runner.Worker.InflightMessage.prototype.resolve = function(data) {
    this._resolve(data);
};

zx.Runner.Worker.InflightMessage.prototype.reject = function(error) {
    this._reject(error);
};
