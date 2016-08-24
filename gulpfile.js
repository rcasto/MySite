require("babel-polyfill"); // ES6 feature polyfills

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    del = require('del'),
    less = require('gulp-less'),
    runSequence = require('run-sequence'),
    minify = require('gulp-minify'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano')
    merge2 = require('merge2');
    
var jsSources = ['source/scripts/**/*.js', 'source/scripts/*.js'];
var views = ['source/index.html', 'source/views/*.html', 'source/partial-views/*.html', 'source/components/*.html'];
var images = ['source/images/*.jpg', 'source/images/*.png', 'source/images/*.svg'];
var lessFiles = ['source/styles/*.less'];

var output = ['dist'];

function buildEs6() {
    return gulp.src(jsSources, {
        base: 'source'
    }).pipe(babel({
        presets: ['es2015']
    }));
}

function buildLess() {
    return gulp.src(lessFiles, {
        base: 'source'
    }).pipe(less({ }));
}

function styleDependencies() {
    return gulp.src('node_modules/normalize.css/normalize.css');
}

gulp.task('minifyjs', function () {
    return gulp.src(jsSources, {
            base: 'source'
        })
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('website.js'))
        .pipe(minify({
            noSource: true
        }))
        .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('minifycss', function () {
    var lessStream = buildLess();
    var styleDependenciesStream = styleDependencies();
    return merge2(styleDependenciesStream, lessStream)
        .pipe(concat('website.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('scripts', function () {
    return buildEs6().pipe(gulp.dest('./dist'));
});

gulp.task('views', function () {
    return gulp.src(views, {
        base: 'source'
    }).pipe(gulp.dest('./dist'));
});

gulp.task('styles', function () {
    var lessStream = buildLess()
        .pipe(gulp.dest('./dist'));
    var styleDependenciesStream = styleDependencies()
        .pipe(gulp.dest('./dist/styles'));
    return merge2(styleDependenciesStream, lessStream);
});

gulp.task('images', function () {
    return gulp.src(images, {
        base: 'source'
    }).pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
    return del(output);
});

// gulp.task('watch', function () {
//     gulp.watch(jsSources, ['scripts']);
// });

// Task dependencies all fire at the same time unless
// they too explicitly have dependencies that must run first
gulp.task('default', function () {
    var environment = process.env.NODE_ENV || 'development';
    if (environment === 'production') {
        runSequence('clean', ['minifyjs', 'minifycss', 'views', 'images']);
    } else {
        runSequence('clean', ['scripts', 'styles', 'views', 'images']);
    }
});