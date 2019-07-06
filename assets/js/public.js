(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var allConfigs = require('./config.secrets.json');

//var Configuration = require('merge-config');

// const config = new Configuration();
// config.file('config.json');
// config.file('config.secrets.json');

exports.configuration = allConfigs;

},{"./config.secrets.json":2}],2:[function(require,module,exports){
module.exports={
    "auth": {
        "token": "NDcxODc4NTU4MzMyMDkyNDE2.DlHbmw.NF1e_Q9nxARorRa6lhXwFAewP1Y"
    },
    "discord": {
        "userId": "134088983712890880",
        "channelId": "489628126905892864"
    }
}

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require('./config').configuration;
var Main = /** @class */ (function () {
    function Main(commandManager, formAccessor, logger) {
        this.commandManager = commandManager;
        this.formAccessor = formAccessor;
        this.logger = logger;
    }
    Main.prototype.initialize = function () {
        this.logger.trace('Main initializing');
        this.formAccessor.loadDefaults();
        this.commandManager.initialize();
        this.logger.trace('Main initialized');
    };
    return Main;
}());
var CommandManager = /** @class */ (function () {
    function CommandManager(batchCommands, logger) {
        this.batchCommands = batchCommands;
        this.logger = logger;
    }
    CommandManager.prototype.initialize = function () {
        var myLogger = this.logger;
        myLogger.trace('CommandManager initializing');
        var batchCommands = this.batchCommands;
        $('#submitMessages').on('click', function (e) {
            logger.trace('Execute commands:clicked');
            e.preventDefault();
            $.ajax({
                url: '/command',
                method: 'POST',
                data: {
                    userId: batchCommands.userId,
                    channelId: batchCommands.channelId,
                    chatCommands: batchCommands.chatCommands
                }
            }).done(function (msg) {
                logger.trace('Execute commands:clicked:done');
                logger.info(msg);
            });
        });
        myLogger.trace('CommandManager initialized');
    };
    return CommandManager;
}());
var FormAccessor = /** @class */ (function () {
    function FormAccessor(defaultDiscordOptions, logger) {
        this.defaultDiscordOptions = defaultDiscordOptions;
        this.logger = logger;
        this.discordUserIdSelector = '#discordUserId';
        this.discordChannelIdSelector = '#discordChannelId';
        this.chatCommandsSelector = '#chatCommands';
    }
    FormAccessor.prototype.loadDefaults = function () {
        this.logger.trace('FormAccessor loading defaults');
        this.userId = this.defaultDiscordOptions.userId;
        this.channelId = this.defaultDiscordOptions.channelId;
        this.logger.trace('FormAccessor loaded defaults');
    };
    Object.defineProperty(FormAccessor.prototype, "userId", {
        get: function () {
            return $(this.discordUserIdSelector).val();
        },
        set: function (v) {
            this.logger.debug("Setting userId to " + v);
            $(this.discordUserIdSelector).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormAccessor.prototype, "channelId", {
        get: function () {
            return $(this.discordChannelIdSelector).val();
        },
        set: function (v) {
            this.logger.debug("Setting channelId to " + v);
            $(this.discordChannelIdSelector).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormAccessor.prototype, "chatCommands", {
        get: function () {
            return $(this.chatCommandsSelector).val();
        },
        set: function (v) {
            this.logger.debug("Setting chatCommands to " + v);
            $(this.chatCommandsSelector).val(v);
        },
        enumerable: true,
        configurable: true
    });
    return FormAccessor;
}());
var Logger = /** @class */ (function () {
    function Logger(minimumLogLevel) {
        if (minimumLogLevel === void 0) { minimumLogLevel = LogLevel.trace; }
        this.minimumLogLevel = minimumLogLevel;
        this.logsSelector = '#logs';
    }
    Logger.prototype.warning = function (value) {
        this.prepend(value, LogLevel.warning);
    };
    Logger.prototype.error = function (value) {
        this.prepend(value, LogLevel.error);
    };
    Logger.prototype.info = function (value) {
        this.prepend(value, LogLevel.info);
    };
    Logger.prototype.trace = function (value) {
        this.prepend(value, LogLevel.trace);
    };
    Logger.prototype.debug = function (value) {
        this.prepend(value, LogLevel.debug);
    };
    Logger.prototype.prepend = function (value, logLevel) {
        if (this.minimumLogLevel > logLevel) {
            return;
        }
        var $li = $('<li>');
        $li.addClass("level-" + logLevel);
        $li.html(value);
        $li.prependTo(this.logsSelector);
    };
    return Logger;
}());
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["trace"] = 0] = "trace";
    LogLevel[LogLevel["debug"] = 1] = "debug";
    LogLevel[LogLevel["info"] = 2] = "info";
    LogLevel[LogLevel["warning"] = 3] = "warning";
    LogLevel[LogLevel["error"] = 4] = "error";
})(LogLevel || (LogLevel = {}));
var logger = new Logger();
var discordOptions = config.discord;
var formAccessor = new FormAccessor(discordOptions, logger);
var commandManager = new CommandManager(formAccessor, logger);
var main = new Main(commandManager, formAccessor, logger);
$(function () {
    setTimeout(function () {
        main.initialize();
    }, 1);
});

},{"./config":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcuanMiLCJjb25maWcuc2VjcmV0cy5qc29uIiwic2l0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJ2YXIgYWxsQ29uZmlncyA9IHJlcXVpcmUoJy4vY29uZmlnLnNlY3JldHMuanNvbicpO1xyXG5cclxuLy92YXIgQ29uZmlndXJhdGlvbiA9IHJlcXVpcmUoJ21lcmdlLWNvbmZpZycpO1xyXG5cclxuLy8gY29uc3QgY29uZmlnID0gbmV3IENvbmZpZ3VyYXRpb24oKTtcclxuLy8gY29uZmlnLmZpbGUoJ2NvbmZpZy5qc29uJyk7XHJcbi8vIGNvbmZpZy5maWxlKCdjb25maWcuc2VjcmV0cy5qc29uJyk7XHJcblxyXG5leHBvcnRzLmNvbmZpZ3VyYXRpb24gPSBhbGxDb25maWdzO1xyXG4iLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgICBcImF1dGhcIjoge1xyXG4gICAgICAgIFwidG9rZW5cIjogXCJORGN4T0RjNE5UVTRNek15TURreU5ERTIuRGxIYm13Lk5GMWVfUTlueEFSb3JSYTZsaFh3RkFld1AxWVwiXHJcbiAgICB9LFxyXG4gICAgXCJkaXNjb3JkXCI6IHtcclxuICAgICAgICBcInVzZXJJZFwiOiBcIjEzNDA4ODk4MzcxMjg5MDg4MFwiLFxyXG4gICAgICAgIFwiY2hhbm5lbElkXCI6IFwiNDg5NjI4MTI2OTA1ODkyODY0XCJcclxuICAgIH1cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKS5jb25maWd1cmF0aW9uO1xyXG52YXIgTWFpbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIE1haW4oY29tbWFuZE1hbmFnZXIsIGZvcm1BY2Nlc3NvciwgbG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kTWFuYWdlciA9IGNvbW1hbmRNYW5hZ2VyO1xyXG4gICAgICAgIHRoaXMuZm9ybUFjY2Vzc29yID0gZm9ybUFjY2Vzc29yO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgfVxyXG4gICAgTWFpbi5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnTWFpbiBpbml0aWFsaXppbmcnKTtcclxuICAgICAgICB0aGlzLmZvcm1BY2Nlc3Nvci5sb2FkRGVmYXVsdHMoKTtcclxuICAgICAgICB0aGlzLmNvbW1hbmRNYW5hZ2VyLmluaXRpYWxpemUoKTtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnTWFpbiBpbml0aWFsaXplZCcpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBNYWluO1xyXG59KCkpO1xyXG52YXIgQ29tbWFuZE1hbmFnZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBDb21tYW5kTWFuYWdlcihiYXRjaENvbW1hbmRzLCBsb2dnZXIpIHtcclxuICAgICAgICB0aGlzLmJhdGNoQ29tbWFuZHMgPSBiYXRjaENvbW1hbmRzO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgfVxyXG4gICAgQ29tbWFuZE1hbmFnZXIucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG15TG9nZ2VyID0gdGhpcy5sb2dnZXI7XHJcbiAgICAgICAgbXlMb2dnZXIudHJhY2UoJ0NvbW1hbmRNYW5hZ2VyIGluaXRpYWxpemluZycpO1xyXG4gICAgICAgIHZhciBiYXRjaENvbW1hbmRzID0gdGhpcy5iYXRjaENvbW1hbmRzO1xyXG4gICAgICAgICQoJyNzdWJtaXRNZXNzYWdlcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci50cmFjZSgnRXhlY3V0ZSBjb21tYW5kczpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jb21tYW5kJyxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogYmF0Y2hDb21tYW5kcy51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbm5lbElkOiBiYXRjaENvbW1hbmRzLmNoYW5uZWxJZCxcclxuICAgICAgICAgICAgICAgICAgICBjaGF0Q29tbWFuZHM6IGJhdGNoQ29tbWFuZHMuY2hhdENvbW1hbmRzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLnRyYWNlKCdFeGVjdXRlIGNvbW1hbmRzOmNsaWNrZWQ6ZG9uZScpO1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8obXNnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbXlMb2dnZXIudHJhY2UoJ0NvbW1hbmRNYW5hZ2VyIGluaXRpYWxpemVkJyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIENvbW1hbmRNYW5hZ2VyO1xyXG59KCkpO1xyXG52YXIgRm9ybUFjY2Vzc29yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRm9ybUFjY2Vzc29yKGRlZmF1bHREaXNjb3JkT3B0aW9ucywgbG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0RGlzY29yZE9wdGlvbnMgPSBkZWZhdWx0RGlzY29yZE9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgdGhpcy5kaXNjb3JkVXNlcklkU2VsZWN0b3IgPSAnI2Rpc2NvcmRVc2VySWQnO1xyXG4gICAgICAgIHRoaXMuZGlzY29yZENoYW5uZWxJZFNlbGVjdG9yID0gJyNkaXNjb3JkQ2hhbm5lbElkJztcclxuICAgICAgICB0aGlzLmNoYXRDb21tYW5kc1NlbGVjdG9yID0gJyNjaGF0Q29tbWFuZHMnO1xyXG4gICAgfVxyXG4gICAgRm9ybUFjY2Vzc29yLnByb3RvdHlwZS5sb2FkRGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0Zvcm1BY2Nlc3NvciBsb2FkaW5nIGRlZmF1bHRzJyk7XHJcbiAgICAgICAgdGhpcy51c2VySWQgPSB0aGlzLmRlZmF1bHREaXNjb3JkT3B0aW9ucy51c2VySWQ7XHJcbiAgICAgICAgdGhpcy5jaGFubmVsSWQgPSB0aGlzLmRlZmF1bHREaXNjb3JkT3B0aW9ucy5jaGFubmVsSWQ7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0Zvcm1BY2Nlc3NvciBsb2FkZWQgZGVmYXVsdHMnKTtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJ1c2VySWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCh0aGlzLmRpc2NvcmRVc2VySWRTZWxlY3RvcikudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB1c2VySWQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJCh0aGlzLmRpc2NvcmRVc2VySWRTZWxlY3RvcikudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwiY2hhbm5lbElkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQodGhpcy5kaXNjb3JkQ2hhbm5lbElkU2VsZWN0b3IpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY2hhbm5lbElkIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQodGhpcy5kaXNjb3JkQ2hhbm5lbElkU2VsZWN0b3IpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcImNoYXRDb21tYW5kc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKHRoaXMuY2hhdENvbW1hbmRzU2VsZWN0b3IpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY2hhdENvbW1hbmRzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQodGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvcikudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEZvcm1BY2Nlc3NvcjtcclxufSgpKTtcclxudmFyIExvZ2dlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExvZ2dlcihtaW5pbXVtTG9nTGV2ZWwpIHtcclxuICAgICAgICBpZiAobWluaW11bUxvZ0xldmVsID09PSB2b2lkIDApIHsgbWluaW11bUxvZ0xldmVsID0gTG9nTGV2ZWwudHJhY2U7IH1cclxuICAgICAgICB0aGlzLm1pbmltdW1Mb2dMZXZlbCA9IG1pbmltdW1Mb2dMZXZlbDtcclxuICAgICAgICB0aGlzLmxvZ3NTZWxlY3RvciA9ICcjbG9ncyc7XHJcbiAgICB9XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLndhcm5pbmcgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsLndhcm5pbmcpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsLmVycm9yKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLmluZm8gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsLmluZm8pO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUudHJhY2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsLnRyYWNlKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbC5kZWJ1Zyk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5wcmVwZW5kID0gZnVuY3Rpb24gKHZhbHVlLCBsb2dMZXZlbCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1pbmltdW1Mb2dMZXZlbCA+IGxvZ0xldmVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyICRsaSA9ICQoJzxsaT4nKTtcclxuICAgICAgICAkbGkuYWRkQ2xhc3MoXCJsZXZlbC1cIiArIGxvZ0xldmVsKTtcclxuICAgICAgICAkbGkuaHRtbCh2YWx1ZSk7XHJcbiAgICAgICAgJGxpLnByZXBlbmRUbyh0aGlzLmxvZ3NTZWxlY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExvZ2dlcjtcclxufSgpKTtcclxudmFyIExvZ0xldmVsO1xyXG4oZnVuY3Rpb24gKExvZ0xldmVsKSB7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcInRyYWNlXCJdID0gMF0gPSBcInRyYWNlXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcImRlYnVnXCJdID0gMV0gPSBcImRlYnVnXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcImluZm9cIl0gPSAyXSA9IFwiaW5mb1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJ3YXJuaW5nXCJdID0gM10gPSBcIndhcm5pbmdcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiZXJyb3JcIl0gPSA0XSA9IFwiZXJyb3JcIjtcclxufSkoTG9nTGV2ZWwgfHwgKExvZ0xldmVsID0ge30pKTtcclxudmFyIGxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcclxudmFyIGRpc2NvcmRPcHRpb25zID0gY29uZmlnLmRpc2NvcmQ7XHJcbnZhciBmb3JtQWNjZXNzb3IgPSBuZXcgRm9ybUFjY2Vzc29yKGRpc2NvcmRPcHRpb25zLCBsb2dnZXIpO1xyXG52YXIgY29tbWFuZE1hbmFnZXIgPSBuZXcgQ29tbWFuZE1hbmFnZXIoZm9ybUFjY2Vzc29yLCBsb2dnZXIpO1xyXG52YXIgbWFpbiA9IG5ldyBNYWluKGNvbW1hbmRNYW5hZ2VyLCBmb3JtQWNjZXNzb3IsIGxvZ2dlcik7XHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbWFpbi5pbml0aWFsaXplKCk7XHJcbiAgICB9LCAxKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpdGUuanMubWFwIl19
