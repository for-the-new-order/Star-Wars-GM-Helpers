(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["trace"] = 0] = "trace";
    LogLevel[LogLevel["debug"] = 1] = "debug";
    LogLevel[LogLevel["info"] = 2] = "info";
    LogLevel[LogLevel["warning"] = 3] = "warning";
    LogLevel[LogLevel["error"] = 4] = "error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel_1 = require("./LogLevel");
var Logger = /** @class */ (function () {
    function Logger(x, minimumLogLevel) {
        this.minimumLogLevel = minimumLogLevel;
        this.logsSelector = '#logs';
        this.TName = x.name;
    }
    Logger.prototype.warning = function (value) {
        this.prepend(value, LogLevel_1.LogLevel.warning);
    };
    Logger.prototype.error = function (value) {
        this.prepend(value, LogLevel_1.LogLevel.error);
    };
    Logger.prototype.info = function (value) {
        this.prepend(value, LogLevel_1.LogLevel.info);
    };
    Logger.prototype.trace = function (value) {
        this.prepend(value, LogLevel_1.LogLevel.trace);
    };
    Logger.prototype.debug = function (value) {
        this.prepend(value, LogLevel_1.LogLevel.debug);
    };
    Logger.prototype.prepend = function (value, logLevel) {
        if (this.minimumLogLevel > logLevel) {
            return;
        }
        var $row = $('<div class="row">');
        var $col1 = $('<div class="col-3">');
        var $col2 = $('<div class="col-9">');
        $row.addClass("level-" + logLevel);
        $col1.html(this.TName);
        $col2.html(value);
        $col1.appendTo($row);
        $col2.appendTo($row);
        $row.prependTo(this.logsSelector);
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

},{"./LogLevel":1}],3:[function(require,module,exports){
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

},{"./LogLevel":1,"./Logger":2}],4:[function(require,module,exports){
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
var LoggerFactory_1 = require("./Logging/LoggerFactory");
var Main = /** @class */ (function () {
    function Main(commands, loggerFactory) {
        this.commands = commands;
        this.logger = loggerFactory.create(Main);
    }
    Main.prototype.initialize = function () {
        var _this = this;
        this.logger.trace('Main initializing');
        var currentCommand = $('body').attr('data-command-identifier');
        this.commands.forEach(function (command) {
            if (currentCommand === command.identifier) {
                _this.logger.debug("Current command: " + command.identifier);
                command.initialize();
            }
            else {
                _this.logger.debug("Skip initialization of command: " + command.identifier);
            }
        });
        this.logger.trace('Main initialized');
    };
    return Main;
}());
var BaseCommand = /** @class */ (function () {
    function BaseCommand(logger) {
        this.logger = logger;
    }
    Object.defineProperty(BaseCommand.prototype, "identifier", {
        get: function () {
            return this.logger.TypeName;
        },
        enumerable: true,
        configurable: true
    });
    return BaseCommand;
}());
var DiscordAccessor = /** @class */ (function () {
    function DiscordAccessor(logger) {
        this.logger = logger;
    }
    Object.defineProperty(DiscordAccessor.prototype, "userId", {
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
    Object.defineProperty(DiscordAccessor.prototype, "channelId", {
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
    Object.defineProperty(DiscordAccessor.prototype, "guildId", {
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
    return DiscordAccessor;
}());
var BatchCommand = /** @class */ (function (_super) {
    __extends(BatchCommand, _super);
    function BatchCommand(loggerFactory, discordInfo) {
        var _this = _super.call(this, loggerFactory.create(BatchCommand)) || this;
        _this.discordInfo = discordInfo;
        _this.chatCommandsSelector = '#chatCommands';
        return _this;
    }
    BatchCommand.prototype.initialize = function () {
        this.logger.trace('BatchCommand loading');
        var me = this;
        $('#submitMessages').on('click', function (e) {
            me.logger.trace('BatchCommand:clicked');
            e.preventDefault();
            $.ajax({
                url: '/commands/batch',
                method: 'POST',
                data: {
                    userId: me.discordInfo.userId,
                    channelId: me.discordInfo.channelId,
                    guildId: me.discordInfo.guildId,
                    chatCommands: me.chatCommands
                }
            }).done(function (msg) {
                me.logger.trace('BatchCommand:posted');
                me.logger.info(msg);
            });
        });
        this.logger.trace('BatchCommand loaded');
    };
    Object.defineProperty(BatchCommand.prototype, "chatCommands", {
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
    return BatchCommand;
}(BaseCommand));
var RacerFormFactory = /** @class */ (function () {
    function RacerFormFactory(loggerFactory) {
        this.loggerFactory = loggerFactory;
        this.logger = loggerFactory.create(RacerFormFactory);
    }
    RacerFormFactory.prototype.create = function (index) {
        var accessor = new RacerFormAccessor(index, this.loggerFactory);
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
        });
        return accessor;
    };
    RacerFormFactory.prototype.attach = function () {
        var accessors = new Array();
        var me = this;
        $('[data-symbols-row]').each(function () {
            var $row = $(this);
            var index = parseInt($row.attr('data-symbols-row'));
            me.logger.trace("SymbolsFormAccessorFactory:attaching:" + index);
            var accessor = new RacerFormAccessor(index, me.loggerFactory);
            accessors.push(accessor);
        });
        return accessors;
    };
    return RacerFormFactory;
}());
var RacerCommand = /** @class */ (function (_super) {
    __extends(RacerCommand, _super);
    function RacerCommand(loggerFactory, symbolsFormAccessorFactory, discordInfo) {
        var _this = _super.call(this, loggerFactory.create(RacerCommand)) || this;
        _this.symbolsFormAccessorFactory = symbolsFormAccessorFactory;
        _this.discordInfo = discordInfo;
        _this.racerFormAccessors = new Array();
        _this.rowCount = 0;
        return _this;
    }
    RacerCommand.prototype.initialize = function () {
        this.logger.trace('RacerCommand loading');
        this.attachSubmitButton();
        this.attachAddRacerButton();
        this.attachSortInitButton();
        this.attachSortRaceButton();
        this.attachResolveNegativesSymbols();
        this.attachRemoveRowButtons();
        this.attachExistingRacer();
        this.logger.trace('RacerCommand loaded');
    };
    RacerCommand.prototype.attachRemoveRowButtons = function () {
        $(document).on('click', '[data-index]', function () {
            var index = $(this).attr('data-index');
            $("[data-symbols-row=\"" + index + "\"]").remove();
        });
    };
    RacerCommand.prototype.attachResolveNegativesSymbols = function () {
        var me = this;
        $('#resolveNegativesSymbols').on('click', function (e) {
            me.logger.trace('resolveNegativesSymbols:clicked');
            e.preventDefault();
            me.racerFormAccessors.forEach(function (accessor) {
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
    RacerCommand.prototype.attachSortRaceButton = function () {
        var me = this;
        $('#sortRace').on('click', function (e) {
            me.logger.trace('sortRace:clicked');
            e.preventDefault();
            me.racerFormAccessors = me.racerFormAccessors
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
    RacerCommand.prototype.attachSortInitButton = function () {
        var me = this;
        $('#sortInit').on('click', function (e) {
            me.logger.trace('sortInit:clicked');
            e.preventDefault();
            me.racerFormAccessors = me.racerFormAccessors
                .sort(function (a, b) {
                return me.sortCompound(a.successes, b.successes) ||
                    me.sortCompound(a.advantages, b.advantages) ||
                    me.sortCompound(a.triumphs, b.triumphs);
            })
                .reverse();
            me.reorderRows();
        });
    };
    RacerCommand.prototype.reorderRows = function () {
        var $parent = $('#display-symbols-card');
        var $rows = $parent.remove('[data-symbols-row]');
        this.racerFormAccessors.forEach(function (element) {
            var index = element.getIndex();
            var selector = "[data-symbols-row=\"" + index + "\"]";
            var $el = $(selector, $rows);
            $parent.append($el);
        });
    };
    RacerCommand.prototype.sortCompound = function (a, b) {
        if (a > b)
            return +1;
        if (a < b)
            return -1;
        return 0;
    };
    RacerCommand.prototype.attachAddRacerButton = function () {
        var me = this;
        $('#addSymbolsRow').on('click', function (e) {
            me.logger.trace('addRacer:clicked');
            e.preventDefault();
            me.addRacer();
        });
    };
    RacerCommand.prototype.attachExistingRacer = function () {
        var _this = this;
        var accessors = this.symbolsFormAccessorFactory.attach();
        accessors.forEach(function (accessor) { return _this.racerFormAccessors.push(accessor); });
        this.rowCount = accessors.length;
    };
    RacerCommand.prototype.addRacer = function () {
        var accessor = this.symbolsFormAccessorFactory.create(this.rowCount++);
        this.racerFormAccessors.push(accessor);
    };
    RacerCommand.prototype.attachSubmitButton = function () {
        var me = this;
        $('#displaySymbols').on('click', function (e) {
            me.logger.trace('displaySymbols:clicked');
            e.preventDefault();
            var data = {
                userId: me.discordInfo.userId,
                channelId: me.discordInfo.channelId,
                guildId: me.discordInfo.guildId,
                symbols: new Array()
            };
            me.racerFormAccessors.forEach(function (row) {
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
    Object.defineProperty(RacerCommand.prototype, "symbols", {
        get: function () {
            return this.racerFormAccessors;
        },
        set: function (v) {
            throw 'NotSupportedException';
        },
        enumerable: true,
        configurable: true
    });
    return RacerCommand;
}(BaseCommand));
var RacerFormAccessor = /** @class */ (function () {
    function RacerFormAccessor(index, loggerFactory) {
        this.index = index;
        this.logger = loggerFactory.create(RacerFormAccessor);
    }
    RacerFormAccessor.prototype.getIndex = function () {
        return this.index;
    };
    Object.defineProperty(RacerFormAccessor.prototype, "racer", {
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
    Object.defineProperty(RacerFormAccessor.prototype, "type", {
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
    Object.defineProperty(RacerFormAccessor.prototype, "advantages", {
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
    Object.defineProperty(RacerFormAccessor.prototype, "successes", {
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
    Object.defineProperty(RacerFormAccessor.prototype, "triumphs", {
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
    Object.defineProperty(RacerFormAccessor.prototype, "threats", {
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
    Object.defineProperty(RacerFormAccessor.prototype, "failures", {
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
    Object.defineProperty(RacerFormAccessor.prototype, "despairs", {
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
    return RacerFormAccessor;
}());
//
// Composition root
//
var loggerFactory = new LoggerFactory_1.LoggerFactory();
var discordInfo = new DiscordAccessor(loggerFactory.create(DiscordAccessor));
var formAccessor = new BatchCommand(loggerFactory, discordInfo);
var symbolsFormAccessorFactory = new RacerFormFactory(loggerFactory);
var displaySymbolsCommandsFormAccessor = new RacerCommand(loggerFactory, symbolsFormAccessorFactory, discordInfo);
var commands = [formAccessor, displaySymbolsCommandsFormAccessor];
var main = new Main(commands, loggerFactory);
$(function () {
    main.initialize();
});

},{"./Logging/LoggerFactory":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTG9nZ2luZy9Mb2dMZXZlbC5qcyIsInNyYy9Mb2dnaW5nL0xvZ2dlci5qcyIsInNyYy9Mb2dnaW5nL0xvZ2dlckZhY3RvcnkuanMiLCJzcmMvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nTGV2ZWw7XHJcbihmdW5jdGlvbiAoTG9nTGV2ZWwpIHtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1widHJhY2VcIl0gPSAwXSA9IFwidHJhY2VcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiZGVidWdcIl0gPSAxXSA9IFwiZGVidWdcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiaW5mb1wiXSA9IDJdID0gXCJpbmZvXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIndhcm5pbmdcIl0gPSAzXSA9IFwid2FybmluZ1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJlcnJvclwiXSA9IDRdID0gXCJlcnJvclwiO1xyXG59KShMb2dMZXZlbCA9IGV4cG9ydHMuTG9nTGV2ZWwgfHwgKGV4cG9ydHMuTG9nTGV2ZWwgPSB7fSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Mb2dMZXZlbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nTGV2ZWxfMSA9IHJlcXVpcmUoXCIuL0xvZ0xldmVsXCIpO1xyXG52YXIgTG9nZ2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTG9nZ2VyKHgsIG1pbmltdW1Mb2dMZXZlbCkge1xyXG4gICAgICAgIHRoaXMubWluaW11bUxvZ0xldmVsID0gbWluaW11bUxvZ0xldmVsO1xyXG4gICAgICAgIHRoaXMubG9nc1NlbGVjdG9yID0gJyNsb2dzJztcclxuICAgICAgICB0aGlzLlROYW1lID0geC5uYW1lO1xyXG4gICAgfVxyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS53YXJuaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLndhcm5pbmcpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsXzEuTG9nTGV2ZWwuZXJyb3IpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWxfMS5Mb2dMZXZlbC5pbmZvKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLnRyYWNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLnRyYWNlKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLmRlYnVnKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLnByZXBlbmQgPSBmdW5jdGlvbiAodmFsdWUsIGxvZ0xldmVsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubWluaW11bUxvZ0xldmVsID4gbG9nTGV2ZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJHJvdyA9ICQoJzxkaXYgY2xhc3M9XCJyb3dcIj4nKTtcclxuICAgICAgICB2YXIgJGNvbDEgPSAkKCc8ZGl2IGNsYXNzPVwiY29sLTNcIj4nKTtcclxuICAgICAgICB2YXIgJGNvbDIgPSAkKCc8ZGl2IGNsYXNzPVwiY29sLTlcIj4nKTtcclxuICAgICAgICAkcm93LmFkZENsYXNzKFwibGV2ZWwtXCIgKyBsb2dMZXZlbCk7XHJcbiAgICAgICAgJGNvbDEuaHRtbCh0aGlzLlROYW1lKTtcclxuICAgICAgICAkY29sMi5odG1sKHZhbHVlKTtcclxuICAgICAgICAkY29sMS5hcHBlbmRUbygkcm93KTtcclxuICAgICAgICAkY29sMi5hcHBlbmRUbygkcm93KTtcclxuICAgICAgICAkcm93LnByZXBlbmRUbyh0aGlzLmxvZ3NTZWxlY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KExvZ2dlci5wcm90b3R5cGUsIFwiVHlwZU5hbWVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UTmFtZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBMb2dnZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTG9nZ2VyID0gTG9nZ2VyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Mb2dnZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIExvZ0xldmVsXzEgPSByZXF1aXJlKFwiLi9Mb2dMZXZlbFwiKTtcclxudmFyIExvZ2dlcl8xID0gcmVxdWlyZShcIi4vTG9nZ2VyXCIpO1xyXG52YXIgTG9nZ2VyRmFjdG9yeSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExvZ2dlckZhY3RvcnkoKSB7XHJcbiAgICB9XHJcbiAgICBMb2dnZXJGYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoeCwgbWluaW11bUxvZ0xldmVsKSB7XHJcbiAgICAgICAgaWYgKG1pbmltdW1Mb2dMZXZlbCA9PT0gdm9pZCAwKSB7IG1pbmltdW1Mb2dMZXZlbCA9IExvZ0xldmVsXzEuTG9nTGV2ZWwudHJhY2U7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExvZ2dlcl8xLkxvZ2dlcih4LCBtaW5pbXVtTG9nTGV2ZWwpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMb2dnZXJGYWN0b3J5O1xyXG59KCkpO1xyXG5leHBvcnRzLkxvZ2dlckZhY3RvcnkgPSBMb2dnZXJGYWN0b3J5O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Mb2dnZXJGYWN0b3J5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nZ2VyRmFjdG9yeV8xID0gcmVxdWlyZShcIi4vTG9nZ2luZy9Mb2dnZXJGYWN0b3J5XCIpO1xyXG52YXIgTWFpbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIE1haW4oY29tbWFuZHMsIGxvZ2dlckZhY3RvcnkpIHtcclxuICAgICAgICB0aGlzLmNvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJGYWN0b3J5LmNyZWF0ZShNYWluKTtcclxuICAgIH1cclxuICAgIE1haW4ucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnTWFpbiBpbml0aWFsaXppbmcnKTtcclxuICAgICAgICB2YXIgY3VycmVudENvbW1hbmQgPSAkKCdib2R5JykuYXR0cignZGF0YS1jb21tYW5kLWlkZW50aWZpZXInKTtcclxuICAgICAgICB0aGlzLmNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDb21tYW5kID09PSBjb21tYW5kLmlkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmxvZ2dlci5kZWJ1ZyhcIkN1cnJlbnQgY29tbWFuZDogXCIgKyBjb21tYW5kLmlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5sb2dnZXIuZGVidWcoXCJTa2lwIGluaXRpYWxpemF0aW9uIG9mIGNvbW1hbmQ6IFwiICsgY29tbWFuZC5pZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdNYWluIGluaXRpYWxpemVkJyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE1haW47XHJcbn0oKSk7XHJcbnZhciBCYXNlQ29tbWFuZCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEJhc2VDb21tYW5kKGxvZ2dlcikge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhc2VDb21tYW5kLnByb3RvdHlwZSwgXCJpZGVudGlmaWVyXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9nZ2VyLlR5cGVOYW1lO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEJhc2VDb21tYW5kO1xyXG59KCkpO1xyXG52YXIgRGlzY29yZEFjY2Vzc29yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRGlzY29yZEFjY2Vzc29yKGxvZ2dlcikge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERpc2NvcmRBY2Nlc3Nvci5wcm90b3R5cGUsIFwidXNlcklkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoJyNkaXNjb3JkVXNlcklkJykudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB1c2VySWQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJCgnI2Rpc2NvcmRVc2VySWQnKS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGlzY29yZEFjY2Vzc29yLnByb3RvdHlwZSwgXCJjaGFubmVsSWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCgnI2Rpc2NvcmRDaGFubmVsSWQnKS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGNoYW5uZWxJZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKCcjZGlzY29yZENoYW5uZWxJZCcpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEaXNjb3JkQWNjZXNzb3IucHJvdG90eXBlLCBcImd1aWxkSWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCgnI2Rpc2NvcmRHdWlsZElkJykudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBkaXNjb3JkR3VpbGRJZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKCcjZGlzY29yZEd1aWxkSWQnKS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gRGlzY29yZEFjY2Vzc29yO1xyXG59KCkpO1xyXG52YXIgQmF0Y2hDb21tYW5kID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEJhdGNoQ29tbWFuZCwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEJhdGNoQ29tbWFuZChsb2dnZXJGYWN0b3J5LCBkaXNjb3JkSW5mbykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGxvZ2dlckZhY3RvcnkuY3JlYXRlKEJhdGNoQ29tbWFuZCkpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuZGlzY29yZEluZm8gPSBkaXNjb3JkSW5mbztcclxuICAgICAgICBfdGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvciA9ICcjY2hhdENvbW1hbmRzJztcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBCYXRjaENvbW1hbmQucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0JhdGNoQ29tbWFuZCBsb2FkaW5nJyk7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjc3VibWl0TWVzc2FnZXMnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ0JhdGNoQ29tbWFuZDpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jb21tYW5kcy9iYXRjaCcsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IG1lLmRpc2NvcmRJbmZvLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsSWQ6IG1lLmRpc2NvcmRJbmZvLmNoYW5uZWxJZCxcclxuICAgICAgICAgICAgICAgICAgICBndWlsZElkOiBtZS5kaXNjb3JkSW5mby5ndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXRDb21tYW5kczogbWUuY2hhdENvbW1hbmRzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdCYXRjaENvbW1hbmQ6cG9zdGVkJyk7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIuaW5mbyhtc2cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnQmF0Y2hDb21tYW5kIGxvYWRlZCcpO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCYXRjaENvbW1hbmQucHJvdG90eXBlLCBcImNoYXRDb21tYW5kc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByYXcgPSAkKHRoaXMuY2hhdENvbW1hbmRzU2VsZWN0b3IpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgY29tbWFuZHMgPSByYXcucmVwbGFjZSgnXFxyJywgJycpLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmRzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY2hhdENvbW1hbmRzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHYuam9pbignXFxuJyk7XHJcbiAgICAgICAgICAgICQodGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvcikudmFsKGNvbW1hbmRzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBCYXRjaENvbW1hbmQ7XHJcbn0oQmFzZUNvbW1hbmQpKTtcclxudmFyIFJhY2VyRm9ybUZhY3RvcnkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBSYWNlckZvcm1GYWN0b3J5KGxvZ2dlckZhY3RvcnkpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlckZhY3RvcnkgPSBsb2dnZXJGYWN0b3J5O1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyRmFjdG9yeS5jcmVhdGUoUmFjZXJGb3JtRmFjdG9yeSk7XHJcbiAgICB9XHJcbiAgICBSYWNlckZvcm1GYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICB2YXIgYWNjZXNzb3IgPSBuZXcgUmFjZXJGb3JtQWNjZXNzb3IoaW5kZXgsIHRoaXMubG9nZ2VyRmFjdG9yeSk7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICBtZS5sb2dnZXIudHJhY2UoXCJTeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeTpsb2FkaW5nOlwiICsgaW5kZXgpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogJy9wYXJ0aWFscy9pbmRleC1kaXNwbGF5LXN5bWJvbHMtZm9ybScsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHsgaW5kZXg6IGluZGV4IH1cclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZShcIlN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5OmxvYWRlZDpcIiArIGluZGV4KTtcclxuICAgICAgICAgICAgdmFyICRwYXJlbnQgPSAkKCcjZGlzcGxheS1zeW1ib2xzLWNhcmQnKTtcclxuICAgICAgICAgICAgdmFyICRyb3cgPSAkKGRhdGEpO1xyXG4gICAgICAgICAgICAkcGFyZW50LmFwcGVuZCgkcm93KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gYWNjZXNzb3I7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJGb3JtRmFjdG9yeS5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhY2Nlc3NvcnMgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJ1tkYXRhLXN5bWJvbHMtcm93XScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCRyb3cuYXR0cignZGF0YS1zeW1ib2xzLXJvdycpKTtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKFwiU3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3Rvcnk6YXR0YWNoaW5nOlwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgYWNjZXNzb3IgPSBuZXcgUmFjZXJGb3JtQWNjZXNzb3IoaW5kZXgsIG1lLmxvZ2dlckZhY3RvcnkpO1xyXG4gICAgICAgICAgICBhY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGFjY2Vzc29ycztcclxuICAgIH07XHJcbiAgICByZXR1cm4gUmFjZXJGb3JtRmFjdG9yeTtcclxufSgpKTtcclxudmFyIFJhY2VyQ29tbWFuZCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhSYWNlckNvbW1hbmQsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBSYWNlckNvbW1hbmQobG9nZ2VyRmFjdG9yeSwgc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnksIGRpc2NvcmRJbmZvKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbG9nZ2VyRmFjdG9yeS5jcmVhdGUoUmFjZXJDb21tYW5kKSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5zeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeSA9IHN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5O1xyXG4gICAgICAgIF90aGlzLmRpc2NvcmRJbmZvID0gZGlzY29yZEluZm87XHJcbiAgICAgICAgX3RoaXMucmFjZXJGb3JtQWNjZXNzb3JzID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgX3RoaXMucm93Q291bnQgPSAwO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnUmFjZXJDb21tYW5kIGxvYWRpbmcnKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFN1Ym1pdEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoQWRkUmFjZXJCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFNvcnRJbml0QnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hTb3J0UmFjZUJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoUmVzb2x2ZU5lZ2F0aXZlc1N5bWJvbHMoKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFJlbW92ZVJvd0J1dHRvbnMoKTtcclxuICAgICAgICB0aGlzLmF0dGFjaEV4aXN0aW5nUmFjZXIoKTtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnUmFjZXJDb21tYW5kIGxvYWRlZCcpO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoUmVtb3ZlUm93QnV0dG9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtaW5kZXhdJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5kZXgnKTtcclxuICAgICAgICAgICAgJChcIltkYXRhLXN5bWJvbHMtcm93PVxcXCJcIiArIGluZGV4ICsgXCJcXFwiXVwiKS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFJlc29sdmVOZWdhdGl2ZXNTeW1ib2xzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3Jlc29sdmVOZWdhdGl2ZXNTeW1ib2xzJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdyZXNvbHZlTmVnYXRpdmVzU3ltYm9sczpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzLmZvckVhY2goZnVuY3Rpb24gKGFjY2Vzc29yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2Vzc2VzID0gYWNjZXNzb3Iuc3VjY2Vzc2VzIC0gYWNjZXNzb3IuZmFpbHVyZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWR2YW50YWdlcyA9IGFjY2Vzc29yLmFkdmFudGFnZXMgLSBhY2Nlc3Nvci50aHJlYXRzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZhaWx1cmVzID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciB0aHJlYXRzID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzZXMgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFpbHVyZXMgPSAtc3VjY2Vzc2VzO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NlcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYWR2YW50YWdlcyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJlYXRzID0gLWFkdmFudGFnZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgYWR2YW50YWdlcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3Nvci5zdWNjZXNzZXMgPSBzdWNjZXNzZXM7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3Nvci5mYWlsdXJlcyA9IGZhaWx1cmVzO1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzb3IuYWR2YW50YWdlcyA9IGFkdmFudGFnZXM7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3Nvci50aHJlYXRzID0gdGhyZWF0cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hTb3J0UmFjZUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNzb3J0UmFjZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnc29ydFJhY2U6Y2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIG1lLnJhY2VyRm9ybUFjY2Vzc29ycyA9IG1lLnJhY2VyRm9ybUFjY2Vzc29yc1xyXG4gICAgICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZS5zb3J0Q29tcG91bmQoYS5zdWNjZXNzZXMgLSBhLmZhaWx1cmVzLCBiLnN1Y2Nlc3NlcyAtIGIuZmFpbHVyZXMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEuYWR2YW50YWdlcyAtIGEudGhyZWF0cywgYi5hZHZhbnRhZ2VzIC0gYi50aHJlYXRzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIG1lLnNvcnRDb21wb3VuZChhLnRyaXVtcGhzLCBiLnRyaXVtcGhzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIG1lLnNvcnRDb21wb3VuZChiLmRlc3BhaXJzLCBhLmRlc3BhaXJzKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIG1lLnJlb3JkZXJSb3dzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hTb3J0SW5pdEJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNzb3J0SW5pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnc29ydEluaXQ6Y2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIG1lLnJhY2VyRm9ybUFjY2Vzc29ycyA9IG1lLnJhY2VyRm9ybUFjY2Vzc29yc1xyXG4gICAgICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZS5zb3J0Q29tcG91bmQoYS5zdWNjZXNzZXMsIGIuc3VjY2Vzc2VzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIG1lLnNvcnRDb21wb3VuZChhLmFkdmFudGFnZXMsIGIuYWR2YW50YWdlcykgfHxcclxuICAgICAgICAgICAgICAgICAgICBtZS5zb3J0Q29tcG91bmQoYS50cml1bXBocywgYi50cml1bXBocyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICBtZS5yZW9yZGVyUm93cygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUucmVvcmRlclJvd3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICRwYXJlbnQgPSAkKCcjZGlzcGxheS1zeW1ib2xzLWNhcmQnKTtcclxuICAgICAgICB2YXIgJHJvd3MgPSAkcGFyZW50LnJlbW92ZSgnW2RhdGEtc3ltYm9scy1yb3ddJyk7XHJcbiAgICAgICAgdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBlbGVtZW50LmdldEluZGV4KCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IFwiW2RhdGEtc3ltYm9scy1yb3c9XFxcIlwiICsgaW5kZXggKyBcIlxcXCJdXCI7XHJcbiAgICAgICAgICAgIHZhciAkZWwgPSAkKHNlbGVjdG9yLCAkcm93cyk7XHJcbiAgICAgICAgICAgICRwYXJlbnQuYXBwZW5kKCRlbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5zb3J0Q29tcG91bmQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIGlmIChhID4gYilcclxuICAgICAgICAgICAgcmV0dXJuICsxO1xyXG4gICAgICAgIGlmIChhIDwgYilcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoQWRkUmFjZXJCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjYWRkU3ltYm9sc1JvdycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnYWRkUmFjZXI6Y2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIG1lLmFkZFJhY2VyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hFeGlzdGluZ1JhY2VyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29ycyA9IHRoaXMuc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnkuYXR0YWNoKCk7XHJcbiAgICAgICAgYWNjZXNzb3JzLmZvckVhY2goZnVuY3Rpb24gKGFjY2Vzc29yKSB7IHJldHVybiBfdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7IH0pO1xyXG4gICAgICAgIHRoaXMucm93Q291bnQgPSBhY2Nlc3NvcnMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYWRkUmFjZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29yID0gdGhpcy5zeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeS5jcmVhdGUodGhpcy5yb3dDb3VudCsrKTtcclxuICAgICAgICB0aGlzLnJhY2VyRm9ybUFjY2Vzc29ycy5wdXNoKGFjY2Vzc29yKTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFN1Ym1pdEJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNkaXNwbGF5U3ltYm9scycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnZGlzcGxheVN5bWJvbHM6Y2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgdXNlcklkOiBtZS5kaXNjb3JkSW5mby51c2VySWQsXHJcbiAgICAgICAgICAgICAgICBjaGFubmVsSWQ6IG1lLmRpc2NvcmRJbmZvLmNoYW5uZWxJZCxcclxuICAgICAgICAgICAgICAgIGd1aWxkSWQ6IG1lLmRpc2NvcmRJbmZvLmd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICBzeW1ib2xzOiBuZXcgQXJyYXkoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBtZS5yYWNlckZvcm1BY2Nlc3NvcnMuZm9yRWFjaChmdW5jdGlvbiAocm93KSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLnN5bWJvbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFjZXI6IHJvdy5yYWNlcixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiByb3cudHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBhZHZhbnRhZ2VzOiByb3cuYWR2YW50YWdlcyxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzZXM6IHJvdy5zdWNjZXNzZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJpdW1waHM6IHJvdy50cml1bXBocyxcclxuICAgICAgICAgICAgICAgICAgICB0aHJlYXRzOiByb3cudGhyZWF0cyxcclxuICAgICAgICAgICAgICAgICAgICBmYWlsdXJlczogcm93LmZhaWx1cmVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3BhaXJzOiByb3cuZGVzcGFpcnNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jb21tYW5kcy9kaXNwbGF5LXN5bWJvbHMnLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdkaXNwbGF5U3ltYm9sczpwb3N0ZWQnKTtcclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci5pbmZvKG1zZyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlckNvbW1hbmQucHJvdG90eXBlLCBcInN5bWJvbHNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRocm93ICdOb3RTdXBwb3J0ZWRFeGNlcHRpb24nO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIFJhY2VyQ29tbWFuZDtcclxufShCYXNlQ29tbWFuZCkpO1xyXG52YXIgUmFjZXJGb3JtQWNjZXNzb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBSYWNlckZvcm1BY2Nlc3NvcihpbmRleCwgbG9nZ2VyRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlckZhY3RvcnkuY3JlYXRlKFJhY2VyRm9ybUFjY2Vzc29yKTtcclxuICAgIH1cclxuICAgIFJhY2VyRm9ybUFjY2Vzc29yLnByb3RvdHlwZS5nZXRJbmRleCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleDtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcInJhY2VyXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjcmFjZXItXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHJhY2VyIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjcmFjZXItXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcInR5cGVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN0eXBlLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0eXBlIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjdHlwZS1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlckZvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwiYWR2YW50YWdlc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2FkdmFudGFnZXMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGFkdmFudGFnZXMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNhZHZhbnRhZ2VzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJzdWNjZXNzZXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNzdWNjZXNzZXMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHN1Y2Nlc3NlcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3N1Y2Nlc3Nlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlckZvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwidHJpdW1waHNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN0cml1bXBocy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgdHJpdW1waHMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiN0cml1bXBocy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlckZvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwidGhyZWF0c1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RocmVhdHMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHRocmVhdHMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiN0aHJlYXRzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJmYWlsdXJlc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2ZhaWx1cmVzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBmYWlsdXJlcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2ZhaWx1cmVzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJkZXNwYWlyc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2Rlc3BhaXJzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBkZXNwYWlycyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2Rlc3BhaXJzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIFJhY2VyRm9ybUFjY2Vzc29yO1xyXG59KCkpO1xyXG4vL1xyXG4vLyBDb21wb3NpdGlvbiByb290XHJcbi8vXHJcbnZhciBsb2dnZXJGYWN0b3J5ID0gbmV3IExvZ2dlckZhY3RvcnlfMS5Mb2dnZXJGYWN0b3J5KCk7XHJcbnZhciBkaXNjb3JkSW5mbyA9IG5ldyBEaXNjb3JkQWNjZXNzb3IobG9nZ2VyRmFjdG9yeS5jcmVhdGUoRGlzY29yZEFjY2Vzc29yKSk7XHJcbnZhciBmb3JtQWNjZXNzb3IgPSBuZXcgQmF0Y2hDb21tYW5kKGxvZ2dlckZhY3RvcnksIGRpc2NvcmRJbmZvKTtcclxudmFyIHN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5ID0gbmV3IFJhY2VyRm9ybUZhY3RvcnkobG9nZ2VyRmFjdG9yeSk7XHJcbnZhciBkaXNwbGF5U3ltYm9sc0NvbW1hbmRzRm9ybUFjY2Vzc29yID0gbmV3IFJhY2VyQ29tbWFuZChsb2dnZXJGYWN0b3J5LCBzeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeSwgZGlzY29yZEluZm8pO1xyXG52YXIgY29tbWFuZHMgPSBbZm9ybUFjY2Vzc29yLCBkaXNwbGF5U3ltYm9sc0NvbW1hbmRzRm9ybUFjY2Vzc29yXTtcclxudmFyIG1haW4gPSBuZXcgTWFpbihjb21tYW5kcywgbG9nZ2VyRmFjdG9yeSk7XHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgbWFpbi5pbml0aWFsaXplKCk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jbGllbnQuanMubWFwIl19
