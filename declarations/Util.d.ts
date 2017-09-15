export declare type Color = string | number;
export declare function uid(target: any): any;
export declare function addArrayItem(array: any[], item: any): void;
export declare function removeArrayItem(array: any[], item: any): void;
export declare function convertColor(color: string | number): string;
export declare function hexToRgb(hex: string): {
    r: number;
    g: number;
    b: number;
};
export declare function rgbToHex(r: number, g: number, b: number): string;
