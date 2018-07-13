var gulp = require('gulp'),
utils = require('gulp-util'),
jshint = require('gulp-jshint');
// var through = require('through2')
var pump = require('pump');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-htmlmin');
var babel = require('gulp-babel');
var zip = require('gulp-zip');
var del = require('del');

// Include Gulp
var dest = "dist/";

// Check the code quality
gulp.task('qualitychecker', function(cb) {
	return gulp.src([
		'**/*.js',
		'!node_modules/**/*.js',
		'!dist/**/*.js',
		'!Touch/components/**/*.js'])
		.pipe(jshint({esversion: 6}))
		.pipe(jshint.reporter('default'))
		.on('error', utils.log);
});


gulp.task('js', function (cb) {
  pump([
				gulp.src('Touch/**/*.js'),
				babel({"presets": ["env"]}),
				uglify(),
        gulp.dest(dest)
    ],
    cb
  );
});


gulp.task('css', function(cb) {
	pump([
		gulp.src('Touch/**/*.css'),
		uglifycss(),
		gulp.dest(dest)
	], cb);
});


gulp.task('html', function (cb) {
  pump([
				gulp.src('Touch/**/*.html'),
				htmlmin({collapseWhitespace: true}),
        gulp.dest(dest)
    ],
    cb
  );
});

gulp.task('clean', function (cb) {
	return del([dest + "/bundle.block"])
});


gulp.task('bundle', function (cb) {
	return pump([
		gulp.src(dest + '/**'),
		zip('bundle.block'),
		gulp.dest(dest)
	], cb);
});


gulp.task('build', gulp.series('clean', gulp.parallel('js', 'css', 'html'), 'bundle'));
gulp.task('default', gulp.series('qualitychecker'));
