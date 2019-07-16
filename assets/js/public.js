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
        $('#displayRacers').on('click', function (e) {
            me.logger.trace('displayRacers:clicked');
            e.preventDefault();
            var data = me.createRaceModel();
            $.ajax({
                url: '/commands/display-racers',
                method: 'POST',
                data: data
            }).done(function (msg) {
                me.logger.info(msg);
                me.logger.trace('displayRacers:posted');
            });
        });
    };
    RacerCommand.prototype.createRaceModel = function () {
        var data = {
            userId: this.discordInfo.userId,
            channelId: this.discordInfo.channelId,
            guildId: this.discordInfo.guildId,
            racers: new Array()
        };
        this.racerFormAccessors.forEach(function (row) {
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
        return data;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQmFzZUNvbW1hbmQuanMiLCJzcmMvQmF0Y2hDb21tYW5kL0JhdGNoQ29tbWFuZC5qcyIsInNyYy9CYXRjaENvbW1hbmQvaW5kZXguanMiLCJzcmMvRGlzY29yZEluZm8vRGlzY29yZEFjY2Vzc29yLmpzIiwic3JjL0Rpc2NvcmRJbmZvL2luZGV4LmpzIiwic3JjL0xvZ2dpbmcvTG9nTGV2ZWwuanMiLCJzcmMvTG9nZ2luZy9Mb2dnZXIuanMiLCJzcmMvTG9nZ2luZy9Mb2dnZXJGYWN0b3J5LmpzIiwic3JjL0xvZ2dpbmcvaW5kZXguanMiLCJzcmMvUmFjZXJDb21tYW5kL1JhY2VQYXJ0LmpzIiwic3JjL1JhY2VyQ29tbWFuZC9SYWNlckNvbW1hbmQuanMiLCJzcmMvUmFjZXJDb21tYW5kL1JhY2VyRm9ybUZhY3RvcnkuanMiLCJzcmMvUmFjZXJDb21tYW5kL1JhY2VyUm93QWNjZXNzb3IuanMiLCJzcmMvUmFjZXJDb21tYW5kL2luZGV4LmpzIiwic3JjL2NsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIEJhc2VDb21tYW5kID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQmFzZUNvbW1hbmQobG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQmFzZUNvbW1hbmQucHJvdG90eXBlLCBcImlkZW50aWZpZXJcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2dnZXIuVHlwZU5hbWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gQmFzZUNvbW1hbmQ7XHJcbn0oKSk7XHJcbmV4cG9ydHMuQmFzZUNvbW1hbmQgPSBCYXNlQ29tbWFuZDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QmFzZUNvbW1hbmQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBCYXNlQ29tbWFuZF8xID0gcmVxdWlyZShcIi4uL0Jhc2VDb21tYW5kXCIpO1xyXG52YXIgQmF0Y2hDb21tYW5kID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEJhdGNoQ29tbWFuZCwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEJhdGNoQ29tbWFuZChsb2dnZXJGYWN0b3J5LCBkaXNjb3JkSW5mbykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGxvZ2dlckZhY3RvcnkuY3JlYXRlKEJhdGNoQ29tbWFuZCkpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuZGlzY29yZEluZm8gPSBkaXNjb3JkSW5mbztcclxuICAgICAgICBfdGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvciA9ICcjY2hhdENvbW1hbmRzJztcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBCYXRjaENvbW1hbmQucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ0JhdGNoQ29tbWFuZCBsb2FkaW5nJyk7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjc3VibWl0TWVzc2FnZXMnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ0JhdGNoQ29tbWFuZDpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jb21tYW5kcy9iYXRjaCcsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IG1lLmRpc2NvcmRJbmZvLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsSWQ6IG1lLmRpc2NvcmRJbmZvLmNoYW5uZWxJZCxcclxuICAgICAgICAgICAgICAgICAgICBndWlsZElkOiBtZS5kaXNjb3JkSW5mby5ndWlsZElkLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXRDb21tYW5kczogbWUuY2hhdENvbW1hbmRzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdCYXRjaENvbW1hbmQ6cG9zdGVkJyk7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIuaW5mbyhtc2cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnQmF0Y2hDb21tYW5kIGxvYWRlZCcpO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCYXRjaENvbW1hbmQucHJvdG90eXBlLCBcImNoYXRDb21tYW5kc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByYXcgPSAkKHRoaXMuY2hhdENvbW1hbmRzU2VsZWN0b3IpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgY29tbWFuZHMgPSByYXcucmVwbGFjZSgnXFxyJywgJycpLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmRzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY2hhdENvbW1hbmRzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHYuam9pbignXFxuJyk7XHJcbiAgICAgICAgICAgICQodGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvcikudmFsKGNvbW1hbmRzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBCYXRjaENvbW1hbmQ7XHJcbn0oQmFzZUNvbW1hbmRfMS5CYXNlQ29tbWFuZCkpO1xyXG5leHBvcnRzLkJhdGNoQ29tbWFuZCA9IEJhdGNoQ29tbWFuZDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QmF0Y2hDb21tYW5kLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBCYXRjaENvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL0JhdGNoQ29tbWFuZFwiKTtcclxuZXhwb3J0cy5CYXRjaENvbW1hbmQgPSBCYXRjaENvbW1hbmRfMS5CYXRjaENvbW1hbmQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBEaXNjb3JkQWNjZXNzb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBEaXNjb3JkQWNjZXNzb3IobG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGlzY29yZEFjY2Vzc29yLnByb3RvdHlwZSwgXCJ1c2VySWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJCgnI2Rpc2NvcmRVc2VySWQnKS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHVzZXJJZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKCcjZGlzY29yZFVzZXJJZCcpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEaXNjb3JkQWNjZXNzb3IucHJvdG90eXBlLCBcImNoYW5uZWxJZFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKCcjZGlzY29yZENoYW5uZWxJZCcpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY2hhbm5lbElkIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoJyNkaXNjb3JkQ2hhbm5lbElkJykudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERpc2NvcmRBY2Nlc3Nvci5wcm90b3R5cGUsIFwiZ3VpbGRJZFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKCcjZGlzY29yZEd1aWxkSWQnKS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGRpc2NvcmRHdWlsZElkIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoJyNkaXNjb3JkR3VpbGRJZCcpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBEaXNjb3JkQWNjZXNzb3I7XHJcbn0oKSk7XHJcbmV4cG9ydHMuRGlzY29yZEFjY2Vzc29yID0gRGlzY29yZEFjY2Vzc29yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1EaXNjb3JkQWNjZXNzb3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIERpc2NvcmRBY2Nlc3Nvcl8xID0gcmVxdWlyZShcIi4vRGlzY29yZEFjY2Vzc29yXCIpO1xyXG5leHBvcnRzLkRpc2NvcmRBY2Nlc3NvciA9IERpc2NvcmRBY2Nlc3Nvcl8xLkRpc2NvcmRBY2Nlc3NvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIExvZ0xldmVsO1xyXG4oZnVuY3Rpb24gKExvZ0xldmVsKSB7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcInRyYWNlXCJdID0gMF0gPSBcInRyYWNlXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcImRlYnVnXCJdID0gMV0gPSBcImRlYnVnXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcImluZm9cIl0gPSAyXSA9IFwiaW5mb1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJ3YXJuaW5nXCJdID0gM10gPSBcIndhcm5pbmdcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiZXJyb3JcIl0gPSA0XSA9IFwiZXJyb3JcIjtcclxufSkoTG9nTGV2ZWwgPSBleHBvcnRzLkxvZ0xldmVsIHx8IChleHBvcnRzLkxvZ0xldmVsID0ge30pKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TG9nTGV2ZWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIExvZ0xldmVsXzEgPSByZXF1aXJlKFwiLi9Mb2dMZXZlbFwiKTtcclxudmFyIExvZ2dlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExvZ2dlcih4LCBtaW5pbXVtTG9nTGV2ZWwpIHtcclxuICAgICAgICB0aGlzLm1pbmltdW1Mb2dMZXZlbCA9IG1pbmltdW1Mb2dMZXZlbDtcclxuICAgICAgICB0aGlzLmxvZ3NTZWxlY3RvciA9ICcjbG9ncyc7XHJcbiAgICAgICAgdGhpcy5UTmFtZSA9IHgubmFtZTtcclxuICAgIH1cclxuICAgIExvZ2dlci5wcm90b3R5cGUud2FybmluZyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWxfMS5Mb2dMZXZlbC53YXJuaW5nKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLmVycm9yKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLmluZm8gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsXzEuTG9nTGV2ZWwuaW5mbyk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS50cmFjZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWxfMS5Mb2dMZXZlbC50cmFjZSk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWxfMS5Mb2dMZXZlbC5kZWJ1Zyk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5wcmVwZW5kID0gZnVuY3Rpb24gKHZhbHVlLCBsb2dMZXZlbCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1pbmltdW1Mb2dMZXZlbCA+IGxvZ0xldmVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyICRyb3cgPSAkKCc8ZGl2IGNsYXNzPVwicm93XCI+Jyk7XHJcbiAgICAgICAgdmFyICRjb2wxID0gJCgnPGRpdiBjbGFzcz1cImNvbC0zXCI+Jyk7XHJcbiAgICAgICAgdmFyICRjb2wyID0gJCgnPGRpdiBjbGFzcz1cImNvbC05XCI+Jyk7XHJcbiAgICAgICAgJHJvdy5hZGRDbGFzcyhcImxldmVsLVwiICsgbG9nTGV2ZWwpO1xyXG4gICAgICAgICRjb2wxLmh0bWwodGhpcy5UTmFtZSk7XHJcbiAgICAgICAgJGNvbDIuaHRtbCh2YWx1ZSk7XHJcbiAgICAgICAgJGNvbDEuYXBwZW5kVG8oJHJvdyk7XHJcbiAgICAgICAgJGNvbDIuYXBwZW5kVG8oJHJvdyk7XHJcbiAgICAgICAgJHJvdy5wcmVwZW5kVG8odGhpcy5sb2dzU2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShMb2dnZXIucHJvdG90eXBlLCBcIlR5cGVOYW1lXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVE5hbWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gTG9nZ2VyO1xyXG59KCkpO1xyXG5leHBvcnRzLkxvZ2dlciA9IExvZ2dlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TG9nZ2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2dMZXZlbF8xID0gcmVxdWlyZShcIi4vTG9nTGV2ZWxcIik7XHJcbnZhciBMb2dnZXJfMSA9IHJlcXVpcmUoXCIuL0xvZ2dlclwiKTtcclxudmFyIExvZ2dlckZhY3RvcnkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMb2dnZXJGYWN0b3J5KCkge1xyXG4gICAgfVxyXG4gICAgTG9nZ2VyRmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKHgsIG1pbmltdW1Mb2dMZXZlbCkge1xyXG4gICAgICAgIGlmIChtaW5pbXVtTG9nTGV2ZWwgPT09IHZvaWQgMCkgeyBtaW5pbXVtTG9nTGV2ZWwgPSBMb2dMZXZlbF8xLkxvZ0xldmVsLnRyYWNlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMb2dnZXJfMS5Mb2dnZXIoeCwgbWluaW11bUxvZ0xldmVsKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTG9nZ2VyRmFjdG9yeTtcclxufSgpKTtcclxuZXhwb3J0cy5Mb2dnZXJGYWN0b3J5ID0gTG9nZ2VyRmFjdG9yeTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TG9nZ2VyRmFjdG9yeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nZ2VyXzEgPSByZXF1aXJlKFwiLi9Mb2dnZXJcIik7XHJcbmV4cG9ydHMuTG9nZ2VyID0gTG9nZ2VyXzEuTG9nZ2VyO1xyXG52YXIgTG9nZ2VyRmFjdG9yeV8xID0gcmVxdWlyZShcIi4vTG9nZ2VyRmFjdG9yeVwiKTtcclxuZXhwb3J0cy5Mb2dnZXJGYWN0b3J5ID0gTG9nZ2VyRmFjdG9yeV8xLkxvZ2dlckZhY3Rvcnk7XHJcbnZhciBMb2dMZXZlbF8xID0gcmVxdWlyZShcIi4vTG9nTGV2ZWxcIik7XHJcbmV4cG9ydHMuTG9nTGV2ZWwgPSBMb2dMZXZlbF8xLkxvZ0xldmVsO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgUmFjZVBhcnQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBSYWNlUGFydChuYW1lLCBkaWZmaWN1bHR5LCBkaXN0YW5jZSkge1xyXG4gICAgICAgIGlmIChkaWZmaWN1bHR5ID09PSB2b2lkIDApIHsgZGlmZmljdWx0eSA9ICdwcCc7IH1cclxuICAgICAgICBpZiAoZGlzdGFuY2UgPT09IHZvaWQgMCkgeyBkaXN0YW5jZSA9IDIwOyB9XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmRpZmZpY3VsdHkgPSBkaWZmaWN1bHR5O1xyXG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgIH1cclxuICAgIHJldHVybiBSYWNlUGFydDtcclxufSgpKTtcclxuZXhwb3J0cy5SYWNlUGFydCA9IFJhY2VQYXJ0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1SYWNlUGFydC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIEJhc2VDb21tYW5kXzEgPSByZXF1aXJlKFwiLi4vQmFzZUNvbW1hbmRcIik7XHJcbnZhciBSYWNlckNvbW1hbmQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoUmFjZXJDb21tYW5kLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gUmFjZXJDb21tYW5kKGxvZ2dlckZhY3RvcnksIHN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5LCBkaXNjb3JkSW5mbykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGxvZ2dlckZhY3RvcnkuY3JlYXRlKFJhY2VyQ29tbWFuZCkpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnkgPSBzeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeTtcclxuICAgICAgICBfdGhpcy5kaXNjb3JkSW5mbyA9IGRpc2NvcmRJbmZvO1xyXG4gICAgICAgIF90aGlzLnJhY2VyRm9ybUFjY2Vzc29ycyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIF90aGlzLnJvd0NvdW50ID0gMDtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ1JhY2VyQ29tbWFuZCBsb2FkaW5nJyk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hTdWJtaXRCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaEFkZFJhY2VyQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hTb3J0SW5pdEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoU29ydFJhY2VCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFJlc29sdmVOZWdhdGl2ZXNTeW1ib2xzKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hSZW1vdmVSb3dCdXR0b25zKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hFeGlzdGluZ1JhY2VyKCk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ1JhY2VyQ29tbWFuZCBsb2FkZWQnKTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFJlbW92ZVJvd0J1dHRvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLWluZGV4XScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gJCh0aGlzKS5hdHRyKCdkYXRhLWluZGV4Jyk7XHJcbiAgICAgICAgICAgICQoXCJbZGF0YS1zeW1ib2xzLXJvdz1cXFwiXCIgKyBpbmRleCArIFwiXFxcIl1cIikucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hSZXNvbHZlTmVnYXRpdmVzU3ltYm9scyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNyZXNvbHZlTmVnYXRpdmVzU3ltYm9scycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgncmVzb2x2ZU5lZ2F0aXZlc1N5bWJvbHM6Y2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIG1lLnJhY2VyRm9ybUFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChhY2Nlc3Nvcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3NlcyA9IGFjY2Vzc29yLnN1Y2Nlc3NlcyAtIGFjY2Vzc29yLmZhaWx1cmVzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkdmFudGFnZXMgPSBhY2Nlc3Nvci5hZHZhbnRhZ2VzIC0gYWNjZXNzb3IudGhyZWF0cztcclxuICAgICAgICAgICAgICAgIHZhciBmYWlsdXJlcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhyZWF0cyA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2Vzc2VzIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZhaWx1cmVzID0gLXN1Y2Nlc3NlcztcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzZXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFkdmFudGFnZXMgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyZWF0cyA9IC1hZHZhbnRhZ2VzO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkdmFudGFnZXMgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWNjZXNzb3Iuc3VjY2Vzc2VzID0gc3VjY2Vzc2VzO1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzb3IuZmFpbHVyZXMgPSBmYWlsdXJlcztcclxuICAgICAgICAgICAgICAgIGFjY2Vzc29yLmFkdmFudGFnZXMgPSBhZHZhbnRhZ2VzO1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzb3IudGhyZWF0cyA9IHRocmVhdHM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoU29ydFJhY2VCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjc29ydFJhY2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ3NvcnRSYWNlOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBtZS5yYWNlckZvcm1BY2Nlc3NvcnMgPSBtZS5yYWNlckZvcm1BY2Nlc3NvcnNcclxuICAgICAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWUuc29ydENvbXBvdW5kKGEuc3VjY2Vzc2VzIC0gYS5mYWlsdXJlcywgYi5zdWNjZXNzZXMgLSBiLmZhaWx1cmVzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIG1lLnNvcnRDb21wb3VuZChhLmFkdmFudGFnZXMgLSBhLnRocmVhdHMsIGIuYWR2YW50YWdlcyAtIGIudGhyZWF0cykgfHxcclxuICAgICAgICAgICAgICAgICAgICBtZS5zb3J0Q29tcG91bmQoYS50cml1bXBocywgYi50cml1bXBocykgfHxcclxuICAgICAgICAgICAgICAgICAgICBtZS5zb3J0Q29tcG91bmQoYi5kZXNwYWlycywgYS5kZXNwYWlycyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICBtZS5yZW9yZGVyUm93cygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoU29ydEluaXRCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjc29ydEluaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ3NvcnRJbml0OmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBtZS5yYWNlckZvcm1BY2Nlc3NvcnMgPSBtZS5yYWNlckZvcm1BY2Nlc3NvcnNcclxuICAgICAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWUuc29ydENvbXBvdW5kKGEuc3VjY2Vzc2VzLCBiLnN1Y2Nlc3NlcykgfHxcclxuICAgICAgICAgICAgICAgICAgICBtZS5zb3J0Q29tcG91bmQoYS5hZHZhbnRhZ2VzLCBiLmFkdmFudGFnZXMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEudHJpdW1waHMsIGIudHJpdW1waHMpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgbWUucmVvcmRlclJvd3MoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLnJlb3JkZXJSb3dzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkcGFyZW50ID0gJCgnI2Rpc3BsYXktc3ltYm9scy1jYXJkJyk7XHJcbiAgICAgICAgdmFyICRyb3dzID0gJHBhcmVudC5yZW1vdmUoJ1tkYXRhLXN5bWJvbHMtcm93XScpO1xyXG4gICAgICAgIHRoaXMucmFjZXJGb3JtQWNjZXNzb3JzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gZWxlbWVudC5nZXRJbmRleCgpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBcIltkYXRhLXN5bWJvbHMtcm93PVxcXCJcIiArIGluZGV4ICsgXCJcXFwiXVwiO1xyXG4gICAgICAgICAgICB2YXIgJGVsID0gJChzZWxlY3RvciwgJHJvd3MpO1xyXG4gICAgICAgICAgICAkcGFyZW50LmFwcGVuZCgkZWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuc29ydENvbXBvdW5kID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICBpZiAoYSA+IGIpXHJcbiAgICAgICAgICAgIHJldHVybiArMTtcclxuICAgICAgICBpZiAoYSA8IGIpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaEFkZFJhY2VyQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI2FkZFN5bWJvbHNSb3cnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ2FkZFJhY2VyOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBtZS5hZGRSYWNlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoRXhpc3RpbmdSYWNlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBhY2Nlc3NvcnMgPSB0aGlzLnN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5LmF0dGFjaCgpO1xyXG4gICAgICAgIGFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChhY2Nlc3NvcikgeyByZXR1cm4gX3RoaXMucmFjZXJGb3JtQWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpOyB9KTtcclxuICAgICAgICB0aGlzLnJvd0NvdW50ID0gYWNjZXNzb3JzLmxlbmd0aDtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmFkZFJhY2VyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhY2Nlc3NvciA9IHRoaXMuc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnkuY3JlYXRlKHRoaXMucm93Q291bnQrKyk7XHJcbiAgICAgICAgdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hTdWJtaXRCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjZGlzcGxheVJhY2VycycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnZGlzcGxheVJhY2VyczpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBtZS5jcmVhdGVSYWNlTW9kZWwoKTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jb21tYW5kcy9kaXNwbGF5LXJhY2VycycsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIuaW5mbyhtc2cpO1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdkaXNwbGF5UmFjZXJzOnBvc3RlZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmNyZWF0ZVJhY2VNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgdXNlcklkOiB0aGlzLmRpc2NvcmRJbmZvLnVzZXJJZCxcclxuICAgICAgICAgICAgY2hhbm5lbElkOiB0aGlzLmRpc2NvcmRJbmZvLmNoYW5uZWxJZCxcclxuICAgICAgICAgICAgZ3VpbGRJZDogdGhpcy5kaXNjb3JkSW5mby5ndWlsZElkLFxyXG4gICAgICAgICAgICByYWNlcnM6IG5ldyBBcnJheSgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnJhY2VyRm9ybUFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgZGF0YS5yYWNlcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAvLyBSYWNlclxyXG4gICAgICAgICAgICAgICAgcmFjZXI6IHJvdy5yYWNlcixcclxuICAgICAgICAgICAgICAgIHNraWxsOiByb3cuc2tpbGwsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiByb3cudHlwZSxcclxuICAgICAgICAgICAgICAgIC8vIFZlaGljbGVcclxuICAgICAgICAgICAgICAgIHZlaGljbGU6IHJvdy52ZWhpY2xlLFxyXG4gICAgICAgICAgICAgICAgc2lsaG91ZXR0ZTogcm93LnNpbGhvdWV0dGUsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3BlZWQ6IHJvdy5jdXJyZW50U3BlZWQsXHJcbiAgICAgICAgICAgICAgICBtYXhTcGVlZDogcm93Lm1heFNwZWVkLFxyXG4gICAgICAgICAgICAgICAgaGFuZGxpbmc6IHJvdy5oYW5kbGluZyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTeXN0ZW1TdHJhaW46IHJvdy5jdXJyZW50U3lzdGVtU3RyYWluLFxyXG4gICAgICAgICAgICAgICAgbWF4U3lzdGVtU3RyYWluOiByb3cubWF4U3lzdGVtU3RyYWluLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudEh1bGw6IHJvdy5jdXJyZW50SHVsbCxcclxuICAgICAgICAgICAgICAgIG1heEh1bGw6IHJvdy5tYXhIdWxsLFxyXG4gICAgICAgICAgICAgICAgcGFydDogcm93LnBhcnQsXHJcbiAgICAgICAgICAgICAgICBsYXA6IHJvdy5sYXAsXHJcbiAgICAgICAgICAgICAgICAvLyBTeW1ib2xzXHJcbiAgICAgICAgICAgICAgICBhZHZhbnRhZ2VzOiByb3cuYWR2YW50YWdlcyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3Nlczogcm93LnN1Y2Nlc3NlcyxcclxuICAgICAgICAgICAgICAgIHRyaXVtcGhzOiByb3cudHJpdW1waHMsXHJcbiAgICAgICAgICAgICAgICB0aHJlYXRzOiByb3cudGhyZWF0cyxcclxuICAgICAgICAgICAgICAgIGZhaWx1cmVzOiByb3cuZmFpbHVyZXMsXHJcbiAgICAgICAgICAgICAgICBkZXNwYWlyczogcm93LmRlc3BhaXJzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlckNvbW1hbmQucHJvdG90eXBlLCBcInJhY2Vyc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJhY2VyRm9ybUFjY2Vzc29ycztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ05vdFN1cHBvcnRlZEV4Y2VwdGlvbic7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gUmFjZXJDb21tYW5kO1xyXG59KEJhc2VDb21tYW5kXzEuQmFzZUNvbW1hbmQpKTtcclxuZXhwb3J0cy5SYWNlckNvbW1hbmQgPSBSYWNlckNvbW1hbmQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVJhY2VyQ29tbWFuZC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgXzEgPSByZXF1aXJlKFwiLlwiKTtcclxudmFyIFJhY2VyRm9ybUZhY3RvcnkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBSYWNlckZvcm1GYWN0b3J5KGxvZ2dlckZhY3RvcnkpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlckZhY3RvcnkgPSBsb2dnZXJGYWN0b3J5O1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyRmFjdG9yeS5jcmVhdGUoUmFjZXJGb3JtRmFjdG9yeSk7XHJcbiAgICB9XHJcbiAgICBSYWNlckZvcm1GYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICB2YXIgYWNjZXNzb3IgPSBuZXcgXzEuUmFjZXJSb3dBY2Nlc3NvcihpbmRleCwgdGhpcy5sb2dnZXJGYWN0b3J5KTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIG1lLmxvZ2dlci50cmFjZShcIlN5bWJvbHNGb3JtQWNjZXNzb3JGYWN0b3J5OmxvYWRpbmc6XCIgKyBpbmRleCk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAnL3BhcnRpYWxzL2luZGV4LWRpc3BsYXktc3ltYm9scy1mb3JtJyxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YTogeyBpbmRleDogaW5kZXggfVxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKFwiU3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3Rvcnk6bG9hZGVkOlwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgJHBhcmVudCA9ICQoJyNkaXNwbGF5LXN5bWJvbHMtY2FyZCcpO1xyXG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQoZGF0YSk7XHJcbiAgICAgICAgICAgICRwYXJlbnQuYXBwZW5kKCRyb3cpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhY2Nlc3NvcjtcclxuICAgIH07XHJcbiAgICBSYWNlckZvcm1GYWN0b3J5LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29ycyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnW2RhdGEtc3ltYm9scy1yb3ddJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkcm93ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoJHJvdy5hdHRyKCdkYXRhLXN5bWJvbHMtcm93JykpO1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoXCJTeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeTphdHRhY2hpbmc6XCIgKyBpbmRleCk7XHJcbiAgICAgICAgICAgIHZhciBhY2Nlc3NvciA9IG5ldyBfMS5SYWNlclJvd0FjY2Vzc29yKGluZGV4LCBtZS5sb2dnZXJGYWN0b3J5KTtcclxuICAgICAgICAgICAgYWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhY2Nlc3NvcnM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFJhY2VyRm9ybUZhY3Rvcnk7XHJcbn0oKSk7XHJcbmV4cG9ydHMuUmFjZXJGb3JtRmFjdG9yeSA9IFJhY2VyRm9ybUZhY3Rvcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVJhY2VyRm9ybUZhY3RvcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFJhY2VyUm93QWNjZXNzb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBSYWNlclJvd0FjY2Vzc29yKGluZGV4LCBsb2dnZXJGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyRmFjdG9yeS5jcmVhdGUoUmFjZXJSb3dBY2Nlc3Nvcik7XHJcbiAgICB9XHJcbiAgICBSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZS5nZXRJbmRleCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleDtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwicmFjZXJcIiwge1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gUmFjZXJcclxuICAgICAgICAvL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNyYWNlci1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgcmFjZXIgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNyYWNlci1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJza2lsbFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3NraWxsLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBza2lsbCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3NraWxsLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInR5cGVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN0eXBlLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0eXBlIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjdHlwZS1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJ2ZWhpY2xlXCIsIHtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIFZlaGljbGVcclxuICAgICAgICAvL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN2ZWhpY2xlLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB2ZWhpY2xlIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjdmVoaWNsZS1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJzaWxob3VldHRlXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjc2lsaG91ZXR0ZS1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgc2lsaG91ZXR0ZSB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3NpbGhvdWV0dGUtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwiY3VycmVudFNwZWVkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjY3VycmVudC1zcGVlZC1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY3VycmVudFNwZWVkIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjY3VycmVudC1zcGVlZC1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJtYXhTcGVlZFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI21heC1zcGVlZC1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgbWF4U3BlZWQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNtYXgtc3BlZWQtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwiaGFuZGxpbmdcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNoYW5kbGluZy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgaGFuZGxpbmcgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNoYW5kbGluZy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJjdXJyZW50U3lzdGVtU3RyYWluXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjY3VycmVudC1zcy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY3VycmVudFN5c3RlbVN0cmFpbiB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2N1cnJlbnQtc3MtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwibWF4U3lzdGVtU3RyYWluXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjbWF4LXNzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBtYXhTeXN0ZW1TdHJhaW4gdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNtYXgtc3MtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwiY3VycmVudEh1bGxcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNjdXJyZW50LWh1bGwtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGN1cnJlbnRIdWxsIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjY3VycmVudC1odWxsLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcIm1heEh1bGxcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNtYXgtaHVsbC1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgbWF4SHVsbCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI21heC1odWxsLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInBhcnRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNwYXJ0LVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBwYXJ0IHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjcGFydC1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJsYXBcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNsYXAtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGxhcCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2xhcC1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJhZHZhbnRhZ2VzXCIsIHtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIFN5bWJvbHNcclxuICAgICAgICAvL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNhZHZhbnRhZ2VzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBhZHZhbnRhZ2VzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjYWR2YW50YWdlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJzdWNjZXNzZXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNzdWNjZXNzZXMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHN1Y2Nlc3NlcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3N1Y2Nlc3Nlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJ0cml1bXBoc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RyaXVtcGhzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0cml1bXBocyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3RyaXVtcGhzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInRocmVhdHNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiN0aHJlYXRzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyB0aHJlYXRzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjdGhyZWF0cy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJmYWlsdXJlc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2ZhaWx1cmVzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBmYWlsdXJlcyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2ZhaWx1cmVzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcImRlc3BhaXJzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjZGVzcGFpcnMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGRlc3BhaXJzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjZGVzcGFpcnMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gUmFjZXJSb3dBY2Nlc3NvcjtcclxufSgpKTtcclxuZXhwb3J0cy5SYWNlclJvd0FjY2Vzc29yID0gUmFjZXJSb3dBY2Nlc3NvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmFjZXJSb3dBY2Nlc3Nvci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgUmFjZXJGb3JtRmFjdG9yeV8xID0gcmVxdWlyZShcIi4vUmFjZXJGb3JtRmFjdG9yeVwiKTtcclxuZXhwb3J0cy5SYWNlckZvcm1GYWN0b3J5ID0gUmFjZXJGb3JtRmFjdG9yeV8xLlJhY2VyRm9ybUZhY3Rvcnk7XHJcbnZhciBSYWNlckNvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL1JhY2VyQ29tbWFuZFwiKTtcclxuZXhwb3J0cy5SYWNlckNvbW1hbmQgPSBSYWNlckNvbW1hbmRfMS5SYWNlckNvbW1hbmQ7XHJcbnZhciBSYWNlclJvd0FjY2Vzc29yXzEgPSByZXF1aXJlKFwiLi9SYWNlclJvd0FjY2Vzc29yXCIpO1xyXG5leHBvcnRzLlJhY2VyUm93QWNjZXNzb3IgPSBSYWNlclJvd0FjY2Vzc29yXzEuUmFjZXJSb3dBY2Nlc3NvcjtcclxudmFyIFJhY2VQYXJ0XzEgPSByZXF1aXJlKFwiLi9SYWNlUGFydFwiKTtcclxuZXhwb3J0cy5SYWNlUGFydCA9IFJhY2VQYXJ0XzEuUmFjZVBhcnQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2dnaW5nXzEgPSByZXF1aXJlKFwiLi9Mb2dnaW5nXCIpO1xyXG52YXIgRGlzY29yZEluZm9fMSA9IHJlcXVpcmUoXCIuL0Rpc2NvcmRJbmZvXCIpO1xyXG52YXIgQmF0Y2hDb21tYW5kXzEgPSByZXF1aXJlKFwiLi9CYXRjaENvbW1hbmRcIik7XHJcbnZhciBSYWNlckNvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL1JhY2VyQ29tbWFuZFwiKTtcclxudmFyIE1haW4gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBNYWluKGNvbW1hbmRzLCBsb2dnZXJGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kcyA9IGNvbW1hbmRzO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyRmFjdG9yeS5jcmVhdGUoTWFpbik7XHJcbiAgICB9XHJcbiAgICBNYWluLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ01haW4gaW5pdGlhbGl6aW5nJyk7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRDb21tYW5kID0gJCgnYm9keScpLmF0dHIoJ2RhdGEtY29tbWFuZC1pZGVudGlmaWVyJyk7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kcy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZCA9PT0gY29tbWFuZC5pZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5sb2dnZXIuZGVidWcoXCJDdXJyZW50IGNvbW1hbmQ6IFwiICsgY29tbWFuZC5pZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMubG9nZ2VyLmRlYnVnKFwiU2tpcCBpbml0aWFsaXphdGlvbiBvZiBjb21tYW5kOiBcIiArIGNvbW1hbmQuaWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnTWFpbiBpbml0aWFsaXplZCcpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBNYWluO1xyXG59KCkpO1xyXG5leHBvcnRzLk1haW4gPSBNYWluO1xyXG4vL1xyXG4vLyBDb21wb3NpdGlvbiByb290XHJcbi8vXHJcbnZhciBsb2dnZXJGYWN0b3J5ID0gbmV3IExvZ2dpbmdfMS5Mb2dnZXJGYWN0b3J5KCk7XHJcbnZhciBkaXNjb3JkSW5mbyA9IG5ldyBEaXNjb3JkSW5mb18xLkRpc2NvcmRBY2Nlc3Nvcihsb2dnZXJGYWN0b3J5LmNyZWF0ZShEaXNjb3JkSW5mb18xLkRpc2NvcmRBY2Nlc3NvcikpO1xyXG52YXIgZm9ybUFjY2Vzc29yID0gbmV3IEJhdGNoQ29tbWFuZF8xLkJhdGNoQ29tbWFuZChsb2dnZXJGYWN0b3J5LCBkaXNjb3JkSW5mbyk7XHJcbnZhciBzeW1ib2xzRm9ybUFjY2Vzc29yRmFjdG9yeSA9IG5ldyBSYWNlckNvbW1hbmRfMS5SYWNlckZvcm1GYWN0b3J5KGxvZ2dlckZhY3RvcnkpO1xyXG52YXIgZGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3NvciA9IG5ldyBSYWNlckNvbW1hbmRfMS5SYWNlckNvbW1hbmQobG9nZ2VyRmFjdG9yeSwgc3ltYm9sc0Zvcm1BY2Nlc3NvckZhY3RvcnksIGRpc2NvcmRJbmZvKTtcclxudmFyIGNvbW1hbmRzID0gW2Zvcm1BY2Nlc3NvciwgZGlzcGxheVN5bWJvbHNDb21tYW5kc0Zvcm1BY2Nlc3Nvcl07XHJcbnZhciBtYWluID0gbmV3IE1haW4oY29tbWFuZHMsIGxvZ2dlckZhY3RvcnkpO1xyXG4kKGZ1bmN0aW9uICgpIHtcclxuICAgIG1haW4uaW5pdGlhbGl6ZSgpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2xpZW50LmpzLm1hcCJdfQ==
