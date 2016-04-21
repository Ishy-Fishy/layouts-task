var gulp = require('gulp');    //gulp should be installed globally and locally in project
var gconcat = require('gulp-concat'); // gulp concat for joining files
var cssmin = require('gulp-cssmin'); //css minificator
var htmlmin = require('gulp-htmlmin'); //html minificator
var filter = require('gulp-filter'); // filter files according to some pattern
var sass = require('gulp-sass'); //sass compiler
var fontmin = require('gulp-fontmin');//font minificator
var imagemin = require('gulp-imagemin'); // images minification
var browserSync = require('browser-sync').create(); // simple server with livereload possibility
var del = require('del');  //module for deleting directories and files

var pth = {
    src: 'src',
    build: 'build'
};

gulp.task('fonts', function () {
    return gulp.src(pth.src + '/fonts/*.ttf')
        .pipe(fontmin())
        .pipe(gulp.dest(pth.build + '/fonts'));

})

gulp.task('sass', function () {
    return gulp.src(pth.src + '/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(pth.src + '/css'))
        .pipe(browserSync.stream());
});

gulp.task('styles',['sass'], function () {
    return gulp.src(pth.src + '/css/*.css')
        .pipe(gconcat('main.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(pth.build + '/css'));
});

gulp.task('html', function () {
    return gulp.src(pth.src + '/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(pth.build))
});


gulp.task('images', function () {
    return gulp.src(pth.src + '/img/**/*')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest(pth.build + '/img'))
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(pth.src + '/scss/*.scss', ['sass']);
    gulp.watch(pth.src + '/css/**/*', ['bsync:styles']);
    gulp.watch(pth.src + '/**/*.html', ['bsync:html']);
});


gulp.task('bsync:styles', ['styles'], function () {
    browserSync.reload();
});

gulp.task('bsync:html', ['html'], function () {
    browserSync.reload();
});

gulp.task('bsync:scripts', ['scripts'], function () {
    browserSync.reload();
});

// Static server
gulp.task('browser-sync', ['styles', 'fonts', 'html', 'images'], function () {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('clean', function () {
    return del('build');
});


gulp.task('build', ['styles', 'fonts', 'html', 'images']);

gulp.task('serve', ['browser-sync', 'watch']);
