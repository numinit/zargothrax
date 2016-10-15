goog.provide('zx.Worker');

zx.Worker = function(worker) {
    this._worker = worker;
    this._worker.addEventListener('message', zx.Worker.prototype.onMessage_.bind(this));
    this._evaluator = new zx.Evaluator();
    this._ctx = new zx.Worker.Context();
};

zx.Worker.prototype.runWorkUnit = function(message) {
    var params = zx.Runner.WorkerMessage.WorkUnitParams.unpack(message.getData());
    var block = this._evaluator.compile(params.getCode());
    return new zx.Runner.WorkerMessage.WorkUnitResult(block.call(this._ctx, params.getArgs()));
};

zx.Worker.prototype.onMessage_ = function(ev) {
    var message = zx.Runner.WorkerMessage.unpack(ev.data);
    var response = null;
    try {
        var resultMessage = null;
        switch (message.getOp()) {
            case zx.Runner.WorkerMessage.Op.WORK_UNIT:
                resultMessage = this.runWorkUnit(message);
                break;
            default:
                throw new Error('invalid message type');
        }

        response = message.newSuccess(resultMessage.pack());
    } catch (e) {
        response = message.newFailure(e.toString());
    }

    this._worker.postMessage(response.pack());
};

zx.Worker.Context = function() {

};

