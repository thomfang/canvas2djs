import { ITextLabel, FontStyle, FontWeight } from './sprite/TextLabel';
import { Color } from './Util';

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var measuredCache: { [key: string]: MeasuredSize } = {};
var measuredWidthCache: { [key: string]: number } = {};
var cacheCount = 0;

function getCacheKey(
    textFlow: TextFlow[],
    width: number,
    fontName: string,
    fontSize: number,
    fontWeight: FontWeight,
    fontStyle: FontStyle,
    lineHeight: number,
    wordWrap: boolean,
    autoResizeWidth: boolean,
) {
    return [JSON.stringify(textFlow), width, fontName, fontSize, fontStyle, lineHeight, wordWrap, autoResizeWidth].join(':');
}

export type TextFlow = {
    text: string;
    fontStyle?: FontStyle;
    fontName?: string;
    fontWeight?: FontWeight;
    fontColor?: Color;
    fontSize?: number;
    strokeWidth?: number;
    strokeColor?: Color;
}

export type TextFragment = TextFlow & {
    width: number;
}

export type MeasuredSize = {
    width: number;
    height: number;
    lines: {
        width: number;
        fragments: TextFragment[];
    }[];
};

export function measureTextWidth(text: string, fontName, fontSize, fontWeight, fontStyle) {
    let key = [text, fontName, fontSize, fontWeight, fontStyle].join(':');
    if (measuredWidthCache[key] != null) {
        return measuredWidthCache[key];
    }
    ctx.font = fontStyle + ' ' + fontWeight + ' ' + fontSize + 'px ' + fontName;
    let width = ctx.measureText(text).width;
    measuredWidthCache[key] = width;
    return width;
}

