"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TableRenderer = /** @class */ (function () {
    function TableRenderer() {
        // Adapted and translated to JavaScript from https://github.com/ekgame/storasbot/blob/master/src/main/java/lt/ekgame/storasbot/utils/TableRenderer.java
        this.table = new Array();
        this.empty = '';
    }
    TableRenderer.prototype.setHeader = function (header) {
        this.header = header;
    };
    TableRenderer.prototype.addRow = function (elements) {
        this.table.push(elements);
    };
    TableRenderer.prototype.setEmptyString = function (str) {
        this.empty = str;
    };
    TableRenderer.prototype.getMaxWidth = function () {
        var tmp = this.header != null && this.header.length > 0 ? this.header.length : 0;
        for (var i = 0; i < this.table.length; i++) {
            var row = this.table[i];
            tmp = Math.max(tmp, row.length);
        }
        return tmp;
    };
    TableRenderer.prototype.normalizeTable = function () {
        var _this = this;
        var height = this.header == null ? this.table.length : this.table.length + 1;
        var normalized = this.createEmptyArray(height, this.getMaxWidth());
        var vIndex = 0;
        if (this.header != null) {
            for (var hIndex = 0; hIndex < this.getMaxWidth(); hIndex++) {
                if (this.header.length > hIndex) {
                    normalized[vIndex][hIndex] = this.header[hIndex].toString();
                }
                else {
                    normalized[vIndex][hIndex] = this.empty;
                }
            }
            vIndex++;
        }
        this.table.forEach(function (obj) {
            for (var hIndex = 0; hIndex < _this.getMaxWidth(); hIndex++) {
                if (obj.length > hIndex)
                    normalized[vIndex][hIndex] = obj[hIndex].toString();
                else
                    normalized[vIndex][hIndex] = _this.empty + 's';
            }
            vIndex++;
        });
        return normalized;
    };
    TableRenderer.prototype.getColumnsWidths = function (table, padding) {
        var columns = new Array();
        for (var vIndex = 0; vIndex < table.length; vIndex++) {
            for (var hIndex = 0; hIndex < this.getMaxWidth(); hIndex++) {
                var element = table[vIndex][hIndex].toString();
                //.replace(/<:[^:]+:[^>]+>/, 'X');
                var elementLength = element.length;
                var paddedLength = elementLength + padding;
                columns.push(paddedLength);
            }
        }
        columns[columns.length - 1] -= padding;
        return columns;
    };
    TableRenderer.prototype.buildElement = function (element, width, emptyChar) {
        var result = element;
        if (result.length < width) {
            result += ''.padEnd(width - result.length, emptyChar);
        }
        return result;
    };
    TableRenderer.prototype.buildLine = function (strings, widths, header) {
        var _this = this;
        var line = '';
        strings.forEach(function (col, i) {
            if (i > 0) {
                line += '│';
            }
            line += _this.buildElement(col, widths[i], ' ');
        });
        if (header) {
            line += '\n';
            strings.forEach(function (col, i) {
                if (i > 0) {
                    line += '╪';
                }
                line += _this.buildElement('', widths[i], '═');
            });
        }
        return line;
    };
    TableRenderer.prototype.build = function () {
        var _this = this;
        var table = this.normalizeTable();
        var widths = this.getColumnsWidths(table, 1);
        var result = '';
        table.forEach(function (row, i) {
            if (i > 0) {
                result += '\n';
            }
            result += _this.buildLine(row, widths, _this.header != null && i == 0);
        });
        return '```\n' + result + '\n```';
    };
    TableRenderer.prototype.createEmptyArray = function (height, width) {
        var array = new Array();
        for (var i = 0; i < height; i++) {
            array.push(new Array(width));
        }
        return array;
    };
    return TableRenderer;
}());
exports.TableRenderer = TableRenderer;
//# sourceMappingURL=TableRenderer.js.map