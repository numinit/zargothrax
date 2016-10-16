goog.provide('zx.Context');

goog.require('zx.HTTPClient');
goog.require('zx.WorkUnit');
goog.require('zx.Runner');
goog.require('zx.Runner.Worker');

zx.Context = function(window, base, workerPath) {
    this._window = window;
    this._client = new zx.HTTPClient(base);
    this._worker = new zx.Runner.Worker(zx.HTTPClient.makeAbsolute(base, workerPath));
    this._delay = 10000;
};

zx.Context.prototype.run = function() {
    this.doWork();
    return this;
};

zx.Context.prototype.doWork = function() {
    var ctx = this;
    var client = this._client;
    var worker = this._worker;
    var failure = function(failedResponse) {
        console.log('failed for reason: ' + failedResponse.getFailureReason());
        ctx.scheduleBackoff_();
    };

    client.get('/work/request').then(function(response) {
        var result = response.getResult();
        var wu = zx.WorkUnit.unpack(result);
        console.log('got WU ' + wu.getId() + ': ' + response.getStatusText());
        client.get(wu.getScript(), 'js').then(function(scriptResponse) {
            console.log('got script ' + wu.getScript() + ': ' + response.getStatusText());
            worker.postWorkUnit(scriptResponse.getResult(), wu.getArguments()).then(function(workerResponse) {
                console.log('worker responded');
                var workData = {
                    'id': wu.getId(),
                    'nonce': wu.getNonce(),
                    'result': workerResponse.getData().getResult()
                };
                client.post('/work/submit', workData).then(function(submitResponse) {
                    console.log('work submission endpoint responded: ' + submitResponse.getStatusText());
                    ctx.scheduleNextWork_(wu.getDelay());
                }, failure);
            }, function(workerFailure) {
                failure(workerFailure.getData().toString());
            });
        }, failure);
    }, failure);
};

zx.Context.prototype.scheduleNextWork_ = function(delay) {
    if (typeof(delay) === 'number') {
        var ref = this;
        this._delay = Math.floor(delay);
        console.log('next work scheduled in ' + this._delay + 'ms');
        this._window.setTimeout(function() {
            ref.doWork();
        }, this._delay);
    }
};

zx.Context.prototype.scheduleBackoff_ = function() {
    this.scheduleNextWork_(this._delay * 1.61803398875);
};