export function measureText(
    textFlow: TextFlow[],
    width: number,
    fontName: string,
    fontStyle: FontStyle,
    fontWeight: FontWeight,
    fontSize: number,
    lineHeight: number,
    wordWrap: boolean,
    autoResizeWidth: boolean,
): MeasuredSize {
    let cacheKey = getCacheKey(textFlow, width, fontName, fontSize, fontWeight, fontStyle, lineHeight, wordWrap, autoResizeWidth);
    let cached = measuredCache[cacheKey];
    if (cached) {
        return cached;
    }

    let measuredSize: MeasuredSize = {
        width: width,
        height: 0,
        lines: [],
    };
    let remainWidth = width;
    let lineFragments: TextFragment[] = [];
    let lineWidth = 0;
    let textMetrics: TextMetrics;

    for (let i = 0, flow: TextFlow; flow = textFlow[i]; i++) {
        let text: string = flow.text;
        let props: TextFlow = {
            fontSize,
            fontStyle,
            fontName,
            fontWeight,
            ...flow,
        }

        ctx.font = props.fontStyle + ' ' + props.fontWeight + ' ' + props.fontSize + 'px ' + props.fontName;

        if (!wordWrap) {
            textMetrics = ctx.measureText(text);
            lineFragments.push({
                ...props,
                text: text,
                width: textMetrics.width,
            });
            lineWidth += textMetrics.width;
            continue;
        }

        let currentPos = 0;
        let lastMeasuredWidth = 0;
        let currentLine = "";
        let tryLine: string;

        while (currentPos < text.length) {
            // console.log("remain width", remainWidth)
            let breaker = nextBreak(text, currentPos, remainWidth, props.fontSize, autoResizeWidth);

            if (breaker.words) {
                tryLine = currentLine + breaker.words;
                textMetrics = ctx.measureText(tryLine);

                if (autoResizeWidth && !breaker.required) {
                    currentLine = tryLine;
                    lastMeasuredWidth = textMetrics.width;
                }
                else if (!autoResizeWidth && textMetrics.width + lineWidth > width) {
                    if (breaker.words.length > 1 && textMetrics.width + lineWidth - props.fontSize <= width) {
                        // console.log(breaker.words, textMetrics.width, lineWidth, props.fontSize, width, remainWidth);
                        tryLine = currentLine + breaker.words.slice(0, breaker.words.length - 1);
                        breaker.words = breaker.words.slice(breaker.words.length - 1);
                        if (breaker.required) {
                            breaker.pos -= 2;
                        }
                        else {
                            breaker.pos -= 1;
                        }

                        lineFragments.push({
                            ...props,
                            text: tryLine.trim(),
                            width: textMetrics.width - fontSize,
                        });
                        measuredSize.lines.push({
                            width: lineWidth + textMetrics.width - fontSize,
                            fragments: lineFragments,
                        });
                    }
                    else {
                        // console.log(breaker.words, textMetrics.width, lineWidth, props.fontSize, width, remainWidth, currentLine);
                        lineFragments.push({
                            ...props,
                            text: currentLine.trim(),
                            width: lastMeasuredWidth,
                        });
                        measuredSize.lines.push({
                            fragments: lineFragments,
                            width: lineWidth + lastMeasuredWidth
                        });
                    }

                    measuredSize.height += lineHeight;

                    lineFragments = [];
                    lineWidth = 0;
                    currentLine = breaker.words;
                    lastMeasuredWidth = ctx.measureText(currentLine.trim()).width;
                    remainWidth = width - lastMeasuredWidth;

                    if (breaker.required) {
                        measuredSize.lines.push({
                            width: lastMeasuredWidth,
                            fragments: [{
                                ...props,
                                text: currentLine.trim(),
                                width: lastMeasuredWidth,
                            }],
                        });
                        measuredSize.height += lineHeight;
                        currentLine = "";
                        lastMeasuredWidth = 0;
                    }
                }
                else if (breaker.required) {
                    lineFragments.push({
                        ...props,
                        text: tryLine.trim(),
                        width: textMetrics.width,
                    });
                    measuredSize.lines.push({
                        width: lineWidth + textMetrics.width,
                        fragments: lineFragments,
                    });
                    measuredSize.height += lineHeight;

                    lineFragments = [];
                    lineWidth = 0;
                    remainWidth = width;
                    lastMeasuredWidth = 0;
                    currentLine = "";
                }
                else {
                    currentLine = tryLine;
                    lastMeasuredWidth = textMetrics.width;
                    remainWidth = width - lastMeasuredWidth;
                }
            }
            else if (breaker.required) {
                currentLine = currentLine.trim();
                if (currentLine.length) {
                    lineFragments.push({
                        ...props,
                        text: currentLine,
                        width: lastMeasuredWidth,
                    });
                }
                measuredSize.lines.push({
                    width: lineWidth + lastMeasuredWidth,
                    fragments: lineFragments,
                });
                measuredSize.height += lineHeight;
                lineFragments = [];
                lineWidth = 0;
                currentLine = "";
                lastMeasuredWidth = 0;
                remainWidth = width;
            }

            currentPos = breaker.pos;
        }

        currentLine = currentLine.trim();
        if (currentLine.length) {
            lineFragments.push({
                ...props,
                text: currentLine,
                width: lastMeasuredWidth,
            });
            lineWidth += lastMeasuredWidth;
            remainWidth = width - lineWidth;
        }
    }

    if (lineFragments.length) {
        measuredSize.lines.push({
            width: lineWidth,
            fragments: lineFragments,
        });
        measuredSize.height += lineHeight;
    }

    if (autoResizeWidth) {
        let max = 0;
        for (let i = 0, l = measuredSize.lines.length; i < l; i++) {
            let line = measuredSize.lines[i];
            if (line.width > max) {
                max = line.width;
            }
        }
        measuredSize.width = max;
    }

    if (cacheCount > 200) {
        measuredCache = {};
        cacheCount = 0;
    }
    measuredSize.width = Math.round(measuredSize.width);
    measuredSize.height = Math.round(measuredSize.height);
    measuredCache[cacheKey] = measuredSize;
    cacheCount += 1;
    return measuredSize;
}

type Breaker = {
    pos: number;
    words: string;
    required: boolean;
}

function nextBreak(text: string, currPos: number, width: number, fontSize: number, autoResizeWidth: boolean): Breaker {
    if (!autoResizeWidth && width < fontSize) {
        return {
            pos: currPos,
            words: "",
            required: true,
        };
    }

    let nextWords: string;
    let required: boolean;
    let breakPos: number;
    let pos: number;
    let num: number;

    num = autoResizeWidth ? text.length - currPos : Math.min(text.length - currPos, Math.floor(width / fontSize));
    nextWords = text.slice(currPos, currPos + num);
    breakPos = nextWords.indexOf('\n');
    required = breakPos > -1;

    if (required) {
        nextWords = nextWords.slice(0, breakPos);
        pos = currPos + breakPos + 1;
    }
    else {
        pos = currPos + num;
    }

    return {
        pos,
        words: nextWords,
        required: required
    };
}
