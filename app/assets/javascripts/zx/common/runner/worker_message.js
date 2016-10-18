goog.provide('zx.Runner.WorkerMessage');

goog.require('zx.Runner');

zx.Runner.WorkerMessage = function(id, op, data, status) {
    if (typeof(id) !== 'string') {
        id = Math.floor(Math.random() * 0x7fffffff).toString(36);
    }

    if (typeof(status) !== 'number') {
        status = zx.Runner.WorkerMessage.Status.REQUEST;
    }

    this._id = id;
    this._op = op;
    this._data = data;
    this._status = status;
};

/**
 * Unpacks a zx.Runner.WorkerMessage.
 * @param {Object} obj The object to unpack
 */
zx.Runner.WorkerMessage.unpack = function(obj) {
    return new zx.Runner.WorkerMessage(obj['i'], obj['o'], obj['d'], obj['s']);
};

/**
 * Enum for message types.
 * @enum {number}
 */
zx.Runner.WorkerMessage.Op = {
    WORK_UNIT: 0
};

/**
 * Enum for message statuses.
 * @enum {number}
 */
zx.Runner.WorkerMessage.Status = {
    REQUEST: 0,
    RESPONSE_SUCCESS: 1,
    RESPONSE_FAILURE: -1
};

/**
 * Returns the message id.
 * @return {string} The message ID
 */
zx.Runner.WorkerMessage.prototype.getId = function() {
    return this._id;
};

/**
 * Returns the operation.
 * @return {zx.Runner.WorkerMessage.Type} The operation
 */
zx.Runner.WorkerMessage.prototype.getOp = function() {
    return this._op;
};

/**
 * Returns the data.
 * @return {Object} The data
 */
zx.Runner.WorkerMessage.prototype.getData = function() {
    return this._data;
};

/**
 * Sets the data
 * @param {Object} data The data
 */
zx.Runner.WorkerMessage.prototype.setData = function(data) {
    this._data = data;
};

/**
 * Returns the status.
 * @return {zx.Runner.WorkerMessage.Status} The status
 */
zx.Runner.WorkerMessage.prototype.getStatus = function() {
    return this._status;
};

/**
 * Returns whether this message is a failure.
 * @return {boolean} Whether this message is a failure
 */
zx.Runner.WorkerMessage.prototype.isFailure = function() {
    return this.getStatus() === zx.Runner.WorkerMessage.Status.RESPONSE_FAILURE;
};

/**
 * Returns whether this message is a success.
 * @return {boolean} Whether this message is a success
 */
zx.Runner.WorkerMessage.prototype.isSuccess = function() {
    return this.getStatus() === zx.Runner.WorkerMessage.Status.RESPONSE_SUCCESS;
};

/**
 * Returns a success message with the same parameters as this one,
 * but different data.
 * @param {Object} obj The data
 * @return {zx.Runner.WorkerMessage} A new message
 */
zx.Runner.WorkerMessage.prototype.newSuccess = function(obj) {
    return this.newDerivedMessage(obj, zx.Runner.WorkerMessage.Status.RESPONSE_SUCCESS);
};

/**
 * Returns a failure message with the same parameters as this one,
 * but different data.
 * @param {Object} obj The data
 * @return {zx.Runner.WorkerMessage} A new message
 */
zx.Runner.WorkerMessage.prototype.newFailure = function(obj) {
    return this.newDerivedMessage(obj, zx.Runner.WorkerMessage.Status.RESPONSE_FAILURE);
};

/**
 * Returns a message with the same parameters as this one,
 * but different data and status.
 * @param {Object} obj The data
 * @param {zx.Runner.WorkerMessage.Status} The status
 * @return {zx.Runner.WorkerMessage} A new message
 */
zx.Runner.WorkerMessage.prototype.newDerivedMessage = function(obj, status) {
    return new zx.Runner.WorkerMessage(this.getId(), this.getOp(), obj, status);
};

/**
 * Packs this WorkerMessage
 * @return {Object} The packed message
 */
zx.Runner.WorkerMessage.prototype.pack = function() {
    return {'i': this.getId(), 'o': this.getOp(), 'd': this.getData(), 's': this.getStatus()};
};

/**
 * Constructor for WorkUnitParams.
 * @final
 * @constructor
 * @param {string} code The code
 * @param {Object} args The args
 */
zx.Runner.WorkerMessage.WorkUnitParams = function(code, args) {
    this._code = code;
    this._args = args;
};

/**
 * Unpacks an WorkUnitParams.
 * @param {Object} obj The object
 * @return {zx.Runner.WorkerMessage.WorkUnitParams} The parameters
 */
zx.Runner.WorkerMessage.WorkUnitParams.unpack = function(obj) {
    return new zx.Runner.WorkerMessage.WorkUnitParams(obj['code'], obj['args']);
};

/**
 * Returns the code in a WorkUnitParams.
 * @return {String} the code
 */
zx.Runner.WorkerMessage.WorkUnitParams.prototype.getCode = function() {
    return this._code;
};

/**
 * Returns the arguments in a WorkUnitParams.
 * @return {Object} the arguments
 */
zx.Runner.WorkerMessage.WorkUnitParams.prototype.getArgs = function() {
    return this._args;
};

/**
 * Packs a WorkUnitParams
 * @return {Object} the packed WorkUnitParams
 */
zx.Runner.WorkerMessage.WorkUnitParams.prototype.pack = function() {
    return {'code': this.getCode(), 'args': this.getArgs()};
};

/**
 * Constructor for WorkUnitResult.
 * @final
 * @constructor
 * @param {Object} result The result
 */
zx.Runner.WorkerMessage.WorkUnitResult = function(result) {
    this._result = result;
};

/**
 * Unpacks this WorkUnitResult
 * @param obj The object
 * @return {zx.Runner.WorkerMessage.WorkUnitResult} The unpacked WorkUnitResult
 */
zx.Runner.WorkerMessage.WorkUnitResult.unpack = function(obj) {
    return new zx.Runner.WorkerMessage.WorkUnitResult(obj['result']);
};

/**
 * Returns the blob in an WorkUnitResult.
 * @return {Object} the result
 */
zx.Runner.WorkerMessage.WorkUnitResult.prototype.getResult = function() {
    return this._result;
};

/**
 * Packs this WorkUnitResult
 * @return {Object} The packed WorkUnitResult
 */
zx.Runner.WorkerMessage.WorkUnitResult.prototype.pack = function() {
    return {'result': this.getResult()};
};
