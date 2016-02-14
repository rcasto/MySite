var gulp = require('gulp'),
    babel = require('gulp-babel'),
    del = require('del'),
    less = require('gulp-less'),
    runSequence = require('run-sequence');
    
var jsSources = ['source/scripts/**/*.js', 'source/scripts/*.js'];
var views = ['source/index.html', 'source/views/*.html', 'source/partial-views/*.html', 'source/components/*.html'];
var images = ['source/images/*.jpg', 'source/images/*.png', 'source/images/*.svg'];
var lessFiles = ['source/styles/*.less'];

var output = ['dist'];

gulp.task('scripts', function () {
    return gulp.src(jsSources, {
        base: 'source'
    }).pipe(babel({
        presets: ['es2015']
    })).pipe(gulp.dest('./dist'));
});

gulp.task('views', function () {
    return gulp.src(views, {
        base: 'source'
    }).pipe(gulp.dest('./dist'));
});

gulp.task('less', function () {
    return gulp.src(lessFiles, {
        base: 'source'
    }).pipe(less({
    })).pipe(gulp.dest('./dist'));
});

gulp.task('images', function () {
    return gulp.src(images, {
        base: 'source'
    }).pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
    return del(output);
});

gulp.task('watch', function () {
    gulp.watch(jsSources, ['scripts']);
});

// Task dependencies all fire at the same time unless
// they too explicitly have dependencies that must run first
gulp.task('default', function () {
    runSequence('clean', ['scripts', 'views', 'images', 'less'])
});