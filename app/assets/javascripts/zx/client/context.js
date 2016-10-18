goog.provide('zx.Context');

goog.require('zx.HTTPClient');
goog.require('zx.WorkUnit');
goog.require('zx.Runner');
goog.require('zx.Runner.Worker');

zx.Context = function(window, base, workerPath, log) {
    this._window = window;
    this._client = new zx.HTTPClient(base);
    this._worker = new zx.Runner.Worker(zx.HTTPClient.makeAbsolute(base, workerPath));
    this._delay = 10000;
    this._log = log;
    this._counter = 0;
};

zx.Context.prototype.run = function() {
    this.log('Starting');
    this.doWork();
    return this;
};

zx.Context.prototype.doWork = function() {
    var ctx = this;
    var client = this._client;
    var worker = this._worker;
    var failure = function(str) {
        ctx.log('failed: ' + str);
        ctx.scheduleBackoff_();
    };
    var failureResponse = function(failedResponse) {
        failure(failedResponse.getFailureReason().toString());
    };

    this.log('Requesting work');
    client.get('/work/request').then(function(response) {
        var result = response.getResult();
        var wu = zx.WorkUnit.unpack(result);
        ctx.log('Received work: ' + wu.getId());
        client.get(wu.getScript(), 'js').then(function(scriptResponse) {
            worker.postWorkUnit(scriptResponse.getResult(), wu.getArguments()).then(function(workerResponse) {
                ctx.log('Finished: "' + wu.getArguments()[0] + '"');
                var workData = {
                    'id': wu.getId(),
                    'nonce': wu.getNonce(),
                    'result': workerResponse.getData().getResult()
                };
                client.post('/work/submit', workData).then(function(submitResponse) {
                    ctx.log('Submitted work: ' + submitResponse.getStatusText());
                    ctx.incrementCounter();
                    ctx.log('You have submitted ' + ctx.getCounter() + ' ' + (ctx.getCounter() == 1 ? 'work unit' : 'work units'));
                    ctx.scheduleNextWork_(wu.getDelay());
                }, failureResponse);
            }, function(workerFailure) {
                failure(workerFailure.getData().toString());
            });
        }, failureResponse);
    }, failureResponse);
};

zx.Context.prototype.incrementCounter = function() {
    this._counter++;
};

zx.Context.prototype.getCounter = function() {
    return this._counter;
};

zx.Context.prototype.log = function(msg) {
    if (typeof(this._log) === 'function') {
        return this._log('' + msg);
    }
};

zx.Context.prototype.scheduleNextWork_ = function(delay) {
    if (typeof(delay) === 'number') {
        var ref = this;
        this._delay = Math.floor(delay);
        this.log('Next work scheduled in ' + (this._delay / 1000) + 's');
        this._window.setTimeout(function() {
            ref.doWork();
        }, this._delay);
    }
};

zx.Context.prototype.scheduleBackoff_ = function() {
    this.scheduleNextWork_(this._delay * 1.61803398875);
};
