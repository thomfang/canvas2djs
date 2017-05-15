import { Texture } from '../Texture';
import { Sprite, ISprite } from './Sprite';
import { TextAlign } from './TextLabel';

export type IBMFontLabel = ISprite & {
    textureMap: { [word: string]: Texture };
    text?: string;
    textAlign?: TextAlign;
    wordWrap?: boolean;
    wordSpace?: number;
    lineHeight?: number;
    fontSize?: number;
}

export class BMFontLabel extends Sprite<IBMFontLabel> {

    protected _lineHeight: number = 5;
    protected _wordSpace: number = 0;
    protected _fontSize: number = 0;
    protected _textAlign: TextAlign = "center";
    protected _wordWrap: boolean = true;
    protected _text: string = "";
    protected _textureMap: { [word: string]: Texture };

    protected _lines: { width: number; words: Texture[] }[] = [];
    protected _autoResize: boolean = true;

    constructor(props?: IBMFontLabel) {
        super();
        props && this.setProps(props);
    }

    get autoResize() {
        return this._autoResize;
    }

    set autoResize(value: boolean) {
        if (this._autoResize !== value) {
            this._autoResize = value;
            if (value && this._lines.length) {
                this.height = this._lines.length * this.lineHeight;
            }
        }
    }

    set text(text: string) {
        if (text === this._text) {
            return;
        }
        this._text = text;
        this._reMeasureText();
    }
    get text() {
        return this._text;
    }

    get textureMap() {
        return this._textureMap;
    }

    set textureMap(textureMap: { [word: string]: Texture }) {
        this._textureMap = textureMap;
        this._reMeasureText();
    }

    get textAlign() {
        return this._textAlign;
    }

    set textAlign(value: TextAlign) {
        if (this._textAlign != value) {
            this._textAlign = value;
        }
    }

    get lineHeight() {
        return this._lineHeight;
    }

    set lineHeight(value: number) {
        if (this._lineHeight != value) {
            this._lineHeight = value;
            if (this.autoResize && this._lines.length) {
                this.height = this._lines.length * value;
            }
        }
    }

    get wordSpace() {
        return this._wordSpace;
    }

    set wordSpace(value: number) {
        if (this._wordSpace !== value) {
            this._wordSpace = value;
            this._reMeasureText();
        }
    }

    set wordWrap(value: boolean) {
        if (this._wordWrap !== value) {
            this._wordWrap = value;
            this._reMeasureText();
        }
    }

    get wordWrap() {
        return this._wordWrap;
    }

    get fontSize() {
        return this._fontSize;
    }

    set fontSize(value: number) {
        if (this._fontSize !== value) {
            this._fontSize = value;
            this._reMeasureText();
        }
    }

    get width() {
        return this._width;
    }

    set width(value: number) {
        if (this._width === value) {
            return;
        }

        this._width = value;
        this._originPixelX = this._width * this._originX;

        if (this.left != null || this.right != null) {
            this._reCalcX();
        }
        else {
            this._adjustAlignX();
        }

        this._reMeasureText();
    }

    get height() {
        return this._height;
    }

    set height(value: number) {
        if (this._height === value) {
            return;
        }
        this._height = value;
        this._originPixelY = this._height * this._originY;

        if (this.top != null || this.bottom != null) {
            this._reCalcY();
        }
        else {
            this._adjustAlignY();
        }
    }

    protected _reMeasureText() {
        if (!this.textureMap || !this._text) {
            this._lines.length = 0;
            return;
        }

        const { textureMap, text, width, lineHeight, fontSize, wordWrap, wordSpace, _lines } = this;

        _lines.length = 0;

        var words = this._text.split('');
        var currLine = _lines[0] = { width: 0, words: [] };

        words.forEach(word => {
            let texture: Texture;
            if (word === " ") {
                texture = null;
            }
            else {
                texture = textureMap[word];
                if (!texture) {
                    console.error(`canvas2d.BMFontLabel: Texture of the word "${word}" not found.`, this);
                    texture = null;
                }
                if (!texture.ready) {
                    console.error(`canvas2d.BMFontLabel: Texture of the word "${word}" is not ready to use.`, this);
                    texture = null;
                }
            }

            if (!wordWrap || currLine.width + fontSize <= width) {
                currLine.width += fontSize;
                currLine.words.push(texture);

                if (currLine.width + wordSpace >= width) {
                    currLine = _lines[_lines.length] = {
                        width: 0, words: []
                    };
                }
            }
            else {
                currLine = _lines[_lines.length] = {
                    width: fontSize, words: [texture]
                };
            }
        });

        if (this.autoResize) {
            this.height = _lines.length * lineHeight;
        }
    }

    protected draw(context: CanvasRenderingContext2D) {
        super.draw(context);

        const { _originPixelX, _originPixelY, _textAlign, fontSize, lineHeight, wordSpace, width } = this;

        let lineSpace = (lineHeight - fontSize) * 0.5;
        let y: number = -_originPixelY + lineSpace;

        this._lines.forEach((line, i) => {
            let x: number;

            if (_textAlign === "right") {
                x = width - line.width - _originPixelX;
            }
            else if (_textAlign == "center") {
                x = (width - line.width) * 0.5 - _originPixelX;
            }
            else {
                x = -_originPixelX;
            }

            line.words.forEach((word, j) => {
                if (word) {
                    context.drawImage(word.source, 0, 0, word.width, word.height, x, y, fontSize, fontSize);
                }
                x += fontSize + wordSpace;
            });

            y += lineHeight;
        });
    }

    addChild(target: any) {
        this._text = (this._text || "") + target;
    }

    addChildren(...children: any[]) {
        this._text = (this._text || "") + children.join("");
    }

}
