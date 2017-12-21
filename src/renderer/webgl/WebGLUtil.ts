export namespace WebGLUtil {

    var isSupport: boolean;

    export function isSupportWebGL() {
        if (isSupport == null) {
            let canvas = document.createElement('canvas');
            try {
                isSupport = createContextAndProgram(canvas) != null;
            } catch (e) {

            }
            canvas = null;
        }
        return isSupport;
    }

    function createContextAndProgram(canvas: HTMLCanvasElement) {
        let gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as any;
        let program = createProgram(gl, [{
            type: gl.VERTEX_SHADER,
            source: vertexShaderSource
        }, {
            type: gl.FRAGMENT_SHADER,
            source: fregmentShaderSource,
        }]);
        return { gl, program };
    }

    export function createWebGLRenderingContext(canvas: HTMLCanvasElement) {
        try {
            let { gl, program } = createContextAndProgram(canvas);
            gl.useProgram(program);

            let vertexLocation = gl.getAttribLocation(program, 'a_vertex');
            let textureCoordLocation = gl.getAttribLocation(program, 'a_textureCoord');
            let colorLoction = gl.getAttribLocation(program, 'a_color');
            let sampleLocation = gl.getUniformLocation(program, "u_sample");
            let matrixLocation = gl.getUniformLocation(program, 'u_matrix');

            gl.enableVertexAttribArray(vertexLocation);
            gl.enableVertexAttribArray(textureCoordLocation);
            gl.enableVertexAttribArray(colorLoction);
            gl.activeTexture(gl.TEXTURE0);

            return {
                gl: gl as WebGLRenderingContext,
                program: program,
                attributes: {
                    vertex: vertexLocation,
                    textureCoord: textureCoordLocation,
                    color: colorLoction,
                },
                uniforms: {
                    sample: sampleLocation,
                    matrix: matrixLocation,
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    export function createProgram(gl: WebGLRenderingContext, shaders: { type: number; source: string }[]) {
        let program = gl.createProgram();
        for (let i = 0, l = shaders.length; i < l; i++) {
            let shaderInfo = shaders[i];
            let shader = createShader(gl, shaderInfo.type, shaderInfo.source);
            gl.attachShader(program, shader);
        }
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.warn(gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    export function createShader(gl: WebGLRenderingContext, type: number, source: string) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.warn(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
}

const vertexShaderSource = `
    attribute vec2 a_color;
    attribute vec2 a_vertex;
    attribute vec2 a_textureCoord;

    uniform mat3 u_matrix;

    varying vec2 v_textureCoord;
    varying vec4 v_color;

    void main() {
        // Multiply the position by the matrix.
        gl_Position = vec4((u_matrix * vec3(a_vertex, 1)).xy, 0, 1);
        v_textureCoord = a_textureCoord;
        v_color = vec4(a_color.x, a_color.x, a_color.x, a_color.x);
    }`;

const fregmentShaderSource = `
    precision lowp float;
    varying vec2 v_textureCoord;
    varying vec4 v_color;
    uniform sampler2D uSampler;

    void main() {
        gl_FragColor = texture2D(uSampler, v_textureCoord) * v_color;
    }`;