import typescript from 'rollup-plugin-typescript';

export default {
    entry: 'src/canvas2d.ts',
    format: 'umd',
    sourceMap: true,
    moduleName: 'canvas2d',
    moduleId: 'canvas2d',
    dest: 'dist/canvas2d.js',
    plugins: [
        typescript({
            tsconfig: false
        })
    ]
}
