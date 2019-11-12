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

const styles = () => {
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
}

const scripts = () => {
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/assets/js'))
        .pipe(browserSync.stream())
}

const clean = () => {
  return del(['build/*'])
}

const watch = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });
    gulp.watch('./src/styles/**/*.scss', styles)
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch('./src/**/*.html', html)
}

const html = () => {
    return gulp.src('./src/*.html')
        .pipe(rigger())
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream())
}

gulp.task('clean', clean);

gulp.task('styles', styles);

gulp.task('scripts', scripts);

gulp.task('watch', watch);

gulp.task('html', html);

gulp.task('build', gulp.series(clean, gulp.parallel(html, styles, scripts)));

gulp.task('default', gulp.series('build', 'watch'));
