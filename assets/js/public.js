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
        this.logger.trace('Main initializing');
        this.commands.forEach(function (command) {
            command.initialize();
        });
        this.logger.trace('Main initialized');
    };
    return Main;
}());
var BaseCommandsAccessor = /** @class */ (function () {
    function BaseCommandsAccessor(logger) {
        this.logger = logger;
    }
    return BaseCommandsAccessor;
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
var BatchCommandsFormAccessor = /** @class */ (function (_super) {
    __extends(BatchCommandsFormAccessor, _super);
    function BatchCommandsFormAccessor(loggerFactory, discordInfo) {
        var _this = _super.call(this, loggerFactory.create(BatchCommandsFormAccessor)) || this;
        _this.discordInfo = discordInfo;
        _this.chatCommandsSelector = '#chatCommands';
        return _this;
    }
    BatchCommandsFormAccessor.prototype.initialize = function () {
        this.logger.trace('BatchCommandsFormAccessor loading');
        var me = this;
        $('#submitMessages').on('click', function (e) {
            me.logger.trace('BatchCommands:clicked');
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
var RacerFormAccessorFactory = /** @class */ (function () {
    function RacerFormAccessorFactory(loggerFactory) {
        this.loggerFactory = loggerFactory;
        this.logger = loggerFactory.create(RacerFormAccessorFactory);
    }
    RacerFormAccessorFactory.prototype.create = function (index) {
        var accessor = new SymbolsFormAccessor(index, this.loggerFactory);
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
    RacerFormAccessorFactory.prototype.attach = function () {
        var accessors = new Array();
        var me = this;
        $('[data-symbols-row]').each(function () {
            var $row = $(this);
            var index = parseInt($row.attr('data-symbols-row'));
            me.logger.trace("SymbolsFormAccessorFactory:attaching:" + index);
            var accessor = new SymbolsFormAccessor(index, me.loggerFactory);
            accessors.push(accessor);
        });
        return accessors;
    };
    return RacerFormAccessorFactory;
}());
var DisplayRacerCommandsFormAccessor = /** @class */ (function (_super) {
    __extends(DisplayRacerCommandsFormAccessor, _super);
    function DisplayRacerCommandsFormAccessor(loggerFactory, symbolsFormAccessorFactory, discordInfo) {
        var _this = _super.call(this, loggerFactory.create(DisplayRacerCommandsFormAccessor)) || this;
        _this.symbolsFormAccessorFactory = symbolsFormAccessorFactory;
        _this.discordInfo = discordInfo;
        _this.racerFormAccessors = new Array();
        _this.rowCount = 0;
        return _this;
    }
    DisplayRacerCommandsFormAccessor.prototype.initialize = function () {
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loading');
        this.attachSubmitButton();
        this.attachAddRacerButton();
        this.attachSortInitButton();
        this.attachSortRaceButton();
        this.attachResolveNegativesSymbols();
        this.attachRemoveRowButtons();
        this.attachExistingRacer();
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loaded');
    };
    DisplayRacerCommandsFormAccessor.prototype.attachRemoveRowButtons = function () {
        $(document).on('click', '[data-index]', function () {
            var index = $(this).attr('data-index');
            $("[data-symbols-row=\"" + index + "\"]").remove();
        });
    };
    DisplayRacerCommandsFormAccessor.prototype.attachResolveNegativesSymbols = function () {
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
    DisplayRacerCommandsFormAccessor.prototype.attachSortRaceButton = function () {
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
    DisplayRacerCommandsFormAccessor.prototype.attachSortInitButton = function () {
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
    DisplayRacerCommandsFormAccessor.prototype.reorderRows = function () {
        var $parent = $('#display-symbols-card');
        var $rows = $parent.remove('[data-symbols-row]');
        this.racerFormAccessors.forEach(function (element) {
            var index = element.getIndex();
            var selector = "[data-symbols-row=\"" + index + "\"]";
            var $el = $(selector, $rows);
            $parent.append($el);
        });
    };
    DisplayRacerCommandsFormAccessor.prototype.sortCompound = function (a, b) {
        if (a > b)
            return +1;
        if (a < b)
            return -1;
        return 0;
    };
    DisplayRacerCommandsFormAccessor.prototype.attachAddRacerButton = function () {
        var me = this;
        $('#addSymbolsRow').on('click', function (e) {
            me.logger.trace('addRacer:clicked');
            e.preventDefault();
            me.addRacer();
        });
    };
    DisplayRacerCommandsFormAccessor.prototype.attachExistingRacer = function () {
        var _this = this;
        var accessors = this.symbolsFormAccessorFactory.attach();
        accessors.forEach(function (accessor) { return _this.racerFormAccessors.push(accessor); });
        this.rowCount = accessors.length;
    };
    DisplayRacerCommandsFormAccessor.prototype.addRacer = function () {
        var accessor = this.symbolsFormAccessorFactory.create(this.rowCount++);
        this.racerFormAccessors.push(accessor);
    };
    DisplayRacerCommandsFormAccessor.prototype.attachSubmitButton = function () {
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
    Object.defineProperty(DisplayRacerCommandsFormAccessor.prototype, "symbols", {
        get: function () {
            return this.racerFormAccessors;
        },
        set: function (v) {
            throw 'NotSupportedException';
        },
        enumerable: true,
        configurable: true
    });
    return DisplayRacerCommandsFormAccessor;
}(BaseCommandsAccessor));
var SymbolsFormAccessor = /** @class */ (function () {
    function SymbolsFormAccessor(index, loggerFactory) {
        this.index = index;
        this.logger = loggerFactory.create(SymbolsFormAccessor);
    }
    SymbolsFormAccessor.prototype.getIndex = function () {
        return this.index;
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
var loggerFactory = new LoggerFactory_1.LoggerFactory();
var discordInfo = new DiscordAccessor(loggerFactory.create(DiscordAccessor));
var formAccessor = new BatchCommandsFormAccessor(loggerFactory, discordInfo);
var symbolsFormAccessorFactory = new RacerFormAccessorFactory(loggerFactory);
var displaySymbolsCommandsFormAccessor = new DisplayRacerCommandsFormAccessor(loggerFactory, symbolsFormAccessorFactory, discordInfo);
var commands = [formAccessor, displaySymbolsCommandsFormAccessor];
var main = new Main(commands, loggerFactory);
$(function () {
    main.initialize();
});

},{"./Logging/LoggerFactory":3,"./config":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJMb2dnaW5nL0xvZ0xldmVsLmpzIiwiTG9nZ2luZy9Mb2dnZXIuanMiLCJMb2dnaW5nL0xvZ2dlckZhY3RvcnkuanMiLCJjb25maWcuanMiLCJjb25maWcuc2VjcmV0cy5qc29uIiwic2l0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nTGV2ZWw7XHJcbihmdW5jdGlvbiAoTG9nTGV2ZWwpIHtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1widHJhY2VcIl0gPSAwXSA9IFwidHJhY2VcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiZGVidWdcIl0gPSAxXSA9IFwiZGVidWdcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiaW5mb1wiXSA9IDJdID0gXCJpbmZvXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIndhcm5pbmdcIl0gPSAzXSA9IFwid2FybmluZ1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJlcnJvclwiXSA9IDRdID0gXCJlcnJvclwiO1xyXG59KShMb2dMZXZlbCA9IGV4cG9ydHMuTG9nTGV2ZWwgfHwgKGV4cG9ydHMuTG9nTGV2ZWwgPSB7fSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Mb2dMZXZlbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nTGV2ZWxfMSA9IHJlcXVpcmUoXCIuL0xvZ0xldmVsXCIpO1xyXG52YXIgTG9nZ2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTG9nZ2VyKHgsIG1pbmltdW1Mb2dMZXZlbCkge1xyXG4gICAgICAgIHRoaXMubWluaW11bUxvZ0xldmVsID0gbWluaW11bUxvZ0xldmVsO1xyXG4gICAgICAgIHRoaXMubG9nc1NlbGVjdG9yID0gJyNsb2dzJztcclxuICAgICAgICB0aGlzLlROYW1lID0geC5uYW1lO1xyXG4gICAgfVxyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS53YXJuaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLndhcm5pbmcpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsXzEuTG9nTGV2ZWwuZXJyb3IpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWxfMS5Mb2dMZXZlbC5pbmZvKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLnRyYWNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLnRyYWNlKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLmRlYnVnKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLnByZXBlbmQgPSBmdW5jdGlvbiAodmFsdWUsIGxvZ0xldmVsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubWluaW11bUxvZ0xldmVsID4gbG9nTGV2ZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJHJvdyA9ICQoJzxkaXYgY2xhc3M9XCJyb3dcIj4nKTtcclxuICAgICAgICB2YXIgJGNvbDEgPSAkKCc8ZGl2IGNsYXNzPVwiY29sLTNcIj4nKTtcclxuICAgICAgICB2YXIgJGNvbDIgPSAkKCc8ZGl2IGNsYXNzPVwiY29sLTlcIj4nKTtcclxuICAgICAgICAkcm93LmFkZENsYXNzKFwibGV2ZWwtXCIgKyBsb2dMZXZlbCk7XHJcbiAgICAgICAgJGNvbDEuaHRtbCh0aGlzLlROYW1lKTtcclxuICAgICAgICAkY29sMi5odG1sKHZhbHVlKTtcclxuICAgICAgICAkY29sMS5hcHBlbmRUbygkcm93KTtcclxuICAgICAgICAkY29sMi5hcHBlbmRUbygkcm93KTtcclxuICAgICAgICAkcm93LnByZXBlbmRUbyh0aGlzLmxvZ3NTZWxlY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExvZ2dlcjtcclxufSgpKTtcclxuZXhwb3J0cy5Mb2dnZXIgPSBMb2dnZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxvZ2dlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nTGV2ZWxfMSA9IHJlcXVpcmUoXCIuL0xvZ0xldmVsXCIpO1xyXG52YXIgTG9nZ2VyXzEgPSByZXF1aXJlKFwiLi9Mb2dnZXJcIik7XHJcbnZhciBMb2dnZXJGYWN0b3J5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTG9nZ2VyRmFjdG9yeSgpIHtcclxuICAgIH1cclxuICAgIExvZ2dlckZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICh4LCBtaW5pbXVtTG9nTGV2ZWwpIHtcclxuICAgICAgICBpZiAobWluaW11bUxvZ0xldmVsID09PSB2b2lkIDApIHsgbWluaW11bUxvZ0xldmVsID0gTG9nTGV2ZWxfMS5Mb2dMZXZlbC50cmFjZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTG9nZ2VyXzEuTG9nZ2VyKHgsIG1pbmltdW1Mb2dMZXZlbCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExvZ2dlckZhY3Rvcnk7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTG9nZ2VyRmFjdG9yeSA9IExvZ2dlckZhY3Rvcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxvZ2dlckZhY3RvcnkuanMubWFwIiwidmFyIGFsbENvbmZpZ3MgPSByZXF1aXJlKCcuL2NvbmZpZy5zZWNyZXRzLmpzb24nKTtcclxuXHJcbi8vdmFyIENvbmZpZ3VyYXRpb24gPSByZXF1aXJlKCdtZXJnZS1jb25maWcnKTtcclxuXHJcbi8vIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWd1cmF0aW9uKCk7XHJcbi8vIGNvbmZpZy5maWxlKCdjb25maWcuanNvbicpO1xyXG4vLyBjb25maWcuZmlsZSgnY29uZmlnLnNlY3JldHMuanNvbicpO1xyXG5cclxuZXhwb3J0cy5jb25maWd1cmF0aW9uID0gYWxsQ29uZmlncztcclxuIiwibW9kdWxlLmV4cG9ydHM9e1xyXG4gICAgXCJhdXRoXCI6IHtcclxuICAgICAgICBcInRva2VuXCI6IFwiTkRjeE9EYzROVFU0TXpNeU1Ea3lOREUyLkRsSGJtdy5ORjFlX1E5bnhBUm9yUmE2bGhYd0ZBZXdQMVlcIlxyXG4gICAgfSxcclxuICAgIFwiZGlzY29yZFwiOiB7XHJcbiAgICAgICAgXCJ1c2VySWRcIjogXCIxMzQwODg5ODM3MTI4OTA4ODBcIixcclxuICAgICAgICBcImNoYW5uZWxJZFwiOiBcIjQ4OTYyODEyNjkwNTg5Mjg2NFwiLFxyXG4gICAgICAgIFwiZ3VpbGRJZFwiOiBcIjI3MzYyODYxMDY5NzM2MzQ1NlwiXHJcbiAgICB9XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2dnZXJGYWN0b3J5XzEgPSByZXF1aXJlKFwiLi9Mb2dnaW5nL0xvZ2dlckZhY3RvcnlcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpLmNvbmZpZ3VyYXRpb247XHJcbnZhciBNYWluID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTWFpbihjb21tYW5kcywgbG9nZ2VyRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMuY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlckZhY3RvcnkuY3JlYXRlKE1haW4pO1xyXG4gICAgfVxyXG4gICAgTWFpbi5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnTWFpbiBpbml0aWFsaXppbmcnKTtcclxuICAgICAgICB0aGlzLmNvbW1hbmRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgY29tbWFuZC5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ01haW4gaW5pdGlhbGl6ZWQnKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTWFpbjtcclxufSgpKTtcclxudmFyIEJhc2VDb21tYW5kc0FjY2Vzc29yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQmFzZUNvbW1hbmRzQWNjZXNzb3IobG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQmFzZUNvbW1hbmRzQWNjZXNzb3I7XHJcbn0oKSk7XHJcbnZhciBEaXNjb3JkQWNjZXNzb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBEaXNjb3JkQWNjZXNzb3IobG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGlzY29yZEFjY2Vzc29yLnByb3RvdHlwZSwgXCJ1c2VySWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCgnI2Rpc2NvcmRVc2VySWQnKS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHVzZXJJZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKCcjZGlzY29yZFVzZXJJZCcpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEaXNjb3JkQWNjZXNzb3IucHJvdG90eXBlLCBcImNoYW5uZWxJZFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKCcjZGlzY29yZENoYW5uZWxJZCcpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY2hhbm5lbElkIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoJyNkaXNjb3JkQ2hhbm5lbElkJykudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERpc2NvcmRBY2Nlc3Nvci5wcm90b3R5cGUsIFwiZ3VpbGRJZFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKCcjZGlzY29yZEd1aWxkSWQnKS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGRpc2NvcmRHdWlsZElkIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoJyNkaXNjb3JkR3VpbGRJZCcpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBEaXNjb3JkQWNjZXNzb3I7XHJcbn0oKSk7XHJcbnZhciBCYXRjaENvbW1hbmRzRm9ybUFjY2Vzc29yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEJhdGNoQ29tbWFuZHNGb3JtQWNjZXNzb3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBCYXRjaENvbW1hbmRzRm9ybUFjY2Vzc29yKGxvZ2dlckZhY3RvcnksIGRpc2NvcmRJbmZvKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbG9nZ2VyRmFjdG9yeS5jcmVhdGUoQmF0Y2hDb21tYW5kc0Zvcm1BY2Nlc3NvcikpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuZGlzY29yZEluZm8gPSBkaXNjb3JkSW5mbztcclxuICAgICAgICBfdGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvciA9ICcjY2hhdENvbW1hbmRzJztcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBCYXRjaENvbW1hbmRzRm9ybUFjY2Vzc29yLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdCYXRjaENvbW1hbmRzRm9ybUFjY2Vzc29yIGxvYWRpbmcnKTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNzdWJtaXRNZXNzYWdlcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnQmF0Y2hDb21tYW5kczpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jb21tYW5kcy9iYXRjaCcsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IG1lLmRpc2NvcmRJbmZvLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsSWQ6IG1lLmRpc2NvcmRJbmZvLmNoYW5uZWxJZCxcclxuICAgICAgICAgICAgICAgICAgICBndWlsZElkOiBtZS5kaXNjb3JkSW5mby5ndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXRDb21tYW5kczogbWUuY2hhdENvbW1hbmRzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdCYXRjaENvbW1hbmRzOnBvc3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLmluZm8obXNnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0JhdGNoQ29tbWFuZHNGb3JtQWNjZXNzb3IgbG9hZGVkJyk7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhdGNoQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcImNoYXRDb21tYW5kc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByYXcgPSAkKHRoaXMuY2hhdENvbW1hbmRzU2VsZWN0b3IpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgY29tbWFuZHMgPSByYXcucmVwbGFjZSgnXFxyJywgJycpLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmRzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY2hhdENvbW1hbmRzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHYuam9pbignXFxuJyk7XHJcbiAgICAgICAgICAgICQodGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvcikudmFsKGNvbW1hbmRzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBCYXRjaENvbW1hbmRzRm9ybUFjY2Vzc29yO1xyXG59KEJhc2VDb21tYW5kc0FjY2Vzc29yKSk7XHJcbnZhciBSYWNlckZvcm1BY2Nlc3NvckZhY3RvcnkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBSYWNlckZvcm1BY2Nlc3NvckZhY3RvcnkobG9nZ2VyRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyRmFjdG9yeSA9IGxvZ2dlckZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJGYWN0b3J5LmNyZWF0ZShSYWNlckZvcm1BY2Nlc3NvckZhY3RvcnkpO1xyXG4gICAgfVxyXG4gICAgUmFjZXJGb3JtQWNjZXNzb3JGYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICB2YXIgYWNjZXNzb3IgPSBuZXcgU3ltYm9sc0Zvcm1BY2Nlc3NvcihpbmRleCwgdGhpcy5sb2dnZXJGYWN0b3J5KTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIG1lLmxvZ2dlci50cmFjZShcIlN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5OmxvYWRpbmc6XCIgKyBpbmRleCk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAnL3BhcnRpYWxzL2luZGV4LWRpc3BsYXktc3ltYm9scy1mb3JtJyxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YTogeyBpbmRleDogaW5kZXggfVxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKFwiU3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3Rvcnk6bG9hZGVkOlwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgJHBhcmVudCA9ICQoJyNkaXNwbGF5LXN5bWJvbHMtY2FyZCcpO1xyXG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQoZGF0YSk7XHJcbiAgICAgICAgICAgICRwYXJlbnQuYXBwZW5kKCRyb3cpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhY2Nlc3NvcjtcclxuICAgIH07XHJcbiAgICBSYWNlckZvcm1BY2Nlc3NvckZhY3RvcnkucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYWNjZXNzb3JzID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCdbZGF0YS1zeW1ib2xzLXJvd10nKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICRyb3cgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCgkcm93LmF0dHIoJ2RhdGEtc3ltYm9scy1yb3cnKSk7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZShcIlN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5OmF0dGFjaGluZzpcIiArIGluZGV4KTtcclxuICAgICAgICAgICAgdmFyIGFjY2Vzc29yID0gbmV3IFN5bWJvbHNGb3JtQWNjZXNzb3IoaW5kZXgsIG1lLmxvZ2dlckZhY3RvcnkpO1xyXG4gICAgICAgICAgICBhY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGFjY2Vzc29ycztcclxuICAgIH07XHJcbiAgICByZXR1cm4gUmFjZXJGb3JtQWNjZXNzb3JGYWN0b3J5O1xyXG59KCkpO1xyXG52YXIgRGlzcGxheVJhY2VyQ29tbWFuZHNGb3JtQWNjZXNzb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoRGlzcGxheVJhY2VyQ29tbWFuZHNGb3JtQWNjZXNzb3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBEaXNwbGF5UmFjZXJDb21tYW5kc0Zvcm1BY2Nlc3Nvcihsb2dnZXJGYWN0b3J5LCBzeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeSwgZGlzY29yZEluZm8pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBsb2dnZXJGYWN0b3J5LmNyZWF0ZShEaXNwbGF5UmFjZXJDb21tYW5kc0Zvcm1BY2Nlc3NvcikpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnkgPSBzeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeTtcclxuICAgICAgICBfdGhpcy5kaXNjb3JkSW5mbyA9IGRpc2NvcmRJbmZvO1xyXG4gICAgICAgIF90aGlzLnJhY2VyRm9ybUFjY2Vzc29ycyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIF90aGlzLnJvd0NvdW50ID0gMDtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBEaXNwbGF5UmFjZXJDb21tYW5kc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnRGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3NvciBsb2FkaW5nJyk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hTdWJtaXRCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaEFkZFJhY2VyQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hTb3J0SW5pdEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoU29ydFJhY2VCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFJlc29sdmVOZWdhdGl2ZXNTeW1ib2xzKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hSZW1vdmVSb3dCdXR0b25zKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hFeGlzdGluZ1JhY2VyKCk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0Rpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IgbG9hZGVkJyk7XHJcbiAgICB9O1xyXG4gICAgRGlzcGxheVJhY2VyQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmF0dGFjaFJlbW92ZVJvd0J1dHRvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLWluZGV4XScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gJCh0aGlzKS5hdHRyKCdkYXRhLWluZGV4Jyk7XHJcbiAgICAgICAgICAgICQoXCJbZGF0YS1zeW1ib2xzLXJvdz1cXFwiXCIgKyBpbmRleCArIFwiXFxcIl1cIikucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgRGlzcGxheVJhY2VyQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmF0dGFjaFJlc29sdmVOZWdhdGl2ZXNTeW1ib2xzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3Jlc29sdmVOZWdhdGl2ZXNTeW1ib2xzJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdyZXNvbHZlTmVnYXRpdmVzU3ltYm9sczpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzLmZvckVhY2goZnVuY3Rpb24gKGFjY2Vzc29yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2Vzc2VzID0gYWNjZXNzb3Iuc3VjY2Vzc2VzIC0gYWNjZXNzb3IuZmFpbHVyZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWR2YW50YWdlcyA9IGFjY2Vzc29yLmFkdmFudGFnZXMgLSBhY2Nlc3Nvci50aHJlYXRzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZhaWx1cmVzID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciB0aHJlYXRzID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzZXMgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFpbHVyZXMgPSAtc3VjY2Vzc2VzO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NlcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYWR2YW50YWdlcyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJlYXRzID0gLWFkdmFudGFnZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgYWR2YW50YWdlcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3Nvci5zdWNjZXNzZXMgPSBzdWNjZXNzZXM7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3Nvci5mYWlsdXJlcyA9IGZhaWx1cmVzO1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzb3IuYWR2YW50YWdlcyA9IGFkdmFudGFnZXM7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3Nvci50aHJlYXRzID0gdGhyZWF0cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgRGlzcGxheVJhY2VyQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmF0dGFjaFNvcnRSYWNlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3NvcnRSYWNlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdzb3J0UmFjZTpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzID0gbWUucmFjZXJGb3JtQWNjZXNzb3JzXHJcbiAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lLnNvcnRDb21wb3VuZChhLnN1Y2Nlc3NlcyAtIGEuZmFpbHVyZXMsIGIuc3VjY2Vzc2VzIC0gYi5mYWlsdXJlcykgfHxcclxuICAgICAgICAgICAgICAgICAgICBtZS5zb3J0Q29tcG91bmQoYS5hZHZhbnRhZ2VzIC0gYS50aHJlYXRzLCBiLmFkdmFudGFnZXMgLSBiLnRocmVhdHMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEudHJpdW1waHMsIGIudHJpdW1waHMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGIuZGVzcGFpcnMsIGEuZGVzcGFpcnMpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgbWUucmVvcmRlclJvd3MoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBEaXNwbGF5UmFjZXJDb21tYW5kc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUuYXR0YWNoU29ydEluaXRCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjc29ydEluaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ3NvcnRJbml0OmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBtZS5yYWNlckZvcm1BY2Nlc3NvcnMgPSBtZS5yYWNlckZvcm1BY2Nlc3NvcnNcclxuICAgICAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWUuc29ydENvbXBvdW5kKGEuc3VjY2Vzc2VzLCBiLnN1Y2Nlc3NlcykgfHxcclxuICAgICAgICAgICAgICAgICAgICBtZS5zb3J0Q29tcG91bmQoYS5hZHZhbnRhZ2VzLCBiLmFkdmFudGFnZXMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEudHJpdW1waHMsIGIudHJpdW1waHMpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgbWUucmVvcmRlclJvd3MoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBEaXNwbGF5UmFjZXJDb21tYW5kc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUucmVvcmRlclJvd3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICRwYXJlbnQgPSAkKCcjZGlzcGxheS1zeW1ib2xzLWNhcmQnKTtcclxuICAgICAgICB2YXIgJHJvd3MgPSAkcGFyZW50LnJlbW92ZSgnW2RhdGEtc3ltYm9scy1yb3ddJyk7XHJcbiAgICAgICAgdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBlbGVtZW50LmdldEluZGV4KCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IFwiW2RhdGEtc3ltYm9scy1yb3c9XFxcIlwiICsgaW5kZXggKyBcIlxcXCJdXCI7XHJcbiAgICAgICAgICAgIHZhciAkZWwgPSAkKHNlbGVjdG9yLCAkcm93cyk7XHJcbiAgICAgICAgICAgICRwYXJlbnQuYXBwZW5kKCRlbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgRGlzcGxheVJhY2VyQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLnNvcnRDb21wb3VuZCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgaWYgKGEgPiBiKVxyXG4gICAgICAgICAgICByZXR1cm4gKzE7XHJcbiAgICAgICAgaWYgKGEgPCBiKVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9O1xyXG4gICAgRGlzcGxheVJhY2VyQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLmF0dGFjaEFkZFJhY2VyQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI2FkZFN5bWJvbHNSb3cnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ2FkZFJhY2VyOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBtZS5hZGRSYWNlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIERpc3BsYXlSYWNlckNvbW1hbmRzRm9ybUFjY2Vzc29yLnByb3RvdHlwZS5hdHRhY2hFeGlzdGluZ1JhY2VyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29ycyA9IHRoaXMuc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnkuYXR0YWNoKCk7XHJcbiAgICAgICAgYWNjZXNzb3JzLmZvckVhY2goZnVuY3Rpb24gKGFjY2Vzc29yKSB7IHJldHVybiBfdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7IH0pO1xyXG4gICAgICAgIHRoaXMucm93Q291bnQgPSBhY2Nlc3NvcnMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIERpc3BsYXlSYWNlckNvbW1hbmRzRm9ybUFjY2Vzc29yLnByb3RvdHlwZS5hZGRSYWNlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYWNjZXNzb3IgPSB0aGlzLnN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5LmNyZWF0ZSh0aGlzLnJvd0NvdW50KyspO1xyXG4gICAgICAgIHRoaXMucmFjZXJGb3JtQWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpO1xyXG4gICAgfTtcclxuICAgIERpc3BsYXlSYWNlckNvbW1hbmRzRm9ybUFjY2Vzc29yLnByb3RvdHlwZS5hdHRhY2hTdWJtaXRCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjZGlzcGxheVN5bWJvbHMnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ2Rpc3BsYXlTeW1ib2xzOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIHVzZXJJZDogbWUuZGlzY29yZEluZm8udXNlcklkLFxyXG4gICAgICAgICAgICAgICAgY2hhbm5lbElkOiBtZS5kaXNjb3JkSW5mby5jaGFubmVsSWQsXHJcbiAgICAgICAgICAgICAgICBndWlsZElkOiBtZS5kaXNjb3JkSW5mby5ndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgc3ltYm9sczogbmV3IEFycmF5KClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5zeW1ib2xzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHJhY2VyOiByb3cucmFjZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogcm93LnR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYWR2YW50YWdlczogcm93LmFkdmFudGFnZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc2VzOiByb3cuc3VjY2Vzc2VzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyaXVtcGhzOiByb3cudHJpdW1waHMsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyZWF0czogcm93LnRocmVhdHMsXHJcbiAgICAgICAgICAgICAgICAgICAgZmFpbHVyZXM6IHJvdy5mYWlsdXJlcyxcclxuICAgICAgICAgICAgICAgICAgICBkZXNwYWlyczogcm93LmRlc3BhaXJzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY29tbWFuZHMvZGlzcGxheS1zeW1ib2xzJyxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnZGlzcGxheVN5bWJvbHM6cG9zdGVkJyk7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIuaW5mbyhtc2cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGlzcGxheVJhY2VyQ29tbWFuZHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcInN5bWJvbHNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRocm93ICdOb3RTdXBwb3J0ZWRFeGNlcHRpb24nO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIERpc3BsYXlSYWNlckNvbW1hbmRzRm9ybUFjY2Vzc29yO1xyXG59KEJhc2VDb21tYW5kc0FjY2Vzc29yKSk7XHJcbnZhciBTeW1ib2xzRm9ybUFjY2Vzc29yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU3ltYm9sc0Zvcm1BY2Nlc3NvcihpbmRleCwgbG9nZ2VyRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlckZhY3RvcnkuY3JlYXRlKFN5bWJvbHNGb3JtQWNjZXNzb3IpO1xyXG4gICAgfVxyXG4gICAgU3ltYm9sc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUuZ2V0SW5kZXggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXg7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN5bWJvbHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcInJhY2VyXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjcmFjZXItXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHJhY2VyIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjcmFjZXItXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ltYm9sc0Zvcm1BY2Nlc3Nvci5wcm90b3R5cGUsIFwidHlwZVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3R5cGUtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHR5cGUgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiN0eXBlLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN5bWJvbHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcImFkdmFudGFnZXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNhZHZhbnRhZ2VzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBhZHZhbnRhZ2VzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjYWR2YW50YWdlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTeW1ib2xzRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJzdWNjZXNzZXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNzdWNjZXNzZXMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHN1Y2Nlc3NlcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3N1Y2Nlc3Nlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTeW1ib2xzRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJ0cml1bXBoc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RyaXVtcGhzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0cml1bXBocyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3RyaXVtcGhzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN5bWJvbHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcInRocmVhdHNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN0aHJlYXRzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0aHJlYXRzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjdGhyZWF0cy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTeW1ib2xzRm9ybUFjY2Vzc29yLnByb3RvdHlwZSwgXCJmYWlsdXJlc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2ZhaWx1cmVzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBmYWlsdXJlcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2ZhaWx1cmVzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN5bWJvbHNGb3JtQWNjZXNzb3IucHJvdG90eXBlLCBcImRlc3BhaXJzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjZGVzcGFpcnMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGRlc3BhaXJzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjZGVzcGFpcnMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gU3ltYm9sc0Zvcm1BY2Nlc3NvcjtcclxufSgpKTtcclxudmFyIGxvZ2dlckZhY3RvcnkgPSBuZXcgTG9nZ2VyRmFjdG9yeV8xLkxvZ2dlckZhY3RvcnkoKTtcclxudmFyIGRpc2NvcmRJbmZvID0gbmV3IERpc2NvcmRBY2Nlc3Nvcihsb2dnZXJGYWN0b3J5LmNyZWF0ZShEaXNjb3JkQWNjZXNzb3IpKTtcclxudmFyIGZvcm1BY2Nlc3NvciA9IG5ldyBCYXRjaENvbW1hbmRzRm9ybUFjY2Vzc29yKGxvZ2dlckZhY3RvcnksIGRpc2NvcmRJbmZvKTtcclxudmFyIHN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5ID0gbmV3IFJhY2VyRm9ybUFjY2Vzc29yRmFjdG9yeShsb2dnZXJGYWN0b3J5KTtcclxudmFyIGRpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IgPSBuZXcgRGlzcGxheVJhY2VyQ29tbWFuZHNGb3JtQWNjZXNzb3IobG9nZ2VyRmFjdG9yeSwgc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnksIGRpc2NvcmRJbmZvKTtcclxudmFyIGNvbW1hbmRzID0gW2Zvcm1BY2Nlc3NvciwgZGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3Nvcl07XHJcbnZhciBtYWluID0gbmV3IE1haW4oY29tbWFuZHMsIGxvZ2dlckZhY3RvcnkpO1xyXG4kKGZ1bmN0aW9uICgpIHtcclxuICAgIG1haW4uaW5pdGlhbGl6ZSgpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2l0ZS5qcy5tYXAiXX0=
