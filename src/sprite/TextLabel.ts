import { convertColor, Color } from '../Util';
import { Sprite, ISprite } from './Sprite';
import { measureText } from '../measureText';

export type FontWeight = "lighter" | "normal" | "bold" | "bolder";
export type FontStyle = "oblique" | "normal" | "italic";
export type TextAlign = "left" | "right" | "center" | "start" | "end";

const DefaultFontSize = 24;

export type ITextLabel = ISprite & {
    text?: string;
    fontName?: string;
    textAlign?: TextAlign;
    fontColor?: Color;
    fontSize?: number;
    lineHeight?: number;
    fontStyle?: FontStyle;
    fontWeight?: FontWeight;
    strokeColor?: Color;
    strokeWidth?: number;
    wordWrap?: boolean;
}

export class TextLabel extends Sprite<ITextLabel> {

    textAlign: TextAlign = 'center';
    strokeColor: Color;
    strokeWidth: number;
    fontColor: Color = 0x000;

    protected _wordWrap: boolean = true;
    protected _fontName: string = 'sans-serif';
    protected _lineHeight: number;
    protected _fontSize: number = DefaultFontSize;
    protected _fontWeight: FontWeight = 'normal';
    protected _fontStyle: FontStyle = 'normal';

    protected _lines: { width: number; text: string; }[] = [];
    protected _text: string;

    constructor(props?: ITextLabel) {
        super();

        props && this.setProps(props);
    }

    set width(value: number) {
        if (this._width === value) {
            return;
        }

        this._width = value;
        this._originPixelX = this._width * this._originX;

        if (this.left != null || this.right != null) {
            this._reCalcX();
        }
        else {
            this._adjustAlignX();
        }

        this._reMeasureText();
    }

    get width() {
        return this._width;
    }

    set height(value: number) {
        if (this._height === value) {
            return;
        }

        this._height = value;
        this._originPixelY = this._height * this._originY;

        if (this.top != null || this.bottom != null) {
            this._reCalcY();
        }
        else {
            this._adjustAlignY();
        }
    }

    get height() {
        return this._height;
    }

    set fontSize(value: number) {
        if (this._fontSize != value) {
            this._fontSize = value;
            if (this._lineHeight == null) {
                this._lineHeight = value;
            }
            this._reMeasureText();
        }
    }

    get fontSize() {
        return this._fontSize;
    }

    set fontName(value: string) {
        if (this._fontName != value) {
            this._fontName = value;
            this._reMeasureText();
        }
    }

    get fontName() {
        return this._fontName;
    }

    set fontStyle(value: FontStyle) {
        if (this._fontStyle != value) {
            this._fontStyle = value;
            this._reMeasureText();
        }
    }

    get fontStyle() {
        return this._fontStyle;
    }

    set fontWeight(value: FontWeight) {
        if (this._fontWeight != value) {
            this._fontWeight = value;
            this._reMeasureText();
        }
    }

    get fontWeight() {
        return this._fontWeight;
    }

    get lineHeight() {
        return this._lineHeight == null ? this._fontSize : this._lineHeight;
    }

    set lineHeight(value: number) {
        if (this._lineHeight != value) {
            this._lineHeight = value;
            this._reMeasureText();
        }
    }

    set wordWrap(value: boolean) {
        if (this._wordWrap !== value) {
            this._wordWrap = value;
            this._reMeasureText();
        }
    }

    get wordWrap() {
        return this._wordWrap;
    }

    set text(content: string) {
        if (this._text !== content) {
            this._text = content;
            this._reMeasureText();
        }
    }

    get text(): string {
        return this._text;
    }

    private _reMeasureText(): void {
        if (!this._text || this.width <= 0) {
            return;
        }
        if (!this.wordWrap) {
            this.height = this.lineHeight;
            this._lines = [{
                text: this._text || "",
                width: this._width,
            }];
            return;
        }
        let res = measureText(this._text, this.width, {
            style: this.fontStyle,
            name: this.fontName,
            weight: this.fontWeight,
        }, this.fontSize, this.lineHeight);

        this._lines = res.lines;
        this.height = res.height;
    }

    addChild(target: any): void {
        if (Array.isArray(target)) {
            this.text += target.join("");
        }
        else {
            this.text += String(target);
        }
    }

    addChildren(...children: any[]) {

    }

    protected draw(context: CanvasRenderingContext2D): void {
        super.draw(context);

        if (!this._lines || this._lines.length === 0) {
            return;
        }

        const { strokeWidth, strokeColor, textAlign, lineHeight, _originPixelX, _originPixelY, fontSize, fontWeight, fontStyle, fontName, fontColor, width } = this;

        context.font = fontStyle + ' ' + fontWeight + ' ' + fontSize + 'px ' + fontName;
        context.fillStyle = convertColor(fontColor);
        context.textAlign = textAlign;
        context.textBaseline = 'top';
        context.lineJoin = 'round';

        if (strokeColor != null) {
            context.strokeStyle = convertColor(strokeColor || 0x000);
            context.lineWidth = (strokeWidth || 1) * 2;
        }

        var x = textAlign === 'left' ? -_originPixelX : textAlign === 'center' ? 0 : width - _originPixelX;
        var lineSpace = lineHeight - fontSize;
        var y = -_originPixelY + lineSpace;

        this._lines.forEach((line) => {
            if (line.text.length > 0) {
                if (strokeColor != null) {
                    context.strokeText(line.text, x, y);
                }
                context.fillText(line.text, x, y);
            }
            y += lineHeight;
        });
    }
}
