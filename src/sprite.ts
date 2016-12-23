import { IEventHelper } from './UIEvent';
import { Color, normalizeColor, uid } from './Util';
import Action from './Action';
import Texture from './Texture';
import EventEmitter from './EventEmitter';

export enum AlignType {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT,
    CENTER
}

/**
 * Sprite attributes
 */
export interface ISprite {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    originX?: number;
    originY?: number;
    bgColor?: Color;
    radius?: number;
    border?: {
        width: number;
        color: Color;
    };
    texture?: Texture | string;
    rotation?: number;
    opacity?: number;
    visible?: boolean;
    alignX?: AlignType,
    alignY?: AlignType,
    flippedX?: boolean;
    flippedY?: boolean;
    clipOverflow?: boolean;

    /**
     * Position X of the clipping rect on texture
     */
    sourceX?: number;

    /**
     * Position Y of the clipping rect on texture
     */
    sourceY?: number;

    /**
     * Width of the clipping rect on texture
     */
    sourceWidth?: number;

    /**
     * Height of the clipping rect on texture
     */
    sourceHeight?: number;

    /**
     * Use lighter mode
     */
    lighterMode?: boolean;

    /**
     * Auto resize by the texture
     */
    autoResize?: boolean;

    touchEnabled?: boolean;
    mouseEnabled?: boolean;
    keyboardEnabled?: boolean;

    /**
     * Sprite initialize method
     */
    init?(): any;

    /**
     * Sprite would call this method each frame
     * @param  deltaTime  Duration between now and last frame
     */
    update?(deltaTime: number): any;

    /**
     * Click event handler
     */
    onClick?(e: IEventHelper, event: MouseEvent): any;

    /**
     * Mouse begin event handler
     */
    onMouseBegin?(e: IEventHelper, event: MouseEvent): any;

    /**
     * Mouse moved event handler
     */
    onMouseMoved?(e: IEventHelper, event: MouseEvent): any;

    /**
     * Mouse ended event handler
     */
    onMouseEnded?(e: IEventHelper, event: MouseEvent): any;

    /**
     * Touch begin event handler
     */
    onTouchBegin?(touches: IEventHelper[], event: TouchEvent): any;

    /**
     * Touch moved event handler
     */
    onTouchMoved?(touches: IEventHelper[], event: TouchEvent): any;

    /**
     * Touch ended event hadndler
     */
    onTouchEnded?(touches: IEventHelper[], event: TouchEvent): any;

    /**
     * KeyDown event handler
     */
    onKeyDown?(event: KeyboardEvent): any;

    /**
     * KeyUp event handler
     */
    onKeyUp?(event: KeyboardEvent): any;
}

export const RAD_PER_DEG: number = Math.PI / 180;

/**
 * Sprite as the base element
 */
export default class Sprite<T extends ISprite> extends EventEmitter {
    protected _width: number = 0;
    protected _height: number = 0;
    protected _originX: number = 0.5;
    protected _originY: number = 0.5;
    protected _rotation: number = 0;
    protected _rotationRad: number = 0;
    protected _texture: Texture;
    protected _alignX: AlignType;
    protected _alignY: AlignType;
    protected _parent: Sprite<T>;

    protected _props: T & ISprite; // Use for tsx

    _originPixelX: number = 0;
    _originPixelY: number = 0;

    id: number;

    x: number = 0;
    y: number = 0;
    scaleX: number = 1;
    scaleY: number = 1;
    radius: number = 0;
    opacity: number = 1;
    sourceX: number = 0;
    sourceY: number = 0;
    sourceWidth: number;
    sourceHeight: number;
    lighterMode: boolean = false;
    autoResize: boolean = true;
    flippedX: boolean = false;
    flippedY: boolean = false;
    visible: boolean = true;
    clipOverflow: boolean = false;
    bgColor: Color;
    border: {
        width: number;
        color: Color;
    };
    children: Sprite<any>[];

    touchEnabled: boolean = true;
    mouseEnabled: boolean = true;
    keyboardEnabled: boolean = true;

    onClick: ISprite["onClick"];

    /**
     * Mouse begin event handler
     */
    onMouseBegin: ISprite["onMouseBegin"];

    /**
     * Mouse moved event handler
     */
    onMouseMoved: ISprite["onMouseMoved"];

    /**
     * Mouse ended event handler
     */
    onMouseEnded: ISprite["onMouseEnded"];

    /**
     * Touch begin event handler
     */
    onTouchBegin: ISprite["onTouchBegin"];

    /**
     * Touch moved event handler
     */
    onTouchMoved: ISprite["onTouchMoved"];

    /**
     * KeyDown event handler
     */
    onKeyDown: ISprite["onKeyDown"];

