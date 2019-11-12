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
const imagemin = require('gulp-imagemin');

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
    gulp.watch('./src/img/**', gulp.series('img-compress'))
});

gulp.task('html', () => {
    return gulp.src('./src/*.html')
        .pipe(rigger())
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream())
});

gulp.task('img-compress', () => {
   return gulp.src('./src/img/**')
       .pipe(imagemin({
           progressive: true
       }))
       .pipe(gulp.dest('./build/img/'))
});

gulp.task('fonts', () => {
    return gulp.src('src/fonts/**')
        .pipe(gulp.dest('build/fonts/'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('html', 'styles', 'scripts', 'img-compress', 'fonts')));

gulp.task('default', gulp.series('build', 'watch'));
