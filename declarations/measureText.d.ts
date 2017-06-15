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
        text: string;
    }[];
};
export declare type MeasuredSize2 = {
    width: number;
    height: number;
    lines: {
        width: number;
        fragments: TextFragment[];
    }[];
};
export declare function measureText2(textFlow: TextFlow[], width: number, fontName: string, fontStyle: FontStyle, fontWeight: FontWeight, fontSize: number, lineHeight: number): MeasuredSize2;
