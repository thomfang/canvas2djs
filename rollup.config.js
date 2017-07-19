var typescript = require('@alexlur/rollup-plugin-typescript');
var pkg = require('./package.json');

var banner =
`/**
 * ${pkg.name} v${pkg.version}
 * Copyright (c) 2013-present ${pkg.author.name} <${pkg.author.email}>
 * All rights reserved.
 */
`;

module.exports = {
    entry: 'src/canvas2d.ts',
    format: 'umd',
    sourceMap: true,
    moduleName: 'canvas2djs',
    moduleId: 'canvas2djs',
    dest: 'dist/canvas2d.js',
    plugins: [
        typescript({
            typescript: require('typescript'),
            tsconfig: false,
            target: 'es5'
        })
    ],
    banner
}
