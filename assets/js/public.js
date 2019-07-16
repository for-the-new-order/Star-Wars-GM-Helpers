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
var allConfigs = require('./config.secrets.json');

//var Configuration = require('merge-config');

// const config = new Configuration();
// config.file('config.json');
// config.file('config.secrets.json');

exports.configuration = allConfigs;

},{"./config.secrets.json":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
var config = require('./config').configuration;
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

},{"./Logging/LoggerFactory":3,"./config":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJMb2dnaW5nL0xvZ0xldmVsLmpzIiwiTG9nZ2luZy9Mb2dnZXIuanMiLCJMb2dnaW5nL0xvZ2dlckZhY3RvcnkuanMiLCJjb25maWcuanMiLCJjb25maWcuc2VjcmV0cy5qc29uIiwic2l0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2dMZXZlbDtcclxuKGZ1bmN0aW9uIChMb2dMZXZlbCkge1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJ0cmFjZVwiXSA9IDBdID0gXCJ0cmFjZVwiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJkZWJ1Z1wiXSA9IDFdID0gXCJkZWJ1Z1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJpbmZvXCJdID0gMl0gPSBcImluZm9cIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wid2FybmluZ1wiXSA9IDNdID0gXCJ3YXJuaW5nXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcImVycm9yXCJdID0gNF0gPSBcImVycm9yXCI7XHJcbn0pKExvZ0xldmVsID0gZXhwb3J0cy5Mb2dMZXZlbCB8fCAoZXhwb3J0cy5Mb2dMZXZlbCA9IHt9KSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxvZ0xldmVsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2dMZXZlbF8xID0gcmVxdWlyZShcIi4vTG9nTGV2ZWxcIik7XHJcbnZhciBMb2dnZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMb2dnZXIoeCwgbWluaW11bUxvZ0xldmVsKSB7XHJcbiAgICAgICAgdGhpcy5taW5pbXVtTG9nTGV2ZWwgPSBtaW5pbXVtTG9nTGV2ZWw7XHJcbiAgICAgICAgdGhpcy5sb2dzU2VsZWN0b3IgPSAnI2xvZ3MnO1xyXG4gICAgICAgIHRoaXMuVE5hbWUgPSB4Lm5hbWU7XHJcbiAgICB9XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLndhcm5pbmcgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsXzEuTG9nTGV2ZWwud2FybmluZyk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWxfMS5Mb2dMZXZlbC5lcnJvcik7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5pbmZvID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLmluZm8pO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUudHJhY2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsXzEuTG9nTGV2ZWwudHJhY2UpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsXzEuTG9nTGV2ZWwuZGVidWcpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUucHJlcGVuZCA9IGZ1bmN0aW9uICh2YWx1ZSwgbG9nTGV2ZWwpIHtcclxuICAgICAgICBpZiAodGhpcy5taW5pbXVtTG9nTGV2ZWwgPiBsb2dMZXZlbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciAkcm93ID0gJCgnPGRpdiBjbGFzcz1cInJvd1wiPicpO1xyXG4gICAgICAgIHZhciAkY29sMSA9ICQoJzxkaXYgY2xhc3M9XCJjb2wtM1wiPicpO1xyXG4gICAgICAgIHZhciAkY29sMiA9ICQoJzxkaXYgY2xhc3M9XCJjb2wtOVwiPicpO1xyXG4gICAgICAgICRyb3cuYWRkQ2xhc3MoXCJsZXZlbC1cIiArIGxvZ0xldmVsKTtcclxuICAgICAgICAkY29sMS5odG1sKHRoaXMuVE5hbWUpO1xyXG4gICAgICAgICRjb2wyLmh0bWwodmFsdWUpO1xyXG4gICAgICAgICRjb2wxLmFwcGVuZFRvKCRyb3cpO1xyXG4gICAgICAgICRjb2wyLmFwcGVuZFRvKCRyb3cpO1xyXG4gICAgICAgICRyb3cucHJlcGVuZFRvKHRoaXMubG9nc1NlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTG9nZ2VyLnByb3RvdHlwZSwgXCJUeXBlTmFtZVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlROYW1lO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIExvZ2dlcjtcclxufSgpKTtcclxuZXhwb3J0cy5Mb2dnZXIgPSBMb2dnZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxvZ2dlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nTGV2ZWxfMSA9IHJlcXVpcmUoXCIuL0xvZ0xldmVsXCIpO1xyXG52YXIgTG9nZ2VyXzEgPSByZXF1aXJlKFwiLi9Mb2dnZXJcIik7XHJcbnZhciBMb2dnZXJGYWN0b3J5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTG9nZ2VyRmFjdG9yeSgpIHtcclxuICAgIH1cclxuICAgIExvZ2dlckZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICh4LCBtaW5pbXVtTG9nTGV2ZWwpIHtcclxuICAgICAgICBpZiAobWluaW11bUxvZ0xldmVsID09PSB2b2lkIDApIHsgbWluaW11bUxvZ0xldmVsID0gTG9nTGV2ZWxfMS5Mb2dMZXZlbC50cmFjZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTG9nZ2VyXzEuTG9nZ2VyKHgsIG1pbmltdW1Mb2dMZXZlbCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExvZ2dlckZhY3Rvcnk7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTG9nZ2VyRmFjdG9yeSA9IExvZ2dlckZhY3Rvcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxvZ2dlckZhY3RvcnkuanMubWFwIiwidmFyIGFsbENvbmZpZ3MgPSByZXF1aXJlKCcuL2NvbmZpZy5zZWNyZXRzLmpzb24nKTtcclxuXHJcbi8vdmFyIENvbmZpZ3VyYXRpb24gPSByZXF1aXJlKCdtZXJnZS1jb25maWcnKTtcclxuXHJcbi8vIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWd1cmF0aW9uKCk7XHJcbi8vIGNvbmZpZy5maWxlKCdjb25maWcuanNvbicpO1xyXG4vLyBjb25maWcuZmlsZSgnY29uZmlnLnNlY3JldHMuanNvbicpO1xyXG5cclxuZXhwb3J0cy5jb25maWd1cmF0aW9uID0gYWxsQ29uZmlncztcclxuIiwibW9kdWxlLmV4cG9ydHM9e1xyXG4gICAgXCJhdXRoXCI6IHtcclxuICAgICAgICBcInRva2VuXCI6IFwiTkRjeE9EYzROVFU0TXpNeU1Ea3lOREUyLkRsSGJtdy5ORjFlX1E5bnhBUm9yUmE2bGhYd0ZBZXdQMVlcIlxyXG4gICAgfSxcclxuICAgIFwiZGlzY29yZFwiOiB7XHJcbiAgICAgICAgXCJ1c2VySWRcIjogXCIxMzQwODg5ODM3MTI4OTA4ODBcIixcclxuICAgICAgICBcImNoYW5uZWxJZFwiOiBcIjQ4OTYyODEyNjkwNTg5Mjg2NFwiLFxyXG4gICAgICAgIFwiZ3VpbGRJZFwiOiBcIjI3MzYyODYxMDY5NzM2MzQ1NlwiXHJcbiAgICB9XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2dnZXJGYWN0b3J5XzEgPSByZXF1aXJlKFwiLi9Mb2dnaW5nL0xvZ2dlckZhY3RvcnlcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpLmNvbmZpZ3VyYXRpb247XHJcbnZhciBNYWluID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTWFpbihjb21tYW5kcywgbG9nZ2VyRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMuY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlckZhY3RvcnkuY3JlYXRlKE1haW4pO1xyXG4gICAgfVxyXG4gICAgTWFpbi5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdNYWluIGluaXRpYWxpemluZycpO1xyXG4gICAgICAgIHZhciBjdXJyZW50Q29tbWFuZCA9ICQoJ2JvZHknKS5hdHRyKCdkYXRhLWNvbW1hbmQtaWRlbnRpZmllcicpO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudENvbW1hbmQgPT09IGNvbW1hbmQuaWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMubG9nZ2VyLmRlYnVnKFwiQ3VycmVudCBjb21tYW5kOiBcIiArIGNvbW1hbmQuaWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kLmluaXRpYWxpemUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmxvZ2dlci5kZWJ1ZyhcIlNraXAgaW5pdGlhbGl6YXRpb24gb2YgY29tbWFuZDogXCIgKyBjb21tYW5kLmlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ01haW4gaW5pdGlhbGl6ZWQnKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTWFpbjtcclxufSgpKTtcclxudmFyIEJhc2VDb21tYW5kID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQmFzZUNvbW1hbmQobG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQmFzZUNvbW1hbmQucHJvdG90eXBlLCBcImlkZW50aWZpZXJcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2dnZXIuVHlwZU5hbWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gQmFzZUNvbW1hbmQ7XHJcbn0oKSk7XHJcbnZhciBEaXNjb3JkQWNjZXNzb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBEaXNjb3JkQWNjZXNzb3IobG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGlzY29yZEFjY2Vzc29yLnByb3RvdHlwZSwgXCJ1c2VySWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCgnI2Rpc2NvcmRVc2VySWQnKS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHVzZXJJZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKCcjZGlzY29yZFVzZXJJZCcpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEaXNjb3JkQWNjZXNzb3IucHJvdG90eXBlLCBcImNoYW5uZWxJZFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKCcjZGlzY29yZENoYW5uZWxJZCcpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY2hhbm5lbElkIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoJyNkaXNjb3JkQ2hhbm5lbElkJykudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERpc2NvcmRBY2Nlc3Nvci5wcm90b3R5cGUsIFwiZ3VpbGRJZFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKCcjZGlzY29yZEd1aWxkSWQnKS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGRpc2NvcmRHdWlsZElkIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoJyNkaXNjb3JkR3VpbGRJZCcpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBEaXNjb3JkQWNjZXNzb3I7XHJcbn0oKSk7XHJcbnZhciBCYXRjaENvbW1hbmQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoQmF0Y2hDb21tYW5kLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gQmF0Y2hDb21tYW5kKGxvZ2dlckZhY3RvcnksIGRpc2NvcmRJbmZvKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbG9nZ2VyRmFjdG9yeS5jcmVhdGUoQmF0Y2hDb21tYW5kKSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5kaXNjb3JkSW5mbyA9IGRpc2NvcmRJbmZvO1xyXG4gICAgICAgIF90aGlzLmNoYXRDb21tYW5kc1NlbGVjdG9yID0gJyNjaGF0Q29tbWFuZHMnO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEJhdGNoQ29tbWFuZC5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnQmF0Y2hDb21tYW5kIGxvYWRpbmcnKTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNzdWJtaXRNZXNzYWdlcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnQmF0Y2hDb21tYW5kOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NvbW1hbmRzL2JhdGNoJyxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogbWUuZGlzY29yZEluZm8udXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5uZWxJZDogbWUuZGlzY29yZEluZm8uY2hhbm5lbElkLFxyXG4gICAgICAgICAgICAgICAgICAgIGd1aWxkSWQ6IG1lLmRpc2NvcmRJbmZvLmd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhdENvbW1hbmRzOiBtZS5jaGF0Q29tbWFuZHNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ0JhdGNoQ29tbWFuZDpwb3N0ZWQnKTtcclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci5pbmZvKG1zZyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdCYXRjaENvbW1hbmQgbG9hZGVkJyk7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhdGNoQ29tbWFuZC5wcm90b3R5cGUsIFwiY2hhdENvbW1hbmRzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJhdyA9ICQodGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvcikudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHJhdy5yZXBsYWNlKCdcXHInLCAnJykuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWFuZHM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBjaGF0Q29tbWFuZHMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gdi5qb2luKCdcXG4nKTtcclxuICAgICAgICAgICAgJCh0aGlzLmNoYXRDb21tYW5kc1NlbGVjdG9yKS52YWwoY29tbWFuZHMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEJhdGNoQ29tbWFuZDtcclxufShCYXNlQ29tbWFuZCkpO1xyXG52YXIgUmFjZXJGb3JtRmFjdG9yeSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJhY2VyRm9ybUZhY3RvcnkobG9nZ2VyRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyRmFjdG9yeSA9IGxvZ2dlckZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJGYWN0b3J5LmNyZWF0ZShSYWNlckZvcm1GYWN0b3J5KTtcclxuICAgIH1cclxuICAgIFJhY2VyRm9ybUZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHZhciBhY2Nlc3NvciA9IG5ldyBSYWNlckZvcm1BY2Nlc3NvcihpbmRleCwgdGhpcy5sb2dnZXJGYWN0b3J5KTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIG1lLmxvZ2dlci50cmFjZShcIlN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5OmxvYWRpbmc6XCIgKyBpbmRleCk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAnL3BhcnRpYWxzL2luZGV4LWRpc3BsYXktc3ltYm9scy1mb3JtJyxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YTogeyBpbmRleDogaW5kZXggfVxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKFwiU3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3Rvcnk6bG9hZGVkOlwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgJHBhcmVudCA9ICQoJyNkaXNwbGF5LXN5bWJvbHMtY2FyZCcpO1xyXG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQoZGF0YSk7XHJcbiAgICAgICAgICAgICRwYXJlbnQuYXBwZW5kKCRyb3cpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhY2Nlc3NvcjtcclxuICAgIH07XHJcbiAgICBSYWNlckZvcm1GYWN0b3J5LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29ycyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnW2RhdGEtc3ltYm9scy1yb3ddJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkcm93ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoJHJvdy5hdHRyKCdkYXRhLXN5bWJvbHMtcm93JykpO1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoXCJTeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeTphdHRhY2hpbmc6XCIgKyBpbmRleCk7XHJcbiAgICAgICAgICAgIHZhciBhY2Nlc3NvciA9IG5ldyBSYWNlckZvcm1BY2Nlc3NvcihpbmRleCwgbWUubG9nZ2VyRmFjdG9yeSk7XHJcbiAgICAgICAgICAgIGFjY2Vzc29ycy5wdXNoKGFjY2Vzc29yKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gYWNjZXNzb3JzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBSYWNlckZvcm1GYWN0b3J5O1xyXG59KCkpO1xyXG52YXIgUmFjZXJDb21tYW5kID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFJhY2VyQ29tbWFuZCwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFJhY2VyQ29tbWFuZChsb2dnZXJGYWN0b3J5LCBzeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeSwgZGlzY29yZEluZm8pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBsb2dnZXJGYWN0b3J5LmNyZWF0ZShSYWNlckNvbW1hbmQpKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLnN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5ID0gc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3Rvcnk7XHJcbiAgICAgICAgX3RoaXMuZGlzY29yZEluZm8gPSBkaXNjb3JkSW5mbztcclxuICAgICAgICBfdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnMgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICBfdGhpcy5yb3dDb3VudCA9IDA7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdSYWNlckNvbW1hbmQgbG9hZGluZycpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoU3VibWl0QnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hBZGRSYWNlckJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoU29ydEluaXRCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFNvcnRSYWNlQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hSZXNvbHZlTmVnYXRpdmVzU3ltYm9scygpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoUmVtb3ZlUm93QnV0dG9ucygpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoRXhpc3RpbmdSYWNlcigpO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdSYWNlckNvbW1hbmQgbG9hZGVkJyk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hSZW1vdmVSb3dCdXR0b25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS1pbmRleF0nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykuYXR0cignZGF0YS1pbmRleCcpO1xyXG4gICAgICAgICAgICAkKFwiW2RhdGEtc3ltYm9scy1yb3c9XFxcIlwiICsgaW5kZXggKyBcIlxcXCJdXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoUmVzb2x2ZU5lZ2F0aXZlc1N5bWJvbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjcmVzb2x2ZU5lZ2F0aXZlc1N5bWJvbHMnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ3Jlc29sdmVOZWdhdGl2ZXNTeW1ib2xzOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBtZS5yYWNlckZvcm1BY2Nlc3NvcnMuZm9yRWFjaChmdW5jdGlvbiAoYWNjZXNzb3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzZXMgPSBhY2Nlc3Nvci5zdWNjZXNzZXMgLSBhY2Nlc3Nvci5mYWlsdXJlcztcclxuICAgICAgICAgICAgICAgIHZhciBhZHZhbnRhZ2VzID0gYWNjZXNzb3IuYWR2YW50YWdlcyAtIGFjY2Vzc29yLnRocmVhdHM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmFpbHVyZXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRocmVhdHMgPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3NlcyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmYWlsdXJlcyA9IC1zdWNjZXNzZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc2VzID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhZHZhbnRhZ2VzIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocmVhdHMgPSAtYWR2YW50YWdlcztcclxuICAgICAgICAgICAgICAgICAgICBhZHZhbnRhZ2VzID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFjY2Vzc29yLnN1Y2Nlc3NlcyA9IHN1Y2Nlc3NlcztcclxuICAgICAgICAgICAgICAgIGFjY2Vzc29yLmZhaWx1cmVzID0gZmFpbHVyZXM7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3Nvci5hZHZhbnRhZ2VzID0gYWR2YW50YWdlcztcclxuICAgICAgICAgICAgICAgIGFjY2Vzc29yLnRocmVhdHMgPSB0aHJlYXRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFNvcnRSYWNlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3NvcnRSYWNlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdzb3J0UmFjZTpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzID0gbWUucmFjZXJGb3JtQWNjZXNzb3JzXHJcbiAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lLnNvcnRDb21wb3VuZChhLnN1Y2Nlc3NlcyAtIGEuZmFpbHVyZXMsIGIuc3VjY2Vzc2VzIC0gYi5mYWlsdXJlcykgfHxcclxuICAgICAgICAgICAgICAgICAgICBtZS5zb3J0Q29tcG91bmQoYS5hZHZhbnRhZ2VzIC0gYS50aHJlYXRzLCBiLmFkdmFudGFnZXMgLSBiLnRocmVhdHMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEudHJpdW1waHMsIGIudHJpdW1waHMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGIuZGVzcGFpcnMsIGEuZGVzcGFpcnMpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgbWUucmVvcmRlclJvd3MoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFNvcnRJbml0QnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3NvcnRJbml0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdzb3J0SW5pdDpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzID0gbWUucmFjZXJGb3JtQWNjZXNzb3JzXHJcbiAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lLnNvcnRDb21wb3VuZChhLnN1Y2Nlc3NlcywgYi5zdWNjZXNzZXMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEuYWR2YW50YWdlcywgYi5hZHZhbnRhZ2VzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIG1lLnNvcnRDb21wb3VuZChhLnRyaXVtcGhzLCBiLnRyaXVtcGhzKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIG1lLnJlb3JkZXJSb3dzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5yZW9yZGVyUm93cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJHBhcmVudCA9ICQoJyNkaXNwbGF5LXN5bWJvbHMtY2FyZCcpO1xyXG4gICAgICAgIHZhciAkcm93cyA9ICRwYXJlbnQucmVtb3ZlKCdbZGF0YS1zeW1ib2xzLXJvd10nKTtcclxuICAgICAgICB0aGlzLnJhY2VyRm9ybUFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGVsZW1lbnQuZ2V0SW5kZXgoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gXCJbZGF0YS1zeW1ib2xzLXJvdz1cXFwiXCIgKyBpbmRleCArIFwiXFxcIl1cIjtcclxuICAgICAgICAgICAgdmFyICRlbCA9ICQoc2VsZWN0b3IsICRyb3dzKTtcclxuICAgICAgICAgICAgJHBhcmVudC5hcHBlbmQoJGVsKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLnNvcnRDb21wb3VuZCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgaWYgKGEgPiBiKVxyXG4gICAgICAgICAgICByZXR1cm4gKzE7XHJcbiAgICAgICAgaWYgKGEgPCBiKVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hBZGRSYWNlckJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNhZGRTeW1ib2xzUm93Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdhZGRSYWNlcjpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUuYWRkUmFjZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaEV4aXN0aW5nUmFjZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYWNjZXNzb3JzID0gdGhpcy5zeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeS5hdHRhY2goKTtcclxuICAgICAgICBhY2Nlc3NvcnMuZm9yRWFjaChmdW5jdGlvbiAoYWNjZXNzb3IpIHsgcmV0dXJuIF90aGlzLnJhY2VyRm9ybUFjY2Vzc29ycy5wdXNoKGFjY2Vzc29yKTsgfSk7XHJcbiAgICAgICAgdGhpcy5yb3dDb3VudCA9IGFjY2Vzc29ycy5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hZGRSYWNlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYWNjZXNzb3IgPSB0aGlzLnN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5LmNyZWF0ZSh0aGlzLnJvd0NvdW50KyspO1xyXG4gICAgICAgIHRoaXMucmFjZXJGb3JtQWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoU3VibWl0QnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI2Rpc3BsYXlTeW1ib2xzJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdkaXNwbGF5U3ltYm9sczpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICB1c2VySWQ6IG1lLmRpc2NvcmRJbmZvLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgIGNoYW5uZWxJZDogbWUuZGlzY29yZEluZm8uY2hhbm5lbElkLFxyXG4gICAgICAgICAgICAgICAgZ3VpbGRJZDogbWUuZGlzY29yZEluZm8uZ3VpbGRJZCxcclxuICAgICAgICAgICAgICAgIHN5bWJvbHM6IG5ldyBBcnJheSgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG1lLnJhY2VyRm9ybUFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuc3ltYm9scy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICByYWNlcjogcm93LnJhY2VyLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHJvdy50eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkdmFudGFnZXM6IHJvdy5hZHZhbnRhZ2VzLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3Nlczogcm93LnN1Y2Nlc3NlcyxcclxuICAgICAgICAgICAgICAgICAgICB0cml1bXBoczogcm93LnRyaXVtcGhzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRocmVhdHM6IHJvdy50aHJlYXRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGZhaWx1cmVzOiByb3cuZmFpbHVyZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzcGFpcnM6IHJvdy5kZXNwYWlyc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NvbW1hbmRzL2Rpc3BsYXktc3ltYm9scycsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ2Rpc3BsYXlTeW1ib2xzOnBvc3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLmluZm8obXNnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyQ29tbWFuZC5wcm90b3R5cGUsIFwic3ltYm9sc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJhY2VyRm9ybUFjY2Vzc29ycztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ05vdFN1cHBvcnRlZEV4Y2VwdGlvbic7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gUmFjZXJDb21tYW5kO1xyXG59KEJhc2VDb21tYW5kKSk7XHJcbnZhciBSYWNlckZvcm1BY2Nlc3NvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJhY2VyRm9ybUFjY2Vzc29yKGluZGV4LCBsb2dnZXJGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyRmFjdG9yeS5jcmVhdGUoUmFjZXJGb3JtQWNjZXNzb3IpO1xyXG4gICAgfVxyXG4gICAgUmFjZXJGb3JtQWNjZXNzb3IucHJvdG90eXBlLmdldEluZGV4ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4O1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlckZvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwicmFjZXJcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNyYWNlci1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgcmFjZXIgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNyYWNlci1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlckZvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwidHlwZVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3R5cGUtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHR5cGUgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiN0eXBlLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJhZHZhbnRhZ2VzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjYWR2YW50YWdlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgYWR2YW50YWdlcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2FkdmFudGFnZXMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcInN1Y2Nlc3Nlc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3N1Y2Nlc3Nlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgc3VjY2Vzc2VzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjc3VjY2Vzc2VzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJ0cml1bXBoc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RyaXVtcGhzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0cml1bXBocyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3RyaXVtcGhzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJ0aHJlYXRzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjdGhyZWF0cy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgdGhyZWF0cyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3RocmVhdHMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcImZhaWx1cmVzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjZmFpbHVyZXMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGZhaWx1cmVzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjZmFpbHVyZXMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcImRlc3BhaXJzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjZGVzcGFpcnMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGRlc3BhaXJzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjZGVzcGFpcnMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gUmFjZXJGb3JtQWNjZXNzb3I7XHJcbn0oKSk7XHJcbi8vXHJcbi8vIENvbXBvc2l0aW9uIHJvb3RcclxuLy9cclxudmFyIGxvZ2dlckZhY3RvcnkgPSBuZXcgTG9nZ2VyRmFjdG9yeV8xLkxvZ2dlckZhY3RvcnkoKTtcclxudmFyIGRpc2NvcmRJbmZvID0gbmV3IERpc2NvcmRBY2Nlc3Nvcihsb2dnZXJGYWN0b3J5LmNyZWF0ZShEaXNjb3JkQWNjZXNzb3IpKTtcclxudmFyIGZvcm1BY2Nlc3NvciA9IG5ldyBCYXRjaENvbW1hbmQobG9nZ2VyRmFjdG9yeSwgZGlzY29yZEluZm8pO1xyXG52YXIgc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnkgPSBuZXcgUmFjZXJGb3JtRmFjdG9yeShsb2dnZXJGYWN0b3J5KTtcclxudmFyIGRpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IgPSBuZXcgUmFjZXJDb21tYW5kKGxvZ2dlckZhY3RvcnksIHN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5LCBkaXNjb3JkSW5mbyk7XHJcbnZhciBjb21tYW5kcyA9IFtmb3JtQWNjZXNzb3IsIGRpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3JdO1xyXG52YXIgbWFpbiA9IG5ldyBNYWluKGNvbW1hbmRzLCBsb2dnZXJGYWN0b3J5KTtcclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICBtYWluLmluaXRpYWxpemUoKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpdGUuanMubWFwIl19
