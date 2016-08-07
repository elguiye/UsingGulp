// File: Gulpfile.js
'use strict';

var gulp = require('gulp'),
connect = require('gulp-connect'),
stylus = require('gulp-stylus'),
nib = require('nib'),
jshint = require('gulp-jshint'),
stylish = require('jshint-stylish'),
historyApiFallback = require('connect-history-api-fallback');

var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

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



var injectSrc = gulp.src(['./app/scripts/**/*.js','./app/stylesheets/**/*.css'], {read: false});
var injectOptions = {
    ignorePath: 'app',
    relative: true
};
var options = {
   // bowerJson: require('./bower.json'),
   // directory: './public/lib',
    ignorePath: '/app',
    base: '/'
}
var config{ (  
	    app: './app/',
        index: app + '*.html',
        js: [ 
            'scripts/**/*.js'
        ],
        styles: [
            'stylesheets/**/*.css'
        ]
    )}
// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function() {
	//var target = gulp.src('./app/index.html');

	//var sources = gulp.src(['./app/scripts/**/*.js','./app/stylesheets/**/*.css']);

	return  gulp
    		.src(config.index)
    		     .pipe(wiredep(options))
    		     .pipe(inject(injectSrc, injectOptions))
	             //.pipe(inject(gulp.src(config.js, {read: false, cwd: "{__dirname}/app/"})))
	             //.pipe(inject(gulp.src(config.styles), {read: false, cwd: "{__dirname}/app/"}))
	             .pipe(gulp.dest(config.app));
});

// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
	gulp.src('./app/index.html')
	.pipe(wiredep({
	directory: './app/lib'
	}))
	.pipe(gulp.dest('./app'));
});

 
gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css']);
  gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css']);
  gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint']);
  gulp.watch([config.js, config.styles], ['inject']);
 gulp.watch(['./bower.json'], ['wiredep']);
});
 
gulp.task('default', ['server', 'inject', 'wiredep', 'watch']);