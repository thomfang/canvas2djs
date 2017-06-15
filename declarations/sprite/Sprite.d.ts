import { EventHelper } from '../UIEvent';
import { Color } from '../Util';
import { Texture } from '../Texture';
import { EventEmitter } from '../EventEmitter';
import { Stage } from '../Stage';
import { SpriteProps } from '../createSprite';
export declare const RAD_PER_DEG: number;
export declare enum AlignType {
    TOP = 0,
    RIGHT = 1,
    BOTTOM = 2,
    LEFT = 3,
    CENTER = 4,
}
export declare enum BlendMode {
    SOURCE_IN = 0,
    SOURCE_OVER = 1,
    SOURCE_ATOP = 2,
    SOURCE_OUT = 3,
    DESTINATION_OVER = 4,
    DESTINATION_IN = 5,
    DESTINATION_OUT = 6,
    DESTINATION_ATOP = 7,
    LIGHTER = 8,
    COPY = 9,
    XOR = 10,
}
export declare class Sprite<T extends ISprite> extends EventEmitter {
    protected _props: T & SpriteProps;
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
    protected _stage: Stage;
    protected _top: number;
    protected _right: number;
    protected _bottom: number;
    protected _left: number;
    protected _percentWidth: number;
    protected _percentHeight: number;
    protected _originPixelX: number;
    protected _originPixelY: number;
    protected _grid: number[];
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
    autoResize: boolean;
    flippedX: boolean;
    flippedY: boolean;
    visible: boolean;
    clipOverflow: boolean;
    bgColor: Color;
    borderColor: Color;
    borderWidth: number;
    children: Sprite<any>[];
    blendMode: BlendMode;
    touchEnabled: boolean;
    mouseEnabled: boolean;
    onClick: ISprite["onClick"];
    onMouseBegin: ISprite["onMouseBegin"];
    onMouseMoved: ISprite["onMouseMoved"];
    onMouseEnded: ISprite["onMouseEnded"];
    onTouchBegin: ISprite["onTouchBegin"];
    onTouchMoved: ISprite["onTouchMoved"];
    onTouchEnded: ISprite["onTouchEnded"];
    constructor(props?: T & SpriteProps);
    protected _init(props?: T & SpriteProps): void;
    setProps(props: T & SpriteProps): void;
    width: number;
    height: number;
    originX: number;
    originY: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
    percentWidth: number;
    percentHeight: number;
    grid: number[];
    rotation: number;
    texture: Texture | string;
    parent: Sprite<any>;
    stage: Stage;
    alignX: AlignType;
    alignY: AlignType;
    protected _update(deltaTime: number): void;
    protected _visit(context: CanvasRenderingContext2D): void;
    protected _reLayoutChildrenOnWidthChanged(): void;
    protected _reLayoutChildrenOnHeightChanged(): void;
    protected _resizeWidth(): void;
    protected _reCalcX(): void;
    protected _resizeHeight(): void;
    protected _reCalcY(): void;
    protected _adjustAlignX(): boolean;
    protected _adjustAlignY(): boolean;
    protected _visitChildren(context: CanvasRenderingContext2D): void;
    protected _clip(context: CanvasRenderingContext2D): void;
    protected _drawBgColor(context: CanvasRenderingContext2D): void;
    protected _drawBorder(context: CanvasRenderingContext2D): void;
    protected draw(context: CanvasRenderingContext2D): void;
    addChild(target: Sprite<any>, position?: number): void;
    addChildren(...children: Sprite<any>[]): void;
    removeChild(target: Sprite<any>): void;
    removeChildren(...children: Sprite<any>[]): void;
    removeAllChildren(recusive?: boolean): void;
    contains(target: Sprite<any>): any;
    release(recusive?: boolean): void;
    update(deltaTime: number): any;
}
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
    borderWidth?: number;
    borderColor?: Color;
    texture?: Texture | string;
    rotation?: number;
    opacity?: number;
    visible?: boolean;
    alignX?: AlignType;
    alignY?: AlignType;
    flippedX?: boolean;
    flippedY?: boolean;
    clipOverflow?: boolean;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    percentWidth?: number;
    percentHeight?: number;
    grid?: number[];
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
    blendMode?: BlendMode;
    /**
     * Auto resize by the texture
     */
    autoResize?: boolean;
    touchEnabled?: boolean;
    mouseEnabled?: boolean;
    /**
     * Sprite would call this method each frame
     * @param  deltaTime  Duration between now and last frame
     */
    update?(deltaTime: number): any;
    /**
     * Click event handler
     */
    onClick?(e: EventHelper, event: MouseEvent): any;
    /**
     * Mouse begin event handler
     */
    onMouseBegin?(e: EventHelper, event: MouseEvent): any;
    /**
     * Mouse moved event handler
     */
    onMouseMoved?(e: EventHelper, event: MouseEvent): any;
    /**
     * Mouse ended event handler
     */
    onMouseEnded?(e: EventHelper, event: MouseEvent): any;
    /**
     * Touch begin event handler
     */
    onTouchBegin?(touches: EventHelper[], event: TouchEvent): any;
    /**
     * Touch moved event handler
     */
    onTouchMoved?(touches: EventHelper[], event: TouchEvent): any;
    /**
     * Touch ended event hadndler
     */
    onTouchEnded?(touches: EventHelper[], event: TouchEvent): any;
}
