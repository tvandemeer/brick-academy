const gulp = require('gulp');
const browserSync = require('browser-sync').create()
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const eslintNew = require('gulp-eslint-new');
const validator = require('gulp-html');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');


function serve () {
    browserSync.init({
        server: {
            baseDir: "./site"
        }
    });

    gulp.watch("./src/css/app.css", copyStyles);
    gulp.watch("./site/css/app.css", lintStyles);
    gulp.watch("./src/js/*.js", copyJs);
    gulp.watch("./site/js/*.js", lintJs);
    gulp.watch("./src/*.html").on("change", copyHtml);
    gulp.watch("./site/*.html").on("change", browserSync.reload);
}

function copyJs () {
    return gulp.src("./src/js/*.js")
        .pipe(gulp.dest("./site/js"));
}

function lintJs () {
    return gulp.src("./site/js/*.js")
        .pipe(eslintNew({ fix: true }))
        .pipe(eslintNew.fix())
        .pipe(eslintNew.format())
        //.pipe(eslintNew.failAfterError())
        .pipe(gulp.dest("./site/js"))
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest("./site/js/minified"))
        .pipe(browserSync.stream());
}

function copyStyles () {
    return gulp.src("./src/css/app.css")
        .pipe(gulp.dest("./site/css"));
}

function lintStyles () {
    return gulp.src("./site/css/app.css")
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest("./site/css"))
        .pipe(cssnano())
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./site/css"))
        .pipe(browserSync.stream());
}

function copyHtml () {
    return gulp.src("./src/*.html")
        .pipe(gulp.dest("./site"));
}

function html () {
    return gulp.src("./site/*.html")
        .pipe(validator())
        .pipe(gulp.dest("./site"));
}

function copyDevFiles () {
    return gulp.src(["./package.json", "./gulpfile.js", "./src/README.md"])
        .pipe(gulp.dest("./site"));
}

function concatJs () {
    return gulp.src("./site/js/*.js")
        .pipe(concat("all.js"))
        .pipe(gulp.dest("./site/js"))
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest("./site/js/minified"));
}


exports.serve = serve;
exports.html = html;
exports.lintJs = lintJs;
exports.lintStyles = lintStyles;
exports.copyHtml = copyHtml;
exports.copyJs = copyJs;
exports.copyDevFiles = copyDevFiles;
exports.concatJs = concatJs;
exports.copyStyles = copyStyles;
