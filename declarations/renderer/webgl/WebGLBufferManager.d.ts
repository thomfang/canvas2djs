export declare class WebGLBufferManager {
    gl: WebGLRenderingContext;
    private bufferInfoById;
    private bufferInfoList;
    constructor(gl: WebGLRenderingContext);
    getBuffer(id: number): WebGLBuffer;
    createBuffer(id: number): WebGLBuffer;
    removeBuffer(id: number): void;
}
