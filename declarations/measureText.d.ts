import { FontStyle, FontWeight } from './sprite/TextLabel';
import { Color } from './Util';
export declare type TextFlow = {
    text: string;
    fontStyle?: FontStyle;
    fontName?: string;
    fontWeight?: FontWeight;
    fontColor?: Color;
    fontSize?: number;
    strokeWidth?: number;
    strokeColor?: Color;
};
export declare type TextFragment = TextFlow & {
    width: number;
};
export declare type MeasuredSize = {
    width: number;
    height: number;
    lines: {
        width: number;
        fragments: TextFragment[];
    }[];
};
export declare function measureTextWidth(text: string, fontName: any, fontSize: any, fontWeight: any, fontStyle: any): number;
export declare function measureText(textFlow: TextFlow[], width: number, fontName: string, fontStyle: FontStyle, fontWeight: FontWeight, fontSize: number, lineHeight: number, wordWrap: boolean, autoResizeWidth: boolean): MeasuredSize;
