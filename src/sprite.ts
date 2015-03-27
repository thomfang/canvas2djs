/// <reference path="action.ts" />
/// <reference path="texture.ts" />

module canvas2d {

    export interface SpriteAttrs {
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
        sourceX?: number;
        sourceY?: number;
        sourceWidth?: number;
        sourceHeight?: number;
        lighterMode?: boolean;
        touchEnabled?: boolean;
        mouseEnabled?: boolean;
        keyboardEnabled?: boolean;
    }

    var RAD_PER_DEG: number = Math.PI / 180;

    export class Sprite {
        private _width: number = 0;
        private _height: number = 0;
        private _originX: number = 0.5;
        private _originY: number = 0.5;
        private _rotation: number = 0;
        private _rotationRad: number = 0;
        private _texture: Texture;

        _originPixelX: number = 0;
        _originPixelY: number = 0;

        x: number = 0;
        y: number = 0;
        scaleX: number = 1;
        scaleY: number = 1;
        sourceX: number = 0;
        sourceY: number = 0;
        opacity: number = 1;

        lighterMode: boolean = false;
        autoResize: boolean = true;
        flippedX: boolean = false;
        flippedY: boolean = false;
        visible: boolean = true;

        sourceWidth: number;
        sourceHeight: number;
        bgColor: string;
        parent: Sprite;
        children: Sprite[];

        touchEnabled: boolean = true;
        mouseEnabled: boolean = true;
        keyboardEnabled: boolean = true;

        constructor(attrs?: SpriteAttrs) {
            this._init(attrs);
        }

        protected _init(attrs?: SpriteAttrs) {
            var name: string;

            for (name in attrs) {
                (<any>this)[name] = (<any>attrs)[name];
            }

            if (this.init) {
                this.init();
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
            if (this.update) {
                this.update(deltaTime);
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

        init(): void {}
        update(deltaTime: number): void {}

        onclick(e: UIEvent.EventHelper): void {}

        onmousebegin(e: UIEvent.EventHelper, event: MouseEvent): void {}
        onmousemoved(e: UIEvent.EventHelper, event: MouseEvent): void {}
        onmouseended(e: UIEvent.EventHelper, event: MouseEvent): void {}

        ontouchbegin(touches: UIEvent.EventHelper[], event): void {}
        ontouchmoved(touches: UIEvent.EventHelper[], event): void {}
        ontouchended(touch: UIEvent.EventHelper, touches: UIEvent.EventHelper[], event): void {}
    }
}
