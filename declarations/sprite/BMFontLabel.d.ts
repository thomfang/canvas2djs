import { Texture } from '../Texture';
import { Sprite, ISprite } from './Sprite';
import { TextAlign } from './TextLabel';
export declare type IBMFontLabel = ISprite & {
    textureMap: {
        [word: string]: Texture | string;
    };
    text?: string;
    textAlign?: TextAlign;
    wordWrap?: boolean;
    wordSpace?: number;
    lineHeight: number;
    fontSize: number;
    autoResizeHeight?: boolean;
};
export declare class BMFontLabel extends Sprite<IBMFontLabel> {
    protected _lineHeight: number;
    protected _wordSpace: number;
    protected _fontSize: number;
    protected _textAlign: TextAlign;
    protected _wordWrap: boolean;
    protected _text: string;
    protected _textureMap: {
        [word: string]: Texture;
    };
    protected _bmfontLines: {
        width: number;
        fragments: Texture[];
    }[];
    protected _fragmentsPos: {
        x: number;
        y: number;
        height: number;
    }[];
    protected _autoResizeHeight: boolean;
    protected _isAllTexturesReady: boolean;
    constructor(props?: IBMFontLabel);
    readonly fragmentsPos: {
        x: number;
        y: number;
        height: number;
    }[];
    readonly bmfontLines: {
        width: number;
        fragments: Texture[];
    }[];
    autoResizeHeight: boolean;
    text: string;
    textureMap: {
        [word: string]: Texture | string;
    };
    textAlign: TextAlign;
    lineHeight: number;
    wordSpace: number;
    wordWrap: boolean;
    fontSize: number;
    width: number;
    height: number;
    protected _reMeasureText(): void;
    protected _updateFragmentsPos(): void;
    protected draw(context: CanvasRenderingContext2D): void;
    addChild(target: any): void;
    addChildren(...children: any[]): void;
}
