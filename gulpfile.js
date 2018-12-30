var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var uglifycss = require('gulp-uglifycss');

var paths = {
	js: ['js/*.js'],
	css: ['css/*.css']
}

gulp.task( 'jsmin', function() {
	return gulp.src(paths.js)
	    .pipe(sourcemaps.init())
	    .pipe(uglify().on('error', function(e){
            console.log(e);
            return;
         }))
	    .pipe(concat('alljs.min.js'))
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest('min_files/'));

});

gulp.task( 'cssmin', function() {
	return gulp.src(paths.css)
	.pipe(sourcemaps.init())
	.pipe(uglifycss({"uglyComments" : true}))
	.pipe(concat('allcss.min.css'))
	.pipe(gulp.dest('min_files/'));
});

gulp.task( 'watch', function() {
	gulp.watch( 'js/*.js', ['jsmin'] );
	gulp.watch( 'css/*.css', ['cssmin'] );
});

gulp.task( 'default', ['watch'] );