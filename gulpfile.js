const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const svgSprite = require("gulp-svg-sprite");
const del = require("del");
const browserSync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    notify: false,
  });
}

function svgSprites() {
  return src("app/images/svg/*.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      }),
    )
    .pipe(dest("app/images"));
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(
      scss({
        outputStyle: "compressed",
      }),
    )
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 versions"],
        grid: true,
      }),
    )
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function htmlInclude() {
  return src("app/*.html")
    .pipe(
      fileInclude({
        prefix: "@",
        basepath: "@file",
      }),
    )
    .pipe(dest("./dist"))
    .pipe(browserSync.stream());
}

function scripts() {
  return (
    src([
      "app/js/main.js",
    ])
      .pipe(concat("main.min.js"))
      // .pipe(uglify())
      .pipe(dest("dist/js"))
      .pipe(browserSync.stream())
  );
}

function images() {
  return src("app/images/**/*.*")
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true,
        }),
        imagemin.mozjpeg({
          quality: 75,
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 5,
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: true,
            },
            {
              cleanupIDs: false,
            },
          ],
        }),
      ]),
    )
    .pipe(dest("dist/images"));
}

function build() {
  return src(["!app/html/*.html", "app/fonts/*.woff", "app/fonts/*.woff2"], {
    base: "app",
  }).pipe(dest("dist"));
}

function cleanDist() {
  return del("dist/*");
}

function watching() {
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/images/svg/*.svg"], svgSprites);
  watch(["app/images/**/*.*"], images);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
  watch(["app/**/*.html"]).on("change", browserSync.reload);
  watch(["app/html/*.html"], htmlInclude);
  watch(["app/*.html"], htmlInclude);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.svgSprites = svgSprites;
exports.htmlInclude = htmlInclude;
exports.build = series(
  cleanDist,
  htmlInclude,
  images,
  svgSprites,
  styles,
  scripts,
  build,
);

exports.default = parallel(
  htmlInclude,
  scripts,
  svgSprites,
  styles,
  images,
  browsersync,
  watching,
);