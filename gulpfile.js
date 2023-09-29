const gulp = require('gulp');
const browserSync = require('browser-sync').create()
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const eslintNew = require('gulp-eslint-new');
const validator = require('gulp-html');
const styleLint = require('gulp-stylelint');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');

const srcJsFiles = ['./src/js/app.js', './src/js/navbar.js', './src/js/deprecated.js'];
const siteJsFiles = ['./site/js/app.js', './site/js/navbar.js', './site/js/deprecated.js'];

function syncBrowser () {
    browserSync.init({
        server: {
            baseDir: "./site"
        },
        watchEvents: ['change', 'add', 'addDir']
    });

    gulp.watch("./src/css/app.css", lintStyles);
    gulp.watch(srcJsFiles, copyJs);
    gulp.watch(siteJsFiles, lintJs);
    gulp.watch("./src/*.html").on("change", copyHtml);
    gulp.watch("./site/*.html").on("change", browserSync.reload);
}

function copyJs () {
    return gulp.src(srcJsFiles)
        .pipe(gulp.dest("./site/js"));
}

function lintJs () {
    return gulp.src(siteJsFiles)
        .pipe(eslintNew({ fix: true }))
        .pipe(eslintNew.fix())
        .pipe(eslintNew.format())
        //.pipe(eslintNew.failAfterError())
        //.pipe(gulp.dest("./site/js"))
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest("./site/js"))
        .pipe(browserSync.stream());
}

function lintStyles () {
    return gulp.src("./src/css/app.css")
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
    return gulp.src("./src/*.html")
        .pipe(validator())
        .pipe(gulp.dest("./site"));
}

function copyGulpfile () {
    return gulp.src("./gulpfile.js")
        .pipe(gulp.dest("./site"));
}

exports.syncBrowser = syncBrowser;
exports.html = html;
exports.lintJs = lintJs;
exports.lintStyles = lintStyles;
exports.copyHtml = copyHtml;
exports.copyJs = copyJs;
exports.copyGulpfile = copyGulpfile;
