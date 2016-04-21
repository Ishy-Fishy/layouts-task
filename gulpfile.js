var gulp = require('gulp');    //gulp should be installed globally and locally in project
var gconcat = require('gulp-concat'); // gulp concat for joining files
var cssmin = require('gulp-cssmin'); //css minificator
var htmlmin = require('gulp-htmlmin'); //html minificator
var mainBowerFiles = require('main-bower-files'); //read 'main' properties in bower files and create pathes
var uglify = require('gulp-uglify'); // minification of javascript
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
        .pipe(gulp.dest(pth.src + '/tempcss'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function(){
    return gulp.src(mainBowerFiles().concat([pth.src + '/js/*.js']))
        .pipe(filter('**/*.js'))
        .pipe(gconcat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(pth.build + '/js'))
});

gulp.task('styles',['sass'], function () {
    return gulp.src([pth.src + '/css/*.css',pth.src + '/tempcss/*.css'])
        .pipe(gconcat('main.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(pth.build + '/css'));
});

gulp.task('stylemin', ['styles'], function () {
    return del(pth.src + '/tempcss');
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
    gulp.watch(pth.src + '/scss/**/*', ['sass']);
    gulp.watch(pth.src + '/css/**/*', ['bsync:styles']);
    gulp.watch(pth.src + '/**/*.html', ['bsync:html']);
    gulp.watch(pth.src + '/js/**/*', ['bsync:scripts']);
});


gulp.task('bsync:styles', ['styles'], function () {
    browserSync.reload();
});

gulp.task('bsync:html', ['html'], function () {
    browserSync.reload();
});

// Static server
gulp.task('browser-sync', ['rebuild'], function () {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('clean', function () {
    return del('build');
});

gulp.task('rebuild', ['clean'],function () {
    return gulp.run('build');
});
gulp.task('build', ['stylemin', 'fonts', 'html', 'images', 'scripts']);

gulp.task('serve', ['browser-sync', 'watch']);
