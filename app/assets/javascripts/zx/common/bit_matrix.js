goog.provide('zx.BitMatrix');

zx.BitMatrix = function(rows, cols, matrix) {
    if (typeof(rows) !== 'number' || typeof(cols) !== 'number' || rows <= 0 || cols <= 0) {
        throw new Error('invalid width or height');
    } else {
        rows = Math.floor(rows);
        cols = Math.floor(cols);
    }

    var bits = rows * cols;
    var words = Math.ceil(bits / 32);
    var padding = bits % 32;
    this._rows = rows;
    this._cols = cols;
    this._padding = padding;

    if (matrix && typeof(matrix) === 'object') {
        // Assume they're passing us an initializer
        if (words !== matrix.length) {
            throw new Error('invalid dimensions for matrix initializer');
        }

        this._matrix = new Uint32Array(words);
        for (var i = 0; i < words; i++) {
            if (Number.isSafeInteger(matrix[i]) && matrix[i] >= 0 && matrix[i] <= 0xffffffff) {
                this._matrix[i] = matrix[i];
            } else {
                throw new Error('element at position ' + i + ' is not valid');
            }
        }
    } else {
        this._matrix = new Uint32Array(words);
    }
};

zx.BitMatrix.unpack = function(obj) {
    return new zx.BitMatrix(obj['r'], obj['c'], obj['m']);
};

zx.BitMatrix.prototype.getNumRows = function() {
    return this._rows;
};

zx.BitMatrix.prototype.getNumCols = function() {
    return this._cols;
};

zx.BitMatrix.prototype.get = function(row, col) {
    return this.op_(row, col, function(matrix, word, bit) {
        return !!(matrix[word] & bit);
    });
};

zx.BitMatrix.prototype.set = function(row, col) {
    return this.op_(row, col, function(matrix, word, bit) {
        matrix[word] |= bit;
    });
};

zx.BitMatrix.prototype.clear = function(row, col) {
    return this.op_(row, col, function(matrix, word, bit) {
        matrix[word] &= ((bit ^ 0xffffffff) | 0);
    });
};

zx.BitMatrix.prototype.copy = function(row, col, value) {
    return value ? this.set(row, col) : this.clear(row, col);
};

zx.BitMatrix.prototype.op_ = function(row, col, cb) {
    if (row >= this._rows || col >= this._cols) {
        throw new Error('invalid row or column');
    }

    var idx = row * this._cols + col;
    var word = Math.floor(idx / 32);
    var bit = (1 << (idx % 32)) | 0;
    return cb(this._matrix, word, bit);
};

zx.BitMatrix.prototype.eachSet = function(cb) {
    return this.eachWithMask_(cb, 0x00000000);
};

zx.BitMatrix.prototype.eachClear = function(cb) {
    return this.eachWithMask_(cb, 0xffffffff);
};

zx.BitMatrix.prototype.eachWithMask_ = function(cb, mask) {
    for (var i = 0; i < this._matrix.length; i++) {
        var word = (this._matrix[i] ^ mask) | 0;
        while (word > 0) {
            var fs = word & -word;
            if (fs > 0) {
                var idx = 32 * i + Math.floor(Math.log2(fs));
                var row = Math.floor(idx / this._cols);
                var col = idx % this._cols;
                if (row >= this._rows || col >= this._cols) {
                    // Ensure that we only iterate over in-bounds values
                    return;
                } else if (cb(row, col) === false) {
                    // False return from callback means stop iteration
                    return;
                }
            }

            word ^= fs;
        }
    }
};

zx.BitMatrix.prototype.pack = function() {
    // We need to copy the matrix; JSON should serialize it as an array,
    // and not as an object
    var tmp = new Array(this._matrix.length);
    for (var i = 0; i < this._matrix.length; i++) {
        tmp[i] = this._matrix[i];
    }
    this.fixPadding_(tmp);

    return {
        'r': this.getNumRows(),
        'c': this.getNumCols(),
        'm': tmp
    };
};

zx.BitMatrix.prototype.fixPadding_ = function(arr) {
    if (this._padding > 0) {
        arr[arr.length - 1] &= ((1 << (32 - this._padding)) - 1) | 0;
    }
};
