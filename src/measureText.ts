
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var _cache: { [key: string]: MeasuredSize } = {};

function getCacheKey(text: string, width: number, fontFace: FontFace, fontSize: number, lineHeight: number) {
    return text + width + fontFace.name + fontSize + lineHeight;
}

export type FontFace = {
    style: string;
    weight: string;
    name: string;
}

export type MeasuredSize = {
    width: number;
    height: number;
    lines: { width: number; text: string }[];
};

export function measureText(text: string, width: number, fontFace: FontFace, fontSize: number, lineHeight: number): MeasuredSize {
    var cacheKey = getCacheKey(text, width, fontFace, fontSize, lineHeight);
    var cached = _cache[cacheKey];
    if (cached) {
        return cached;
    }

    var measuredSize: MeasuredSize = {} as any;
    var textMetrics: TextMetrics;
    var lastMeasuredWidth: number;
    var tryLine: string;
    var currentLine: string;

    ctx.font = fontFace.style + ' ' + fontFace.weight + ' ' + fontSize + 'px ' + fontFace.name;
    textMetrics = ctx.measureText(text);

    measuredSize.width = textMetrics.width;
    measuredSize.height = lineHeight;
    measuredSize.lines = [];

    if (measuredSize.width <= width) {
        // The entire text string fits.
        measuredSize.lines.push({ width: measuredSize.width, text: text });
    }
    else {
        // Break into multiple lines.
        measuredSize.width = width;
        currentLine = '';

        let breaker = new LineBreaker(text, fontSize);
        let remainWidth = width;
        let index = 0;
        let words: string;

        while (index < text.length) {
            let res = breaker.nextBreak(remainWidth);

            if (res.len) {
                words = text.slice(index, index + res.len);
                tryLine = currentLine + words;
                textMetrics = ctx.measureText(tryLine);
                if (textMetrics.width > width) {
                    measuredSize.height += lineHeight;
                    measuredSize.lines.push({
                        width: lastMeasuredWidth,
                        text: currentLine.trim(),
                    });
                    currentLine = words;
                    lastMeasuredWidth = ctx.measureText(currentLine.trim()).width;
                    remainWidth = width;
                }
                else {
                    currentLine = tryLine;
                    lastMeasuredWidth = textMetrics.width;
                    remainWidth = width - lastMeasuredWidth;
                }
            }
            else {
                measuredSize.height += lineHeight;
                measuredSize.lines.push({
                    width: lastMeasuredWidth,
                    text: currentLine.trim(),
                });
                currentLine = "";
                lastMeasuredWidth = 0;
                remainWidth = width;
            }

            index += res.len;
        }

        currentLine = currentLine.trim();
        if (currentLine.length > 0) {
            textMetrics = ctx.measureText(currentLine);
            measuredSize.lines.push({ width: textMetrics.width, text: currentLine });
        }
    }

    _cache[cacheKey] = measuredSize;

    return measuredSize;
};

class LineBreaker {

    private position = 0;

    constructor(public text: string, public fontSize: number) {

    }

    nextBreak(width: number) {
        let len = Math.max(0, Math.floor(width / this.fontSize) - 1);
        let pos = this.position;
        this.position += len;
        return {
            len,
        };
    }
}