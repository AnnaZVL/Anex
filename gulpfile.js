const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const include = require('gulp-include');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const svg = require('gulp-svg-sprite');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const htmlMin = require('gulp-htmlmin');
const replace = require('gulp-replace');

let prod = false;
function isProd(done) {
    prod = true;
    done();
};

function htmlPage() {
    return src('app/pages/*.html')
        .pipe(include({
            includePaths: 'app/components'
        }))
        .pipe(replace('src="/images/dist/', 'src="images/'))
        .pipe(replace('href="/images/dist/', 'href="images/'))
        .pipe(replace('src="/images/src/', 'src="images/'))    
        .pipe(dest('app'))        
        .pipe(gulpif(prod, htmlMin({
            collapseWhitespace: true,
          })))
        .pipe(gulpif(prod, (dest('dist'))))
        .pipe(browserSync.stream())
};

function styles() {
    return src([
        'node_modules/swiper/swiper-bundle.css', 
        'app/scss/style.scss'
        ])
        .pipe(gulpif(!prod, sourcemaps.init()))           
        .pipe(scss({
            outputStyle: prod ? 'compressed' : 'expanded'
        }))      
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: false
        }))
        .pipe(replace('url("/fonts/', 'url("../fonts/'))
        .pipe(replace("url('/fonts/", "url('../fonts/"))
        .pipe(replace('../../images/dist/', '../images/'))
        .pipe(concat('style.min.css'))        
        .pipe(gulpif(!prod, sourcemaps.write()))
        .pipe(dest('app/css/'))         
        .pipe(gulpif(prod, dest('dist/css')))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'node_modules/swiper/swiper-bundle.js',        
        'app/js/script.js'
        ],{ base: '.' })        
        .pipe(gulpif(!prod, sourcemaps.init()))
        .pipe(concat('main.min.js'))           
        .pipe(gulpif(prod, uglify()))
        .pipe(gulpif(!prod, sourcemaps.write()))
        .pipe(dest('./app/js/'))        
        .pipe(gulpif(prod, dest('./dist/js/')))     
        .pipe(browserSync.stream())               
};

function images() {
    return src('app/images/**/*.*')
        .pipe(gulpif(!prod, newer('app/images'))) 
        .pipe(gulpif(prod, dest('dist/images'))) 
        .pipe(gulpif(!prod, dest('app/images'))) 
        .pipe(browserSync.stream())    
}


function svgSprite() {
    return src('app/images/**/*.svg')
    .on('data', function(file) {
            console.log('Processing SVG:', file.relative);
        })
        .pipe(svg({
            mode: {
                symbol: {
                    sprite: '../sprite.svg',
                    example: true
                }
            }
        }))       
        .pipe(dest('app/images'))
        .pipe(gulpif(prod, dest('dist/images'))) 
        .pipe(browserSync.stream()) 
}

function fonts() {
    return src('app/fonts/*.*')
        .pipe(fonter({
            formats: ['woff', 'ttf']
        }))
        .pipe(src('app/fonts/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(dest('app/fonts'))
        .pipe(gulpif(prod, (dest('dist/fonts'))))    
        .pipe(browserSync.stream())   
};

function watching() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });

    watch(['app/components/*', 'app/pages/*'], htmlPage);
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/script.js'], scripts); 
    watch(['app/images/src'], images);
    watch(['app/**/*.html']).on('change', browserSync.reload);   
};

function cleanDist() {
    return src('dist', { read: false, allowEmpty: true })
        .pipe(clean());
}

exports.htmlPage = htmlPage;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.svgSprite = svgSprite;
exports.fonts = fonts;
exports.watching = watching;
exports.clean = cleanDist;

exports.dev = parallel(htmlPage, styles, scripts, images, fonts, watching);
exports.build = series(isProd, cleanDist, htmlPage, styles, images, svgSprite, fonts, scripts);