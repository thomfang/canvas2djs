var gulp = require("gulp");
var concat = require("gulp-concat");
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var merge2 = require("merge2");

gulp.task('default', function() {
    var tsResult = gulp.src('src/*.ts')
        //.pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(ts({
            //sortOutput: true,
            out: "canvas2d.js",
            noEmitOnError: true,
            target: "ES5",
            declarationFiles: true,
            noExternalResolve: true
        }));

    return merge2([
        tsResult.dts
            .pipe(gulp.dest("build")),
        tsResult.js
            //.pipe(concat('canvas2d.js')) // You can use other plugins that also support gulp-sourcemaps
            //.pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
            .pipe(gulp.dest('build'))
    ]);
});