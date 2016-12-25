import Texture from './Texture';
import Sprite, { ISprite } from './Sprite';

export interface IBMFontLabel extends ISprite {
    textureMap: { [word: string]: Texture };
    text?: string;
}

export default class BMFontLabel extends Sprite<IBMFontLabel> {

    private _text: string;
    private _words: Texture[];
    private _textureMap: { [word: string]: Texture };

    constructor(attrs?: IBMFontLabel) {
        super(attrs);
    }

    set text(text: string) {
        if (text === this._text) {
            return;
        }
        this.setText(text);
    }
    get text() {
        return this._text;
    }

    get textureMap() {
        return this._textureMap;
    }

    set textureMap(textureMap: { [word: string]: Texture }) {
        this._textureMap = textureMap;
        this.setText(this._text);
    }

    setText(text: string) {
        this._text = text || '';

        if (!this.textureMap || !this._text) {
            return;
        }

        var words = this._text.split('');

        if (!words.length) {
            this._words.length = 0;
        }
        else {
            this._words = words.map(word => {
                if (!this._textureMap[word]) {
                    console.error(`canvas2d.BMFontLabel: Texture of the word "${word}" not found`);
                }
                return this._textureMap[word];
            });
        }

        this.removeAllChildren();

        if (this._words && this._words.length) {
            this._words.forEach((word, i) => {
                if (!word) {
                    return;
                }

                super.addChild(new Sprite({
                    x: i * word.width,
                    texture: word,
                    originX: 0,
                    originY: 0
                }));
            });

            this.width = this._words.length * this._words[0].width;
            this.height = this._words[0].height;
        }
    }

    addChild() {
        throw new Error('canvas2d.BMFontLabel.addChild(): This method cannot be called.');
    }
    
}
