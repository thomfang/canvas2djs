import { Sprite } from '../sprite/Sprite';
import { Texture } from '../Texture';
import { uid, convertColor } from '../Util';
import { TextFragment } from '../measureText';

export class CanvasRenderTarget {
    protected options: CanvasFrameBufferOptions;
    protected context: CanvasRenderingContext2D;
    protected isIdle: boolean;

    id: number;
    source: HTMLCanvasElement;
    hasSomethingToDraw: boolean;

    constructor() {
        this.id = uid(this);
    }

    protected init() {
        this.options = {
            radius: 0,
            width: 0,
            height: 0,
            texture: null,
            sourceX: 0,
            sourceY: 0,
            sourceWidth: null,
            sourceHeight: null,
            grid: null,
            bgColor: null,
            borderColor: null,
            borderWidth: null,

            fragmentsPos: null,
            bmfontLines: null,
            textLines: null,
            fontSize: null,
            fontColor: null,
            strokeColor: null,
            strokeWidth: null,

        };
        this.isIdle = false;
        this.hasSomethingToDraw = false;
    }

    public update(sprite: Sprite<{}>) {
        let needUpdate: boolean;
        Object.keys(this.options).forEach(key => {
            let value = sprite[key];
            if (key === 'bgColor' || key === 'borderColor' || key === 'fontColor' || key === 'strokeColor') {
                value = convertColor(value);
            }
            if (key === 'texture') {
                let texture = value as Texture;
                if (this.options.texture != texture) {
                    if (!texture || texture.ready) {
                        this.options.texture = texture;
                        needUpdate = true;
                    }
                }
            }
            else if (this.options[key] != value) {
                this.options[key] = value;
                needUpdate = true;
            }
        });
        if (!needUpdate) {
            return false;
        }
        this.hasSomethingToDraw = true;
        this.updateSource();
        return true;
    }

    public updateSource() {
        let { width, height, radius, bgColor, borderColor, texture, textLines, bmfontLines } = this.options;

        if (((width === 0 || height === 0) && radius === 0) ||
            (bgColor == null && borderColor == null && texture == null && textLines == null && bmfontLines == null)) {
            return this.hasSomethingToDraw = false;
        }

        let canvasWidth: number;
        let canvasHeight: number;
        if (radius > 0) {
            canvasWidth = canvasHeight = Math.ceil(radius * 2);
        }
        else {
            canvasWidth = Math.ceil(width);
            canvasHeight = Math.ceil(height);
        }
        if (canvasWidth === 0 || canvasHeight === 0) {
            this.hasSomethingToDraw = false;
            return;
        }
        
        if (!this.source) {
            this.createCanvas();
        }
        let { source, context } = this;
        if (source.width != canvasWidth || source.height !== canvasHeight) {
            source.width = canvasWidth;
            source.height = canvasHeight;
        }
        else {
            context.clearRect(0, 0, source.width, source.height);
        }

        context.save();

        this.drawBgColor();
        this.drawTexture();
        this.drawText();
        this.drawBMFont();
        this.drawBorder();

        context.restore();
    }

    public drawBgColor() {
        let context = this.context;
        let { bgColor, radius, width, height } = this.options;
        if (bgColor != null) {
            context.fillStyle = bgColor;
            context.beginPath();
            if (radius > 0) {
                context.arc(radius, radius, radius, 0, Math.PI * 2, true);
            }
            else {
                context.rect(0, 0, width, height);
            }
            context.closePath();
            context.fill();
            this.hasSomethingToDraw = true;
        }
    }

    public drawBorder() {
        let context = this.context;
        let { borderColor, borderWidth, radius, width, height } = this.options;
        if (borderColor != null) {
            context.lineWidth = borderWidth || 1;
            context.strokeStyle = borderColor;
            context.beginPath();
            if (radius > 0) {
                context.arc(radius, radius, radius, 0, Math.PI * 2, true);
            }
            else {
                context.rect(0, 0, width, height);
            }
            context.closePath();
            context.stroke();
            this.hasSomethingToDraw = true;
        }
    }

