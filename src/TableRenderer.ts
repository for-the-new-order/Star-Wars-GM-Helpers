export class TableRenderer {
    // Adapted and translated to JavaScript from https://github.com/ekgame/storasbot/blob/master/src/main/java/lt/ekgame/storasbot/utils/TableRenderer.java

    private header: Array<string>;
    private table: Array<Array<string>> = new Array<Array<string>>();
    private empty: string = '';
    public setHeader(header: string[]): void {
        this.header = header;
    }
    public addRow(elements: string[]): void {
        this.table.push(elements);
    }
    public setEmptyString(str: string): void {
        this.empty = str;
    }
    private getMaxWidth() {
        let tmp = this.header != null && this.header.length > 0 ? this.header.length : 0;
        for (let i = 0; i < this.table.length; i++) {
            const row = this.table[i];
            tmp = Math.max(tmp, row.length);
        }
        return tmp;
    }
    private normalizeTable(): string[][] {
        const height: number = this.header == null ? this.table.length : this.table.length + 1;
        const normalized = this.createEmptyArray(height, this.getMaxWidth());
        let vIndex = 0;
        if (this.header != null) {
            for (let hIndex = 0; hIndex < this.getMaxWidth(); hIndex++) {
                if (this.header.length > hIndex) {
                    normalized[vIndex][hIndex] = this.header[hIndex].toString();
                } else {
                    normalized[vIndex][hIndex] = this.empty;
                }
            }
            vIndex++;
        }
        this.table.forEach(obj => {
            for (let hIndex = 0; hIndex < this.getMaxWidth(); hIndex++) {
                if (obj.length > hIndex) normalized[vIndex][hIndex] = obj[hIndex].toString();
                else normalized[vIndex][hIndex] = this.empty + 's';
            }
            vIndex++;
        });
        return normalized;
    }
    private getColumnsWidths(table: Array<Array<string>>, padding: number): number[] {
        const columns = new Array<number>();
        for (let hIndex = 0; hIndex < this.getMaxWidth(); hIndex++) {
            let columnLength = 0;
            for (let vIndex = 0; vIndex < table.length; vIndex++) {
                const element = table[vIndex][hIndex].toString();
                //.replace(/<:[^:]+:[^>]+>/, 'X');
                const elementLength = element.length;
                const paddedLength = elementLength + padding;
                columnLength = Math.max(columnLength, paddedLength);
            }
            columns.push(columnLength);
        }
        columns[columns.length - 1] -= padding;
        return columns;
    }
    private buildElement(element: string, width: number, emptyChar: string): string {
        let result = element;
        if (result.length < width) {
            result += ''.padEnd(width - result.length, emptyChar);
        }
        return result;
    }
    private buildLine(strings: Array<string>, widths: Array<number>, header: boolean): string {
        let line = '';
        strings.forEach((col, i) => {
            if (i > 0) {
                line += '│';
            }
            line += this.buildElement(col, widths[i], ' ');
        });
        if (header) {
            line += '\n';
            strings.forEach((col, i) => {
                if (i > 0) {
                    line += '╪';
                }
                line += this.buildElement('', widths[i], '═');
            });
        }
        return line;
    }
    public build(): string {
        const table = this.normalizeTable();
        const widths = this.getColumnsWidths(table, 1);
        let result = '';
        table.forEach((row, i) => {
            if (i > 0) {
                result += '\n';
            }
            result += this.buildLine(row, widths, this.header != null && i == 0);
        });
        return '```\n' + result + '\n```';
    }

    private createEmptyArray(height: number, width: number) {
        const array = new Array<Array<string>>();
        for (let i = 0; i < height; i++) {
            array.push(new Array<string>(width));
        }
        return array;
    }
}
