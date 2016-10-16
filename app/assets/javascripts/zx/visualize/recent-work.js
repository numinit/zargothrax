goog.provide('zx.RecentWork');

zx.RecentWork = function(id, result) {
    this._id = id;
    this._result = result;
};

zx.RecentWork.unpack = function(obj) {
    return new zx.RecentWork(obj['id'], obj['result']);
};

zx.RecentWork.prototype.getId = function() {
    return this._id;
};

zx.RecentWork.prototype.getResult = function() {
    return this._result;
};

zx.RecentWork.prototype.getResultField = function(field) {
    var result = this.getResult();
    return result[field];
};

zx.RecentWork.prototype.pack = function() {
    return {
        'id': this.getId(),
        'result': this.getResult()
    };
};
