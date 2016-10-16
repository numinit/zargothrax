goog.provide('zx.Worker');

zx.Worker = function(worker, base) {
    this._worker = worker;
    this._worker.addEventListener('message', zx.Worker.prototype.onMessage_.bind(this));
    this._base = base;
    this._evaluator = new zx.Evaluator();
    this._ctx = new zx.Worker.Context();
};

zx.Worker.prototype.runWorkUnit = function(message) {
    var params = zx.Runner.WorkerMessage.WorkUnitParams.unpack(message.getData());
    var block = this._evaluator.compile(params.getCode());
    var ctx = this._ctx;
    return new Promise(function(resolve, reject) {
        block.call(ctx, params.getArgs()).then(function(result) {
            resolve(new zx.Runner.WorkerMessage.WorkUnitResult(result));
        }, reject);
    });
};

zx.Worker.prototype.onMessage_ = function(ev) {
    var message = zx.Runner.WorkerMessage.unpack(ev.data);
    var worker = this._worker;
    var promise = null;
    switch (message.getOp()) {
        case zx.Runner.WorkerMessage.Op.WORK_UNIT:
            promise = this.runWorkUnit(message);
            break;
        default:
            promise = Promise.reject('invalid message type');
            break;
    }

    promise.then(function(resultMessage) {
        worker.postMessage(message.newSuccess(resultMessage.pack()).pack());
    }, function(reason) {
        worker.postMessage(message.newFailure(reason.toString()).pack());
    });
};

zx.Worker.Context = function() {

};

