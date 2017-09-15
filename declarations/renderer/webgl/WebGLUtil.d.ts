export declare namespace WebGLUtil {
    function isSupportWebGL(): boolean;
    function createWebGLRenderingContext(canvas: HTMLCanvasElement): {
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        attributes: {
            vertex: any;
            textureCoord: any;
            color: any;
        };
        uniforms: {
            sample: any;
            matrix: any;
        };
    };
    function createProgram(gl: WebGLRenderingContext, shaders: {
        type: number;
        source: string;
    }[]): WebGLProgram;
    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader;
}
