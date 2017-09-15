import { WebGLTextureManager } from './WebGLTextureManager';
import { WebGLBufferManager } from './WebGLBufferManager';
import { Sprite } from '../../sprite/Sprite';
import { VertexData } from './VertexData';
import { TransformData } from './TransformData';
import { Matrix3 } from "./Matrix3";
import { WebGLUtil } from "./WebGLUtil";
import { CanvasRenderTarget } from '../../rendertarget/CanvasRenderTarget';

export class WebGLRenderer {
    private textureManager: WebGLTextureManager;
    private alphaBufferManager: WebGLBufferManager;
    private texCoordBufferManager: WebGLBufferManager;
    private vertexBufferManager: WebGLBufferManager;

    private gl: WebGLRenderingContext;
    private program: WebGLProgram | null;

    private colorLoction: number;
    private vertexLocation: number;
    private textureCoordLocation: number;
    private sampleLocation: WebGLUniformLocation;
    private matrixLocation: WebGLUniformLocation;

    size: { width: number; height: number };
    projectionMatrix: number[];

    init(canvas: HTMLCanvasElement) {
        let obj = WebGLUtil.createWebGLRenderingContext(canvas);
        this.gl = obj.gl;
        this.program = obj.program;
        this.colorLoction = obj.attributes.color;
        this.vertexLocation = obj.attributes.vertex;
        this.textureCoordLocation = obj.attributes.textureCoord;
        this.sampleLocation = obj.uniforms.sample;
        this.matrixLocation = obj.uniforms.matrix;

        this.vertexBufferManager = new WebGLBufferManager(this.gl);
        this.texCoordBufferManager = new WebGLBufferManager(this.gl);
        this.alphaBufferManager = new WebGLBufferManager(this.gl);
        this.textureManager = new WebGLTextureManager(this.gl);
    }

    setSize(width: number, height: number) {
        this.size = { width, height };
        this.gl.viewport(0, 0, width, height);
        this.projectionMatrix = Matrix3.make2DProjection(width, height);
    }

    draw(sprite: Sprite<{}>) {
        var gl = this.gl;
        // gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.drawSprite(sprite);
    }

    drawSprite(sprite: Sprite<{}>, parentMat: number[] = null, x = 0, y = 0, alpha = 1) {
        if (!sprite.visible || sprite.opacity === 0) {
            return;
        }

        let transformData = TransformData.getTransformData(sprite.id);
        let matrix = transformData.updateMatrix(sprite);

        if (x !== 0 || y !== 0) {
            matrix = Matrix3.matrixMultiply(matrix, Matrix3.makeTranslation(x, y));
        }

        // 应用父级的矩阵
        if (parentMat) {
            matrix = Matrix3.matrixMultiply(matrix, parentMat);
        }

        // 应用投影矩阵
        let projectedMat = Matrix3.matrixMultiply(matrix, this.projectionMatrix);

        this.gl.uniformMatrix3fv(this.matrixLocation, false, projectedMat);

        let originOffsetX = -sprite.originX * sprite.width;
        let originOffsetY = -sprite.originY * sprite.height;

        alpha *= sprite.opacity;

        if (sprite.clipOverflow) {
            this.gl.enable(this.gl.SCISSOR_TEST);
            this.gl.scissor(sprite.x + (x + originOffsetX), (this.size.height - sprite.height) * (1 - sprite.originY), sprite.width, sprite.height);
        }

        if (sprite.width !== 0 && sprite.height !== 0) {
            // let textureInfo = this.getTextureInfo(sprite.texture);
            // if (textureInfo.isReady) {
            //     this.drawTexture(sprite, textureInfo, originOffsetX, originOffsetY, alpha);
            // }
            // let canvasFrameBuffer = sprite.canvasFrameBuffer;
            // let hasUpdated = canvasFrameBuffer.update(sprite);
            // if (canvasFrameBuffer.hasSomethingToDraw) {
            //     this.drawTexture(sprite, canvasFrameBuffer, originOffsetX, originOffsetY, alpha, hasUpdated);
            // }
        }

        if (sprite.children) {
            sprite.children.forEach(child => {
                this.drawSprite(child, matrix, originOffsetX, originOffsetY, alpha);
            });
        }

        if (sprite.clipOverflow) {
            this.gl.disable(this.gl.SCISSOR_TEST);
        }
    }