    /**
     * KeyUp event handler
     */
    onKeyUp: ISprite["onKeyUp"];

    /**
     * Touch ended event hadndler
     */
    onTouchEnded: ISprite["onTouchEnded"];

    constructor(attrs?: ISprite) {
        super();
        this.id = uid(this);
        this._init(attrs);
    }

    protected _init(attrs?: ISprite) {
        if (attrs) {
            Object.keys(attrs).forEach(name => this[name] = attrs[name]);
        }
        this.init();
    }

    set width(value: number) {
        if (this._width === value) {
            return;
        }

        this._width = value;
        this._originPixelX = this._width * this._originX;
        this.adjustAlignX();

        this.children && this.children.forEach(sprite => sprite.adjustAlignX());
    }

    get width(): number {
        return this._width;
    }

    set height(value: number) {
        if (this._height === value) {
            return;
        }

        this._height = value;
        this._originPixelY = this._height * this._originY;
        this.adjustAlignY();

        this.children && this.children.forEach(sprite => sprite.adjustAlignY());
    }

    get height(): number {
        return this._height;
    }

    set originX(value: number) {
        if (this._originX === value) {
            return;
        }

        this._originX = value;
        this._originPixelX = this._originX * this._width;
        this.adjustAlignX();
    }

    get originX(): number {
        return this._originX;
    }

    set originY(value: number) {
        if (this._originY === value) {
            return;
        }

        this._originY = value;
        this._originPixelY = this._originY * this._height;
        this.adjustAlignY();
    }

    get originY(): number {
        return this._originY;
    }

    set rotation(value: number) {
        if (this._rotation === value) {
            return;
        }

        this._rotation = value;
        this._rotationRad = this._rotation * RAD_PER_DEG;
    }

    get rotation(): number {
        return this._rotation;
    }

    set texture(value: Texture | string) {
        let texture: Texture;

        if (typeof value === 'string') {
            texture = Texture.create(value);
        }
        else {
            texture = value;
        }

        if (texture === this._texture) {
            return;
        }

        this._texture = texture;

        if (!this.autoResize) {
            return;
        }

        if (texture) {
            if (texture.ready) {
                this.width = texture.width;
                this.height = texture.height;
            }
            else {
                texture.onReady((size) => {
                    this.width = size.width;
                    this.height = size.height;
                });
            }
        }
        else {
            this.width = 0;
            this.height = 0;
        }
    }

    get texture() {
        return this._texture;
    }

    set parent(sprite: Sprite<any>) {
        if (sprite === this._parent) {
            return;
        }

        this._parent = sprite;

        if (sprite) {
            this.adjustAlignX();
            this.adjustAlignY();
        }
    }

    get parent() {
        return this._parent;
    }

    set alignX(value: AlignType) {
        if (this._alignX === value || value === AlignType.BOTTOM || value === AlignType.TOP) {
            return;
        }
        this._alignX = value;
        this.adjustAlignX();
    }

    get alignX() {
        return this._alignX;
    }

    set alignY(value: AlignType) {
        if (this._alignY === value || value === AlignType.LEFT || value === AlignType.RIGHT) {
            return;
        }
        this._alignY = value;
        this.adjustAlignY();
    }

    get alignY() {
        return this._alignY;
    }

    _update(deltaTime: number): void {
        this.update(deltaTime);

        if (this.children && this.children.length) {
            this.children.slice().forEach((child) => {
                child._update(deltaTime);
            });
        }
    }

    _visit(context: CanvasRenderingContext2D): void {
        if (!this.visible || this.opacity === 0) {
            return;
        }

        var sx: number = this.scaleX;
        var sy: number = this.scaleY;

        context.save();

        if (this.lighterMode) {
            context.globalCompositeOperation = "lighter";
        }
        if (this.x !== 0 || this.y !== 0) {
            context.translate(this.x, this.y);
        }
        if (this.opacity !== 1) {
            context.globalAlpha = this.opacity;
        }
        if (this.flippedX) {
            sx = -sx;
        }
        if (this.flippedY) {
            sy = -sy;
        }
        if (sx !== 1 || sy !== 1) {
            context.scale(sx, sy);
        }

        var rotationRad: number = this._rotationRad % 360;

        if (rotationRad !== 0) {
            context.rotate(rotationRad);
        }

        if ((this._width !== 0 && this._height !== 0) || this.radius > 0) {
            this.draw(context);
        }

        this._visitAllChildren(context);

        context.restore();
    }

    adjustAlignX() {
        if (!this.parent || this._alignX == null) {
            return;
        }

        let x: number;
        let ox = this._originPixelX;

        switch (this._alignX) {
            case AlignType.LEFT:
                x = ox;
                break;
            case AlignType.RIGHT:
                x = this.parent.width - (this.width - ox);
                break;
            case AlignType.CENTER:
                x = this.parent.width * 0.5 + ox - this.width * 0.5;
                break;
        }

        if (x != null) {
            this.x = x;
        }
    }

