"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel_1 = require("./LogLevel");
var Logger = /** @class */ (function () {
    function Logger(x, prependLogStrategy) {
        this.prependLogStrategy = prependLogStrategy;
        this.TName = x.name;
    }
    Logger.prototype.warning = function (value) {
        this.prependLogStrategy.prepend(this.TypeName, value, LogLevel_1.LogLevel.warning);
    };
    Logger.prototype.error = function (value) {
        this.prependLogStrategy.prepend(this.TypeName, value, LogLevel_1.LogLevel.error);
    };
    Logger.prototype.info = function (value) {
        this.prependLogStrategy.prepend(this.TypeName, value, LogLevel_1.LogLevel.info);
    };
    Logger.prototype.trace = function (value) {
        this.prependLogStrategy.prepend(this.TypeName, value, LogLevel_1.LogLevel.trace);
    };
    Logger.prototype.debug = function (value) {
        this.prependLogStrategy.prepend(this.TypeName, value, LogLevel_1.LogLevel.debug);
    };
    Object.defineProperty(Logger.prototype, "TypeName", {
        get: function () {
            return this.TName;
        },
        enumerable: true,
        configurable: true
    });
    return Logger;
}());
exports.Logger = Logger;
var ClientSidePrependLogStrategy = /** @class */ (function () {
    function ClientSidePrependLogStrategy(minimumLogLevel) {
        if (minimumLogLevel === void 0) { minimumLogLevel = LogLevel_1.LogLevel.trace; }
        this.minimumLogLevel = minimumLogLevel;
        this.logsSelector = '#logs';
    }
    ClientSidePrependLogStrategy.prototype.prepend = function (name, value, logLevel) {
        if (this.minimumLogLevel > logLevel) {
            return;
        }
        var $row = $('<div class="row">');
        var $col1 = $('<div class="col-3">');
        var $col2 = $('<div class="col-9">');
        $row.addClass("level-" + logLevel);
        $col1.html(name);
        $col2.html(value);
        $col1.appendTo($row);
        $col2.appendTo($row);
        $row.prependTo(this.logsSelector);
    };
    return ClientSidePrependLogStrategy;
}());
exports.ClientSidePrependLogStrategy = ClientSidePrependLogStrategy;
var ServerSidePrependLogStrategy = /** @class */ (function () {
    function ServerSidePrependLogStrategy(minimumLogLevel) {
        if (minimumLogLevel === void 0) { minimumLogLevel = LogLevel_1.LogLevel.trace; }
        this.minimumLogLevel = minimumLogLevel;
    }
    ServerSidePrependLogStrategy.prototype.prepend = function (name, value, logLevel) {
        if (this.minimumLogLevel > logLevel) {
            //return;
        }
        var message = "[" + name + "] " + value;
        switch (logLevel) {
            case LogLevel_1.LogLevel.trace:
                console.trace(message);
                break;
            case LogLevel_1.LogLevel.debug:
                console.debug(message);
                break;
            case LogLevel_1.LogLevel.info:
                console.info(message);
                break;
            case LogLevel_1.LogLevel.warning:
                console.warn(message);
                break;
            case LogLevel_1.LogLevel.error:
                console.error(message);
                break;
            default:
                console.log(message);
                break;
        }
    };
    return ServerSidePrependLogStrategy;
}());
exports.ServerSidePrependLogStrategy = ServerSidePrependLogStrategy;
//# sourceMappingURL=Logger.js.map