import { Sprite } from '../../sprite/Sprite';
import { VertexData } from './VertexData';
import { CanvasRenderTarget } from '../../rendertarget/CanvasRenderTarget';
export declare class WebGLRenderer {
    private textureManager;
    private alphaBufferManager;
    private texCoordBufferManager;
    private vertexBufferManager;
    private gl;
    private program;
    private colorLoction;
    private vertexLocation;
    private textureCoordLocation;
    private sampleLocation;
    private matrixLocation;
    size: {
        width: number;
        height: number;
    };
    projectionMatrix: number[];
    init(canvas: HTMLCanvasElement): void;
    setSize(width: number, height: number): void;
    draw(sprite: Sprite<{}>): void;
    drawSprite(sprite: Sprite<{}>, parentMat?: number[], x?: number, y?: number, alpha?: number): void;
    drawTexture(sprite: Sprite<{}>, canvasFrameBuffer: CanvasRenderTarget, x: number, y: number, alpha: number, hasUpdated: boolean): void;
    bindVertexBuffer(sprite: Sprite<{}>, vertexData: VertexData, x: number, y: number): WebGLBuffer;
    bindTexCoordBuffer(sprite: Sprite<{}>, vertexData: VertexData): WebGLBuffer;
    bindAlphaBuffer(sprite: Sprite<{}>, vertexData: VertexData, alpha: number): WebGLBuffer;
    removeData(sprite: Sprite<{}>): void;
    private static instance;
    static getInstance(): WebGLRenderer;
}