    public drawTexture() {
        let context = this.context;
        let { borderWidth, sourceX, sourceY, sourceWidth, sourceHeight, grid, texture, width, height } = this.options;
        if (texture && texture.ready && texture.width !== 0 && texture.height !== 0) {
            sourceWidth = sourceWidth == null ? texture.width : sourceWidth;
            sourceHeight = sourceHeight == null ? texture.height : sourceHeight;

            if (!Array.isArray(grid)) {
                context.drawImage(texture.source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
            }
            else {
                let gridSource = texture.createGridSource(width, height, sourceX, sourceY, sourceWidth, sourceHeight, grid);
                context.drawImage(gridSource, 0, 0, width, height);
            }
            this.hasSomethingToDraw = true;
        }
    }

    public drawText() {
        let context = this.context;
        let { fontColor, strokeColor, strokeWidth, fragmentsPos, textLines } = this.options;

        if (textLines) {
            let index = 0;
            context.textAlign = "left";
            context.textBaseline = 'middle';
            context.lineJoin = 'round';
            textLines.forEach(line => {
                line.fragments.forEach((fragment) => {
                    if (fragment.text) {
                        let _fontColor = fragment.fontColor != null ? fragment.fontColor : fontColor;
                        let _strokeColor = "strokeColor" in fragment ? fragment.strokeColor : strokeColor;
                        let _strokeWidth = "strokeWidth" in fragment ? fragment.strokeWidth : strokeWidth;

                        let pos = fragmentsPos[index];

                        context.font = fragment.fontStyle + ' ' + fragment.fontWeight + ' ' + fragment.fontSize + 'px ' + fragment.fontName;
                        context.fillStyle = convertColor(_fontColor);

                        if (_strokeColor != null) {
                            context.strokeStyle = convertColor(_strokeColor || 0x000);
                            context.lineWidth = _strokeWidth || 1;
                            context.strokeText(fragment.text, pos.x, pos.y);
                        }
                        context.fillText(fragment.text, pos.x, pos.y);
                    }
                    index += 1;
                });
            });
            this.hasSomethingToDraw = true;
        }
    }

    public drawBMFont() {
        let context = this.context;
        let { bmfontLines, fragmentsPos, fontSize } = this.options;
        if (bmfontLines) {
            let index = 0;
            bmfontLines.forEach((line, i) => {
                line.fragments.forEach((word, j) => {
                    if (word) {
                        let pos = fragmentsPos[index];
                        context.drawImage(word.source, 0, 0, word.width, word.height, pos.x, pos.y, fontSize, pos.height);
                    }
                    index += 1;
                });
            });
            this.hasSomethingToDraw = true;
        }
    }

    protected createCanvas() {
        this.source = document.createElement('canvas');
        this.context = this.source.getContext('2d');
    }

    protected static instanceMap: { [id: number]: CanvasRenderTarget } = {};
    protected static instanceList: CanvasRenderTarget[] = [];

    public static create(id: number) {
        let renderTarget = this.instanceMap[id];
        if (!renderTarget) {
            for (let i = 0; renderTarget = this.instanceList[i]; i++) {
                if (renderTarget.isIdle) {
                    break;
                }
            }
            if (!renderTarget) {
                renderTarget = new this();
                this.instanceList.push(renderTarget);
            }
            renderTarget.init();
            this.instanceMap[id] = renderTarget;
        }
        return renderTarget;
    }

    public static remove(id: number) {
        let spriteTexture = this.instanceMap[id];
        if (spriteTexture) {
            spriteTexture.isIdle = true;
            delete this.instanceMap[id];
        }
    }
}

export type CanvasFrameBufferOptions = {
    grid: number[];
    radius: number;
    width: number;
    height: number;
    bgColor: string;
    borderColor: string;
    borderWidth: number;
    texture: Texture;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;

    fontSize: number;
    fontColor: string;
    strokeColor: string;
    strokeWidth: number;
    fragmentsPos: { x: number; y: number; height?: number; }[];
    textLines: { fragments: TextFragment[]; width: number }[];
    bmfontLines: { width: number; fragments: Texture[] }[];
}