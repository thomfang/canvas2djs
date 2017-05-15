export declare type FontFace = {
    style: string;
    weight: string;
    name: string;
};
export declare type MeasuredSize = {
    width: number;
    height: number;
    lines: {
        width: number;
        text: string;
    }[];
};
export declare function measureText(text: string, width: number, fontFace: FontFace, fontSize: number, lineHeight: number): MeasuredSize;
