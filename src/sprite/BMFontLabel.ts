import { Texture } from '../Texture';
import { Sprite, ISprite } from './Sprite';
import { TextAlign } from './TextLabel';

export type IBMFontLabel = ISprite & {
    textureMap: { [word: string]: Texture | string };
    text?: string;
    textAlign?: TextAlign;
    wordWrap?: boolean;
    wordSpace?: number;
    lineHeight: number;
    fontSize: number;
    autoResizeHeight?: boolean;
}

export class BMFontLabel extends Sprite<IBMFontLabel> {

    protected _lineHeight: number = 5;
    protected _wordSpace: number = 0;
    protected _fontSize: number = 0;
    protected _textAlign: TextAlign = "center";
    protected _wordWrap: boolean = true;
    protected _text: string = "";
    protected _textureMap: { [word: string]: Texture };

    protected _bmfontLines: { width: number; fragments: Texture[] }[];
    protected _fragmentsPos: { x: number; y: number; height: number }[];
    protected _autoResizeHeight: boolean = true;
    protected _isAllTexturesReady: boolean;

    constructor(props?: IBMFontLabel) {
        super();
        props && this.setProps(props);
    }

    get fragmentsPos() {
        return this._fragmentsPos;
    }

    get bmfontLines() {
        return this._bmfontLines;
    }

    get autoResizeHeight() {
        return this._autoResizeHeight;
    }

    set autoResizeHeight(value: boolean) {
        if (this._autoResizeHeight !== value) {
            this._autoResizeHeight = value;
            if (value && this._bmfontLines && this._bmfontLines.length) {
                this.height = this._bmfontLines.length * this.lineHeight;
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

    set textureMap(textureMap: { [word: string]: Texture | string }) {
        if (textureMap != null) {
            let _textureMap: { [word: string]: Texture } = {};
            let unReadyCount = 0;
            let onReady = () => {
                if (this._isAllTexturesReady = --unReadyCount === 0) {
                    this._reMeasureText();
                }
            };
            Object.keys(textureMap).forEach(word => {
                let wordTexture = textureMap[word];
                if (typeof wordTexture === 'string') {
                    unReadyCount += 1;
                    wordTexture = _textureMap[word] = Texture.create(wordTexture);
                    wordTexture.onReady(onReady);
                }
                else {
                    _textureMap[word] = wordTexture;
                }
            });

            this._textureMap = _textureMap;
            if (this._isAllTexturesReady = unReadyCount === 0) {
                this._reMeasureText();
            }
        }
    }

    get textAlign() {
        return this._textAlign;
    }

    set textAlign(value: TextAlign) {
        if (this._textAlign != value) {
            this._textAlign = value;
            this._updateFragmentsPos();
        }
    }

    get lineHeight() {
        return this._lineHeight;
    }

    set lineHeight(value: number) {
        if (this._lineHeight != value) {
            this._lineHeight = value;
            if (this._autoResizeHeight && this._bmfontLines && this._bmfontLines.length) {
                this.height = this._bmfontLines.length * value;
            }
            this._updateFragmentsPos();
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
        if (!this.textureMap || !this._text || !this._isAllTexturesReady || this.width <= 0) {
            this._bmfontLines = null;
            return;
        }

        const { _textureMap, text, width, lineHeight, fontSize, wordWrap, wordSpace } = this;

        let _bmfontLines = this._bmfontLines = [];

        var words = this._text.split('');
        var currLine = _bmfontLines[0] = { width: 0, fragments: [] };

        words.forEach(word => {
            let texture: Texture;
            if (word === " ") {
                texture = null;
            }
            else {
                texture = _textureMap[word];
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
                currLine.fragments.push(texture);

                if (currLine.width + wordSpace >= width) {
                    currLine = _bmfontLines[_bmfontLines.length] = {
                        width: 0, fragments: []
                    };
                }
            }
            else {
                currLine = _bmfontLines[_bmfontLines.length] = {
                    width: fontSize, fragments: [texture]
                };
            }
        });

        if (this._autoResizeHeight) {
            this.height = _bmfontLines.length * lineHeight;
        }

        this._updateFragmentsPos();
    }

    protected _updateFragmentsPos() {
        if (!this._bmfontLines) {
            return;
        }

        let { _originPixelX, _originPixelY, _textAlign, _bmfontLines, width, fontSize, lineHeight, wordSpace } = this;
        let _fragmentsPos: { x: number; y: number; height: number }[] = this._fragmentsPos = [];
        let y: number = -_originPixelY;
        // let y = 0;

        _bmfontLines.forEach((line, i) => {
            let x: number;

            if (_textAlign === "right") {
                x = width - line.width - _originPixelX;
                // x = width - line.width;
            }
            else if (_textAlign == "center") {
                x = (width - line.width) * 0.5 - _originPixelX;
                // x = (width - line.width) * 0.5;
            }
            else {
                x = -_originPixelX;
                // x = 0;
            }

            line.fragments.forEach((word, j) => {
                let ty = y;
                let h = 0;
                if (word) {
                    h = fontSize / word.width * word.height;
                    let p = (lineHeight - h) * 0.5;
                    ty = y + p;
                }
                _fragmentsPos.push({ x, y: ty, height: h });
                x += fontSize + wordSpace;
            });

            y += lineHeight;
        });
    }

    protected draw(context: CanvasRenderingContext2D) {
        super.draw(context);

        if (!this._bmfontLines) {
            return;
        }

        const { _originPixelX, _originPixelY, _textAlign, fontSize, lineHeight, wordSpace, width } = this;

        // let y: number = -_originPixelY;
        let _fragmentsPos = this._fragmentsPos;
        let index = 0;

        this._bmfontLines.forEach((line, i) => {
            // let x: number;

            // if (_textAlign === "right") {
            //     x = width - line.width - _originPixelX;
            // }
            // else if (_textAlign == "center") {
            //     x = (width - line.width) * 0.5 - _originPixelX;
            // }
            // else {
            //     x = -_originPixelX;
            // }

            line.fragments.forEach((word, j) => {
                if (word) {
                    // let h = fontSize / word.width * word.height;
                    // let p = (lineHeight - h) * 0.5;
                    // context.drawImage(word.source, 0, 0, word.width, word.height, x, y + p, fontSize, h);
                    let pos = _fragmentsPos[index];
                    context.drawImage(word.source, 0, 0, word.width, word.height, pos.x, pos.y, fontSize, pos.height);
                }
                // x += fontSize + wordSpace;
                index += 1;
            });

            // y += lineHeight;
        });
    }

    addChild(target: any) {
        this._text = (this._text || "") + target;
    }

    addChildren(...children: any[]) {
        this._text = (this._text || "") + children.join("");
    }

}
