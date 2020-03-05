let gulp = require('gulp');
let sass = require('gulp-sass');
let babel = require('gulp-babel');

// compile sass
gulp.task('sass', function () {
    return gulp.src('public/stylesheets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/stylesheets/css/'));
});

// compile ES6
gulp.task('es6', function() {
    return gulp.src('public/js/**/*.js')
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(gulp.dest('./build/'));
})

// watch for sass/ES6 updates
gulp.task('default', function() {
    gulp.watch('public/stylesheets/**/*.scss', gulp.series('sass'));
    gulp.watch('public/js/**/*.js', gulp.series('es6'));
});