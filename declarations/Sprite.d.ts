import { IEventHelper } from './UIEvent';
import { Color } from './Util';
import Texture from './Texture';
import EventEmitter from './EventEmitter';
export declare enum AlignType {
    TOP = 0,
    RIGHT = 1,
    BOTTOM = 2,
    LEFT = 3,
    CENTER = 4,
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
    alignX?: AlignType;
    alignY?: AlignType;
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
export declare const RAD_PER_DEG: number;
/**
 * Sprite as the base element
 */
export default class Sprite<T extends ISprite> extends EventEmitter {
    protected _width: number;
    protected _height: number;
    protected _originX: number;
    protected _originY: number;
    protected _rotation: number;
    protected _rotationRad: number;
    protected _texture: Texture;
    protected _alignX: AlignType;
    protected _alignY: AlignType;
    protected _parent: Sprite<T>;
    protected _props: T & ISprite;
    _originPixelX: number;
    _originPixelY: number;
    id: number;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    radius: number;
    opacity: number;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;
    lighterMode: boolean;
    autoResize: boolean;
    flippedX: boolean;
    flippedY: boolean;
    visible: boolean;
    clipOverflow: boolean;
    bgColor: Color;
    border: {
        width: number;
        color: Color;
    };
    children: Sprite<any>[];
    touchEnabled: boolean;
    mouseEnabled: boolean;
    keyboardEnabled: boolean;
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
    constructor(attrs?: ISprite);
    protected _init(attrs?: ISprite): void;
    width: number;
    height: number;
    originX: number;
    originY: number;
    rotation: number;
    texture: Texture | string;
    parent: Sprite<any>;
    alignX: AlignType;
    alignY: AlignType;
    _update(deltaTime: number): void;
    _visit(context: CanvasRenderingContext2D): void;
    adjustAlignX(): void;
    adjustAlignY(): void;
    protected _visitAllChildren(context: CanvasRenderingContext2D): void;
    protected _clip(context: CanvasRenderingContext2D): void;
    protected _drawBgColor(context: CanvasRenderingContext2D): void;
    protected _drawBorder(context: CanvasRenderingContext2D): void;
    protected draw(context: CanvasRenderingContext2D): void;
    addChild(target: Sprite<any>, position?: number): void;
    removeChild(target: Sprite<any>): void;
    removeAllChildren(recusive?: boolean): void;
    release(recusive?: boolean): void;
    update(deltaTime: number): any;
}
