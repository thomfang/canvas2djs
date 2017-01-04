import { normalizeColor, Color } from './Util';
import Sprite, { ISprite } from './Sprite';

var measureContext = document.createElement("canvas").getContext("2d");
var regEnter = /\n/;

export type FontWeight = "lighter" | "normal" | "bold" | "bolder";
export type FontStyle = "oblique" | "normal" | "italic";
export type TextAlign = "left" | "right" | "center" | "start" | "end";

export interface ITextLabel extends ISprite {
    text?: string;
    fontName?: string;
    textAlign?: TextAlign;
    fontColor?: Color;
    fontSize?: number;
    lineSpace?: number;
    fontStyle?: FontStyle;
    fontWeight?: FontWeight;
    maxWidth?: number;
    stroke?: {
        color: Color;
        width: number;
    };
}

export default class TextLabel extends Sprite<ITextLabel> {

    maxWidth: number;
    fontName: string = 'sans-serif';
    textAlign: TextAlign = 'center';
    fontColor: Color = 0x000;
    fontSize: number = 20;
    fontWeight: FontWeight = 'normal';
    fontStyle: FontStyle = 'normal';
    lineSpace: number = 5;
    stroke: {
        color: Color;
        width: number;
    };

    private _lines: string[];
    private _text: string = '';

    constructor(props?: ITextLabel) {
        super();
        super._init(props);
    }

    protected _init(props?: ISprite) {

    }

    set texture(value: any) {
        throw new Error(`canvas2d: TextLabel cannot set texture.`);
    }

    set text(content: string) {
        if (this._text !== content) {
            this._text = content;

            if (this.autoResize) {
                this._resize();
            }
            else {
                this._lines = content.split(regEnter);
            }
        }
    }

    get text(): string {
        return this._text;
    }

    private _resize(): void {
        this._lines = this._text.split(regEnter);

        var width = 0;
        var height = 0;
        var fontSize = this.fontSize;
        var lineSpace = this.lineSpace;

        measureContext.save();
        measureContext.font = this.fontStyle + ' ' + this.fontWeight + ' ' + fontSize + 'px ' + this.fontName;

        this._lines.forEach((text, i) => {
            width = Math.max(width, measureContext.measureText(text).width);
            height = lineSpace * i + fontSize * (i + 1);
        });

        measureContext.restore();

        this.width = width;
        this.height = height;
    }

    addChild(): void {
        throw new Error(`canvas2d.TextLabel.addChild(): Don't call this method.`);
    }

    protected draw(context: CanvasRenderingContext2D): void {
        this._drawBgColor(context);
        this._drawBorder(context);

        if (this._text.length === 0) {
            return;
        }

        context.font = this.fontStyle + ' ' + this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontName;
        context.fillStyle = normalizeColor(this.fontColor);
        context.textAlign = this.textAlign;
        context.textBaseline = 'middle';
        context.lineJoin = 'round';

        if (this.stroke) {
            context.strokeStyle = normalizeColor(this.stroke.color);
            context.lineWidth = this.stroke.width * 2;
        }

        var y = 0;
        var h = this.fontSize + this.lineSpace;

        this._lines.forEach((text) => {
            if (text.length > 0) {
                if (this.stroke) {
                    context.strokeText(text, 0, y, 0xffff);
                }
                context.fillText(text, 0, y, 0xffff);
            }
            y += h;
        });
    }
}
