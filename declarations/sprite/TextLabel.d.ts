import { Color } from '../Util';
import { Sprite, ISprite } from './Sprite';
export declare type FontWeight = "lighter" | "normal" | "bold" | "bolder";
export declare type FontStyle = "oblique" | "normal" | "italic";
export declare type TextAlign = "left" | "right" | "center" | "start" | "end";
export declare type ITextLabel = ISprite & {
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
};
export declare class TextLabel extends Sprite<ITextLabel> {
    textAlign: TextAlign;
    strokeColor: Color;
    strokeWidth: number;
    fontColor: Color;
    protected _wordWrap: boolean;
    protected _fontName: string;
    protected _lineHeight: number;
    protected _fontSize: number;
    protected _fontWeight: FontWeight;
    protected _fontStyle: FontStyle;
    protected _lines: {
        width: number;
        text: string;
    }[];
    protected _text: string;
    constructor(props?: ITextLabel);
    width: number;
    height: number;
    fontSize: number;
    fontName: string;
    fontStyle: FontStyle;
    fontWeight: FontWeight;
    lineHeight: number;
    wordWrap: boolean;
    text: string;
    private _reMeasureText();
    addChild(target: any): void;
    addChildren(...children: any[]): void;
    protected draw(context: CanvasRenderingContext2D): void;
}
