"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var config = require('./config').configuration;
var Main = /** @class */ (function () {
    function Main(commands, logger) {
        this.commands = commands;
        this.logger = logger;
    }
    Main.prototype.initialize = function () {
        this.logger.trace('Main initializing');
        this.commands.forEach(function (command) {
            command.initialize();
        });
        this.logger.trace('Main initialized');
    };
    return Main;
}());
var BaseCommandsAccessor = /** @class */ (function () {
    function BaseCommandsAccessor(defaultDiscordOptions, logger) {
        this.defaultDiscordOptions = defaultDiscordOptions;
        this.logger = logger;
    }
    BaseCommandsAccessor.prototype.initialize = function () {
        this.logger.trace('BaseCommandsAccessor initializing');
        this.userId = this.defaultDiscordOptions.userId;
        this.channelId = this.defaultDiscordOptions.channelId;
        this.guildId = this.defaultDiscordOptions.guildId;
        this.load();
        this.logger.trace('BaseCommandsAccessor initialized');
    };
    Object.defineProperty(BaseCommandsAccessor.prototype, "userId", {
        get: function () {
            return $('#discordUserId').val();
        },
        set: function (v) {
            this.logger.debug("Setting userId to " + v);
            $('#discordUserId').val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCommandsAccessor.prototype, "channelId", {
        get: function () {
            return $('#discordChannelId').val();
        },
        set: function (v) {
            this.logger.debug("Setting channelId to " + v);
            $('#discordChannelId').val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCommandsAccessor.prototype, "guildId", {
        get: function () {
            return $('#discordGuildId').val();
        },
        set: function (v) {
            this.logger.debug("Setting discordGuildId to " + v);
            $('#discordGuildId').val(v);
        },
        enumerable: true,
        configurable: true
    });
    return BaseCommandsAccessor;
}());
var BatchCommandsFormAccessor = /** @class */ (function (_super) {
    __extends(BatchCommandsFormAccessor, _super);
    function BatchCommandsFormAccessor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.chatCommandsSelector = '#chatCommands';
        return _this;
    }
    BatchCommandsFormAccessor.prototype.load = function () {
        this.logger.trace('BatchCommandsFormAccessor loading');
        var me = this;
        $('#submitMessages').on('click', function (e) {
            me.logger.trace('BatchCommands:clicked');
            e.preventDefault();
            $.ajax({
                url: '/commands/batch',
                method: 'POST',
                data: {
                    userId: me.userId,
                    channelId: me.channelId,
                    guildId: me.guildId,
                    chatCommands: me.chatCommands
                }
            }).done(function (msg) {
                me.logger.trace('BatchCommands:posted');
                me.logger.info(msg);
            });
        });
        this.logger.trace('BatchCommandsFormAccessor loaded');
    };
    Object.defineProperty(BatchCommandsFormAccessor.prototype, "chatCommands", {
        get: function () {
            var raw = $(this.chatCommandsSelector).val();
            var commands = raw.replace('\r', '').split('\n');
            return commands;
        },
        set: function (v) {
            this.logger.debug("Setting chatCommands to " + v);
            var commands = v.join('\n');
            $(this.chatCommandsSelector).val(commands);
        },
        enumerable: true,
        configurable: true
    });
    return BatchCommandsFormAccessor;
}(BaseCommandsAccessor));
var SymbolsFormAccessorFactory = /** @class */ (function () {
    function SymbolsFormAccessorFactory(logger) {
        this.logger = logger;
    }
    SymbolsFormAccessorFactory.prototype.create = function (index) {
        var accessor = new SymbolsFormAccessor(index, this.logger);
        var me = this;
        me.logger.trace("SymbolsFormAccessorFactory:loading:" + index);
        $.ajax({
            url: '/partials/index-display-symbols-form',
            method: 'GET',
            data: { index: index }
        }).done(function (data) {
            me.logger.trace("SymbolsFormAccessorFactory:loaded:" + index);
            var $nextSibling = $('#display-symbols-button-row');
            var $row = $(data);
            $row.insertBefore($nextSibling);
            accessor.loadDefaults();
        });
        return accessor;
    };
    return SymbolsFormAccessorFactory;
}());
var DisplaySymbolsCommandsFormAccessor = /** @class */ (function (_super) {
    __extends(DisplaySymbolsCommandsFormAccessor, _super);
    function DisplaySymbolsCommandsFormAccessor(defaultDiscordOptions, logger, symbolsFormAccessorFactory) {
        var _this = _super.call(this, defaultDiscordOptions, logger) || this;
        _this.symbolsFormAccessorFactory = symbolsFormAccessorFactory;
        _this.symbolsFormAccessors = new Array();
        return _this;
    }
    DisplaySymbolsCommandsFormAccessor.prototype.load = function () {
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loading');
        this.addRow();
        this.attachSubmitButton();
        this.attachAddRowButton();
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loaded');
    };
    DisplaySymbolsCommandsFormAccessor.prototype.attachAddRowButton = function () {
        var me = this;
        $('#addSymbolsRow').on('click', function (e) {
            me.logger.trace('addSymbolsRow:clicked');
            e.preventDefault();
            me.addRow();
        });
    };
    DisplaySymbolsCommandsFormAccessor.prototype.addRow = function () {
        var accessor = this.symbolsFormAccessorFactory.create(this.symbolsFormAccessors.length);
        this.symbolsFormAccessors.push(accessor);
        accessor.loadDefaults();
    };
    DisplaySymbolsCommandsFormAccessor.prototype.attachSubmitButton = function () {
        var me = this;
        $('#displaySymbols').on('click', function (e) {
            me.logger.trace('displaySymbols:clicked');
            e.preventDefault();
            var data = {
                userId: me.userId,
                channelId: me.channelId,
                guildId: me.guildId,
                symbols: new Array()
            };
            me.symbolsFormAccessors.forEach(function (row) {
                data.symbols.push({
                    label: row.label,
                    type: row.type,
                    advantages: row.advantages,
                    successes: row.successes,
                    triumphs: row.triumphs,
                    threats: row.threats,
                    failures: row.failures,
                    despairs: row.despairs
                });
            });
            $.ajax({
                url: '/commands/display-symbols',
                method: 'POST',
                data: data
            }).done(function (msg) {
                me.logger.trace('displaySymbols:posted');
                me.logger.info(msg);
            });
        });
    };
    Object.defineProperty(DisplaySymbolsCommandsFormAccessor.prototype, "symbols", {
        get: function () {
            return this.symbolsFormAccessors;
        },
        set: function (v) {
            throw 'NotSupportedException';
        },
        enumerable: true,
        configurable: true
    });
    return DisplaySymbolsCommandsFormAccessor;
}(BaseCommandsAccessor));
var SymbolsFormAccessor = /** @class */ (function () {
    function SymbolsFormAccessor(index, logger) {
        this.index = index;
        this.logger = logger;
    }
    SymbolsFormAccessor.prototype.loadDefaults = function () {
        this.type = 'NPC';
        this.advantages = 0;
        this.successes = 0;
        this.triumphs = 0;
        this.threats = 0;
        this.failures = 0;
        this.despairs = 0;
    };
    Object.defineProperty(SymbolsFormAccessor.prototype, "label", {
        get: function () {
            return $("#label-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting label to " + v);
            $("#label-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolsFormAccessor.prototype, "type", {
        get: function () {
            return $("#type-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting type to " + v);
            $("#type-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolsFormAccessor.prototype, "advantages", {
        get: function () {
            return $("#advantages-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting advantages to " + v);
            $("#advantages-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolsFormAccessor.prototype, "successes", {
        get: function () {
            return $("#successes-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting successes to " + v);
            $("#successes-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolsFormAccessor.prototype, "triumphs", {
        get: function () {
            return $("#triumphs-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting triumphs to " + v);
            $("#triumphs-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolsFormAccessor.prototype, "threats", {
        get: function () {
            return $("#threats-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting threats to " + v);
            $("#threats-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolsFormAccessor.prototype, "failures", {
        get: function () {
            return $("#failures-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting failures to " + v);
            $("#failures-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolsFormAccessor.prototype, "despairs", {
        get: function () {
            return $("#despairs-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting despairs to " + v);
            $("#despairs-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    return SymbolsFormAccessor;
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
var formAccessor = new BatchCommandsFormAccessor(discordOptions, logger);
var symbolsFormAccessorFactory = new SymbolsFormAccessorFactory(logger);
var displaySymbolsCommandsFormAccessor = new DisplaySymbolsCommandsFormAccessor(discordOptions, logger, symbolsFormAccessorFactory);
var commands = [formAccessor, displaySymbolsCommandsFormAccessor];
var main = new Main(commands, logger);
$(function () {
    main.initialize();
});
//# sourceMappingURL=site.js.map