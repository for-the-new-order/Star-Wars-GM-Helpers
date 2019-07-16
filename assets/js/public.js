(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.BaseCommand = BaseCommand;

},{}],2:[function(require,module,exports){
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
var BaseCommand_1 = require("../BaseCommand");
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
}(BaseCommand_1.BaseCommand));
exports.BatchCommand = BatchCommand;

},{"../BaseCommand":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BatchCommand_1 = require("./BatchCommand");
exports.BatchCommand = BatchCommand_1.BatchCommand;

},{"./BatchCommand":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.DiscordAccessor = DiscordAccessor;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DiscordAccessor_1 = require("./DiscordAccessor");
exports.DiscordAccessor = DiscordAccessor_1.DiscordAccessor;

},{"./DiscordAccessor":4}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./LogLevel":6}],8:[function(require,module,exports){
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

},{"./LogLevel":6,"./Logger":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("./Logger");
exports.Logger = Logger_1.Logger;
var LoggerFactory_1 = require("./LoggerFactory");
exports.LoggerFactory = LoggerFactory_1.LoggerFactory;
var LogLevel_1 = require("./LogLevel");
exports.LogLevel = LogLevel_1.LogLevel;

},{"./LogLevel":6,"./Logger":7,"./LoggerFactory":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RacePart = /** @class */ (function () {
    function RacePart(name, difficulty, distance) {
        if (difficulty === void 0) { difficulty = 'pp'; }
        if (distance === void 0) { distance = 20; }
        this.name = name;
        this.difficulty = difficulty;
        this.distance = distance;
    }
    return RacePart;
}());
exports.RacePart = RacePart;

},{}],11:[function(require,module,exports){
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
var BaseCommand_1 = require("../BaseCommand");
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
                racers: new Array()
            };
            me.racerFormAccessors.forEach(function (row) {
                data.racers.push({
                    // Racer
                    racer: row.racer,
                    skill: row.skill,
                    type: row.type,
                    // Vehicle
                    vehicle: row.vehicle,
                    silhouette: row.silhouette,
                    currentSpeed: row.currentSpeed,
                    maxSpeed: row.maxSpeed,
                    handling: row.handling,
                    currentSystemStrain: row.currentSystemStrain,
                    maxSystemStrain: row.maxSystemStrain,
                    currentHull: row.currentHull,
                    maxHull: row.maxHull,
                    part: row.part,
                    lap: row.lap,
                    // Symbols
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
    Object.defineProperty(RacerCommand.prototype, "racers", {
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
}(BaseCommand_1.BaseCommand));
exports.RacerCommand = RacerCommand;

},{"../BaseCommand":1}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var RacerFormFactory = /** @class */ (function () {
    function RacerFormFactory(loggerFactory) {
        this.loggerFactory = loggerFactory;
        this.logger = loggerFactory.create(RacerFormFactory);
    }
    RacerFormFactory.prototype.create = function (index) {
        var accessor = new _1.RacerRowAccessor(index, this.loggerFactory);
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
            var accessor = new _1.RacerRowAccessor(index, me.loggerFactory);
            accessors.push(accessor);
        });
        return accessors;
    };
    return RacerFormFactory;
}());
exports.RacerFormFactory = RacerFormFactory;

},{".":14}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RacerRowAccessor = /** @class */ (function () {
    function RacerRowAccessor(index, loggerFactory) {
        this.index = index;
        this.logger = loggerFactory.create(RacerRowAccessor);
    }
    RacerRowAccessor.prototype.getIndex = function () {
        return this.index;
    };
    Object.defineProperty(RacerRowAccessor.prototype, "racer", {
        //
        // Racer
        //
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
    Object.defineProperty(RacerRowAccessor.prototype, "skill", {
        get: function () {
            return $("#skill-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting skill to " + v);
            $("#skill-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "type", {
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
    Object.defineProperty(RacerRowAccessor.prototype, "vehicle", {
        //
        // Vehicle
        //
        get: function () {
            return $("#vehicle-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting vehicle to " + v);
            $("#vehicle-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "silhouette", {
        get: function () {
            return $("#silhouette-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting silhouette to " + v);
            $("#silhouette-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "currentSpeed", {
        get: function () {
            return $("#current-speed-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting currentSpeed to " + v);
            $("#current-speed-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "maxSpeed", {
        get: function () {
            return $("#max-speed-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting maxSpeed to " + v);
            $("#max-speed-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "handling", {
        get: function () {
            return $("#handling-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting handling to " + v);
            $("#handling-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "currentSystemStrain", {
        get: function () {
            return $("#current-ss-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting currentSystemStrain to " + v);
            $("#current-ss-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "maxSystemStrain", {
        get: function () {
            return $("#max-ss-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting maxSystemStrain to " + v);
            $("#max-ss-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "currentHull", {
        get: function () {
            return $("#current-hull-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting currentHull to " + v);
            $("#current-hull-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "maxHull", {
        get: function () {
            return $("#max-hull-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting maxHull to " + v);
            $("#max-hull-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "part", {
        get: function () {
            return $("#part-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting part to " + v);
            $("#part-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "lap", {
        get: function () {
            return $("#lap-" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting lap to " + v);
            $("#lap-" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacerRowAccessor.prototype, "advantages", {
        //
        // Symbols
        //
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
    Object.defineProperty(RacerRowAccessor.prototype, "successes", {
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
    Object.defineProperty(RacerRowAccessor.prototype, "triumphs", {
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
    Object.defineProperty(RacerRowAccessor.prototype, "threats", {
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
    Object.defineProperty(RacerRowAccessor.prototype, "failures", {
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
    Object.defineProperty(RacerRowAccessor.prototype, "despairs", {
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
    return RacerRowAccessor;
}());
exports.RacerRowAccessor = RacerRowAccessor;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RacerFormFactory_1 = require("./RacerFormFactory");
exports.RacerFormFactory = RacerFormFactory_1.RacerFormFactory;
var RacerCommand_1 = require("./RacerCommand");
exports.RacerCommand = RacerCommand_1.RacerCommand;
var RacerRowAccessor_1 = require("./RacerRowAccessor");
exports.RacerRowAccessor = RacerRowAccessor_1.RacerRowAccessor;
var RacePart_1 = require("./RacePart");
exports.RacePart = RacePart_1.RacePart;

},{"./RacePart":10,"./RacerCommand":11,"./RacerFormFactory":12,"./RacerRowAccessor":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logging_1 = require("./Logging");
var DiscordInfo_1 = require("./DiscordInfo");
var BatchCommand_1 = require("./BatchCommand");
var RacerCommand_1 = require("./RacerCommand");
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
exports.Main = Main;
//
// Composition root
//
var loggerFactory = new Logging_1.LoggerFactory();
var discordInfo = new DiscordInfo_1.DiscordAccessor(loggerFactory.create(DiscordInfo_1.DiscordAccessor));
var formAccessor = new BatchCommand_1.BatchCommand(loggerFactory, discordInfo);
var symbolsFormAccessorFactory = new RacerCommand_1.RacerFormFactory(loggerFactory);
var displaySymbolsCommandsFormAccessor = new RacerCommand_1.RacerCommand(loggerFactory, symbolsFormAccessorFactory, discordInfo);
var commands = [formAccessor, displaySymbolsCommandsFormAccessor];
var main = new Main(commands, loggerFactory);
$(function () {
    main.initialize();
});

},{"./BatchCommand":3,"./DiscordInfo":5,"./Logging":9,"./RacerCommand":14}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQmFzZUNvbW1hbmQuanMiLCJzcmMvQmF0Y2hDb21tYW5kL0JhdGNoQ29tbWFuZC5qcyIsInNyYy9CYXRjaENvbW1hbmQvaW5kZXguanMiLCJzcmMvRGlzY29yZEluZm8vRGlzY29yZEFjY2Vzc29yLmpzIiwic3JjL0Rpc2NvcmRJbmZvL2luZGV4LmpzIiwic3JjL0xvZ2dpbmcvTG9nTGV2ZWwuanMiLCJzcmMvTG9nZ2luZy9Mb2dnZXIuanMiLCJzcmMvTG9nZ2luZy9Mb2dnZXJGYWN0b3J5LmpzIiwic3JjL0xvZ2dpbmcvaW5kZXguanMiLCJzcmMvUmFjZXJDb21tYW5kL1JhY2VQYXJ0LmpzIiwic3JjL1JhY2VyQ29tbWFuZC9SYWNlckNvbW1hbmQuanMiLCJzcmMvUmFjZXJDb21tYW5kL1JhY2VyRm9ybUZhY3RvcnkuanMiLCJzcmMvUmFjZXJDb21tYW5kL1JhY2VyUm93QWNjZXNzb3IuanMiLCJzcmMvUmFjZXJDb21tYW5kL2luZGV4LmpzIiwic3JjL2NsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBCYXNlQ29tbWFuZCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEJhc2VDb21tYW5kKGxvZ2dlcikge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhc2VDb21tYW5kLnByb3RvdHlwZSwgXCJpZGVudGlmaWVyXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9nZ2VyLlR5cGVOYW1lO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEJhc2VDb21tYW5kO1xyXG59KCkpO1xyXG5leHBvcnRzLkJhc2VDb21tYW5kID0gQmFzZUNvbW1hbmQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJhc2VDb21tYW5kLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgQmFzZUNvbW1hbmRfMSA9IHJlcXVpcmUoXCIuLi9CYXNlQ29tbWFuZFwiKTtcclxudmFyIEJhdGNoQ29tbWFuZCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhCYXRjaENvbW1hbmQsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBCYXRjaENvbW1hbmQobG9nZ2VyRmFjdG9yeSwgZGlzY29yZEluZm8pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBsb2dnZXJGYWN0b3J5LmNyZWF0ZShCYXRjaENvbW1hbmQpKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmRpc2NvcmRJbmZvID0gZGlzY29yZEluZm87XHJcbiAgICAgICAgX3RoaXMuY2hhdENvbW1hbmRzU2VsZWN0b3IgPSAnI2NoYXRDb21tYW5kcyc7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgQmF0Y2hDb21tYW5kLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdCYXRjaENvbW1hbmQgbG9hZGluZycpO1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3N1Ym1pdE1lc3NhZ2VzJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdCYXRjaENvbW1hbmQ6Y2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY29tbWFuZHMvYmF0Y2gnLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiBtZS5kaXNjb3JkSW5mby51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbm5lbElkOiBtZS5kaXNjb3JkSW5mby5jaGFubmVsSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3VpbGRJZDogbWUuZGlzY29yZEluZm8uZ3VpbGRJZCxcclxuICAgICAgICAgICAgICAgICAgICBjaGF0Q29tbWFuZHM6IG1lLmNoYXRDb21tYW5kc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnQmF0Y2hDb21tYW5kOnBvc3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLmluZm8obXNnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0JhdGNoQ29tbWFuZCBsb2FkZWQnKTtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQmF0Y2hDb21tYW5kLnByb3RvdHlwZSwgXCJjaGF0Q29tbWFuZHNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmF3ID0gJCh0aGlzLmNoYXRDb21tYW5kc1NlbGVjdG9yKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gcmF3LnJlcGxhY2UoJ1xccicsICcnKS5zcGxpdCgnXFxuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGNoYXRDb21tYW5kcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICB2YXIgY29tbWFuZHMgPSB2LmpvaW4oJ1xcbicpO1xyXG4gICAgICAgICAgICAkKHRoaXMuY2hhdENvbW1hbmRzU2VsZWN0b3IpLnZhbChjb21tYW5kcyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gQmF0Y2hDb21tYW5kO1xyXG59KEJhc2VDb21tYW5kXzEuQmFzZUNvbW1hbmQpKTtcclxuZXhwb3J0cy5CYXRjaENvbW1hbmQgPSBCYXRjaENvbW1hbmQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJhdGNoQ29tbWFuZC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgQmF0Y2hDb21tYW5kXzEgPSByZXF1aXJlKFwiLi9CYXRjaENvbW1hbmRcIik7XHJcbmV4cG9ydHMuQmF0Y2hDb21tYW5kID0gQmF0Y2hDb21tYW5kXzEuQmF0Y2hDb21tYW5kO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgRGlzY29yZEFjY2Vzc29yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRGlzY29yZEFjY2Vzc29yKGxvZ2dlcikge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERpc2NvcmRBY2Nlc3Nvci5wcm90b3R5cGUsIFwidXNlcklkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoJyNkaXNjb3JkVXNlcklkJykudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB1c2VySWQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJCgnI2Rpc2NvcmRVc2VySWQnKS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGlzY29yZEFjY2Vzc29yLnByb3RvdHlwZSwgXCJjaGFubmVsSWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCgnI2Rpc2NvcmRDaGFubmVsSWQnKS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGNoYW5uZWxJZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKCcjZGlzY29yZENoYW5uZWxJZCcpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEaXNjb3JkQWNjZXNzb3IucHJvdG90eXBlLCBcImd1aWxkSWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCgnI2Rpc2NvcmRHdWlsZElkJykudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBkaXNjb3JkR3VpbGRJZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKCcjZGlzY29yZEd1aWxkSWQnKS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gRGlzY29yZEFjY2Vzc29yO1xyXG59KCkpO1xyXG5leHBvcnRzLkRpc2NvcmRBY2Nlc3NvciA9IERpc2NvcmRBY2Nlc3NvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RGlzY29yZEFjY2Vzc29yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBEaXNjb3JkQWNjZXNzb3JfMSA9IHJlcXVpcmUoXCIuL0Rpc2NvcmRBY2Nlc3NvclwiKTtcclxuZXhwb3J0cy5EaXNjb3JkQWNjZXNzb3IgPSBEaXNjb3JkQWNjZXNzb3JfMS5EaXNjb3JkQWNjZXNzb3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2dMZXZlbDtcclxuKGZ1bmN0aW9uIChMb2dMZXZlbCkge1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJ0cmFjZVwiXSA9IDBdID0gXCJ0cmFjZVwiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJkZWJ1Z1wiXSA9IDFdID0gXCJkZWJ1Z1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJpbmZvXCJdID0gMl0gPSBcImluZm9cIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wid2FybmluZ1wiXSA9IDNdID0gXCJ3YXJuaW5nXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcImVycm9yXCJdID0gNF0gPSBcImVycm9yXCI7XHJcbn0pKExvZ0xldmVsID0gZXhwb3J0cy5Mb2dMZXZlbCB8fCAoZXhwb3J0cy5Mb2dMZXZlbCA9IHt9KSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxvZ0xldmVsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2dMZXZlbF8xID0gcmVxdWlyZShcIi4vTG9nTGV2ZWxcIik7XHJcbnZhciBMb2dnZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMb2dnZXIoeCwgbWluaW11bUxvZ0xldmVsKSB7XHJcbiAgICAgICAgdGhpcy5taW5pbXVtTG9nTGV2ZWwgPSBtaW5pbXVtTG9nTGV2ZWw7XHJcbiAgICAgICAgdGhpcy5sb2dzU2VsZWN0b3IgPSAnI2xvZ3MnO1xyXG4gICAgICAgIHRoaXMuVE5hbWUgPSB4Lm5hbWU7XHJcbiAgICB9XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLndhcm5pbmcgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsXzEuTG9nTGV2ZWwud2FybmluZyk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWxfMS5Mb2dMZXZlbC5lcnJvcik7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5pbmZvID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLmluZm8pO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUudHJhY2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsXzEuTG9nTGV2ZWwudHJhY2UpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsXzEuTG9nTGV2ZWwuZGVidWcpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUucHJlcGVuZCA9IGZ1bmN0aW9uICh2YWx1ZSwgbG9nTGV2ZWwpIHtcclxuICAgICAgICBpZiAodGhpcy5taW5pbXVtTG9nTGV2ZWwgPiBsb2dMZXZlbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciAkcm93ID0gJCgnPGRpdiBjbGFzcz1cInJvd1wiPicpO1xyXG4gICAgICAgIHZhciAkY29sMSA9ICQoJzxkaXYgY2xhc3M9XCJjb2wtM1wiPicpO1xyXG4gICAgICAgIHZhciAkY29sMiA9ICQoJzxkaXYgY2xhc3M9XCJjb2wtOVwiPicpO1xyXG4gICAgICAgICRyb3cuYWRkQ2xhc3MoXCJsZXZlbC1cIiArIGxvZ0xldmVsKTtcclxuICAgICAgICAkY29sMS5odG1sKHRoaXMuVE5hbWUpO1xyXG4gICAgICAgICRjb2wyLmh0bWwodmFsdWUpO1xyXG4gICAgICAgICRjb2wxLmFwcGVuZFRvKCRyb3cpO1xyXG4gICAgICAgICRjb2wyLmFwcGVuZFRvKCRyb3cpO1xyXG4gICAgICAgICRyb3cucHJlcGVuZFRvKHRoaXMubG9nc1NlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTG9nZ2VyLnByb3RvdHlwZSwgXCJUeXBlTmFtZVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlROYW1lO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIExvZ2dlcjtcclxufSgpKTtcclxuZXhwb3J0cy5Mb2dnZXIgPSBMb2dnZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxvZ2dlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nTGV2ZWxfMSA9IHJlcXVpcmUoXCIuL0xvZ0xldmVsXCIpO1xyXG52YXIgTG9nZ2VyXzEgPSByZXF1aXJlKFwiLi9Mb2dnZXJcIik7XHJcbnZhciBMb2dnZXJGYWN0b3J5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTG9nZ2VyRmFjdG9yeSgpIHtcclxuICAgIH1cclxuICAgIExvZ2dlckZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICh4LCBtaW5pbXVtTG9nTGV2ZWwpIHtcclxuICAgICAgICBpZiAobWluaW11bUxvZ0xldmVsID09PSB2b2lkIDApIHsgbWluaW11bUxvZ0xldmVsID0gTG9nTGV2ZWxfMS5Mb2dMZXZlbC50cmFjZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTG9nZ2VyXzEuTG9nZ2VyKHgsIG1pbmltdW1Mb2dMZXZlbCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExvZ2dlckZhY3Rvcnk7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTG9nZ2VyRmFjdG9yeSA9IExvZ2dlckZhY3Rvcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxvZ2dlckZhY3RvcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIExvZ2dlcl8xID0gcmVxdWlyZShcIi4vTG9nZ2VyXCIpO1xyXG5leHBvcnRzLkxvZ2dlciA9IExvZ2dlcl8xLkxvZ2dlcjtcclxudmFyIExvZ2dlckZhY3RvcnlfMSA9IHJlcXVpcmUoXCIuL0xvZ2dlckZhY3RvcnlcIik7XHJcbmV4cG9ydHMuTG9nZ2VyRmFjdG9yeSA9IExvZ2dlckZhY3RvcnlfMS5Mb2dnZXJGYWN0b3J5O1xyXG52YXIgTG9nTGV2ZWxfMSA9IHJlcXVpcmUoXCIuL0xvZ0xldmVsXCIpO1xyXG5leHBvcnRzLkxvZ0xldmVsID0gTG9nTGV2ZWxfMS5Mb2dMZXZlbDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFJhY2VQYXJ0ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUmFjZVBhcnQobmFtZSwgZGlmZmljdWx0eSwgZGlzdGFuY2UpIHtcclxuICAgICAgICBpZiAoZGlmZmljdWx0eSA9PT0gdm9pZCAwKSB7IGRpZmZpY3VsdHkgPSAncHAnOyB9XHJcbiAgICAgICAgaWYgKGRpc3RhbmNlID09PSB2b2lkIDApIHsgZGlzdGFuY2UgPSAyMDsgfVxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5kaWZmaWN1bHR5ID0gZGlmZmljdWx0eTtcclxuICAgICAgICB0aGlzLmRpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gUmFjZVBhcnQ7XHJcbn0oKSk7XHJcbmV4cG9ydHMuUmFjZVBhcnQgPSBSYWNlUGFydDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmFjZVBhcnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBCYXNlQ29tbWFuZF8xID0gcmVxdWlyZShcIi4uL0Jhc2VDb21tYW5kXCIpO1xyXG52YXIgUmFjZXJDb21tYW5kID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFJhY2VyQ29tbWFuZCwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFJhY2VyQ29tbWFuZChsb2dnZXJGYWN0b3J5LCBzeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeSwgZGlzY29yZEluZm8pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBsb2dnZXJGYWN0b3J5LmNyZWF0ZShSYWNlckNvbW1hbmQpKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLnN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5ID0gc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3Rvcnk7XHJcbiAgICAgICAgX3RoaXMuZGlzY29yZEluZm8gPSBkaXNjb3JkSW5mbztcclxuICAgICAgICBfdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnMgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICBfdGhpcy5yb3dDb3VudCA9IDA7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdSYWNlckNvbW1hbmQgbG9hZGluZycpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoU3VibWl0QnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hBZGRSYWNlckJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoU29ydEluaXRCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFNvcnRSYWNlQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hSZXNvbHZlTmVnYXRpdmVzU3ltYm9scygpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoUmVtb3ZlUm93QnV0dG9ucygpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoRXhpc3RpbmdSYWNlcigpO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdSYWNlckNvbW1hbmQgbG9hZGVkJyk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hSZW1vdmVSb3dCdXR0b25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS1pbmRleF0nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykuYXR0cignZGF0YS1pbmRleCcpO1xyXG4gICAgICAgICAgICAkKFwiW2RhdGEtc3ltYm9scy1yb3c9XFxcIlwiICsgaW5kZXggKyBcIlxcXCJdXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoUmVzb2x2ZU5lZ2F0aXZlc1N5bWJvbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjcmVzb2x2ZU5lZ2F0aXZlc1N5bWJvbHMnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ3Jlc29sdmVOZWdhdGl2ZXNTeW1ib2xzOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBtZS5yYWNlckZvcm1BY2Nlc3NvcnMuZm9yRWFjaChmdW5jdGlvbiAoYWNjZXNzb3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzZXMgPSBhY2Nlc3Nvci5zdWNjZXNzZXMgLSBhY2Nlc3Nvci5mYWlsdXJlcztcclxuICAgICAgICAgICAgICAgIHZhciBhZHZhbnRhZ2VzID0gYWNjZXNzb3IuYWR2YW50YWdlcyAtIGFjY2Vzc29yLnRocmVhdHM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmFpbHVyZXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRocmVhdHMgPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3NlcyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmYWlsdXJlcyA9IC1zdWNjZXNzZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc2VzID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhZHZhbnRhZ2VzIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocmVhdHMgPSAtYWR2YW50YWdlcztcclxuICAgICAgICAgICAgICAgICAgICBhZHZhbnRhZ2VzID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFjY2Vzc29yLnN1Y2Nlc3NlcyA9IHN1Y2Nlc3NlcztcclxuICAgICAgICAgICAgICAgIGFjY2Vzc29yLmZhaWx1cmVzID0gZmFpbHVyZXM7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3Nvci5hZHZhbnRhZ2VzID0gYWR2YW50YWdlcztcclxuICAgICAgICAgICAgICAgIGFjY2Vzc29yLnRocmVhdHMgPSB0aHJlYXRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFNvcnRSYWNlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3NvcnRSYWNlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdzb3J0UmFjZTpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzID0gbWUucmFjZXJGb3JtQWNjZXNzb3JzXHJcbiAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lLnNvcnRDb21wb3VuZChhLnN1Y2Nlc3NlcyAtIGEuZmFpbHVyZXMsIGIuc3VjY2Vzc2VzIC0gYi5mYWlsdXJlcykgfHxcclxuICAgICAgICAgICAgICAgICAgICBtZS5zb3J0Q29tcG91bmQoYS5hZHZhbnRhZ2VzIC0gYS50aHJlYXRzLCBiLmFkdmFudGFnZXMgLSBiLnRocmVhdHMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEudHJpdW1waHMsIGIudHJpdW1waHMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGIuZGVzcGFpcnMsIGEuZGVzcGFpcnMpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgbWUucmVvcmRlclJvd3MoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFNvcnRJbml0QnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3NvcnRJbml0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdzb3J0SW5pdDpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzID0gbWUucmFjZXJGb3JtQWNjZXNzb3JzXHJcbiAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lLnNvcnRDb21wb3VuZChhLnN1Y2Nlc3NlcywgYi5zdWNjZXNzZXMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEuYWR2YW50YWdlcywgYi5hZHZhbnRhZ2VzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIG1lLnNvcnRDb21wb3VuZChhLnRyaXVtcGhzLCBiLnRyaXVtcGhzKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIG1lLnJlb3JkZXJSb3dzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5yZW9yZGVyUm93cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJHBhcmVudCA9ICQoJyNkaXNwbGF5LXN5bWJvbHMtY2FyZCcpO1xyXG4gICAgICAgIHZhciAkcm93cyA9ICRwYXJlbnQucmVtb3ZlKCdbZGF0YS1zeW1ib2xzLXJvd10nKTtcclxuICAgICAgICB0aGlzLnJhY2VyRm9ybUFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGVsZW1lbnQuZ2V0SW5kZXgoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gXCJbZGF0YS1zeW1ib2xzLXJvdz1cXFwiXCIgKyBpbmRleCArIFwiXFxcIl1cIjtcclxuICAgICAgICAgICAgdmFyICRlbCA9ICQoc2VsZWN0b3IsICRyb3dzKTtcclxuICAgICAgICAgICAgJHBhcmVudC5hcHBlbmQoJGVsKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLnNvcnRDb21wb3VuZCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgaWYgKGEgPiBiKVxyXG4gICAgICAgICAgICByZXR1cm4gKzE7XHJcbiAgICAgICAgaWYgKGEgPCBiKVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hBZGRSYWNlckJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNhZGRTeW1ib2xzUm93Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdhZGRSYWNlcjpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUuYWRkUmFjZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaEV4aXN0aW5nUmFjZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYWNjZXNzb3JzID0gdGhpcy5zeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeS5hdHRhY2goKTtcclxuICAgICAgICBhY2Nlc3NvcnMuZm9yRWFjaChmdW5jdGlvbiAoYWNjZXNzb3IpIHsgcmV0dXJuIF90aGlzLnJhY2VyRm9ybUFjY2Vzc29ycy5wdXNoKGFjY2Vzc29yKTsgfSk7XHJcbiAgICAgICAgdGhpcy5yb3dDb3VudCA9IGFjY2Vzc29ycy5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hZGRSYWNlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYWNjZXNzb3IgPSB0aGlzLnN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5LmNyZWF0ZSh0aGlzLnJvd0NvdW50KyspO1xyXG4gICAgICAgIHRoaXMucmFjZXJGb3JtQWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoU3VibWl0QnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI2Rpc3BsYXlTeW1ib2xzJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdkaXNwbGF5U3ltYm9sczpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICB1c2VySWQ6IG1lLmRpc2NvcmRJbmZvLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgIGNoYW5uZWxJZDogbWUuZGlzY29yZEluZm8uY2hhbm5lbElkLFxyXG4gICAgICAgICAgICAgICAgZ3VpbGRJZDogbWUuZGlzY29yZEluZm8uZ3VpbGRJZCxcclxuICAgICAgICAgICAgICAgIHJhY2VyczogbmV3IEFycmF5KClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5yYWNlcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUmFjZXJcclxuICAgICAgICAgICAgICAgICAgICByYWNlcjogcm93LnJhY2VyLFxyXG4gICAgICAgICAgICAgICAgICAgIHNraWxsOiByb3cuc2tpbGwsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogcm93LnR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVmVoaWNsZVxyXG4gICAgICAgICAgICAgICAgICAgIHZlaGljbGU6IHJvdy52ZWhpY2xlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpbGhvdWV0dGU6IHJvdy5zaWxob3VldHRlLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTcGVlZDogcm93LmN1cnJlbnRTcGVlZCxcclxuICAgICAgICAgICAgICAgICAgICBtYXhTcGVlZDogcm93Lm1heFNwZWVkLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsaW5nOiByb3cuaGFuZGxpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFN5c3RlbVN0cmFpbjogcm93LmN1cnJlbnRTeXN0ZW1TdHJhaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4U3lzdGVtU3RyYWluOiByb3cubWF4U3lzdGVtU3RyYWluLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRIdWxsOiByb3cuY3VycmVudEh1bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4SHVsbDogcm93Lm1heEh1bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFydDogcm93LnBhcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFwOiByb3cubGFwLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFN5bWJvbHNcclxuICAgICAgICAgICAgICAgICAgICBhZHZhbnRhZ2VzOiByb3cuYWR2YW50YWdlcyxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzZXM6IHJvdy5zdWNjZXNzZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJpdW1waHM6IHJvdy50cml1bXBocyxcclxuICAgICAgICAgICAgICAgICAgICB0aHJlYXRzOiByb3cudGhyZWF0cyxcclxuICAgICAgICAgICAgICAgICAgICBmYWlsdXJlczogcm93LmZhaWx1cmVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3BhaXJzOiByb3cuZGVzcGFpcnNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jb21tYW5kcy9kaXNwbGF5LXN5bWJvbHMnLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdkaXNwbGF5U3ltYm9sczpwb3N0ZWQnKTtcclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci5pbmZvKG1zZyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlckNvbW1hbmQucHJvdG90eXBlLCBcInJhY2Vyc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJhY2VyRm9ybUFjY2Vzc29ycztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ05vdFN1cHBvcnRlZEV4Y2VwdGlvbic7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gUmFjZXJDb21tYW5kO1xyXG59KEJhc2VDb21tYW5kXzEuQmFzZUNvbW1hbmQpKTtcclxuZXhwb3J0cy5SYWNlckNvbW1hbmQgPSBSYWNlckNvbW1hbmQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVJhY2VyQ29tbWFuZC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgXzEgPSByZXF1aXJlKFwiLlwiKTtcclxudmFyIFJhY2VyRm9ybUZhY3RvcnkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBSYWNlckZvcm1GYWN0b3J5KGxvZ2dlckZhY3RvcnkpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlckZhY3RvcnkgPSBsb2dnZXJGYWN0b3J5O1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyRmFjdG9yeS5jcmVhdGUoUmFjZXJGb3JtRmFjdG9yeSk7XHJcbiAgICB9XHJcbiAgICBSYWNlckZvcm1GYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICB2YXIgYWNjZXNzb3IgPSBuZXcgXzEuUmFjZXJSb3dBY2Nlc3NvcihpbmRleCwgdGhpcy5sb2dnZXJGYWN0b3J5KTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIG1lLmxvZ2dlci50cmFjZShcIlN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5OmxvYWRpbmc6XCIgKyBpbmRleCk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAnL3BhcnRpYWxzL2luZGV4LWRpc3BsYXktc3ltYm9scy1mb3JtJyxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YTogeyBpbmRleDogaW5kZXggfVxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKFwiU3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3Rvcnk6bG9hZGVkOlwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgJHBhcmVudCA9ICQoJyNkaXNwbGF5LXN5bWJvbHMtY2FyZCcpO1xyXG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQoZGF0YSk7XHJcbiAgICAgICAgICAgICRwYXJlbnQuYXBwZW5kKCRyb3cpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhY2Nlc3NvcjtcclxuICAgIH07XHJcbiAgICBSYWNlckZvcm1GYWN0b3J5LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29ycyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnW2RhdGEtc3ltYm9scy1yb3ddJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkcm93ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoJHJvdy5hdHRyKCdkYXRhLXN5bWJvbHMtcm93JykpO1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoXCJTeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeTphdHRhY2hpbmc6XCIgKyBpbmRleCk7XHJcbiAgICAgICAgICAgIHZhciBhY2Nlc3NvciA9IG5ldyBfMS5SYWNlclJvd0FjY2Vzc29yKGluZGV4LCBtZS5sb2dnZXJGYWN0b3J5KTtcclxuICAgICAgICAgICAgYWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhY2Nlc3NvcnM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFJhY2VyRm9ybUZhY3Rvcnk7XHJcbn0oKSk7XHJcbmV4cG9ydHMuUmFjZXJGb3JtRmFjdG9yeSA9IFJhY2VyRm9ybUZhY3Rvcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVJhY2VyRm9ybUZhY3RvcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFJhY2VyUm93QWNjZXNzb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBSYWNlclJvd0FjY2Vzc29yKGluZGV4LCBsb2dnZXJGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyRmFjdG9yeS5jcmVhdGUoUmFjZXJSb3dBY2Nlc3Nvcik7XHJcbiAgICB9XHJcbiAgICBSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZS5nZXRJbmRleCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleDtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwicmFjZXJcIiwge1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gUmFjZXJcclxuICAgICAgICAvL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNyYWNlci1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgcmFjZXIgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNyYWNlci1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJza2lsbFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3NraWxsLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBza2lsbCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3NraWxsLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInR5cGVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN0eXBlLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0eXBlIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjdHlwZS1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJ2ZWhpY2xlXCIsIHtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIFZlaGljbGVcclxuICAgICAgICAvL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN2ZWhpY2xlLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB2ZWhpY2xlIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjdmVoaWNsZS1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJzaWxob3VldHRlXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjc2lsaG91ZXR0ZS1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgc2lsaG91ZXR0ZSB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3NpbGhvdWV0dGUtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwiY3VycmVudFNwZWVkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjY3VycmVudC1zcGVlZC1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY3VycmVudFNwZWVkIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjY3VycmVudC1zcGVlZC1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJtYXhTcGVlZFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI21heC1zcGVlZC1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgbWF4U3BlZWQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNtYXgtc3BlZWQtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwiaGFuZGxpbmdcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNoYW5kbGluZy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgaGFuZGxpbmcgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNoYW5kbGluZy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJjdXJyZW50U3lzdGVtU3RyYWluXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjY3VycmVudC1zcy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY3VycmVudFN5c3RlbVN0cmFpbiB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2N1cnJlbnQtc3MtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwibWF4U3lzdGVtU3RyYWluXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjbWF4LXNzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBtYXhTeXN0ZW1TdHJhaW4gdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNtYXgtc3MtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwiY3VycmVudEh1bGxcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNjdXJyZW50LWh1bGwtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGN1cnJlbnRIdWxsIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjY3VycmVudC1odWxsLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcIm1heEh1bGxcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNtYXgtaHVsbC1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgbWF4SHVsbCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI21heC1odWxsLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInBhcnRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNwYXJ0LVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBwYXJ0IHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjcGFydC1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJsYXBcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNsYXAtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGxhcCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2xhcC1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJhZHZhbnRhZ2VzXCIsIHtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIFN5bWJvbHNcclxuICAgICAgICAvL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNhZHZhbnRhZ2VzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBhZHZhbnRhZ2VzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjYWR2YW50YWdlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJzdWNjZXNzZXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNzdWNjZXNzZXMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHN1Y2Nlc3NlcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3N1Y2Nlc3Nlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJ0cml1bXBoc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RyaXVtcGhzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0cml1bXBocyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3RyaXVtcGhzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInRocmVhdHNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN0aHJlYXRzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0aHJlYXRzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjdGhyZWF0cy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJmYWlsdXJlc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2ZhaWx1cmVzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBmYWlsdXJlcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2ZhaWx1cmVzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcImRlc3BhaXJzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjZGVzcGFpcnMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGRlc3BhaXJzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjZGVzcGFpcnMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gUmFjZXJSb3dBY2Nlc3NvcjtcclxufSgpKTtcclxuZXhwb3J0cy5SYWNlclJvd0FjY2Vzc29yID0gUmFjZXJSb3dBY2Nlc3NvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmFjZXJSb3dBY2Nlc3Nvci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgUmFjZXJGb3JtRmFjdG9yeV8xID0gcmVxdWlyZShcIi4vUmFjZXJGb3JtRmFjdG9yeVwiKTtcclxuZXhwb3J0cy5SYWNlckZvcm1GYWN0b3J5ID0gUmFjZXJGb3JtRmFjdG9yeV8xLlJhY2VyRm9ybUZhY3Rvcnk7XHJcbnZhciBSYWNlckNvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL1JhY2VyQ29tbWFuZFwiKTtcclxuZXhwb3J0cy5SYWNlckNvbW1hbmQgPSBSYWNlckNvbW1hbmRfMS5SYWNlckNvbW1hbmQ7XHJcbnZhciBSYWNlclJvd0FjY2Vzc29yXzEgPSByZXF1aXJlKFwiLi9SYWNlclJvd0FjY2Vzc29yXCIpO1xyXG5leHBvcnRzLlJhY2VyUm93QWNjZXNzb3IgPSBSYWNlclJvd0FjY2Vzc29yXzEuUmFjZXJSb3dBY2Nlc3NvcjtcclxudmFyIFJhY2VQYXJ0XzEgPSByZXF1aXJlKFwiLi9SYWNlUGFydFwiKTtcclxuZXhwb3J0cy5SYWNlUGFydCA9IFJhY2VQYXJ0XzEuUmFjZVBhcnQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2dnaW5nXzEgPSByZXF1aXJlKFwiLi9Mb2dnaW5nXCIpO1xyXG52YXIgRGlzY29yZEluZm9fMSA9IHJlcXVpcmUoXCIuL0Rpc2NvcmRJbmZvXCIpO1xyXG52YXIgQmF0Y2hDb21tYW5kXzEgPSByZXF1aXJlKFwiLi9CYXRjaENvbW1hbmRcIik7XHJcbnZhciBSYWNlckNvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL1JhY2VyQ29tbWFuZFwiKTtcclxudmFyIE1haW4gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBNYWluKGNvbW1hbmRzLCBsb2dnZXJGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kcyA9IGNvbW1hbmRzO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyRmFjdG9yeS5jcmVhdGUoTWFpbik7XHJcbiAgICB9XHJcbiAgICBNYWluLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ01haW4gaW5pdGlhbGl6aW5nJyk7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRDb21tYW5kID0gJCgnYm9keScpLmF0dHIoJ2RhdGEtY29tbWFuZC1pZGVudGlmaWVyJyk7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZCA9PT0gY29tbWFuZC5pZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5sb2dnZXIuZGVidWcoXCJDdXJyZW50IGNvbW1hbmQ6IFwiICsgY29tbWFuZC5pZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMubG9nZ2VyLmRlYnVnKFwiU2tpcCBpbml0aWFsaXphdGlvbiBvZiBjb21tYW5kOiBcIiArIGNvbW1hbmQuaWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnTWFpbiBpbml0aWFsaXplZCcpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBNYWluO1xyXG59KCkpO1xyXG5leHBvcnRzLk1haW4gPSBNYWluO1xyXG4vL1xyXG4vLyBDb21wb3NpdGlvbiByb290XHJcbi8vXHJcbnZhciBsb2dnZXJGYWN0b3J5ID0gbmV3IExvZ2dpbmdfMS5Mb2dnZXJGYWN0b3J5KCk7XHJcbnZhciBkaXNjb3JkSW5mbyA9IG5ldyBEaXNjb3JkSW5mb18xLkRpc2NvcmRBY2Nlc3Nvcihsb2dnZXJGYWN0b3J5LmNyZWF0ZShEaXNjb3JkSW5mb18xLkRpc2NvcmRBY2Nlc3NvcikpO1xyXG52YXIgZm9ybUFjY2Vzc29yID0gbmV3IEJhdGNoQ29tbWFuZF8xLkJhdGNoQ29tbWFuZChsb2dnZXJGYWN0b3J5LCBkaXNjb3JkSW5mbyk7XHJcbnZhciBzeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeSA9IG5ldyBSYWNlckNvbW1hbmRfMS5SYWNlckZvcm1GYWN0b3J5KGxvZ2dlckZhY3RvcnkpO1xyXG52YXIgZGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3NvciA9IG5ldyBSYWNlckNvbW1hbmRfMS5SYWNlckNvbW1hbmQobG9nZ2VyRmFjdG9yeSwgc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnksIGRpc2NvcmRJbmZvKTtcclxudmFyIGNvbW1hbmRzID0gW2Zvcm1BY2Nlc3NvciwgZGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3Nvcl07XHJcbnZhciBtYWluID0gbmV3IE1haW4oY29tbWFuZHMsIGxvZ2dlckZhY3RvcnkpO1xyXG4kKGZ1bmN0aW9uICgpIHtcclxuICAgIG1haW4uaW5pdGlhbGl6ZSgpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2xpZW50LmpzLm1hcCJdfQ==
