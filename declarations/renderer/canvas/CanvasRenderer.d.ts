import { Sprite } from '../../sprite/Sprite';
export declare class CanvasRenderer {
    private context;
    private bufferContext;
    private bufferCanvas;
    size: {
        width: number;
        height: number;
    };
    init(canvas: HTMLCanvasElement): void;
    setSize(width: number, height: number): void;
    render(sprite: Sprite<{}>): void;
    private drawSprite(sprite);
    private drawOnCanvas(sprite);
    private clip(sprite);
}
