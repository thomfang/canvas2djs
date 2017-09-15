export declare class WebGLTextureManager {
    gl: WebGLRenderingContext;
    private textureInfoList;
    private textureInfoById;
    constructor(gl: WebGLRenderingContext);
    getTexture(id: number): WebGLTexture;
    createTexture(id: number): WebGLTexture;
    removeTexture(id: number): void;
}
