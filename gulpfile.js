const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprifixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const include = require('gulp-include');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const svg = require('gulp-svg-sprite');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const htmlMin = require('gulp-htmlmin');

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
        .pipe(dest('app'))
        .pipe(gulpif(prod,src('app/pages/*.html')))
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
        }).on('error', scss.logError))        
        .pipe(autoprifixer({
            overrideBrowserslist: ['last 5 version'],
            cascade: false
        }))
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
    return src([
        'app/images/src/**/*.*',
        '!app/images/src/**/*.svg'
        ])
        .pipe(newer('app/images/dist'))
        .pipe(avif({ quality: 50}))

        .pipe(src('app/images/src/**/*.*'))
        .pipe(webp())

        .pipe(src('app/images/src/**/*.*'))
        .pipe(imagemin())
        .pipe(dest('app/images/dist'))
        .pipe(gulpif(prod, (dest('dist/images'))))    
        .pipe(browserSync.stream()) 

};

function svgSprite() {
    return src('app/images/src/**/*.svg')
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
        .on('error', function(err) {
            console.error('SVG Sprite error:', err);
        })
        .pipe(dest('app/images/dist'))
        .pipe(gulpif(prod, dest('dist/images'))) 
        .pipe(browserSync.stream()) 
        .on('end', function() {
            console.log('✅ SVG sprite built successfully');
        });    
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
    return src('dist')
        .pipe(clean())
};

function checkSvgFiles(cb) {
    const fs = require('fs');
    const path = require('path');
    
    const iconDir = path.join(__dirname, 'app/images/dist/icon');
    
    console.log('=== Checking icon files in:', iconDir, '===');
    
    if (!fs.existsSync(iconDir)) {
        console.log('❌ Icon directory does not exist:', iconDir);
        return cb();
    }
    
    const files = fs.readdirSync(iconDir);
    const svgFiles = files.filter(f => f.endsWith('.svg'));
    
    console.log('📁 Found', svgFiles.length, 'SVG files:');
    svgFiles.forEach(file => {
        console.log('   →', file);
    });
    
    // Ищем arrow иконки
    const arrowFiles = svgFiles.filter(file => 
        file.toLowerCase().includes('arrow') || 
        file.toLowerCase().includes('left') || 
        file.toLowerCase().includes('right')
    );
    
    console.log('\n🔍 Arrow icons found:', arrowFiles.length);
    arrowFiles.forEach(file => console.log('   ✅', file));
    
    cb();
}

exports.checkSvgFiles = checkSvgFiles;

exports.htmlPage = htmlPage;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.svgSprite = svgSprite;
exports.fonts = fonts;
exports.watching = watching;
exports.clean = cleanDist;

exports.dev = parallel(htmlPage, styles, scripts, images, fonts, watching);
exports.build = series(isProd, cleanDist, htmlPage, styles, images, fonts, scripts);