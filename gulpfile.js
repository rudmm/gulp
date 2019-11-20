const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const rigger = require('gulp-rigger');
const htmlMin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const responsive = require('gulp-responsive');
const retina = require('gulp-img-retina');
const plumber = require('gulp-plumber');
const gutil = require('gutil');

gulp.task('clean', () => {
    return del(['build/*'])
});

gulp.task('styles', () => {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(concat('style.css'))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.stream())
});

gulp.task('scripts', () => {
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/assets/js'))
        .pipe(browserSync.stream())
});

gulp.task('watch', () => {
    browserSync.init({
        logPrefix: "misha.rud",
        server: {
            baseDir: './build'
        }
    });
    gulp.watch('./src/styles/**/*.scss', gulp.series('styles'))
    gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
    gulp.watch('./src/**/*.html', gulp.series('html'))
    gulp.watch('./src/img/**', gulp.series('img-compress', 'img-svg'))
});

gulp.task('html', () => {
    return gulp.src('./src/*.html')
        .pipe(rigger())
        .pipe(retina({
            1: '',
            2: '@2x'
        }))
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream())
});


gulp.task('img-compress', () => {
    return gulp.src('./src/img/**/*.{png,jpg}')
        .pipe(plumber())
       .pipe(
           responsive(
               {
                   '*.{png,jpg}':[
                       {
                           width: '50%'
                       },
                       {
                           width: '100%',
                           rename:{
                               suffix: '@2x'
                           }
                       }
                   ]
               },
               {
                   // Global configuration for all images
                   // The output quality for JPEG, WebP and TIFF output formats
                   quality: 50,
                   // Use progressive (interlace) scan for JPEG and PNG output
                   progressive: true,
                   // Zlib compression level of PNG output format
                   compressionLevel: 6,
                   // Strip all metadata
                   withMetadata: false,
                   errorOnUnusedImage: false
               }
           )


       )
        .on('error', function (err) {
            gutil.log('No matching images found in source: ' +'./src/img/**/*.{png,jpg}' , '');
        })
       .pipe(gulp.dest('./build/img/'))
       .pipe(browserSync.stream())
});

gulp.task('img-svg', () => {
    return gulp.src('./src/img/**/*.svg')
        .pipe(gulp.dest('./build/img'))
        .pipe(browserSync.stream())
});

gulp.task('img', () => {
    return gulp.src('./src/img/**/*.{png,jpg}')
        .pipe(rename({suffix: '@2x'}))
        .pipe(gulp.dest('./build/img'))
        .pipe(browserSync.stream())
} );

gulp.task('fonts', () => {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts/'))
        .pipe(browserSync.stream())
});
gulp.task('build', gulp.series('clean', gulp.parallel('html', 'styles', 'scripts', gulp.series('img-compress', 'img-svg'), 'fonts')));

gulp.task('default', gulp.series('build', 'watch'));
