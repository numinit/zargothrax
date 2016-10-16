goog.provide('zx.Context');

goog.require('zx.HTTPClient');
goog.require('zx.WorkUnit');
goog.require('zx.Runner');
goog.require('zx.Runner.Worker');

zx.Context = function(window, base, workerPath) {
    this._window = window;
    this._client = new zx.HTTPClient(base);
    this._worker = new zx.Runner.Worker(zx.HTTPClient.makeAbsolute(base, workerPath));
};

zx.Context.prototype.run = function() {
    this.getWork();
    return this;
};

zx.Context.prototype.getWork = function() {
    var client = this._client;
    var worker = this._worker;
    var failure = function(failedResponse) {
        console.log('failed for reason: ' + failedResponse.getFailureReason());
    };

    client.get('/work/request').then(function(response) {
        var result = response.getResult();
        var wu = zx.WorkUnit.unpack(result);
        console.log('got WU ' + wu.getId());
        console.log(wu.pack());
        client.get(wu.getScript(), 'js').then(function(scriptResponse) {
            console.log('got script ' + wu.getScript());
            worker.postWorkUnit(scriptResponse.getResult(), wu.getArguments()).then(function(workerResponse) {
                console.log('worker responded');
                console.log(workerResponse);
            }, function(workerFailure) {
                failure(workerFailure.getData().toString());
            });
        }, failure);
    }, failure);
};
