"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("./Logger");
var LoggerFactory = /** @class */ (function () {
    function LoggerFactory(prependLogStrategy) {
        this.prependLogStrategy = prependLogStrategy;
    }
    LoggerFactory.prototype.create = function (x) {
        return new Logger_1.Logger(x, this.prependLogStrategy);
    };
    return LoggerFactory;
}());
exports.LoggerFactory = LoggerFactory;
//# sourceMappingURL=LoggerFactory.js.map