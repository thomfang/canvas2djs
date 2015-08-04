/// <reference path="action.ts" />
/// <reference path="texture.ts" />

namespace canvas2d {

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
        bgColor?: string;
        texture?: Texture;
        rotation?: number;
        opacity?: number;
        visible?: boolean;
        flippedX?: boolean;
        flippedY?: boolean;
        
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
        onclick?(e: UIEvent.IEventHelper): any;

        /**
         * Mouse begin event handler
         */
        onmousebegin?(e: UIEvent.IEventHelper, event: MouseEvent): any;
        
        /**
         * Mouse moved event handler
         */
        onmousemoved?(e: UIEvent.IEventHelper, event: MouseEvent): any;
        
        /**
         * Mouse ended event handler
         */
        onmouseended?(e: UIEvent.IEventHelper, event: MouseEvent): any;

        /**
         * Touch begin event handler
         */
        ontouchbegin?(touches: UIEvent.IEventHelper[], event: TouchEvent): any;
        
        /**
         * Touch moved event handler
         */
        ontouchmoved?(touches: UIEvent.IEventHelper[], event: TouchEvent): any;
        
        /**
         * Touch ended event hadndler
         */
        ontouchended?(touch: UIEvent.IEventHelper, touches: UIEvent.IEventHelper[], event: TouchEvent): any;
    }

    export const RAD_PER_DEG: number = Math.PI / 180;

    /**
     * Sprite as the base element
     */
    export class Sprite implements ISprite {
        protected _width: number = 0;
        protected _height: number = 0;
        protected _originX: number = 0.5;
        protected _originY: number = 0.5;
        protected _rotation: number = 0;
        protected _rotationRad: number = 0;
        protected _texture: Texture;

        _originPixelX: number = 0;
        _originPixelY: number = 0;

        x: number = 0;
        y: number = 0;
        scaleX: number = 1;
        scaleY: number = 1;
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
        bgColor: string;
        parent: Sprite;
        children: Sprite[];

        touchEnabled: boolean = true;
        mouseEnabled: boolean = true;
        keyboardEnabled: boolean = true;

        constructor(attrs?: ISprite) {
            this._init(attrs);
        }

        protected _init(attrs?: ISprite) {
            Object.keys(attrs).forEach(name => this[name] = attrs[name]);
            
            if (typeof this['init'] === 'function') {
                this['init']();
            }
        }

        set width(value: number) {
            this._width = value;
            this._originPixelX = this._width * this._originX;
        }

        get width(): number {
            return this._width;
        }

        set height(value: number) {
            this._height = value;
            this._originPixelY = this._height * this._originY;
        }

        get height(): number {
            return this._height;
        }

        set originX(value: number) {
            this._originX = value;
            this._originPixelX = this._originX * this._width;
        }

        get originX(): number {
            return this._originX;
        }

        set originY(value: number) {
            this._originY = value;
            this._originPixelY = this._originY * this._height;
        }

        get originY(): number {
            return this._originY;
        }

        set rotation(value: number) {
            this._rotation = value;
            this._rotationRad = this._rotation * RAD_PER_DEG;
        }

        get rotation(): number {
            return this._rotation;
        }

        set texture(value: Texture) {
            this._texture = value;

            if (this.autoResize) {
                if (value) {
                    this.width = value.width;
                    this.height = value.height;
                }
                else {
                    this.width = 0;
                    this.height = 0;
                }
            }
        }

        get texture() {
            return this._texture;
        }

        _update(deltaTime: number): void {
            if (typeof this['update'] === 'function') {
                this['update'](deltaTime);
            }

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
                context.scale(sx,  sy);
            }

            var rotationRad: number = this._rotationRad % 360;

            if (rotationRad !== 0) {
                context.rotate(rotationRad);
            }

            if (this._width !== 0 && this._height !== 0) {
                this.draw(context);
            }

            this._visitAllChild(context);

            context.restore();
        }

        protected _visitAllChild(context: CanvasRenderingContext2D): void {
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

        protected _drawBgColor(context: CanvasRenderingContext2D): void {
            if (typeof this.bgColor === 'string') {
                context.fillStyle = this.bgColor;
                context.beginPath();
                context.rect(-this._originPixelX, -this._originPixelY, this._width, this._height);
                context.closePath();
                context.fill();
            }
        }

        protected draw(context: CanvasRenderingContext2D): void {
            this._drawBgColor(context);

            var texture = this.texture;
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

        addChild(target: Sprite, position?: number): void {
            if (target.parent) {
                throw new Error("Sprite has been added");
            }

            if (!this.children) {
                this.children = [];
            }

            var children: Sprite[] = this.children;

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

        removeChild(target: Sprite): void {
            if (!this.children || !this.children.length) {
                return;
            }
            var index = this.children.indexOf(target);
            if (index > -1) {
                this.children.splice(index, 1);
                target.parent = null;
            }
        }

        removeAllChild(recusive?: boolean): void {
            if (!this.children || !this.children.length) {
                return;
            }

            while (this.children.length) {
                var sprite: Sprite = this.children[0];

                if (recusive) {
                    sprite.removeAllChild(true);
                    Action.stop(sprite);
                }
                this.removeChild(sprite);
            }

            this.children = null;
        }
    }
}
