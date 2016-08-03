// File: Gulpfile.js
'use strict';

var gulp = require('gulp'),
connect = require('gulp-connect'),
stylus = require('gulp-stylus'),
nib = require('nib'),
jshint = require('gulp-jshint'),
stylish = require('jshint-stylish'),
historyApiFallback = require('connect-history-api-fallback');

// Servidor web de desarrollo
gulp.task('server', function() {
	connect.server({
	root: './app',
	hostname: '0.0.0.0',
	port: 8080,
   livereload: true
  });
});

// Preprocesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function() {
	gulp.src('./app/stylesheets/main.styl')
	.pipe(stylus({ use: nib() }))
	.pipe(gulp.dest('./app/stylesheets'))
	.pipe(connect.reload());
});
 
gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
	return gulp.src('./app/scripts/**/*.js')
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(jshint.reporter('fail'));
});

 
gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css']);
  gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint']);
});
 
gulp.task('default', ['server', 'watch']);