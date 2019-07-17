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
Object.defineProperty(exports, "__esModule", { value: true });
var RacePartAccessor = /** @class */ (function () {
    function RacePartAccessor(index, loggerFactory) {
        this.index = index;
        this.logger = loggerFactory.create(RacePartAccessor);
    }
    RacePartAccessor.prototype.getIndex = function () {
        return this.index;
    };
    Object.defineProperty(RacePartAccessor.prototype, "name", {
        get: function () {
            return $("#partName" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting name to " + v);
            $("#partName" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacePartAccessor.prototype, "difficulty", {
        get: function () {
            return $("#partDifficulty" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting difficulty to " + v);
            $("#partDifficulty" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RacePartAccessor.prototype, "distance", {
        get: function () {
            return $("#partDistance" + this.index).val();
        },
        set: function (v) {
            this.logger.debug("Setting distance to " + v);
            $("#partDistance" + this.index).val(v);
        },
        enumerable: true,
        configurable: true
    });
    return RacePartAccessor;
}());
exports.RacePartAccessor = RacePartAccessor;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RacerFormFactory_1 = require("./RacerFormFactory");
var RacePartAccessor_1 = require("./RacePartAccessor");
var RacePartFactory = /** @class */ (function () {
    function RacePartFactory(loggerFactory) {
        this.loggerFactory = loggerFactory;
        this.logger = loggerFactory.create(RacerFormFactory_1.RacerFormFactory);
    }
    RacePartFactory.prototype.attach = function () {
        var me = this;
        var accessors = new Array();
        $('[data-race-part]').each(function () {
            var $row = $(this);
            var index = parseInt($row.attr('data-race-part'));
            me.logger.trace("RacePartFactory:attaching:" + index);
            var accessor = new RacePartAccessor_1.RacePartAccessor(index, me.loggerFactory);
            accessors.push(accessor);
        });
        return accessors;
    };
    return RacePartFactory;
}());
exports.RacePartFactory = RacePartFactory;

},{"./RacePartAccessor":11,"./RacerFormFactory":14}],13:[function(require,module,exports){
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
var _1 = require(".");
var RacerCommand = /** @class */ (function (_super) {
    __extends(RacerCommand, _super);
    function RacerCommand(loggerFactory, racerFormFactory, discordInfo, racePartFactory, raceService) {
        if (raceService === void 0) { raceService = new RaceService(); }
        var _this = _super.call(this, loggerFactory.create(RacerCommand)) || this;
        _this.racerFormFactory = racerFormFactory;
        _this.discordInfo = discordInfo;
        _this.racePartFactory = racePartFactory;
        _this.raceService = raceService;
        _this.racerFormAccessors = new Array();
        _this.racePartAccessors = new Array();
        _this.rowCount = 0;
        return _this;
    }
    RacerCommand.prototype.initialize = function () {
        this.logger.trace('RacerCommand loading');
        this.attachSubmitButton();
        this.attachAddRacerButton();
        this.attachSortInitButton();
        this.attachSortRaceButton();
        this.attachResolveAllNegativeSymbolsButton();
        this.attachResolveOneNegativeSymbolsButtons();
        this.attachRemoveRowButtons();
        this.attachExistingRacer();
        this.attachResetButton();
        this.attachSaveButton();
        this.attachLoadButton();
        this.attachRollRaceButtons();
        this.loadExistingParts();
        this.logger.trace('RacerCommand loaded');
    };
    RacerCommand.prototype.attachSaveButton = function () {
        var me = this;
        $('#saveRace').on('click', function () {
            var name = prompt('Enter the race name');
            if (name) {
                var race = me.createRaceModel();
                var data = {
                    name: name,
                    race: race,
                    discordInfo: {
                        userId: me.discordInfo.userId,
                        channelId: me.discordInfo.channelId,
                        guildId: me.discordInfo.guildId
                    }
                };
                me.logger.trace("Saving race under name '" + name + "'.");
                me.logger.debug(JSON.stringify(data));
                $.ajax({
                    url: '/commands/save-race',
                    method: 'POST',
                    data: data
                }).done(function (msg) {
                    me.logger.info(msg);
                    me.logger.trace("Race '" + name + "' saved.");
                });
            }
            else {
                me.logger.info('Saving race aborted by the user.');
            }
        });
    };
    RacerCommand.prototype.attachLoadButton = function () {
        var me = this;
        $('#loadRace').on('click', function () {
            var name = prompt('Race name');
            if (name) {
                location.assign("/race?race=" + name);
            }
            else {
                me.logger.info('Save race aborted by the user.');
            }
        });
    };
    RacerCommand.prototype.attachResetButton = function () {
        var me = this;
        $('#resetRace').on('click', function () {
            if (confirm('Are you sure that you want to cancel the race? All unsaved changes will be lost forever!')) {
                me.logger.trace('Resetting the race');
                location.assign('/race');
            }
            else {
                me.logger.info("Race reset aborted by user.");
            }
        });
    };
    RacerCommand.prototype.attachRemoveRowButtons = function () {
        var me = this;
        $(document).on('click', '[data-delete="race-row"]', function () {
            var index = $(this).attr('data-index');
            if (confirm('Are you sure that you want to delete this row?')) {
                me.logger.trace("Deleting the row '" + index + "'.");
                $("[data-symbols-row=\"" + index + "\"]").remove();
            }
            else {
                me.logger.trace("Deletion of row '" + index + "' aborted by the user.");
            }
        });
    };
    RacerCommand.prototype.attachResolveAllNegativeSymbolsButton = function () {
        var me = this;
        $('#resolveNegativesSymbols').on('click', function (e) {
            me.logger.trace('Resolve all negative symbols');
            e.preventDefault();
            me.racerFormAccessors.forEach(function (accessor) { return me.raceService.applyNegativeEffects(accessor); });
        });
    };
    RacerCommand.prototype.attachResolveOneNegativeSymbolsButtons = function () {
        var me = this;
        $(document).on('click', '[data-resolve="race-negative"]', function (e) {
            var rawIndex = $(this).attr('data-index');
            var index = parseInt(rawIndex);
            me.logger.trace("Resolve negative symbols of " + index);
            e.preventDefault();
            var accessor = me.racerFormAccessors[index];
            if (accessor) {
                me.raceService.applyNegativeEffects(accessor);
            }
            else {
                me.logger.warning("The \"racerFormAccessors[" + index + "]\" does not exist.");
            }
        });
    };
    RacerCommand.prototype.attachRollRaceButtons = function () {
        var me = this;
        $(document).on('click', '[data-roll="race"]', function (e) {
            var rawIndex = $(this).attr('data-index');
            e.preventDefault();
            var index = parseInt(rawIndex);
            var accessor = me.racerFormAccessors[index];
            if (accessor) {
                me.logger.trace("Roll racing skill of index: " + index + " | skill: " + accessor.skill);
                // TODO
                me.logger.warning('Not yet implemented!');
            }
            else {
                me.logger.warning("The \"racerFormAccessors[" + index + "]\" does not exist.");
            }
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
    RacerCommand.prototype.loadExistingParts = function () {
        var _this = this;
        var accessors = this.racePartFactory.attach();
        accessors.forEach(function (accessor) { return _this.racePartAccessors.push(accessor); });
    };
    RacerCommand.prototype.attachExistingRacer = function () {
        var _this = this;
        var accessors = this.racerFormFactory.attach();
        accessors.forEach(function (accessor) { return _this.racerFormAccessors.push(accessor); });
        this.rowCount = accessors.length;
    };
    RacerCommand.prototype.addRacer = function () {
        var accessor = this.racerFormFactory.create(this.rowCount++);
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
            racers: new Array(),
            parts: new Array()
        };
        this.racers.forEach(function (row) {
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
        this.parts.forEach(function (part) { return data.parts.push(new _1.RacePart(part.name, part.difficulty, part.distance)); });
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
    Object.defineProperty(RacerCommand.prototype, "parts", {
        get: function () {
            return this.racePartAccessors;
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
var RaceService = /** @class */ (function () {
    function RaceService() {
    }
    RaceService.prototype.applyNegativeEffects = function (model) {
        var successes = model.successes - model.failures;
        var advantages = model.advantages - model.threats;
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
        model.successes = successes;
        model.failures = failures;
        model.advantages = advantages;
        model.threats = threats;
        return model;
    };
    return RaceService;
}());
exports.RaceService = RaceService;

},{".":16,"../BaseCommand":1}],14:[function(require,module,exports){
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
        me.logger.trace("RacerFormFactory:loading:" + index);
        $.ajax({
            url: '/partials/index-display-symbols-form',
            method: 'GET',
            data: { index: index }
        }).done(function (data) {
            me.logger.trace("RacerFormFactory:loaded:" + index);
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
            me.logger.trace("RacerFormFactory:attaching:" + index);
            var accessor = new _1.RacerRowAccessor(index, me.loggerFactory);
            accessors.push(accessor);
        });
        return accessors;
    };
    return RacerFormFactory;
}());
exports.RacerFormFactory = RacerFormFactory;

},{".":16}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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
var RacePartFactory_1 = require("./RacePartFactory");
exports.RacePartFactory = RacePartFactory_1.RacePartFactory;
var RacePartAccessor_1 = require("./RacePartAccessor");
exports.RacePartAccessor = RacePartAccessor_1.RacePartAccessor;

},{"./RacePart":10,"./RacePartAccessor":11,"./RacePartFactory":12,"./RacerCommand":13,"./RacerFormFactory":14,"./RacerRowAccessor":15}],17:[function(require,module,exports){
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
var racerFormFactory = new RacerCommand_1.RacerFormFactory(loggerFactory);
var racePartFactory = new RacerCommand_1.RacePartFactory(loggerFactory);
var displaySymbolsCommandsFormAccessor = new RacerCommand_1.RacerCommand(loggerFactory, racerFormFactory, discordInfo, racePartFactory);
var commands = [formAccessor, displaySymbolsCommandsFormAccessor];
var main = new Main(commands, loggerFactory);
$(function () {
    main.initialize();
});

},{"./BatchCommand":3,"./DiscordInfo":5,"./Logging":9,"./RacerCommand":16}]},{},[17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQmFzZUNvbW1hbmQuanMiLCJzcmMvQmF0Y2hDb21tYW5kL0JhdGNoQ29tbWFuZC5qcyIsInNyYy9CYXRjaENvbW1hbmQvaW5kZXguanMiLCJzcmMvRGlzY29yZEluZm8vRGlzY29yZEFjY2Vzc29yLmpzIiwic3JjL0Rpc2NvcmRJbmZvL2luZGV4LmpzIiwic3JjL0xvZ2dpbmcvTG9nTGV2ZWwuanMiLCJzcmMvTG9nZ2luZy9Mb2dnZXIuanMiLCJzcmMvTG9nZ2luZy9Mb2dnZXJGYWN0b3J5LmpzIiwic3JjL0xvZ2dpbmcvaW5kZXguanMiLCJzcmMvUmFjZXJDb21tYW5kL1JhY2VQYXJ0LmpzIiwic3JjL1JhY2VyQ29tbWFuZC9SYWNlUGFydEFjY2Vzc29yLmpzIiwic3JjL1JhY2VyQ29tbWFuZC9SYWNlUGFydEZhY3RvcnkuanMiLCJzcmMvUmFjZXJDb21tYW5kL1JhY2VyQ29tbWFuZC5qcyIsInNyYy9SYWNlckNvbW1hbmQvUmFjZXJGb3JtRmFjdG9yeS5qcyIsInNyYy9SYWNlckNvbW1hbmQvUmFjZXJSb3dBY2Nlc3Nvci5qcyIsInNyYy9SYWNlckNvbW1hbmQvaW5kZXguanMiLCJzcmMvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgQmFzZUNvbW1hbmQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCYXNlQ29tbWFuZChsb2dnZXIpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCYXNlQ29tbWFuZC5wcm90b3R5cGUsIFwiaWRlbnRpZmllclwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvZ2dlci5UeXBlTmFtZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBCYXNlQ29tbWFuZDtcclxufSgpKTtcclxuZXhwb3J0cy5CYXNlQ29tbWFuZCA9IEJhc2VDb21tYW5kO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1CYXNlQ29tbWFuZC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIEJhc2VDb21tYW5kXzEgPSByZXF1aXJlKFwiLi4vQmFzZUNvbW1hbmRcIik7XHJcbnZhciBCYXRjaENvbW1hbmQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoQmF0Y2hDb21tYW5kLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gQmF0Y2hDb21tYW5kKGxvZ2dlckZhY3RvcnksIGRpc2NvcmRJbmZvKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbG9nZ2VyRmFjdG9yeS5jcmVhdGUoQmF0Y2hDb21tYW5kKSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5kaXNjb3JkSW5mbyA9IGRpc2NvcmRJbmZvO1xyXG4gICAgICAgIF90aGlzLmNoYXRDb21tYW5kc1NlbGVjdG9yID0gJyNjaGF0Q29tbWFuZHMnO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEJhdGNoQ29tbWFuZC5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSgnQmF0Y2hDb21tYW5kIGxvYWRpbmcnKTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNzdWJtaXRNZXNzYWdlcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnQmF0Y2hDb21tYW5kOmNsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NvbW1hbmRzL2JhdGNoJyxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogbWUuZGlzY29yZEluZm8udXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5uZWxJZDogbWUuZGlzY29yZEluZm8uY2hhbm5lbElkLFxyXG4gICAgICAgICAgICAgICAgICAgIGd1aWxkSWQ6IG1lLmRpc2NvcmRJbmZvLmd1aWxkSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhdENvbW1hbmRzOiBtZS5jaGF0Q29tbWFuZHNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ0JhdGNoQ29tbWFuZDpwb3N0ZWQnKTtcclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci5pbmZvKG1zZyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdCYXRjaENvbW1hbmQgbG9hZGVkJyk7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhdGNoQ29tbWFuZC5wcm90b3R5cGUsIFwiY2hhdENvbW1hbmRzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJhdyA9ICQodGhpcy5jaGF0Q29tbWFuZHNTZWxlY3RvcikudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IHJhdy5yZXBsYWNlKCdcXHInLCAnJykuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWFuZHM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBjaGF0Q29tbWFuZHMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gdi5qb2luKCdcXG4nKTtcclxuICAgICAgICAgICAgJCh0aGlzLmNoYXRDb21tYW5kc1NlbGVjdG9yKS52YWwoY29tbWFuZHMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEJhdGNoQ29tbWFuZDtcclxufShCYXNlQ29tbWFuZF8xLkJhc2VDb21tYW5kKSk7XHJcbmV4cG9ydHMuQmF0Y2hDb21tYW5kID0gQmF0Y2hDb21tYW5kO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1CYXRjaENvbW1hbmQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIEJhdGNoQ29tbWFuZF8xID0gcmVxdWlyZShcIi4vQmF0Y2hDb21tYW5kXCIpO1xyXG5leHBvcnRzLkJhdGNoQ29tbWFuZCA9IEJhdGNoQ29tbWFuZF8xLkJhdGNoQ29tbWFuZDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIERpc2NvcmRBY2Nlc3NvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIERpc2NvcmRBY2Nlc3Nvcihsb2dnZXIpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEaXNjb3JkQWNjZXNzb3IucHJvdG90eXBlLCBcInVzZXJJZFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKCcjZGlzY29yZFVzZXJJZCcpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgdXNlcklkIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoJyNkaXNjb3JkVXNlcklkJykudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERpc2NvcmRBY2Nlc3Nvci5wcm90b3R5cGUsIFwiY2hhbm5lbElkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoJyNkaXNjb3JkQ2hhbm5lbElkJykudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBjaGFubmVsSWQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJCgnI2Rpc2NvcmRDaGFubmVsSWQnKS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGlzY29yZEFjY2Vzc29yLnByb3RvdHlwZSwgXCJndWlsZElkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoJyNkaXNjb3JkR3VpbGRJZCcpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgZGlzY29yZEd1aWxkSWQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJCgnI2Rpc2NvcmRHdWlsZElkJykudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIERpc2NvcmRBY2Nlc3NvcjtcclxufSgpKTtcclxuZXhwb3J0cy5EaXNjb3JkQWNjZXNzb3IgPSBEaXNjb3JkQWNjZXNzb3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURpc2NvcmRBY2Nlc3Nvci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgRGlzY29yZEFjY2Vzc29yXzEgPSByZXF1aXJlKFwiLi9EaXNjb3JkQWNjZXNzb3JcIik7XHJcbmV4cG9ydHMuRGlzY29yZEFjY2Vzc29yID0gRGlzY29yZEFjY2Vzc29yXzEuRGlzY29yZEFjY2Vzc29yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nTGV2ZWw7XHJcbihmdW5jdGlvbiAoTG9nTGV2ZWwpIHtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1widHJhY2VcIl0gPSAwXSA9IFwidHJhY2VcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiZGVidWdcIl0gPSAxXSA9IFwiZGVidWdcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiaW5mb1wiXSA9IDJdID0gXCJpbmZvXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIndhcm5pbmdcIl0gPSAzXSA9IFwid2FybmluZ1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJlcnJvclwiXSA9IDRdID0gXCJlcnJvclwiO1xyXG59KShMb2dMZXZlbCA9IGV4cG9ydHMuTG9nTGV2ZWwgfHwgKGV4cG9ydHMuTG9nTGV2ZWwgPSB7fSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Mb2dMZXZlbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nTGV2ZWxfMSA9IHJlcXVpcmUoXCIuL0xvZ0xldmVsXCIpO1xyXG52YXIgTG9nZ2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTG9nZ2VyKHgsIG1pbmltdW1Mb2dMZXZlbCkge1xyXG4gICAgICAgIHRoaXMubWluaW11bUxvZ0xldmVsID0gbWluaW11bUxvZ0xldmVsO1xyXG4gICAgICAgIHRoaXMubG9nc1NlbGVjdG9yID0gJyNsb2dzJztcclxuICAgICAgICB0aGlzLlROYW1lID0geC5uYW1lO1xyXG4gICAgfVxyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS53YXJuaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLndhcm5pbmcpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmQodmFsdWUsIExvZ0xldmVsXzEuTG9nTGV2ZWwuZXJyb3IpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZCh2YWx1ZSwgTG9nTGV2ZWxfMS5Mb2dMZXZlbC5pbmZvKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLnRyYWNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLnRyYWNlKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kKHZhbHVlLCBMb2dMZXZlbF8xLkxvZ0xldmVsLmRlYnVnKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLnByZXBlbmQgPSBmdW5jdGlvbiAodmFsdWUsIGxvZ0xldmVsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubWluaW11bUxvZ0xldmVsID4gbG9nTGV2ZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJHJvdyA9ICQoJzxkaXYgY2xhc3M9XCJyb3dcIj4nKTtcclxuICAgICAgICB2YXIgJGNvbDEgPSAkKCc8ZGl2IGNsYXNzPVwiY29sLTNcIj4nKTtcclxuICAgICAgICB2YXIgJGNvbDIgPSAkKCc8ZGl2IGNsYXNzPVwiY29sLTlcIj4nKTtcclxuICAgICAgICAkcm93LmFkZENsYXNzKFwibGV2ZWwtXCIgKyBsb2dMZXZlbCk7XHJcbiAgICAgICAgJGNvbDEuaHRtbCh0aGlzLlROYW1lKTtcclxuICAgICAgICAkY29sMi5odG1sKHZhbHVlKTtcclxuICAgICAgICAkY29sMS5hcHBlbmRUbygkcm93KTtcclxuICAgICAgICAkY29sMi5hcHBlbmRUbygkcm93KTtcclxuICAgICAgICAkcm93LnByZXBlbmRUbyh0aGlzLmxvZ3NTZWxlY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KExvZ2dlci5wcm90b3R5cGUsIFwiVHlwZU5hbWVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UTmFtZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBMb2dnZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTG9nZ2VyID0gTG9nZ2VyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Mb2dnZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIExvZ0xldmVsXzEgPSByZXF1aXJlKFwiLi9Mb2dMZXZlbFwiKTtcclxudmFyIExvZ2dlcl8xID0gcmVxdWlyZShcIi4vTG9nZ2VyXCIpO1xyXG52YXIgTG9nZ2VyRmFjdG9yeSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExvZ2dlckZhY3RvcnkoKSB7XHJcbiAgICB9XHJcbiAgICBMb2dnZXJGYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoeCwgbWluaW11bUxvZ0xldmVsKSB7XHJcbiAgICAgICAgaWYgKG1pbmltdW1Mb2dMZXZlbCA9PT0gdm9pZCAwKSB7IG1pbmltdW1Mb2dMZXZlbCA9IExvZ0xldmVsXzEuTG9nTGV2ZWwudHJhY2U7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExvZ2dlcl8xLkxvZ2dlcih4LCBtaW5pbXVtTG9nTGV2ZWwpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMb2dnZXJGYWN0b3J5O1xyXG59KCkpO1xyXG5leHBvcnRzLkxvZ2dlckZhY3RvcnkgPSBMb2dnZXJGYWN0b3J5O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Mb2dnZXJGYWN0b3J5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBMb2dnZXJfMSA9IHJlcXVpcmUoXCIuL0xvZ2dlclwiKTtcclxuZXhwb3J0cy5Mb2dnZXIgPSBMb2dnZXJfMS5Mb2dnZXI7XHJcbnZhciBMb2dnZXJGYWN0b3J5XzEgPSByZXF1aXJlKFwiLi9Mb2dnZXJGYWN0b3J5XCIpO1xyXG5leHBvcnRzLkxvZ2dlckZhY3RvcnkgPSBMb2dnZXJGYWN0b3J5XzEuTG9nZ2VyRmFjdG9yeTtcclxudmFyIExvZ0xldmVsXzEgPSByZXF1aXJlKFwiLi9Mb2dMZXZlbFwiKTtcclxuZXhwb3J0cy5Mb2dMZXZlbCA9IExvZ0xldmVsXzEuTG9nTGV2ZWw7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBSYWNlUGFydCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJhY2VQYXJ0KG5hbWUsIGRpZmZpY3VsdHksIGRpc3RhbmNlKSB7XHJcbiAgICAgICAgaWYgKGRpZmZpY3VsdHkgPT09IHZvaWQgMCkgeyBkaWZmaWN1bHR5ID0gJ3BwJzsgfVxyXG4gICAgICAgIGlmIChkaXN0YW5jZSA9PT0gdm9pZCAwKSB7IGRpc3RhbmNlID0gMjA7IH1cclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuZGlmZmljdWx0eSA9IGRpZmZpY3VsdHk7XHJcbiAgICAgICAgdGhpcy5kaXN0YW5jZSA9IGRpc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFJhY2VQYXJ0O1xyXG59KCkpO1xyXG5leHBvcnRzLlJhY2VQYXJ0ID0gUmFjZVBhcnQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVJhY2VQYXJ0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBSYWNlUGFydEFjY2Vzc29yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUmFjZVBhcnRBY2Nlc3NvcihpbmRleCwgbG9nZ2VyRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlckZhY3RvcnkuY3JlYXRlKFJhY2VQYXJ0QWNjZXNzb3IpO1xyXG4gICAgfVxyXG4gICAgUmFjZVBhcnRBY2Nlc3Nvci5wcm90b3R5cGUuZ2V0SW5kZXggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXg7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VQYXJ0QWNjZXNzb3IucHJvdG90eXBlLCBcIm5hbWVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNwYXJ0TmFtZVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBuYW1lIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjcGFydE5hbWVcIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlUGFydEFjY2Vzc29yLnByb3RvdHlwZSwgXCJkaWZmaWN1bHR5XCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjcGFydERpZmZpY3VsdHlcIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgZGlmZmljdWx0eSB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3BhcnREaWZmaWN1bHR5XCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZVBhcnRBY2Nlc3Nvci5wcm90b3R5cGUsIFwiZGlzdGFuY2VcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNwYXJ0RGlzdGFuY2VcIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgZGlzdGFuY2UgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNwYXJ0RGlzdGFuY2VcIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBSYWNlUGFydEFjY2Vzc29yO1xyXG59KCkpO1xyXG5leHBvcnRzLlJhY2VQYXJ0QWNjZXNzb3IgPSBSYWNlUGFydEFjY2Vzc29yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1SYWNlUGFydEFjY2Vzc29yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBSYWNlckZvcm1GYWN0b3J5XzEgPSByZXF1aXJlKFwiLi9SYWNlckZvcm1GYWN0b3J5XCIpO1xyXG52YXIgUmFjZVBhcnRBY2Nlc3Nvcl8xID0gcmVxdWlyZShcIi4vUmFjZVBhcnRBY2Nlc3NvclwiKTtcclxudmFyIFJhY2VQYXJ0RmFjdG9yeSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJhY2VQYXJ0RmFjdG9yeShsb2dnZXJGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJGYWN0b3J5ID0gbG9nZ2VyRmFjdG9yeTtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlckZhY3RvcnkuY3JlYXRlKFJhY2VyRm9ybUZhY3RvcnlfMS5SYWNlckZvcm1GYWN0b3J5KTtcclxuICAgIH1cclxuICAgIFJhY2VQYXJ0RmFjdG9yeS5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29ycyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICQoJ1tkYXRhLXJhY2UtcGFydF0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICRyb3cgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCgkcm93LmF0dHIoJ2RhdGEtcmFjZS1wYXJ0JykpO1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoXCJSYWNlUGFydEZhY3Rvcnk6YXR0YWNoaW5nOlwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgYWNjZXNzb3IgPSBuZXcgUmFjZVBhcnRBY2Nlc3Nvcl8xLlJhY2VQYXJ0QWNjZXNzb3IoaW5kZXgsIG1lLmxvZ2dlckZhY3RvcnkpO1xyXG4gICAgICAgICAgICBhY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGFjY2Vzc29ycztcclxuICAgIH07XHJcbiAgICByZXR1cm4gUmFjZVBhcnRGYWN0b3J5O1xyXG59KCkpO1xyXG5leHBvcnRzLlJhY2VQYXJ0RmFjdG9yeSA9IFJhY2VQYXJ0RmFjdG9yeTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmFjZVBhcnRGYWN0b3J5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgQmFzZUNvbW1hbmRfMSA9IHJlcXVpcmUoXCIuLi9CYXNlQ29tbWFuZFwiKTtcclxudmFyIF8xID0gcmVxdWlyZShcIi5cIik7XHJcbnZhciBSYWNlckNvbW1hbmQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoUmFjZXJDb21tYW5kLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gUmFjZXJDb21tYW5kKGxvZ2dlckZhY3RvcnksIHJhY2VyRm9ybUZhY3RvcnksIGRpc2NvcmRJbmZvLCByYWNlUGFydEZhY3RvcnksIHJhY2VTZXJ2aWNlKSB7XHJcbiAgICAgICAgaWYgKHJhY2VTZXJ2aWNlID09PSB2b2lkIDApIHsgcmFjZVNlcnZpY2UgPSBuZXcgUmFjZVNlcnZpY2UoKTsgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGxvZ2dlckZhY3RvcnkuY3JlYXRlKFJhY2VyQ29tbWFuZCkpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMucmFjZXJGb3JtRmFjdG9yeSA9IHJhY2VyRm9ybUZhY3Rvcnk7XHJcbiAgICAgICAgX3RoaXMuZGlzY29yZEluZm8gPSBkaXNjb3JkSW5mbztcclxuICAgICAgICBfdGhpcy5yYWNlUGFydEZhY3RvcnkgPSByYWNlUGFydEZhY3Rvcnk7XHJcbiAgICAgICAgX3RoaXMucmFjZVNlcnZpY2UgPSByYWNlU2VydmljZTtcclxuICAgICAgICBfdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnMgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICBfdGhpcy5yYWNlUGFydEFjY2Vzc29ycyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIF90aGlzLnJvd0NvdW50ID0gMDtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ1JhY2VyQ29tbWFuZCBsb2FkaW5nJyk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hTdWJtaXRCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaEFkZFJhY2VyQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hTb3J0SW5pdEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoU29ydFJhY2VCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFJlc29sdmVBbGxOZWdhdGl2ZVN5bWJvbHNCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmF0dGFjaFJlc29sdmVPbmVOZWdhdGl2ZVN5bWJvbHNCdXR0b25zKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hSZW1vdmVSb3dCdXR0b25zKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hFeGlzdGluZ1JhY2VyKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hSZXNldEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoU2F2ZUJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoTG9hZEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuYXR0YWNoUm9sbFJhY2VCdXR0b25zKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkRXhpc3RpbmdQYXJ0cygpO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdSYWNlckNvbW1hbmQgbG9hZGVkJyk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hTYXZlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3NhdmVSYWNlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHByb21wdCgnRW50ZXIgdGhlIHJhY2UgbmFtZScpO1xyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJhY2UgPSBtZS5jcmVhdGVSYWNlTW9kZWwoKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFjZTogcmFjZSxcclxuICAgICAgICAgICAgICAgICAgICBkaXNjb3JkSW5mbzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IG1lLmRpc2NvcmRJbmZvLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbElkOiBtZS5kaXNjb3JkSW5mby5jaGFubmVsSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1aWxkSWQ6IG1lLmRpc2NvcmRJbmZvLmd1aWxkSWRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKFwiU2F2aW5nIHJhY2UgdW5kZXIgbmFtZSAnXCIgKyBuYW1lICsgXCInLlwiKTtcclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci5kZWJ1ZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9jb21tYW5kcy9zYXZlLXJhY2UnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lLmxvZ2dlci5pbmZvKG1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKFwiUmFjZSAnXCIgKyBuYW1lICsgXCInIHNhdmVkLlwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLmluZm8oJ1NhdmluZyByYWNlIGFib3J0ZWQgYnkgdGhlIHVzZXIuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaExvYWRCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjbG9hZFJhY2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gcHJvbXB0KCdSYWNlIG5hbWUnKTtcclxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGxvY2F0aW9uLmFzc2lnbihcIi9yYWNlP3JhY2U9XCIgKyBuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci5pbmZvKCdTYXZlIHJhY2UgYWJvcnRlZCBieSB0aGUgdXNlci4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoUmVzZXRCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjcmVzZXRSYWNlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHRoYXQgeW91IHdhbnQgdG8gY2FuY2VsIHRoZSByYWNlPyBBbGwgdW5zYXZlZCBjaGFuZ2VzIHdpbGwgYmUgbG9zdCBmb3JldmVyIScpKSB7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ1Jlc2V0dGluZyB0aGUgcmFjZScpO1xyXG4gICAgICAgICAgICAgICAgbG9jYXRpb24uYXNzaWduKCcvcmFjZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLmluZm8oXCJSYWNlIHJlc2V0IGFib3J0ZWQgYnkgdXNlci5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFJlbW92ZVJvd0J1dHRvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtZGVsZXRlPVwicmFjZS1yb3dcIl0nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykuYXR0cignZGF0YS1pbmRleCcpO1xyXG4gICAgICAgICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHRoYXQgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgcm93PycpKSB7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoXCJEZWxldGluZyB0aGUgcm93ICdcIiArIGluZGV4ICsgXCInLlwiKTtcclxuICAgICAgICAgICAgICAgICQoXCJbZGF0YS1zeW1ib2xzLXJvdz1cXFwiXCIgKyBpbmRleCArIFwiXFxcIl1cIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoXCJEZWxldGlvbiBvZiByb3cgJ1wiICsgaW5kZXggKyBcIicgYWJvcnRlZCBieSB0aGUgdXNlci5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFJlc29sdmVBbGxOZWdhdGl2ZVN5bWJvbHNCdXR0b24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKCcjcmVzb2x2ZU5lZ2F0aXZlc1N5bWJvbHMnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ1Jlc29sdmUgYWxsIG5lZ2F0aXZlIHN5bWJvbHMnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBtZS5yYWNlckZvcm1BY2Nlc3NvcnMuZm9yRWFjaChmdW5jdGlvbiAoYWNjZXNzb3IpIHsgcmV0dXJuIG1lLnJhY2VTZXJ2aWNlLmFwcGx5TmVnYXRpdmVFZmZlY3RzKGFjY2Vzc29yKTsgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hSZXNvbHZlT25lTmVnYXRpdmVTeW1ib2xzQnV0dG9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS1yZXNvbHZlPVwicmFjZS1uZWdhdGl2ZVwiXScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciByYXdJbmRleCA9ICQodGhpcykuYXR0cignZGF0YS1pbmRleCcpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludChyYXdJbmRleCk7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZShcIlJlc29sdmUgbmVnYXRpdmUgc3ltYm9scyBvZiBcIiArIGluZGV4KTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgYWNjZXNzb3IgPSBtZS5yYWNlckZvcm1BY2Nlc3NvcnNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoYWNjZXNzb3IpIHtcclxuICAgICAgICAgICAgICAgIG1lLnJhY2VTZXJ2aWNlLmFwcGx5TmVnYXRpdmVFZmZlY3RzKGFjY2Vzc29yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci53YXJuaW5nKFwiVGhlIFxcXCJyYWNlckZvcm1BY2Nlc3NvcnNbXCIgKyBpbmRleCArIFwiXVxcXCIgZG9lcyBub3QgZXhpc3QuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hSb2xsUmFjZUJ1dHRvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtcm9sbD1cInJhY2VcIl0nLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgcmF3SW5kZXggPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5kZXgnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludChyYXdJbmRleCk7XHJcbiAgICAgICAgICAgIHZhciBhY2Nlc3NvciA9IG1lLnJhY2VyRm9ybUFjY2Vzc29yc1tpbmRleF07XHJcbiAgICAgICAgICAgIGlmIChhY2Nlc3Nvcikge1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKFwiUm9sbCByYWNpbmcgc2tpbGwgb2YgaW5kZXg6IFwiICsgaW5kZXggKyBcIiB8IHNraWxsOiBcIiArIGFjY2Vzc29yLnNraWxsKTtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci53YXJuaW5nKCdOb3QgeWV0IGltcGxlbWVudGVkIScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLndhcm5pbmcoXCJUaGUgXFxcInJhY2VyRm9ybUFjY2Vzc29yc1tcIiArIGluZGV4ICsgXCJdXFxcIiBkb2VzIG5vdCBleGlzdC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFNvcnRSYWNlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3NvcnRSYWNlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdzb3J0UmFjZTpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzID0gbWUucmFjZXJGb3JtQWNjZXNzb3JzXHJcbiAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lLnNvcnRDb21wb3VuZChhLnN1Y2Nlc3NlcyAtIGEuZmFpbHVyZXMsIGIuc3VjY2Vzc2VzIC0gYi5mYWlsdXJlcykgfHxcclxuICAgICAgICAgICAgICAgICAgICBtZS5zb3J0Q29tcG91bmQoYS5hZHZhbnRhZ2VzIC0gYS50aHJlYXRzLCBiLmFkdmFudGFnZXMgLSBiLnRocmVhdHMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEudHJpdW1waHMsIGIudHJpdW1waHMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGIuZGVzcGFpcnMsIGEuZGVzcGFpcnMpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgbWUucmVvcmRlclJvd3MoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmF0dGFjaFNvcnRJbml0QnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI3NvcnRJbml0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdzb3J0SW5pdDpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUucmFjZXJGb3JtQWNjZXNzb3JzID0gbWUucmFjZXJGb3JtQWNjZXNzb3JzXHJcbiAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lLnNvcnRDb21wb3VuZChhLnN1Y2Nlc3NlcywgYi5zdWNjZXNzZXMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgbWUuc29ydENvbXBvdW5kKGEuYWR2YW50YWdlcywgYi5hZHZhbnRhZ2VzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIG1lLnNvcnRDb21wb3VuZChhLnRyaXVtcGhzLCBiLnRyaXVtcGhzKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIG1lLnJlb3JkZXJSb3dzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5yZW9yZGVyUm93cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJHBhcmVudCA9ICQoJyNkaXNwbGF5LXN5bWJvbHMtY2FyZCcpO1xyXG4gICAgICAgIHZhciAkcm93cyA9ICRwYXJlbnQucmVtb3ZlKCdbZGF0YS1zeW1ib2xzLXJvd10nKTtcclxuICAgICAgICB0aGlzLnJhY2VyRm9ybUFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGVsZW1lbnQuZ2V0SW5kZXgoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gXCJbZGF0YS1zeW1ib2xzLXJvdz1cXFwiXCIgKyBpbmRleCArIFwiXFxcIl1cIjtcclxuICAgICAgICAgICAgdmFyICRlbCA9ICQoc2VsZWN0b3IsICRyb3dzKTtcclxuICAgICAgICAgICAgJHBhcmVudC5hcHBlbmQoJGVsKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLnNvcnRDb21wb3VuZCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgaWYgKGEgPiBiKVxyXG4gICAgICAgICAgICByZXR1cm4gKzE7XHJcbiAgICAgICAgaWYgKGEgPCBiKVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5hdHRhY2hBZGRSYWNlckJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgICQoJyNhZGRTeW1ib2xzUm93Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgbWUubG9nZ2VyLnRyYWNlKCdhZGRSYWNlcjpjbGlja2VkJyk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbWUuYWRkUmFjZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSYWNlckNvbW1hbmQucHJvdG90eXBlLmxvYWRFeGlzdGluZ1BhcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29ycyA9IHRoaXMucmFjZVBhcnRGYWN0b3J5LmF0dGFjaCgpO1xyXG4gICAgICAgIGFjY2Vzc29ycy5mb3JFYWNoKGZ1bmN0aW9uIChhY2Nlc3NvcikgeyByZXR1cm4gX3RoaXMucmFjZVBhcnRBY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7IH0pO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoRXhpc3RpbmdSYWNlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBhY2Nlc3NvcnMgPSB0aGlzLnJhY2VyRm9ybUZhY3RvcnkuYXR0YWNoKCk7XHJcbiAgICAgICAgYWNjZXNzb3JzLmZvckVhY2goZnVuY3Rpb24gKGFjY2Vzc29yKSB7IHJldHVybiBfdGhpcy5yYWNlckZvcm1BY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7IH0pO1xyXG4gICAgICAgIHRoaXMucm93Q291bnQgPSBhY2Nlc3NvcnMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYWRkUmFjZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29yID0gdGhpcy5yYWNlckZvcm1GYWN0b3J5LmNyZWF0ZSh0aGlzLnJvd0NvdW50KyspO1xyXG4gICAgICAgIHRoaXMucmFjZXJGb3JtQWNjZXNzb3JzLnB1c2goYWNjZXNzb3IpO1xyXG4gICAgfTtcclxuICAgIFJhY2VyQ29tbWFuZC5wcm90b3R5cGUuYXR0YWNoU3VibWl0QnV0dG9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnI2Rpc3BsYXlSYWNlcnMnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoJ2Rpc3BsYXlSYWNlcnM6Y2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gbWUuY3JlYXRlUmFjZU1vZGVsKCk7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY29tbWFuZHMvZGlzcGxheS1yYWNlcnMnLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAgICAgbWUubG9nZ2VyLmluZm8obXNnKTtcclxuICAgICAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZSgnZGlzcGxheVJhY2Vyczpwb3N0ZWQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUmFjZXJDb21tYW5kLnByb3RvdHlwZS5jcmVhdGVSYWNlTW9kZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHJhY2VyczogbmV3IEFycmF5KCksXHJcbiAgICAgICAgICAgIHBhcnRzOiBuZXcgQXJyYXkoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5yYWNlcnMuZm9yRWFjaChmdW5jdGlvbiAocm93KSB7XHJcbiAgICAgICAgICAgIGRhdGEucmFjZXJzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgLy8gUmFjZXJcclxuICAgICAgICAgICAgICAgIHJhY2VyOiByb3cucmFjZXIsXHJcbiAgICAgICAgICAgICAgICBza2lsbDogcm93LnNraWxsLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogcm93LnR5cGUsXHJcbiAgICAgICAgICAgICAgICAvLyBWZWhpY2xlXHJcbiAgICAgICAgICAgICAgICB2ZWhpY2xlOiByb3cudmVoaWNsZSxcclxuICAgICAgICAgICAgICAgIHNpbGhvdWV0dGU6IHJvdy5zaWxob3VldHRlLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFNwZWVkOiByb3cuY3VycmVudFNwZWVkLFxyXG4gICAgICAgICAgICAgICAgbWF4U3BlZWQ6IHJvdy5tYXhTcGVlZCxcclxuICAgICAgICAgICAgICAgIGhhbmRsaW5nOiByb3cuaGFuZGxpbmcsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3lzdGVtU3RyYWluOiByb3cuY3VycmVudFN5c3RlbVN0cmFpbixcclxuICAgICAgICAgICAgICAgIG1heFN5c3RlbVN0cmFpbjogcm93Lm1heFN5c3RlbVN0cmFpbixcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRIdWxsOiByb3cuY3VycmVudEh1bGwsXHJcbiAgICAgICAgICAgICAgICBtYXhIdWxsOiByb3cubWF4SHVsbCxcclxuICAgICAgICAgICAgICAgIHBhcnQ6IHJvdy5wYXJ0LFxyXG4gICAgICAgICAgICAgICAgbGFwOiByb3cubGFwLFxyXG4gICAgICAgICAgICAgICAgLy8gU3ltYm9sc1xyXG4gICAgICAgICAgICAgICAgYWR2YW50YWdlczogcm93LmFkdmFudGFnZXMsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzZXM6IHJvdy5zdWNjZXNzZXMsXHJcbiAgICAgICAgICAgICAgICB0cml1bXBoczogcm93LnRyaXVtcGhzLFxyXG4gICAgICAgICAgICAgICAgdGhyZWF0czogcm93LnRocmVhdHMsXHJcbiAgICAgICAgICAgICAgICBmYWlsdXJlczogcm93LmZhaWx1cmVzLFxyXG4gICAgICAgICAgICAgICAgZGVzcGFpcnM6IHJvdy5kZXNwYWlyc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnBhcnRzLmZvckVhY2goZnVuY3Rpb24gKHBhcnQpIHsgcmV0dXJuIGRhdGEucGFydHMucHVzaChuZXcgXzEuUmFjZVBhcnQocGFydC5uYW1lLCBwYXJ0LmRpZmZpY3VsdHksIHBhcnQuZGlzdGFuY2UpKTsgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyQ29tbWFuZC5wcm90b3R5cGUsIFwicmFjZXJzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFjZXJGb3JtQWNjZXNzb3JzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aHJvdyAnTm90U3VwcG9ydGVkRXhjZXB0aW9uJztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlckNvbW1hbmQucHJvdG90eXBlLCBcInBhcnRzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFjZVBhcnRBY2Nlc3NvcnM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRocm93ICdOb3RTdXBwb3J0ZWRFeGNlcHRpb24nO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIFJhY2VyQ29tbWFuZDtcclxufShCYXNlQ29tbWFuZF8xLkJhc2VDb21tYW5kKSk7XHJcbmV4cG9ydHMuUmFjZXJDb21tYW5kID0gUmFjZXJDb21tYW5kO1xyXG52YXIgUmFjZVNlcnZpY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBSYWNlU2VydmljZSgpIHtcclxuICAgIH1cclxuICAgIFJhY2VTZXJ2aWNlLnByb3RvdHlwZS5hcHBseU5lZ2F0aXZlRWZmZWN0cyA9IGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgIHZhciBzdWNjZXNzZXMgPSBtb2RlbC5zdWNjZXNzZXMgLSBtb2RlbC5mYWlsdXJlcztcclxuICAgICAgICB2YXIgYWR2YW50YWdlcyA9IG1vZGVsLmFkdmFudGFnZXMgLSBtb2RlbC50aHJlYXRzO1xyXG4gICAgICAgIHZhciBmYWlsdXJlcyA9IDA7XHJcbiAgICAgICAgdmFyIHRocmVhdHMgPSAwO1xyXG4gICAgICAgIGlmIChzdWNjZXNzZXMgPCAwKSB7XHJcbiAgICAgICAgICAgIGZhaWx1cmVzID0gLXN1Y2Nlc3NlcztcclxuICAgICAgICAgICAgc3VjY2Vzc2VzID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFkdmFudGFnZXMgPCAwKSB7XHJcbiAgICAgICAgICAgIHRocmVhdHMgPSAtYWR2YW50YWdlcztcclxuICAgICAgICAgICAgYWR2YW50YWdlcyA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1vZGVsLnN1Y2Nlc3NlcyA9IHN1Y2Nlc3NlcztcclxuICAgICAgICBtb2RlbC5mYWlsdXJlcyA9IGZhaWx1cmVzO1xyXG4gICAgICAgIG1vZGVsLmFkdmFudGFnZXMgPSBhZHZhbnRhZ2VzO1xyXG4gICAgICAgIG1vZGVsLnRocmVhdHMgPSB0aHJlYXRzO1xyXG4gICAgICAgIHJldHVybiBtb2RlbDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUmFjZVNlcnZpY2U7XHJcbn0oKSk7XHJcbmV4cG9ydHMuUmFjZVNlcnZpY2UgPSBSYWNlU2VydmljZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmFjZXJDb21tYW5kLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBfMSA9IHJlcXVpcmUoXCIuXCIpO1xyXG52YXIgUmFjZXJGb3JtRmFjdG9yeSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJhY2VyRm9ybUZhY3RvcnkobG9nZ2VyRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyRmFjdG9yeSA9IGxvZ2dlckZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJGYWN0b3J5LmNyZWF0ZShSYWNlckZvcm1GYWN0b3J5KTtcclxuICAgIH1cclxuICAgIFJhY2VyRm9ybUZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHZhciBhY2Nlc3NvciA9IG5ldyBfMS5SYWNlclJvd0FjY2Vzc29yKGluZGV4LCB0aGlzLmxvZ2dlckZhY3RvcnkpO1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgbWUubG9nZ2VyLnRyYWNlKFwiUmFjZXJGb3JtRmFjdG9yeTpsb2FkaW5nOlwiICsgaW5kZXgpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogJy9wYXJ0aWFscy9pbmRleC1kaXNwbGF5LXN5bWJvbHMtZm9ybScsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHsgaW5kZXg6IGluZGV4IH1cclxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIG1lLmxvZ2dlci50cmFjZShcIlJhY2VyRm9ybUZhY3Rvcnk6bG9hZGVkOlwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgJHBhcmVudCA9ICQoJyNkaXNwbGF5LXN5bWJvbHMtY2FyZCcpO1xyXG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQoZGF0YSk7XHJcbiAgICAgICAgICAgICRwYXJlbnQuYXBwZW5kKCRyb3cpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhY2Nlc3NvcjtcclxuICAgIH07XHJcbiAgICBSYWNlckZvcm1GYWN0b3J5LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29ycyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgJCgnW2RhdGEtc3ltYm9scy1yb3ddJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkcm93ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoJHJvdy5hdHRyKCdkYXRhLXN5bWJvbHMtcm93JykpO1xyXG4gICAgICAgICAgICBtZS5sb2dnZXIudHJhY2UoXCJSYWNlckZvcm1GYWN0b3J5OmF0dGFjaGluZzpcIiArIGluZGV4KTtcclxuICAgICAgICAgICAgdmFyIGFjY2Vzc29yID0gbmV3IF8xLlJhY2VyUm93QWNjZXNzb3IoaW5kZXgsIG1lLmxvZ2dlckZhY3RvcnkpO1xyXG4gICAgICAgICAgICBhY2Nlc3NvcnMucHVzaChhY2Nlc3Nvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGFjY2Vzc29ycztcclxuICAgIH07XHJcbiAgICByZXR1cm4gUmFjZXJGb3JtRmFjdG9yeTtcclxufSgpKTtcclxuZXhwb3J0cy5SYWNlckZvcm1GYWN0b3J5ID0gUmFjZXJGb3JtRmFjdG9yeTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmFjZXJGb3JtRmFjdG9yeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgUmFjZXJSb3dBY2Nlc3NvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJhY2VyUm93QWNjZXNzb3IoaW5kZXgsIGxvZ2dlckZhY3RvcnkpIHtcclxuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJGYWN0b3J5LmNyZWF0ZShSYWNlclJvd0FjY2Vzc29yKTtcclxuICAgIH1cclxuICAgIFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLmdldEluZGV4ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4O1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJyYWNlclwiLCB7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBSYWNlclxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3JhY2VyLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyByYWNlciB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI3JhY2VyLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInNraWxsXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjc2tpbGwtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHNraWxsIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjc2tpbGwtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwidHlwZVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3R5cGUtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHR5cGUgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiN0eXBlLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInZlaGljbGVcIiwge1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gVmVoaWNsZVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3ZlaGljbGUtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHZlaGljbGUgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiN2ZWhpY2xlLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInNpbGhvdWV0dGVcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNzaWxob3VldHRlLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBzaWxob3VldHRlIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjc2lsaG91ZXR0ZS1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJjdXJyZW50U3BlZWRcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNjdXJyZW50LXNwZWVkLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBjdXJyZW50U3BlZWQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNjdXJyZW50LXNwZWVkLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcIm1heFNwZWVkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjbWF4LXNwZWVkLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBtYXhTcGVlZCB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI21heC1zcGVlZC1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJoYW5kbGluZ1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2hhbmRsaW5nLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBoYW5kbGluZyB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI2hhbmRsaW5nLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcImN1cnJlbnRTeXN0ZW1TdHJhaW5cIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNjdXJyZW50LXNzLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBjdXJyZW50U3lzdGVtU3RyYWluIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjY3VycmVudC1zcy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJtYXhTeXN0ZW1TdHJhaW5cIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNtYXgtc3MtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIG1heFN5c3RlbVN0cmFpbiB0byBcIiArIHYpO1xyXG4gICAgICAgICAgICAkKFwiI21heC1zcy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSYWNlclJvd0FjY2Vzc29yLnByb3RvdHlwZSwgXCJjdXJyZW50SHVsbFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2N1cnJlbnQtaHVsbC1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgY3VycmVudEh1bGwgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNjdXJyZW50LWh1bGwtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwibWF4SHVsbFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI21heC1odWxsLVwiICsgdGhpcy5pbmRleCkudmFsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKFwiU2V0dGluZyBtYXhIdWxsIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjbWF4LWh1bGwtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwicGFydFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3BhcnQtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHBhcnQgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNwYXJ0LVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcImxhcFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2xhcC1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgbGFwIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjbGFwLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcImFkdmFudGFnZXNcIiwge1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gU3ltYm9sc1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI2FkdmFudGFnZXMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGFkdmFudGFnZXMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNhZHZhbnRhZ2VzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInN1Y2Nlc3Nlc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3N1Y2Nlc3Nlcy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgc3VjY2Vzc2VzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjc3VjY2Vzc2VzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcInRyaXVtcGhzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjdHJpdW1waHMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHRyaXVtcGhzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjdHJpdW1waHMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwidGhyZWF0c1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RocmVhdHMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIHRocmVhdHMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiN0aHJlYXRzLVwiICsgdGhpcy5pbmRleCkudmFsKHYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJhY2VyUm93QWNjZXNzb3IucHJvdG90eXBlLCBcImZhaWx1cmVzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICQoXCIjZmFpbHVyZXMtXCIgKyB0aGlzLmluZGV4KS52YWwoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoXCJTZXR0aW5nIGZhaWx1cmVzIHRvIFwiICsgdik7XHJcbiAgICAgICAgICAgICQoXCIjZmFpbHVyZXMtXCIgKyB0aGlzLmluZGV4KS52YWwodik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmFjZXJSb3dBY2Nlc3Nvci5wcm90b3R5cGUsIFwiZGVzcGFpcnNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChcIiNkZXNwYWlycy1cIiArIHRoaXMuaW5kZXgpLnZhbCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlNldHRpbmcgZGVzcGFpcnMgdG8gXCIgKyB2KTtcclxuICAgICAgICAgICAgJChcIiNkZXNwYWlycy1cIiArIHRoaXMuaW5kZXgpLnZhbCh2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBSYWNlclJvd0FjY2Vzc29yO1xyXG59KCkpO1xyXG5leHBvcnRzLlJhY2VyUm93QWNjZXNzb3IgPSBSYWNlclJvd0FjY2Vzc29yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1SYWNlclJvd0FjY2Vzc29yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBSYWNlckZvcm1GYWN0b3J5XzEgPSByZXF1aXJlKFwiLi9SYWNlckZvcm1GYWN0b3J5XCIpO1xyXG5leHBvcnRzLlJhY2VyRm9ybUZhY3RvcnkgPSBSYWNlckZvcm1GYWN0b3J5XzEuUmFjZXJGb3JtRmFjdG9yeTtcclxudmFyIFJhY2VyQ29tbWFuZF8xID0gcmVxdWlyZShcIi4vUmFjZXJDb21tYW5kXCIpO1xyXG5leHBvcnRzLlJhY2VyQ29tbWFuZCA9IFJhY2VyQ29tbWFuZF8xLlJhY2VyQ29tbWFuZDtcclxudmFyIFJhY2VyUm93QWNjZXNzb3JfMSA9IHJlcXVpcmUoXCIuL1JhY2VyUm93QWNjZXNzb3JcIik7XHJcbmV4cG9ydHMuUmFjZXJSb3dBY2Nlc3NvciA9IFJhY2VyUm93QWNjZXNzb3JfMS5SYWNlclJvd0FjY2Vzc29yO1xyXG52YXIgUmFjZVBhcnRfMSA9IHJlcXVpcmUoXCIuL1JhY2VQYXJ0XCIpO1xyXG5leHBvcnRzLlJhY2VQYXJ0ID0gUmFjZVBhcnRfMS5SYWNlUGFydDtcclxudmFyIFJhY2VQYXJ0RmFjdG9yeV8xID0gcmVxdWlyZShcIi4vUmFjZVBhcnRGYWN0b3J5XCIpO1xyXG5leHBvcnRzLlJhY2VQYXJ0RmFjdG9yeSA9IFJhY2VQYXJ0RmFjdG9yeV8xLlJhY2VQYXJ0RmFjdG9yeTtcclxudmFyIFJhY2VQYXJ0QWNjZXNzb3JfMSA9IHJlcXVpcmUoXCIuL1JhY2VQYXJ0QWNjZXNzb3JcIik7XHJcbmV4cG9ydHMuUmFjZVBhcnRBY2Nlc3NvciA9IFJhY2VQYXJ0QWNjZXNzb3JfMS5SYWNlUGFydEFjY2Vzc29yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTG9nZ2luZ18xID0gcmVxdWlyZShcIi4vTG9nZ2luZ1wiKTtcclxudmFyIERpc2NvcmRJbmZvXzEgPSByZXF1aXJlKFwiLi9EaXNjb3JkSW5mb1wiKTtcclxudmFyIEJhdGNoQ29tbWFuZF8xID0gcmVxdWlyZShcIi4vQmF0Y2hDb21tYW5kXCIpO1xyXG52YXIgUmFjZXJDb21tYW5kXzEgPSByZXF1aXJlKFwiLi9SYWNlckNvbW1hbmRcIik7XHJcbnZhciBNYWluID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTWFpbihjb21tYW5kcywgbG9nZ2VyRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMuY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlckZhY3RvcnkuY3JlYXRlKE1haW4pO1xyXG4gICAgfVxyXG4gICAgTWFpbi5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKCdNYWluIGluaXRpYWxpemluZycpO1xyXG4gICAgICAgIHZhciBjdXJyZW50Q29tbWFuZCA9ICQoJ2JvZHknKS5hdHRyKCdkYXRhLWNvbW1hbmQtaWRlbnRpZmllcicpO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZHMuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudENvbW1hbmQgPT09IGNvbW1hbmQuaWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMubG9nZ2VyLmRlYnVnKFwiQ3VycmVudCBjb21tYW5kOiBcIiArIGNvbW1hbmQuaWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kLmluaXRpYWxpemUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmxvZ2dlci5kZWJ1ZyhcIlNraXAgaW5pdGlhbGl6YXRpb24gb2YgY29tbWFuZDogXCIgKyBjb21tYW5kLmlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoJ01haW4gaW5pdGlhbGl6ZWQnKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTWFpbjtcclxufSgpKTtcclxuZXhwb3J0cy5NYWluID0gTWFpbjtcclxuLy9cclxuLy8gQ29tcG9zaXRpb24gcm9vdFxyXG4vL1xyXG52YXIgbG9nZ2VyRmFjdG9yeSA9IG5ldyBMb2dnaW5nXzEuTG9nZ2VyRmFjdG9yeSgpO1xyXG52YXIgZGlzY29yZEluZm8gPSBuZXcgRGlzY29yZEluZm9fMS5EaXNjb3JkQWNjZXNzb3IobG9nZ2VyRmFjdG9yeS5jcmVhdGUoRGlzY29yZEluZm9fMS5EaXNjb3JkQWNjZXNzb3IpKTtcclxudmFyIGZvcm1BY2Nlc3NvciA9IG5ldyBCYXRjaENvbW1hbmRfMS5CYXRjaENvbW1hbmQobG9nZ2VyRmFjdG9yeSwgZGlzY29yZEluZm8pO1xyXG52YXIgcmFjZXJGb3JtRmFjdG9yeSA9IG5ldyBSYWNlckNvbW1hbmRfMS5SYWNlckZvcm1GYWN0b3J5KGxvZ2dlckZhY3RvcnkpO1xyXG52YXIgcmFjZVBhcnRGYWN0b3J5ID0gbmV3IFJhY2VyQ29tbWFuZF8xLlJhY2VQYXJ0RmFjdG9yeShsb2dnZXJGYWN0b3J5KTtcclxudmFyIGRpc3BsYXlTeW1ib2xzQ29tbWFuZHNGb3JtQWNjZXNzb3IgPSBuZXcgUmFjZXJDb21tYW5kXzEuUmFjZXJDb21tYW5kKGxvZ2dlckZhY3RvcnksIHJhY2VyRm9ybUZhY3RvcnksIGRpc2NvcmRJbmZvLCByYWNlUGFydEZhY3RvcnkpO1xyXG52YXIgY29tbWFuZHMgPSBbZm9ybUFjY2Vzc29yLCBkaXNwbGF5U3ltYm9sc0NvbW1hbmRzRm9ybUFjY2Vzc29yXTtcclxudmFyIG1haW4gPSBuZXcgTWFpbihjb21tYW5kcywgbG9nZ2VyRmFjdG9yeSk7XHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgbWFpbi5pbml0aWFsaXplKCk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jbGllbnQuanMubWFwIl19
