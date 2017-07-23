import { convertColor, Color } from '../Util';
import { Sprite, ISprite, AlignType } from './Sprite';
import {
    // measureText, 
    TextFlow, TextFragment, measureText
} from '../measureText';

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
    textFlow?: TextFlow[];
    autoResizeWidth?: boolean;
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
    protected _textFlow: Array<TextFlow>;
    protected _autoResizeWidth: boolean = false;

    protected _textLines: { fragments: TextFragment[]; width: number }[];
    protected _text: string;

    constructor(props?: ITextLabel) {
        super();

        props && this.setProps(props);
    }

    set autoResizeWidth(value: boolean) {
        if (this._autoResizeWidth != value) {
            this._autoResizeWidth = value;
            this._reMeasureText();
        }
    }

    get autoResizeWidth() {
        return this._autoResizeWidth;
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

        if (!this._autoResizeWidth) {
            this._reMeasureText();
        }

        this._onChildResize();
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

        this._onChildResize();
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
            if (!content) {
                this._textFlow = null;
                this._textLines = null;
            }
            else {
                this._textFlow = [{ text: this._text }];
                this._reMeasureText();
            }
        }
    }

    get text(): string {
        return this._text;
    }

    set textFlow(value: Array<TextFlow>) {
        if (this._textFlow != value) {
            this._textFlow = value;
            if (!value || !value.length) {
                this._textLines = null;
            }
            else {
                this._reMeasureText();
            }
        }
    }

    get textFlow() {
        return this._textFlow;
    }

    private _reMeasureText(): void {
        if (!this._textFlow || !this._textFlow.length || (this.width <= 0 && !this._autoResizeWidth)) {
            return;
        }
        let result = measureText(this._textFlow, this.width, this.fontName, this.fontStyle, this.fontWeight, this.fontSize, this.lineHeight, this.wordWrap, this._autoResizeWidth);
        this._textLines = result.lines;
        if (this._autoResizeWidth) {
            this.width = result.width;
        }
        this.height = result.height;
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
        this.text += children.join("");
    }

    protected draw(context: CanvasRenderingContext2D): void {
        super.draw(context);

        if (!this._textLines || this._textLines.length === 0) {
            return;
        }

        const { textAlign, lineHeight, _originPixelX, _originPixelY, width } = this;

        let y = -_originPixelY + lineHeight * 0.5;

        this._textLines.forEach(line => {
            let x: number = -_originPixelX;
            if (textAlign === "center") {
                x += (width - line.width) * 0.5;
            }
            else if (textAlign === "right") {
                x += width - line.width;
            }

            line.fragments.forEach((fragment) => {
                if (fragment.text) {
                    let fontColor = fragment.fontColor != null ? fragment.fontColor : this.fontColor;
                    let strokeColor = "strokeColor" in fragment ? fragment.strokeColor : this.strokeColor;
                    let strokeWidth = "strokeWidth" in fragment ? fragment.strokeWidth : this.strokeWidth;

                    context.save();
                    context.font = fragment.fontStyle + ' ' + fragment.fontWeight + ' ' + fragment.fontSize + 'px ' + fragment.fontName;
                    context.fillStyle = convertColor(fontColor);
                    // context.textAlign = textAlign;
                    context.textAlign = "left";
                    context.textBaseline = 'middle';
                    context.lineJoin = 'round';

                    if (strokeColor != null) {
                        context.strokeStyle = convertColor(strokeColor || 0x000);
                        context.lineWidth = (strokeWidth || 1) * 2;
                        context.strokeText(fragment.text, x, y);
                    }
                    context.fillText(fragment.text, x, y);
                    context.restore();
                }

                x += fragment.width;
            });

            y += lineHeight;
        });
    }
}