    adjustAlignY() {
        if (!this.parent || this._alignY == null) {
            return;
        }

        let y: number;
        let oy = this._originPixelY;

        switch (this._alignY) {
            case AlignType.TOP:
                y = oy;
                break;
            case AlignType.BOTTOM:
                y = this.parent.height - (this.height - oy);
                break;
            case AlignType.CENTER:
                y = this.parent.height * 0.5 + oy - this.height * 0.5;
                break;
        }

        if (y != null) {
            this.y = y;
        }
    }

    protected _visitAllChildren(context: CanvasRenderingContext2D): void {
        if (!this.children || !this.children.length) {
            return;
        }
        if (this._originPixelX !== 0 || this._originPixelY !== 0) {
            context.translate(-this._originPixelX, -this._originPixelY);
        }

        this.children.forEach((child) => {
            child._visit(context);
        });
    }

    protected _clip(context: CanvasRenderingContext2D) {
        if (!this.clipOverflow) {
            return;
        }

        context.beginPath();
        if (this.radius > 0) {
            context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        }
        else {
            context.rect(-this._originPixelX, -this._originPixelY, this._width, this._height);
        }
        context.closePath();
        context.clip();
    }

    protected _drawBgColor(context: CanvasRenderingContext2D): void {
        if (this.bgColor == null) {
            return;
        }

        context.fillStyle = normalizeColor(this.bgColor);
        context.beginPath();
        if (this.radius > 0) {
            context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        }
        else {
            context.rect(-this._originPixelX, -this._originPixelY, this._width, this._height);
        }
        context.closePath();
        context.fill();
    }

    protected _drawBorder(context: CanvasRenderingContext2D): void {
        if (this.border) {
            context.lineWidth = this.border.width;
            context.strokeStyle = normalizeColor(this.border.color);
            context.beginPath();
            if (this.radius > 0) {
                context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
            }
            else {
                context.rect(-this._originPixelX, -this._originPixelY, this._width, this._height);
            }
            context.closePath();
            context.stroke();
        }
    }

    protected draw(context: CanvasRenderingContext2D): void {
        this._clip(context);
        this._drawBgColor(context);
        this._drawBorder(context);

        var texture = this._texture;
        if (texture && texture.ready && texture.width !== 0 && texture.height !== 0) {
            var sx: number = this.sourceX;
            var sy: number = this.sourceY;
            var sw: number = this.sourceWidth == null ? texture.width : this.sourceWidth;
            var sh: number = this.sourceHeight == null ? texture.height : this.sourceHeight;

            context.drawImage(
                texture.source, sx, sy, sw, sh,
                -this._originPixelX, -this._originPixelY, this.width, this.height
            );
        }
    }

    addChild(target: Sprite<any>, position?: number): void {
        if (target.parent) {
            throw new Error("Sprite has been added");
        }

        if (!this.children) {
            this.children = [];
        }

        var children: Sprite<any>[] = this.children;

        if (children.indexOf(target) === -1) {
            if (position > -1 && position < children.length) {
                children.splice(position, 0, target);
            }
            else {
                children.push(target);
            }
            target.parent = this;
        }
    }

    removeChild(target: Sprite<any>): void {
        if (!this.children || !this.children.length) {
            return;
        }
        var index = this.children.indexOf(target);
        if (index > -1) {
            this.children.splice(index, 1);
            target.parent = null;
        }
    }

    removeAllChildren(recusive?: boolean): void {
        if (!this.children || !this.children.length) {
            return;
        }

        while (this.children.length) {
            var sprite: Sprite<any> = this.children[0];

            if (recusive) {
                sprite.removeAllChildren(true);
                Action.stop(sprite);
            }
            this.removeChild(sprite);
        }

        this.children = null;
    }

    release(recusive?: boolean) {
        Action.stop(this);

        if (recusive && this.children) {
            while (this.children.length) {
                this.children[0].release(recusive);
            }
        }
        else {
            this.removeAllChildren();
        }

        if (this.parent) {
            this.parent.removeChild(this);
        }

        addToReleasePool(this);
    }

    init(): any {

    }

    update(deltaTime: number): any {

    }
}

let releaseSpritePool: Sprite<any>[] = [];
let timerId: number;

function addToReleasePool(sprite: Sprite<any>) {
    releaseSpritePool.push(sprite);

    if (timerId != null) {
        return;
    }

    setTimeout(() => {
        releaseSpritePool.forEach(e => {
            for (let i in e) {
                delete e[i];
            }
        });

        timerId = null;
        releaseSpritePool.length = 0;
    }, 0);
}