    drawTexture(sprite: Sprite<{}>, canvasFrameBuffer: CanvasRenderTarget, x: number, y: number, alpha: number, hasUpdated: boolean) {
        var gl = this.gl;
        var vertexData = VertexData.getVertexData(sprite.id);

        var vertexBuffer = this.bindVertexBuffer(sprite, vertexData, x, y);
        gl.vertexAttribPointer(this.vertexLocation, 2, gl.FLOAT, false, 0, 0);

        var texCoordBuffer = this.bindTexCoordBuffer(sprite, vertexData);
        gl.vertexAttribPointer(this.textureCoordLocation, 2, gl.FLOAT, false, 0, 0);

        var alphaBuffer = this.bindAlphaBuffer(sprite, vertexData, alpha);
        gl.vertexAttribPointer(this.colorLoction, 2, gl.FLOAT, false, 0, 0);

        var texture = this.textureManager.getTexture(canvasFrameBuffer.id);
        if (!texture) {
            texture = this.textureManager.createTexture(canvasFrameBuffer.id);
            hasUpdated = true;
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if (hasUpdated) {
            // Set the parameters so we can render any size image.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            // Upload the image into the texture.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvasFrameBuffer.source);
        }

        // gl.bindTexture(gl.TEXTURE0, texture);

        // gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
        gl.uniform1i(this.sampleLocation, 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
    }

    bindVertexBuffer(sprite: Sprite<{}>, vertexData: VertexData, x: number, y: number) {
        var gl = this.gl;
        var updated = vertexData.updateVertexs(x, y, sprite.width, sprite.height);
        var buffer: WebGLBuffer = this.vertexBufferManager.getBuffer(sprite.id);

        if (!buffer) {
            buffer = this.vertexBufferManager.createBuffer(sprite.id);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexData.vertexs, gl.STATIC_DRAW);
        }
        else {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            if (updated) {
                gl.bufferData(gl.ARRAY_BUFFER, vertexData.vertexs, gl.STATIC_DRAW);
            }
        }
        return buffer;
    }

    bindTexCoordBuffer(sprite: Sprite<{}>, vertexData: VertexData) {
        var gl = this.gl;

        var buffer: WebGLBuffer = this.texCoordBufferManager.getBuffer(sprite.id);

        if (!buffer) {
            buffer = this.texCoordBufferManager.createBuffer(sprite.id);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexData.texCoords, gl.STATIC_DRAW);
        }
        else {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        }
        return buffer;
    }

    // bindTexCoordBuffer(sprite: Sprite<{}>, vertexData: VertexData, updated: boolean) {
    //     var gl = this.gl;
    //     var imgWidth = sprite.width;
    //     var imgHeight = sprite.height;

    //     var updated = vertexData.updateTexCoords(textureInfo.source.width, textureInfo.source.height, sprite.sourceX, sprite.sourceY, sw, sh);
    //     var buffer: WebGLBuffer = this.texCoordBufferManager.getBuffer(sprite.id);

    //     if (!buffer) {
    //         buffer = this.texCoordBufferManager.createBuffer(sprite.id);
    //         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    //         gl.bufferData(gl.ARRAY_BUFFER, vertexData.texCoords, gl.STATIC_DRAW);
    //     }
    //     else {
    //         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    //         if (updated) {
    //             gl.bufferData(gl.ARRAY_BUFFER, vertexData.texCoords, gl.STATIC_DRAW);
    //         }
    //     }
    //     return buffer;
    // }

    bindAlphaBuffer(sprite: Sprite<{}>, vertexData: VertexData, alpha: number) {
        let gl = this.gl;
        let updated = vertexData.updateAlpha(alpha);
        let buffer: WebGLBuffer = this.alphaBufferManager.getBuffer(sprite.id);

        if (!buffer) {
            buffer = this.alphaBufferManager.createBuffer(sprite.id);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexData.alpha, gl.STATIC_DRAW);
        }
        else {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            if (updated) {
                gl.bufferData(gl.ARRAY_BUFFER, vertexData.alpha, gl.STATIC_DRAW);
            }
        }
        return buffer;
    }

    removeData(sprite: Sprite<{}>) {
        // let id = sprite.id;
        // this.vertexBufferManager.removeBuffer(id);
        // this.texCoordBufferManager.removeBuffer(id);
        // this.alphaBufferManager.removeBuffer(id);
        // this.textureManager.removeTexture(sprite.canvasFrameBuffer.id);

        // VertexData.removeVertexData(id);
        // TransformData.removeTransformData(id);
    }

    // getTextureInfo(imageUrl: string) {
    //     if (!this.textureInfo[imageUrl]) {
    //         var gl = this.gl;
    //         var texture = gl.createTexture() as WebGLTexture;
    //         var image = new Image();
    //         this.textureInfo[imageUrl] = {
    //             source: image,
    //             texture: texture,
    //             isReady: false,
    //         };
    //         var textureSource = this.textureInfo[imageUrl];

    //         image.onload = () => {
    //             gl.bindTexture(gl.TEXTURE_2D, texture);

    //             // Set the parameters so we can render any size image.
    //             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    //             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    //             // Upload the image into the texture.
    //             gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    //             gl.bindTexture(gl.TEXTURE_2D, null);

    //             textureSource.isReady = true;
    //         };

    //         image.src = imageUrl;
    //     }

    //     return this.textureInfo[imageUrl];
    // }

    private static instance: WebGLRenderer;
    public static getInstance() {
        if (!this.instance) {
            this.instance = new WebGLRenderer();
        }
        return this.instance;
    }
}