import { Texture } from '../Texture';
import { Sprite, ISprite } from './Sprite';
export interface IBMFontLabel extends ISprite {
    textureMap: {
        [word: string]: Texture;
    };
    text?: string;
}
export declare class BMFontLabel extends Sprite<IBMFontLabel> {
    private _text;
    private _words;
    private _textureMap;
    constructor(attrs?: IBMFontLabel);
    text: string;
    textureMap: {
        [word: string]: Texture;
    };
    setText(text: string): void;
    addChild(): void;
}
