/// <reference path="sprite.ts" />
/// <reference path="texture.ts" />

namespace canvas2d {
    
    export interface IBMFontLabel extends ISprite {
        textureMap: {[word: string]: Texture};
        text?: string;
    }

    /**
     * BitMap font label
     */
    export class BMFontLabel extends Sprite {

        private _text: string;
        private _words: Texture[];
        private _wordTextureMap: {[word: string]: Texture};
        
        constructor(attrs?: IBMFontLabel) {
            super(attrs);
        }

        set text(text: string) {
            this.setText(text);
        }
        get text() {
            return this._text;
        }
        
        setText(text: string) {
            this._text = text || '';

            var words = this._text.split('');

            if (!words.length) {
                this._words.length = 0;
            }
            else {
                this._words = words.map(word => {
                    if (!this._wordTextureMap[word]) {
                        throw new Error(word + ': the texture of this word not found');
                    }
                    return this._wordTextureMap[word];
                });
            }

            this.removeAllChild();

            if (this._words && this._words.length) {
                this._words.forEach((word, i) => {
                    this.addChild(new Sprite({
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
    }
}
