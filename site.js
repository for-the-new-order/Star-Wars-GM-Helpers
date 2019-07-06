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
//# sourceMappingURL=site.js.map