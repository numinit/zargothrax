goog.provide('zx.HTTPClient');

zx.HTTPClient = function(base) {
    this._base = zx.HTTPClient.stripTrailingSlashes(base);
};

zx.HTTPClient.stripTrailingSlashes = function(str) {
    return str.replace(/\/+$/g, '');
};

zx.HTTPClient.makeAbsolute = function(base, uri) {
    return [zx.HTTPClient.stripTrailingSlashes(base), uri.replace(/^\/+/g, '')].join('/');
};

zx.HTTPClient.prototype.get = function(uri, type) {
    var xhr = new XMLHttpRequest();
    var promise = this.initXHR(xhr, uri, 'GET', type);
    xhr.send();
    return promise;
};

zx.HTTPClient.prototype.post = function(uri, data, type) {
    var xhr = new XMLHttpRequest();
    var promise = this.initXHR(xhr, uri, 'POST', type);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(JSON.stringify({'params': data}));
    return promise;
};

zx.HTTPClient.prototype.makeAbsolute = function(uri) {
    return zx.HTTPClient.makeAbsolute(this._base, uri);
};

zx.HTTPClient.prototype.initXHR = function(xhr, uri, method, type) {
    var ref = this;
    type = type || 'json';
    return new Promise(function(resolve, reject) {
        xhr.open(method, ref.makeAbsolute(uri), true);
        xhr.setRequestHeader('X-Requested-With', 'zx');
        xhr.setRequestHeader('X-Hammer-Of', 'Glory');
        xhr.onreadystatechange = function(ev) {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }

            var response = new zx.HTTPClient.Response(xhr.status, xhr.statusText, xhr.response, type === 'json');
            if (response.isSuccess()) {
                resolve(response);
            } else {
                reject(response);
            }
        };
    });
};

zx.HTTPClient.Response = function(status, statusText, rawResponse, json) {
    this._status = status;
    this._statusText = statusText;

    if (status < 200 || status > 299) {
        this._error = statusText;
    }

    if (json) {
        try {
            var response = JSON.parse(rawResponse);
            if ('result' in response) {
                this._result = response['result'];
            } else if ('error' in response) {
                this._result = null;
                this._error = response['error'];
            } else {
                this._result = response;
                this._error = 'neither result nor error in response JSON';
            }
        } catch (e) {
            this._result = null;
            this._error = 'JSON parser error: ' + e.toString();
        }
    } else {
        this._result = rawResponse;
    }
};

/**
 * Enum for HTTP response statuses.
 * @enum {number}
 */
zx.HTTPClient.Response.FailureType = {
    FAILURE: -1,
    SUCCESS: 0
};

zx.HTTPClient.Response.prototype.isSuccess = function() {
    return !this._error;
};

zx.HTTPClient.Response.prototype.isFailure = function() {
    return !this.isSuccess();
};

zx.HTTPClient.Response.prototype.getResult = function() {
    return this._result;
};

zx.HTTPClient.Response.prototype.getFailureReason = function() {
    return this._error ? this._error.toString() : null;
};

