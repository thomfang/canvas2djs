import { Color } from '../Util';
import { Sprite, ISprite } from './Sprite';
import { TextFlow, TextFragment } from '../measureText';
import { CanvasSource } from '../CanvasSource';
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
    textFlow?: TextFlow[];
    autoResizeWidth?: boolean;
};
export declare class TextLabel extends Sprite<ITextLabel> {
    protected _canvasSource: CanvasSource;
    protected _wordWrap: boolean;
    protected _fontName: string;
    protected _lineHeight: number;
    protected _fontSize: number;
    protected _fontWeight: FontWeight;
    protected _fontStyle: FontStyle;
    protected _textAlign: TextAlign;
    protected _strokeColor: Color;
    protected _strokeWidth: number;
    protected _fontColor: Color;
    protected _textFlow: Array<TextFlow>;
    protected _autoResizeWidth: boolean;
    protected _textLines: {
        fragments: TextFragment[];
        width: number;
    }[];
    protected _text: string;
    protected _isSetByTextFlow: boolean;
    protected _fragmentsPos: {
        x: number;
        y: number;
    }[];
    constructor(props?: ITextLabel);
    readonly fragmentsPos: {
        x: number;
        y: number;
    }[];
    readonly textLines: {
        fragments: TextFragment[];
        width: number;
    }[];
    textAlign: TextAlign;
    strokeColor: Color;
    strokeWidth: number;
    fontColor: Color;
    autoResizeWidth: boolean;
    width: number;
    height: number;
    fontSize: number;
    fontName: string;
    fontStyle: FontStyle;
    fontWeight: FontWeight;
    lineHeight: number;
    wordWrap: boolean;
    text: string;
    textFlow: Array<TextFlow>;
    private _reMeasureText();
    protected _updateFragmentsPos(): void;
    protected _updateCanvasSource(): void;
    addChild(target: any): void;
    addChildren(...children: any[]): void;
    protected draw(context: CanvasRenderingContext2D): void;
    release(recusive?: boolean): void;
}
