/// <reference path="sprite.ts" />

namespace canvas2d {

    export interface ITextLabel extends ISprite {
        fontName?: string;
        textAlign?: string;
        fontColor?: string;
        fontSize?: number;
        lineSpace?: number;
    }

    var measureContext = document.createElement("canvas").getContext("2d");
    var regEnter = /\n/;

    export class TextLabel extends Sprite {

        fontName: string = 'Arial';
        textAlign: string = 'center';
        fontColor: string = '#000';
        fontSize: number = 20;
        lineSpace: number = 5;

        private _lines: string[];
        private _text: string = '';

        constructor(attrs?: ITextLabel) {
            super();
            super._init(attrs);
        }

        protected _init(attrs?: ISprite) {

        }

        set text(content: string) {
            if (this._text !== content) {
                this._text = content;

                if (this.autoResize) {
                    this._resize();
                }
                else {
                    this._lines = content.split(regEnter);
                }
            }
        }

        get text(): string {
            return this._text;
        }

        private _resize(): void {
            this._lines = this._text.split(regEnter);

            var width = 0;
            var height = 0;
            var fontSize = this.fontSize;
            var lineSpace = this.lineSpace;

            measureContext.save();
            measureContext.font = fontSize + 'px ' + this.fontName;

            this._lines.forEach((text, i) => {
                width = Math.max(width, measureContext.measureText(text).width);
                height = lineSpace * i + fontSize * (i + 1);
            });

            measureContext.restore();

            this.width = width;
            this.height = height;
        }

        addChild(): void {
            throw new Error("TextLabel cannot not have children");
        }

        removeChild(): void {
            throw new Error("TextLabel has no child");
        }

        protected draw(context: CanvasRenderingContext2D): void {
            if (this._text.length === 0) {
                return;
            }

            this._drawBgColor(context);

            context.font = this.fontSize + 'px ' + this.fontName;
            context.fillStyle = this.fontColor;
            context.textAlign = this.textAlign;
            context.textBaseline = 'top';

            var y = -this.originY * this.height;
            var w = this.width;
            var h = this.fontSize + this.lineSpace;

            this._lines.forEach((text) => {
                if (text.length > 0) {
                    context.fillText(text, 0, y);
                }
                y += h;
            });
        }
    }
}
