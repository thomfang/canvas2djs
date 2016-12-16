var gulp = require('gulp');
var ts = require('gulp-typescript');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var stripLine = require('gulp-strip-line');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function () {

    var tsResult = tsProject.src() // or tsProject.src() 
        .pipe(tsProject());

    return tsResult.dts
        .pipe(concat("canvas2d.d.ts"))
        .pipe(replace(/export\s+(default)?|declare\s+/g, ''))
        .pipe(stripLine([/import.*?from.+/]))
        .pipe(header([
            'export as namespace canvas2d;',
            'export = canvas2d;\n',
            'declare namespace canvas2d {\n'
        ].join('\n')))
        .pipe(footer('\n}'))
        .pipe(gulp.dest('dist/'));
});