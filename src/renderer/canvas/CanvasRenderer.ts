import { Sprite, BlendModeStrings } from '../../sprite/Sprite';
import { convertColor } from '../../Util';

export class CanvasRenderer {

    private context: CanvasRenderingContext2D;
    private bufferContext: CanvasRenderingContext2D;
    private bufferCanvas: HTMLCanvasElement;

    size: { width: number; height: number };

    init(canvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d');
        this.bufferCanvas = document.createElement("canvas");
        this.bufferContext = this.bufferCanvas.getContext("2d");
    }

    setSize(width: number, height: number) {
        this.bufferCanvas.width = width;
        this.bufferCanvas.height = height;
        this.size = { width, height };
    }

    render(sprite: Sprite<{}>) {
        let { width, height } = this.size;

        this.bufferContext.clearRect(0, 0, width, height);
        this.drawSprite(sprite);

        this.context.clearRect(0, 0, width, height);
        this.context.drawImage(this.bufferCanvas, 0, 0, width, height);
    }

    private drawSprite(sprite: Sprite<{}>) {
        if (!sprite.visible || sprite.opacity === 0) {
            return;
        }

        var context = this.bufferContext;
        var sx: number = sprite.scaleX;
        var sy: number = sprite.scaleY;

        context.save();

        if (sprite.blendMode != null) {
            context.globalCompositeOperation = BlendModeStrings[sprite.blendMode];
        }
        if (sprite.x !== 0 || sprite.y !== 0) {
            context.translate(sprite.x, sprite.y);
        }
        if (sprite.opacity !== 1) {
            context.globalAlpha = sprite.opacity;
        }
        if (sprite.flippedX) {
            sx = -sx;
        }
        if (sprite.flippedY) {
            sy = -sy;
        }
        if (sx !== 1 || sy !== 1) {
            context.scale(sx, sy);
        }

        if (sprite.rotation % 360 !== 0) {
            context.rotate(sprite.rotationInRadians);
        }

        if ((sprite.width !== 0 && sprite.height !== 0) || sprite.radius > 0) {
            this.drawOnCanvas(sprite);
        }

        if (sprite.children && sprite.children.length) {
            if (sprite.originPixelX !== 0 || sprite.originPixelY !== 0) {
                context.translate(-sprite.originPixelX, -sprite.originPixelY);
            }
            for (let i = 0, child: Sprite<{}>; child = sprite.children[i]; i++) {
                this.drawSprite(child);
            }
        }

        context.restore();
    }

    private drawOnCanvas(sprite: Sprite<{}>): void {
        // let context = this.bufferContext;
        // let renderTarget = sprite.renderTarget;
        // this.clip(sprite);

        // if (renderTarget) {
        //     renderTarget.update(sprite);
        //     if (renderTarget.hasSomethingToDraw && renderTarget.source && renderTarget.source.width !== 0 && renderTarget.source.height !== 0) {
        //         context.drawImage(renderTarget.source, -sprite.originPixelX, -sprite.originPixelY, sprite.width, sprite.height);
        //     }
        // }
    }

    private clip(sprite: Sprite<{}>) {
        if (!sprite.clipOverflow) {
            return;
        }
        let context = this.bufferContext;

        context.beginPath();
        if (sprite.radius > 0) {
            context.arc(0, 0, sprite.radius, 0, Math.PI * 2, true);
        }
        else {
            context.rect(-sprite.originPixelX, -sprite.originPixelY, sprite.width, sprite.height);
        }
        context.closePath();
        context.clip();
    }
}