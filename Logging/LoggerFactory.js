"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel_1 = require("./LogLevel");
var Logger_1 = require("./Logger");
var LoggerFactory = /** @class */ (function () {
    function LoggerFactory() {
    }
    LoggerFactory.prototype.create = function (x, minimumLogLevel) {
        if (minimumLogLevel === void 0) { minimumLogLevel = LogLevel_1.LogLevel.trace; }
        return new Logger_1.Logger(x, minimumLogLevel);
    };
    return LoggerFactory;
}());
exports.LoggerFactory = LoggerFactory;
//# sourceMappingURL=LoggerFactory.js.map