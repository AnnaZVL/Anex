import gulp from "gulp";
import fileInclude from "gulp-file-include";
import dartSass from 'gulp-dart-sass';
import cleanCSS from "gulp-clean-css";
import terser from "gulp-terser";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import avif from "gulp-avif";
import svgSprite from "gulp-svg-sprite";
import ttf2woff2 from "gulp-ttf2woff2";
import browserSync from "browser-sync";
import { deleteAsync } from "del";
import gulpIf from "gulp-if";
import newer from "gulp-newer";

const isProd = process.argv.includes("--prod");

const paths = {
  html: {
    src: ["app/pages/**/*.html"],
    watch: ["app/**/*.html"],
    dest: "dist/",
  },
  scss: {
    src:["node_modules/swiper/swiper-bundle.css", "app/scss/style.scss"],
    watch: "app/scss/**/*.scss",
    dest: "dist/css/",
  },
  js: {
    src: ["node_modules/swiper/swiper-bundle.js", "app/js/**/*.js" ],
    dest: "dist/js/",
  },
  images: {
    src: "app/images/**/*.{png,jpg,jpeg}",
    dest: "dist/images/",
  },
  svg: {
    src: ["app/images/**/*.svg", "!app/images/sprite.svg"],
    dest: "dist/images/",
  },
  fonts: {
    src: "app/fonts/**/*.ttf",
    dest: "dist/fonts/",
  },
};

// Очистка
export const clean = () => deleteAsync(["dist"]);

// HTML
export const html = () => 
    gulp
    .src(paths.html.src, { allowEmpty: true })
    .pipe(fileInclude({ prefix: "@@", basepath: "app" }))    
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());

// SCSS
export const styles = () =>
  gulp
    .src(paths.scss.src, { allowEmpty: true })
    .pipe(dartSass().on("error", dartSass.logError))
    .pipe(gulpIf(isProd, cleanCSS()))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());

// JS
export const scripts = () =>
  gulp
    .src(paths.js.src, { allowEmpty: true })
    .pipe(gulpIf(isProd, terser()))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());

const originals = () => gulp
    .src(paths.images.src, { allowEmpty: true })
    .pipe(newer(paths.images.dest))
    .pipe(gulpIf(isProd, imagemin()))
    .pipe(gulp.dest(paths.images.dest));

    const webpImages = () => gulp
    .src(paths.images.src)
    .pipe(webp())
    .pipe(gulp.dest(paths.images.dest));

  // AVIF
  const avifImages = () => gulp
    .src(paths.images.src)
    .pipe(avif())
    .pipe(gulp.dest(paths.images.dest));

export const images = gulp.parallel(originals, webpImages, avifImages);

// SVG sprite
export const sprite = () =>
  gulp
    .src(paths.svg.src, { allowEmpty: true })    
    .pipe(
      svgSprite({
        mode: { stack: { sprite: "../sprite.svg" } }
      })
    )
    .pipe(gulp.dest(paths.svg.dest))
    .pipe(browserSync.stream());  

// Fonts
export const fonts = () =>
  gulp.src(paths.fonts.src, { allowEmpty: true }).pipe(ttf2woff2()).pipe(gulp.dest(paths.fonts.dest));

// Сервер
export const serve = () => {
  browserSync.init({
    server: {
      baseDir: "dist",
      middleware: function (req, res, next) {
        // Отключаем CSP только для dev-сервера
        res.setHeader(
          "Content-Security-Policy",
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:"
        );
        next();
      },
    },
    notify: false,
  });

  gulp.watch(paths.html.watch, html);
  gulp.watch(paths.scss.watch, styles);
  gulp.watch(paths.js.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.svg.src, sprite);
  gulp.watch(paths.fonts.src, fonts);
};

// Сборка
export const build = gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, images, sprite, fonts)
);

export const dev = gulp.series(build, serve);

export default dev;