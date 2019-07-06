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
// $(() => {
// });
setTimeout(function () {
    main.initialize();
}, 100);

},{"./config":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcuanMiLCJjb25maWcuc2VjcmV0cy5qc29uIiwic2l0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInZhciBhbGxDb25maWdzID0gcmVxdWlyZSgnLi9jb25maWcuc2VjcmV0cy5qc29uJyk7XHJcblxyXG4vL3ZhciBDb25maWd1cmF0aW9uID0gcmVxdWlyZSgnbWVyZ2UtY29uZmlnJyk7XHJcblxyXG4vLyBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlndXJhdGlvbigpO1xyXG4vLyBjb25maWcuZmlsZSgnY29uZmlnLmpzb24nKTtcclxuLy8gY29uZmlnLmZpbGUoJ2NvbmZpZy5zZWNyZXRzLmpzb24nKTtcclxuXHJcbmV4cG9ydHMuY29uZmlndXJhdGlvbiA9IGFsbENvbmZpZ3M7XHJcbiIsIm1vZHVsZS5leHBvcnRzPXtcclxuICAgIFwiYXV0aFwiOiB7XHJcbiAgICAgICAgXCJ0b2tlblwiOiBcIk5EY3hPRGM0TlRVNE16TXlNRGt5TkRFMi5EbEhibXcuTkYxZV9ROW54QVJvclJhNmxoWHdGQWV3UDFZXCJcclxuICAgIH0sXHJcbiAgICBcImRpc2NvcmRcIjoge1xyXG4gICAgICAgIFwidXNlcklkXCI6IFwiMTM0MDg4OTgzNzEyODkwODgwXCIsXHJcbiAgICAgICAgXCJjaGFubmVsSWRcIjogXCI0ODk2MjgxMjY5MDU4OTI4NjRcIlxyXG4gICAgfVxyXG59XHJcbiIsInZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpLmNvbmZpZ3VyYXRpb247XHJcbnZhciBNYWluID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTWFpbihjb21tYW5kTWFuYWdlciwgZm9ybUFjY2Vzc29yLCBsb2dnZXIpIHtcclxuICAgICAgICB0aGlzLmNvbW1hbmRNYW5hZ2VyID0gY29tbWFuZE1hbmFnZXI7XHJcbiAgICAgICAgdGhpcy5mb3JtQWNjZXNzb3IgPSBmb3JtQWNjZXNzb3I7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICBNYWluLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdNYWluIGluaXRpYWxpemluZycpO1xyXG4gICAgICAgIHRoaXMuZm9ybUFjY2Vzc29yLmxvYWREZWZhdWx0cygpO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZE1hbmFnZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdNYWluIGluaXRpYWxpemVkJyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE1haW47XHJcbn0oKSk7XHJcbnZhciBDb21tYW5kTWFuYWdlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENvbW1hbmRNYW5hZ2VyKGJhdGNoQ29tbWFuZHMsIGxvZ2dlcikge1xyXG4gICAgICAgIHRoaXMuYmF0Y2hDb21tYW5kcyA9IGJhdGNoQ29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICBDb21tYW5kTWFuYWdlci5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbXlMb2dnZXIgPSB0aGlzLmxvZ2dlcjtcclxuICAgICAgICBteUxvZ2dlci50cmFjZSgnQ29tbWFuZE1hbmFnZXIgaW5pdGlhbGl6aW5nJyk7XHJcbiAgICAgICAgdmFyIGJhdGNoQ29tbWFuZHMgPSB0aGlzLmJhdGNoQ29tbWFuZHM7XHJcbiAgICAgICAgJCgnI3N1Ym1pdE1lc3NhZ2VzJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLnRyYWNlKCdFeGVjdXRlIGNvbW1hbmRzOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NvbW1hbmQnLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiBiYXRjaENvbW1hbmRzLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsSWQ6IGJhdGNoQ29tbWFuZHMuY2hhbm5lbElkLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXRDb21tYW5kczogYmF0Y2hDb21tYW5kcy5jaGF0Q29tbWFuZHNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dnZXIudHJhY2UoJ0V4ZWN1dGUgY29tbWFuZHM6Y2xpY2tlZDpkb25lJyk7XHJcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhtc2cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBteUxvZ2dlci50cmFjZSgnQ29tbWFuZE1hbmFnZXIgaW5pdGlhbGl6ZWQnKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQ29tbWFuZE1hbmFnZXI7XHJcbn0oKSk7XHJcbnZhciBGb3JtQWNjZXNzb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBGb3JtQWNjZXNzb3IoZGVmYXVsdERpc2NvcmRPcHRpb25zLCBsb2dnZXIpIHtcclxuICAgICAgICB0aGlzLmRlZmF1bHREaXNjb3JkT3B0aW9ucyA9IGRlZmF1bHREaXNjb3JkT3B0aW9ucztcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcclxuICAgICAgICB0aGlzLmRpc2NvcmRVc2VySWRTZWxlY3RvciA9ICcjZGlzY29yZFVzZXJJZCc7XHJcbiAgICAgICAgdGhpcy5kaXNjb3JkQ2hhbm5lbElkU2VsZWN0b3IgPSAnI2Rpc2NvcmRDaGFubmVsSWQnO1xyXG4gICAgICAgIHRoaXMuY2hhdENvbW1hbmRzU2VsZWN0b3IgPSAnI2NoYXRDb21tYW5kcyc7XHJcbiAgICB9XHJcbiAgICBGb3JtQWNjZXNzb3IucHJvdG90eXBlLmxvYWREZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnRm9ybUFjY2Vzc29yIGxvYWRpbmcgZGVmYXVsdHMnKTtcclxuICAgICAgICB0aGlzLnVzZXJJZCA9IHRoaXMuZGVmYXVsdERpc2NvcmRPcHRpb25zLnVzZXJJZDtcclxuICAgICAgICB0aGlzLmNoYW5uZWxJZCA9IHRoaXMuZGVmYXVsdERpc2NvcmRPcHRpb25zLmNoYW5uZWxJZDtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnRm9ybUFjY2Vzc29yIGxvYWRlZCBkZWZhdWx0cycpO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcInVzZXJJZFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKHRoaXMuZGlzY29yZFVzZXJJZFNlbGVjdG9yKS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHVzZXJJZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKHRoaXMuZGlzY29yZFVzZXJJZFNlbGVjdG9yKS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJjaGFubmVsSWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCh0aGlzLmRpc2NvcmRDaGFubmVsSWRTZWxlY3RvcikudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBjaGFubmVsSWQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJCh0aGlzLmRpc2NvcmRDaGFubmVsSWRTZWxlY3RvcikudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwiY2hhdENvbW1hbmRzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQodGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvcikudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBjaGF0Q29tbWFuZHMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJCh0aGlzLmNoYXRDb21tYW5kc1NlbGVjdG9yKS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gRm9ybUFjY2Vzc29yO1xyXG59KCkpO1xyXG52YXIgTG9nZ2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTG9nZ2VyKG1pbmltdW1Mb2dMZXZlbCkge1xyXG4gICAgICAgIGlmIChtaW5pbXVtTG9nTGV2ZWwgPT09IHZvaWQgMCkgeyBtaW5pbXVtTG9nTGV2ZWwgPSBMb2dMZXZlbC50cmFjZTsgfVxyXG4gICAgICAgIHRoaXMubWluaW11bUxvZ0xldmVsID0gbWluaW11bUxvZ0xldmVsO1xyXG4gICAgICAgIHRoaXMubG9nc1NlbGVjdG9yID0gJyNsb2dzJztcclxuICAgIH1cclxuICAgIExvZ2dlci5wcm90b3R5cGUud2FybmluZyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWwud2FybmluZyk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWwuZXJyb3IpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWwuaW5mbyk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS50cmFjZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWwudHJhY2UpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsLmRlYnVnKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLnByZXBlbmQgPSBmdW5jdGlvbiAodmFsdWUsIGxvZ0xldmVsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubWluaW11bUxvZ0xldmVsID4gbG9nTGV2ZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJGxpID0gJCgnPGxpPicpO1xyXG4gICAgICAgICRsaS5hZGRDbGFzcyhcImxldmVsLVwiICsgbG9nTGV2ZWwpO1xyXG4gICAgICAgICRsaS5odG1sKHZhbHVlKTtcclxuICAgICAgICAkbGkucHJlcGVuZFRvKHRoaXMubG9nc1NlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTG9nZ2VyO1xyXG59KCkpO1xyXG52YXIgTG9nTGV2ZWw7XHJcbihmdW5jdGlvbiAoTG9nTGV2ZWwpIHtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1widHJhY2VcIl0gPSAwXSA9IFwidHJhY2VcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiZGVidWdcIl0gPSAxXSA9IFwiZGVidWdcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiaW5mb1wiXSA9IDJdID0gXCJpbmZvXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIndhcm5pbmdcIl0gPSAzXSA9IFwid2FybmluZ1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJlcnJvclwiXSA9IDRdID0gXCJlcnJvclwiO1xyXG59KShMb2dMZXZlbCB8fCAoTG9nTGV2ZWwgPSB7fSkpO1xyXG52YXIgbG9nZ2VyID0gbmV3IExvZ2dlcigpO1xyXG52YXIgZGlzY29yZE9wdGlvbnMgPSBjb25maWcuZGlzY29yZDtcclxudmFyIGZvcm1BY2Nlc3NvciA9IG5ldyBGb3JtQWNjZXNzb3IoZGlzY29yZE9wdGlvbnMsIGxvZ2dlcik7XHJcbnZhciBjb21tYW5kTWFuYWdlciA9IG5ldyBDb21tYW5kTWFuYWdlcihmb3JtQWNjZXNzb3IsIGxvZ2dlcik7XHJcbnZhciBtYWluID0gbmV3IE1haW4oY29tbWFuZE1hbmFnZXIsIGZvcm1BY2Nlc3NvciwgbG9nZ2VyKTtcclxuLy8gJCgoKSA9PiB7XHJcbi8vIH0pO1xyXG5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgIG1haW4uaW5pdGlhbGl6ZSgpO1xyXG59LCAxMDApO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaXRlLmpzLm1hcCJdfQ==
