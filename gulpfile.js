const { watch, src, dest, series } = require("gulp");
const uglify = require("gulp-uglify");
const minifyCSS = require("gulp-minify-css");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const del = require("del");
const babel = require("gulp-babel");
sass.compiler = require("node-sass");

async function clear(cb) {
  await del("dist/**");
  cb();
}
function html() {
  const hash = Date.now();
  return src("src/pages/**/*.ejs")
    .pipe(ejs({ hash }))
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("dist/"));
}
function javascript() {
  return src("src/assets/js/**/*.js")
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(uglify())
    .pipe(dest("dist/js"));
}
function css() {
  return src("src/assets/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(minifyCSS())
    .pipe(dest("dist/css"));
}
function image() {
  return src("src/assets/img/**").pipe(dest("dist/img"));
}
function dev() {
  watch(["src/**"], series(clear, html, javascript, css, image));
}
exports.build = series(clear, html, javascript, css, image);
exports.default = dev;
