import { Color } from '../Util';
import { Sprite, ISprite } from './Sprite';
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
    fontStroke?: {
        color: Color;
        width: number;
    };
}
export declare class TextLabel extends Sprite<ITextLabel> {
    maxWidth: number;
    fontName: string;
    textAlign: TextAlign;
    lineSpace: number;
    fontColor: Color;
    fontSize: number;
    fontWeight: FontWeight;
    fontStyle: FontStyle;
    fontStroke: {
        color: Color;
        width: number;
    };
    private _lines;
    private _text;
    constructor(props?: ITextLabel);
    protected _init(props?: ISprite): void;
    texture: any;
    text: string;
    private _resize();
    addChild(): void;
    protected draw(context: CanvasRenderingContext2D): void;
}
