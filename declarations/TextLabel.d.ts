import Sprite, { ISprite } from './sprite';
import { Color } from './Util';
export declare type FontWeight = "lighter" | "normal" | "bold" | "bolder";
export declare type FontStyle = "oblique" | "normal" | "italic";
export declare type TextAlign = "left" | "right" | "center" | "start" | "end";
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
    fontName: string;
    textAlign: TextAlign;
    fontColor: Color;
    fontSize: number;
    fontWeight: FontWeight;
    fontStyle: FontStyle;
    lineSpace: number;
    stroke: {
        color: Color;
        width: number;
    };
    private _lines;
    private _text;
    constructor(attrs?: ITextLabel);
    protected _init(attrs?: ISprite): void;
    texture: any;
    text: string;
    private _resize();
    addChild(): void;
    removeChild(): void;
    protected draw(context: CanvasRenderingContext2D): void;
}
