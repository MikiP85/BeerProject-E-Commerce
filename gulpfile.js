const gulp = require("gulp");
const sass = require("gulp-sass");
const minify = require("gulp-minify");
const browserSync = require("browser-sync").create();
const minifyCSS = require("gulp-csso");
const gulpCopy = require("gulp-copy");
const autoprefixer = require("gulp-autoprefixer");

function style() {
  return gulp
    .src("./scss/style.scss", { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(gulp.dest("./css", { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

function minifyJs() {
  return gulp
    .src("./js/**/*.js")
    .pipe(
      minify({
        noSource: true,
        ext: {
          min: ".js"
        }
      })
    )
    .pipe(gulp.dest("dist/js"));
}

function minifyCss() {
  return gulp
    .src("./css/**/*.css")
    .pipe(minifyCSS())
    .pipe(gulp.dest("./dist/css"));
}

function copy() {
  return gulp
    .src([
      "./assets/**/*.*",
      "./*.html",
      "./node_modules/axios/dist/axios.min.js",
      "./node_modules/handlebars/dist/handlebars.min.js"
    ])
    .pipe(gulpCopy("./dist"));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch("./scss/**/*.scss", style);
  gulp.watch("./scss/**/*.scss").on("change", browserSync.reload);
  gulp.watch("./*.html").on("change", browserSync.reload);
  gulp.watch("./js/**/*.js").on("change", browserSync.reload);
}

exports.style = style;
exports.watch = watch;

exports.minifyJs = minifyJs;
exports.minifyCss = minifyCss;
exports.copy = copy;

exports.build = gulp.series(style, minifyCss, minifyJs, copy);
