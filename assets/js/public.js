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
        "channelId": "489628126905892864",
        "guildId": "273628610697363456"
    }
}

},{}],3:[function(require,module,exports){
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
            var $parent = $('#display-symbols-card');
            var $row = $(data);
            $parent.append($row);
            accessor.load();
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
        _this.rowCount = 0;
        return _this;
    }
    DisplaySymbolsCommandsFormAccessor.prototype.load = function () {
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loading');
        this.addRacer();
        this.attachSubmitButton();
        this.attachAddRacerButton();
        this.attachSortInitButton();
        this.attachSortRaceButton();
        this.attachResolveNegativesSymbols();
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loaded');
    };
    DisplaySymbolsCommandsFormAccessor.prototype.attachResolveNegativesSymbols = function () {
        var me = this;
        $('#resolveNegativesSymbols').on('click', function (e) {
            me.logger.trace('resolveNegativesSymbols:clicked');
            e.preventDefault();
            me.symbolsFormAccessors.forEach(function (accessor) {
                var successes = accessor.successes - accessor.failures;
                var advantages = accessor.advantages - accessor.threats;
                var failures = 0;
                var threats = 0;
                if (successes < 0) {
                    failures = -successes;
                    successes = 0;
                }
                if (advantages < 0) {
                    threats = -advantages;
                    advantages = 0;
                }
                accessor.successes = successes;
                accessor.failures = failures;
                accessor.advantages = advantages;
                accessor.threats = threats;
            });
        });
    };
    DisplaySymbolsCommandsFormAccessor.prototype.attachSortRaceButton = function () {
        var me = this;
        $('#sortRace').on('click', function (e) {
            me.logger.trace('sortRace:clicked');
            e.preventDefault();
            me.symbolsFormAccessors = me.symbolsFormAccessors
                .sort(function (a, b) {
                return me.sortCompound(a.successes - a.failures, b.successes - b.failures) ||
                    me.sortCompound(a.advantages - a.threats, b.advantages - b.threats) ||
                    me.sortCompound(a.triumphs, b.triumphs) ||
                    me.sortCompound(b.despairs, a.despairs);
            })
                .reverse();
            me.reorderRows();
        });
    };
    DisplaySymbolsCommandsFormAccessor.prototype.attachSortInitButton = function () {
        var me = this;
        $('#sortInit').on('click', function (e) {
            me.logger.trace('sortInit:clicked');
            e.preventDefault();
            me.symbolsFormAccessors = me.symbolsFormAccessors
                .sort(function (a, b) {
                return me.sortCompound(a.successes, b.successes) ||
                    me.sortCompound(a.advantages, b.advantages) ||
                    me.sortCompound(a.triumphs, b.triumphs);
            })
                .reverse();
            me.reorderRows();
        });
    };
    DisplaySymbolsCommandsFormAccessor.prototype.reorderRows = function () {
        var $parent = $('#display-symbols-card');
        var $rows = $parent.remove('[data-symbols-row]');
        this.symbolsFormAccessors.forEach(function (element) {
            var index = element.getIndex();
            var selector = "[data-symbols-row=\"" + index + "\"]";
            var $el = $(selector, $rows);
            $parent.append($el);
        });
    };
    DisplaySymbolsCommandsFormAccessor.prototype.sortCompound = function (a, b) {
        if (a > b)
            return +1;
        if (a < b)
            return -1;
        return 0;
    };
    DisplaySymbolsCommandsFormAccessor.prototype.attachAddRacerButton = function () {
        var me = this;
        $('#addSymbolsRow').on('click', function (e) {
            me.logger.trace('addSymbolsRow:clicked');
            e.preventDefault();
            me.addRacer();
        });
    };
    DisplaySymbolsCommandsFormAccessor.prototype.addRacer = function () {
        var accessor = this.symbolsFormAccessorFactory.create(this.rowCount++);
        this.symbolsFormAccessors.push(accessor);
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
                    racer: row.racer,
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
    SymbolsFormAccessor.prototype.load = function () {
        this.loadDefaults();
        this.attachRemoveButton();
    };
    SymbolsFormAccessor.prototype.getIndex = function () {
        return this.index;
    };
    SymbolsFormAccessor.prototype.attachRemoveButton = function () {
        var me = this;
        $("[data-index=\"" + me.index + "\"]").on('click', function () {
            $("[data-symbols-row=\"" + me.index + "\"]").remove();
        });
    };
    SymbolsFormAccessor.prototype.loadDefaults = function () {
        this.type = 'NPC';
        this.advantages = 0;
        this.successes = 0;
        this.triumphs = 0;
        this.threats = 0;
        this.failures = 0;
        this.despairs = 0;
    };
    Object.defineProperty(SymbolsFormAccessor.prototype, "racer", {
        get: function () {
            return $("#racer-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting racer to " + v);
            $("#racer-" + this.index).val(v);
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

},{"./config":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcuanMiLCJjb25maWcuc2VjcmV0cy5qc29uIiwic2l0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJ2YXIgYWxsQ29uZmlncyA9IHJlcXVpcmUoJy4vY29uZmlnLnNlY3JldHMuanNvbicpO1xyXG5cclxuLy92YXIgQ29uZmlndXJhdGlvbiA9IHJlcXVpcmUoJ21lcmdlLWNvbmZpZycpO1xyXG5cclxuLy8gY29uc3QgY29uZmlnID0gbmV3IENvbmZpZ3VyYXRpb24oKTtcclxuLy8gY29uZmlnLmZpbGUoJ2NvbmZpZy5qc29uJyk7XHJcbi8vIGNvbmZpZy5maWxlKCdjb25maWcuc2VjcmV0cy5qc29uJyk7XHJcblxyXG5leHBvcnRzLmNvbmZpZ3VyYXRpb24gPSBhbGxDb25maWdzO1xyXG4iLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgICBcImF1dGhcIjoge1xyXG4gICAgICAgIFwidG9rZW5cIjogXCJORGN4T0RjNE5UVTRNek15TURreU5ERTIuRGxIYm13Lk5GMWVfUTlueEFSb3JSYTZsaFh3RkFld1AxWVwiXHJcbiAgICB9LFxyXG4gICAgXCJkaXNjb3JkXCI6IHtcclxuICAgICAgICBcInVzZXJJZFwiOiBcIjEzNDA4ODk4MzcxMjg5MDg4MFwiLFxyXG4gICAgICAgIFwiY2hhbm5lbElkXCI6IFwiNDg5NjI4MTI2OTA1ODkyODY0XCIsXHJcbiAgICAgICAgXCJndWlsZElkXCI6IFwiMjczNjI4NjEwNjk3MzYzNDU2XCJcclxuICAgIH1cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJykuY29uZmlndXJhdGlvbjtcclxudmFyIE1haW4gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBNYWluKGNvbW1hbmRzLCBsb2dnZXIpIHtcclxuICAgICAgICB0aGlzLmNvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICBNYWluLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdNYWluIGluaXRpYWxpemluZycpO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICBjb21tYW5kLmluaXRpYWxpemUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnTWFpbiBpbml0aWFsaXplZCcpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBNYWluO1xyXG59KCkpO1xyXG52YXIgQmFzZUNvbW1hbmRzQWNjZXNzb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCYXNlQ29tbWFuZHNBY2Nlc3NvcihkZWZhdWx0RGlzY29yZE9wdGlvbnMsIGxvZ2dlcikge1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdERpc2NvcmRPcHRpb25zID0gZGVmYXVsdERpc2NvcmRPcHRpb25zO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgfVxyXG4gICAgQmFzZUNvbW1hbmRzQWNjZXNzb3IucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0Jhc2VDb21tYW5kc0FjY2Vzc29yIGluaXRpYWxpemluZycpO1xyXG4gICAgICAgIHRoaXMudXNlcklkID0gdGhpcy5kZWZhdWx0RGlzY29yZE9wdGlvbnMudXNlcklkO1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbElkID0gdGhpcy5kZWZhdWx0RGlzY29yZE9wdGlvbnMuY2hhbm5lbElkO1xyXG4gICAgICAgIHRoaXMuZ3VpbGRJZCA9IHRoaXMuZGVmYXVsdERpc2NvcmRPcHRpb25zLmd1aWxkSWQ7XHJcbiAgICAgICAgdGhpcy5sb2FkKCk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0Jhc2VDb21tYW5kc0FjY2Vzc29yIGluaXRpYWxpemVkJyk7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhc2VDb21tYW5kc0FjY2Vzc29yLnByb3RvdHlwZSwgXCJ1c2VySWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCgnI2Rpc2NvcmRVc2VySWQnKS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHVzZXJJZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKCcjZGlzY29yZFVzZXJJZCcpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCYXNlQ29tbWFuZHNBY2Nlc3Nvci5wcm90b3R5cGUsIFwiY2hhbm5lbElkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoJyNkaXNjb3JkQ2hhbm5lbElkJykudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBjaGFubmVsSWQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJCgnI2Rpc2NvcmRDaGFubmVsSWQnKS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQmFzZUNvbW1hbmRzQWNjZXNzb3IucHJvdG90eXBlLCBcImd1aWxkSWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCgnI2Rpc2NvcmRHdWlsZElkJykudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBkaXNjb3JkR3VpbGRJZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKCcjZGlzY29yZEd1aWxkSWQnKS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gQmFzZUNvbW1hbmRzQWNjZXNzb3I7XHJcbn0oKSk7XHJcbnZhciBCYXRjaENvbW1hbmRzRm9ybUFjY2Vzc29yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEJhdGNoQ29tbWFuZHNGb3JtQWNjZXNzb3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBCYXRjaENvbW1hbmRzRm9ybUFjY2Vzc29yKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmNoYXRDb21tYW5kc1NlbGVjdG9yID0gJyNjaGF0Q29tbWFuZHMnO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEJhdGNoQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0JhdGNoQ29tbWFuZHNGb3JtQWNjZXNzb3IgbG9hZGluZycpO1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3N1Ym1pdE1lc3NhZ2VzJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdCYXRjaENvbW1hbmRzOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NvbW1hbmRzL2JhdGNoJyxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogbWUudXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5uZWxJZDogbWUuY2hhbm5lbElkLFxyXG4gICAgICAgICAgICAgICAgICAgIGd1aWxkSWQ6IG1lLmd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhdENvbW1hbmRzOiBtZS5jaGF0Q29tbWFuZHNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ0JhdGNoQ29tbWFuZHM6cG9zdGVkJyk7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIuaW5mbyhtc2cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnQmF0Y2hDb21tYW5kc0Zvcm1BY2Nlc3NvciBsb2FkZWQnKTtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQmF0Y2hDb21tYW5kc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwiY2hhdENvbW1hbmRzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJhdyA9ICQodGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvcikudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHJhdy5yZXBsYWNlKCdcXHInLCAnJykuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWFuZHM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBjaGF0Q29tbWFuZHMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gdi5qb2luKCdcXG4nKTtcclxuICAgICAgICAgICAgJCh0aGlzLmNoYXRDb21tYW5kc1NlbGVjdG9yKS52YWwoY29tbWFuZHMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEJhdGNoQ29tbWFuZHNGb3JtQWNjZXNzb3I7XHJcbn0oQmFzZUNvbW1hbmRzQWNjZXNzb3IpKTtcclxudmFyIFN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnkobG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICBTeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29yID0gbmV3IFN5bWJvbHNGb3JtQWNjZXNzb3IoaW5kZXgsIHRoaXMubG9nZ2VyKTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIG1lLmxvZ2dlci50cmFjZShcIlN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5OmxvYWRpbmc6XCIgKyBpbmRleCk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAnL3BhcnRpYWxzL2luZGV4LWRpc3BsYXktc3ltYm9scy1mb3JtJyxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YTogeyBpbmRleDogaW5kZXggfVxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKFwiU3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3Rvcnk6bG9hZGVkOlwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgJHBhcmVudCA9ICQoJyNkaXNwbGF5LXN5bWJvbHMtY2FyZCcpO1xyXG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQoZGF0YSk7XHJcbiAgICAgICAgICAgICRwYXJlbnQuYXBwZW5kKCRyb3cpO1xyXG4gICAgICAgICAgICBhY2Nlc3Nvci5sb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGFjY2Vzc29yO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeTtcclxufSgpKTtcclxudmFyIERpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoRGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3NvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIERpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IoZGVmYXVsdERpc2NvcmRPcHRpb25zLCBsb2dnZXIsIHN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgZGVmYXVsdERpc2NvcmRPcHRpb25zLCBsb2dnZXIpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnkgPSBzeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeTtcclxuICAgICAgICBfdGhpcy5zeW1ib2xzRm9ybUFjY2Vzc29ycyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIF90aGlzLnJvd0NvdW50ID0gMDtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBEaXNwbGF5U3ltYm9sc0NvbW1hbmRzRm9ybUFjY2Vzc29yLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdEaXNwbGF5U3ltYm9sc0NvbW1hbmRzRm9ybUFjY2Vzc29yIGxvYWRpbmcnKTtcclxuICAgICAgICB0aGlzLmFkZFJhY2VyKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hTdWJtaXRCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaEFkZFJhY2VyQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hTb3J0SW5pdEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoU29ydFJhY2VCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFJlc29sdmVOZWdhdGl2ZXNTeW1ib2xzKCk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0Rpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IgbG9hZGVkJyk7XHJcbiAgICB9O1xyXG4gICAgRGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUuYXR0YWNoUmVzb2x2ZU5lZ2F0aXZlc1N5bWJvbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjcmVzb2x2ZU5lZ2F0aXZlc1N5bWJvbHMnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ3Jlc29sdmVOZWdhdGl2ZXNTeW1ib2xzOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBtZS5zeW1ib2xzRm9ybUFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChhY2Nlc3Nvcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3NlcyA9IGFjY2Vzc29yLnN1Y2Nlc3NlcyAtIGFjY2Vzc29yLmZhaWx1cmVzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkdmFudGFnZXMgPSBhY2Nlc3Nvci5hZHZhbnRhZ2VzIC0gYWNjZXNzb3IudGhyZWF0cztcclxuICAgICAgICAgICAgICAgIHZhciBmYWlsdXJlcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhyZWF0cyA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2Vzc2VzIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZhaWx1cmVzID0gLXN1Y2Nlc3NlcztcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzZXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFkdmFudGFnZXMgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyZWF0cyA9IC1hZHZhbnRhZ2VzO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkdmFudGFnZXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWNjZXNzb3Iuc3VjY2Vzc2VzID0gc3VjY2Vzc2VzO1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzb3IuZmFpbHVyZXMgPSBmYWlsdXJlcztcclxuICAgICAgICAgICAgICAgIGFjY2Vzc29yLmFkdmFudGFnZXMgPSBhZHZhbnRhZ2VzO1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzb3IudGhyZWF0cyA9IHRocmVhdHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIERpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmF0dGFjaFNvcnRSYWNlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3NvcnRSYWNlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdzb3J0UmFjZTpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUuc3ltYm9sc0Zvcm1BY2Nlc3NvcnMgPSBtZS5zeW1ib2xzRm9ybUFjY2Vzc29yc1xyXG4gICAgICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZS5zb3J0Q29tcG91bmQoYS5zdWNjZXNzZXMgLSBhLmZhaWx1cmVzLCBiLnN1Y2Nlc3NlcyAtIGIuZmFpbHVyZXMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEuYWR2YW50YWdlcyAtIGEudGhyZWF0cywgYi5hZHZhbnRhZ2VzIC0gYi50aHJlYXRzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIG1lLnNvcnRDb21wb3VuZChhLnRyaXVtcGhzLCBiLnRyaXVtcGhzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIG1lLnNvcnRDb21wb3VuZChiLmRlc3BhaXJzLCBhLmRlc3BhaXJzKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIG1lLnJlb3JkZXJSb3dzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgRGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUuYXR0YWNoU29ydEluaXRCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjc29ydEluaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ3NvcnRJbml0OmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBtZS5zeW1ib2xzRm9ybUFjY2Vzc29ycyA9IG1lLnN5bWJvbHNGb3JtQWNjZXNzb3JzXHJcbiAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lLnNvcnRDb21wb3VuZChhLnN1Y2Nlc3NlcywgYi5zdWNjZXNzZXMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEuYWR2YW50YWdlcywgYi5hZHZhbnRhZ2VzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIG1lLnNvcnRDb21wb3VuZChhLnRyaXVtcGhzLCBiLnRyaXVtcGhzKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIG1lLnJlb3JkZXJSb3dzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgRGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUucmVvcmRlclJvd3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICRwYXJlbnQgPSAkKCcjZGlzcGxheS1zeW1ib2xzLWNhcmQnKTtcclxuICAgICAgICB2YXIgJHJvd3MgPSAkcGFyZW50LnJlbW92ZSgnW2RhdGEtc3ltYm9scy1yb3ddJyk7XHJcbiAgICAgICAgdGhpcy5zeW1ib2xzRm9ybUFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGVsZW1lbnQuZ2V0SW5kZXgoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gXCJbZGF0YS1zeW1ib2xzLXJvdz1cXFwiXCIgKyBpbmRleCArIFwiXFxcIl1cIjtcclxuICAgICAgICAgICAgdmFyICRlbCA9ICQoc2VsZWN0b3IsICRyb3dzKTtcclxuICAgICAgICAgICAgJHBhcmVudC5hcHBlbmQoJGVsKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBEaXNwbGF5U3ltYm9sc0NvbW1hbmRzRm9ybUFjY2Vzc29yLnByb3RvdHlwZS5zb3J0Q29tcG91bmQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIGlmIChhID4gYilcclxuICAgICAgICAgICAgcmV0dXJuICsxO1xyXG4gICAgICAgIGlmIChhIDwgYilcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfTtcclxuICAgIERpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmF0dGFjaEFkZFJhY2VyQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI2FkZFN5bWJvbHNSb3cnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ2FkZFN5bWJvbHNSb3c6Y2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIG1lLmFkZFJhY2VyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgRGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUuYWRkUmFjZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29yID0gdGhpcy5zeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeS5jcmVhdGUodGhpcy5yb3dDb3VudCsrKTtcclxuICAgICAgICB0aGlzLnN5bWJvbHNGb3JtQWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpO1xyXG4gICAgfTtcclxuICAgIERpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmF0dGFjaFN1Ym1pdEJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNkaXNwbGF5U3ltYm9scycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnZGlzcGxheVN5bWJvbHM6Y2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgdXNlcklkOiBtZS51c2VySWQsXHJcbiAgICAgICAgICAgICAgICBjaGFubmVsSWQ6IG1lLmNoYW5uZWxJZCxcclxuICAgICAgICAgICAgICAgIGd1aWxkSWQ6IG1lLmd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICBzeW1ib2xzOiBuZXcgQXJyYXkoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBtZS5zeW1ib2xzRm9ybUFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuc3ltYm9scy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICByYWNlcjogcm93LnJhY2VyLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHJvdy50eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkdmFudGFnZXM6IHJvdy5hZHZhbnRhZ2VzLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3Nlczogcm93LnN1Y2Nlc3NlcyxcclxuICAgICAgICAgICAgICAgICAgICB0cml1bXBoczogcm93LnRyaXVtcGhzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRocmVhdHM6IHJvdy50aHJlYXRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGZhaWx1cmVzOiByb3cuZmFpbHVyZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzcGFpcnM6IHJvdy5kZXNwYWlyc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NvbW1hbmRzL2Rpc3BsYXktc3ltYm9scycsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ2Rpc3BsYXlTeW1ib2xzOnBvc3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLmluZm8obXNnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcInN5bWJvbHNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2xzRm9ybUFjY2Vzc29ycztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ05vdFN1cHBvcnRlZEV4Y2VwdGlvbic7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gRGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3NvcjtcclxufShCYXNlQ29tbWFuZHNBY2Nlc3NvcikpO1xyXG52YXIgU3ltYm9sc0Zvcm1BY2Nlc3NvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFN5bWJvbHNGb3JtQWNjZXNzb3IoaW5kZXgsIGxvZ2dlcikge1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcclxuICAgIH1cclxuICAgIFN5bWJvbHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkRGVmYXVsdHMoKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFJlbW92ZUJ1dHRvbigpO1xyXG4gICAgfTtcclxuICAgIFN5bWJvbHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmdldEluZGV4ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4O1xyXG4gICAgfTtcclxuICAgIFN5bWJvbHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmF0dGFjaFJlbW92ZUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoXCJbZGF0YS1pbmRleD1cXFwiXCIgKyBtZS5pbmRleCArIFwiXFxcIl1cIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKFwiW2RhdGEtc3ltYm9scy1yb3c9XFxcIlwiICsgbWUuaW5kZXggKyBcIlxcXCJdXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFN5bWJvbHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmxvYWREZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSAnTlBDJztcclxuICAgICAgICB0aGlzLmFkdmFudGFnZXMgPSAwO1xyXG4gICAgICAgIHRoaXMuc3VjY2Vzc2VzID0gMDtcclxuICAgICAgICB0aGlzLnRyaXVtcGhzID0gMDtcclxuICAgICAgICB0aGlzLnRocmVhdHMgPSAwO1xyXG4gICAgICAgIHRoaXMuZmFpbHVyZXMgPSAwO1xyXG4gICAgICAgIHRoaXMuZGVzcGFpcnMgPSAwO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTeW1ib2xzRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJyYWNlclwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3JhY2VyLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyByYWNlciB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3JhY2VyLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN5bWJvbHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcInR5cGVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN0eXBlLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0eXBlIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjdHlwZS1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTeW1ib2xzRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJhZHZhbnRhZ2VzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjYWR2YW50YWdlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgYWR2YW50YWdlcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2FkdmFudGFnZXMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ltYm9sc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwic3VjY2Vzc2VzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjc3VjY2Vzc2VzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBzdWNjZXNzZXMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNzdWNjZXNzZXMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ltYm9sc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwidHJpdW1waHNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN0cml1bXBocy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgdHJpdW1waHMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiN0cml1bXBocy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTeW1ib2xzRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJ0aHJlYXRzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjdGhyZWF0cy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgdGhyZWF0cyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3RocmVhdHMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ltYm9sc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwiZmFpbHVyZXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNmYWlsdXJlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgZmFpbHVyZXMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNmYWlsdXJlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTeW1ib2xzRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJkZXNwYWlyc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2Rlc3BhaXJzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBkZXNwYWlycyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2Rlc3BhaXJzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIFN5bWJvbHNGb3JtQWNjZXNzb3I7XHJcbn0oKSk7XHJcbnZhciBMb2dnZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMb2dnZXIobWluaW11bUxvZ0xldmVsKSB7XHJcbiAgICAgICAgaWYgKG1pbmltdW1Mb2dMZXZlbCA9PT0gdm9pZCAwKSB7IG1pbmltdW1Mb2dMZXZlbCA9IExvZ0xldmVsLnRyYWNlOyB9XHJcbiAgICAgICAgdGhpcy5taW5pbXVtTG9nTGV2ZWwgPSBtaW5pbXVtTG9nTGV2ZWw7XHJcbiAgICAgICAgdGhpcy5sb2dzU2VsZWN0b3IgPSAnI2xvZ3MnO1xyXG4gICAgfVxyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS53YXJuaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbC53YXJuaW5nKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbC5lcnJvcik7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5pbmZvID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbC5pbmZvKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLnRyYWNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbC50cmFjZSk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWwuZGVidWcpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUucHJlcGVuZCA9IGZ1bmN0aW9uICh2YWx1ZSwgbG9nTGV2ZWwpIHtcclxuICAgICAgICBpZiAodGhpcy5taW5pbXVtTG9nTGV2ZWwgPiBsb2dMZXZlbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciAkbGkgPSAkKCc8bGk+Jyk7XHJcbiAgICAgICAgJGxpLmFkZENsYXNzKFwibGV2ZWwtXCIgKyBsb2dMZXZlbCk7XHJcbiAgICAgICAgJGxpLmh0bWwodmFsdWUpO1xyXG4gICAgICAgICRsaS5wcmVwZW5kVG8odGhpcy5sb2dzU2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMb2dnZXI7XHJcbn0oKSk7XHJcbnZhciBMb2dMZXZlbDtcclxuKGZ1bmN0aW9uIChMb2dMZXZlbCkge1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJ0cmFjZVwiXSA9IDBdID0gXCJ0cmFjZVwiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJkZWJ1Z1wiXSA9IDFdID0gXCJkZWJ1Z1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJpbmZvXCJdID0gMl0gPSBcImluZm9cIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wid2FybmluZ1wiXSA9IDNdID0gXCJ3YXJuaW5nXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcImVycm9yXCJdID0gNF0gPSBcImVycm9yXCI7XHJcbn0pKExvZ0xldmVsIHx8IChMb2dMZXZlbCA9IHt9KSk7XHJcbnZhciBsb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XHJcbnZhciBkaXNjb3JkT3B0aW9ucyA9IGNvbmZpZy5kaXNjb3JkO1xyXG52YXIgZm9ybUFjY2Vzc29yID0gbmV3IEJhdGNoQ29tbWFuZHNGb3JtQWNjZXNzb3IoZGlzY29yZE9wdGlvbnMsIGxvZ2dlcik7XHJcbnZhciBzeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeSA9IG5ldyBTeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeShsb2dnZXIpO1xyXG52YXIgZGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3NvciA9IG5ldyBEaXNwbGF5U3ltYm9sc0NvbW1hbmRzRm9ybUFjY2Vzc29yKGRpc2NvcmRPcHRpb25zLCBsb2dnZXIsIHN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5KTtcclxudmFyIGNvbW1hbmRzID0gW2Zvcm1BY2Nlc3NvciwgZGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3Nvcl07XHJcbnZhciBtYWluID0gbmV3IE1haW4oY29tbWFuZHMsIGxvZ2dlcik7XHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgbWFpbi5pbml0aWFsaXplKCk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaXRlLmpzLm1hcCJdfQ==
