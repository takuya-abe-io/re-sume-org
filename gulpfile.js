"use strict"

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const runSequence = require('run-sequence');
const stripDebug = require('gulp-strip-debug');
const sassGlob = require("gulp-sass-glob");
// const minimist = require('minimist');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;


//**************************************************************************************************
// DIR SET
//**************************************************************************************************

// const args = minimist(process.argv.slice(2));

// ディレクトリ名変数
const dir = {
	prj_target 	: 'htdocs',
	prj_src			: 'htdocs',
	prj_scss		: 'scss',
	prj_dist		: 'css'
};

// 出力ディレクトリ
 //var env = null;
let env = dir.prj_dist;


// *****************************************************************************************************************
// VIEWS
// *****************************************************************************************************************
gulp.task('views', () => {
	return gulp.src(['!app/**/_**/*.pug', 'app/**/*.pug'])
		.pipe($.plumber())
		.pipe($.pug({ pretty: true }))
		.pipe(gulp.dest('.tmp'))
		.pipe(reload({ stream: true }));
});


// *****************************************************************************************************************
// CSS
// *****************************************************************************************************************
gulp.task('styles', () => {
	return gulp.src('app/styles/**/*.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe(sassGlob())
		.pipe($.sass.sync({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('.tmp/styles'))
		.pipe(reload({ stream: true }));
});


// *****************************************************************************************************************
// scripts
// *****************************************************************************************************************
gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

// *****************************************************************************************************************
// html
// *****************************************************************************************************************
gulp.task('html', ['views', 'styles'], () => {
	return gulp.src(['.tmp/**/*.html'])
		.pipe($.useref({
			searchPath: ['.tmp', 'app', '.'],
		}))
		.pipe($.if('*.js', stripDebug()))
		// .pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.cssnano({ safe: true, autoprefixer: false })))
		.pipe($.if('*.html', $.htmlmin({ collapseWhitespace: true })))
		.pipe(gulp.dest('dist'));
});

// *****************************************************************************************************************
// images
// *****************************************************************************************************************
gulp.task('images', () => {
	return gulp.src('app/images/**/*')
		.pipe($.cache($.imagemin()))
		.pipe(gulp.dest('dist/images'));
});

// *****************************************************************************************************************
// extras
// *****************************************************************************************************************
gulp.task('extras', [], () => {
	return gulp.src([
		'app/**/*',
		'!app/scripts/**/*.js',
		'!app/**/*.+(html|scss|pug)'
	])
		.pipe($.ignore.include({ isFile: true }))
		.pipe(gulp.dest('dist'));
});

// *****************************************************************************************************************
// clean
// *****************************************************************************************************************
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// *****************************************************************************************************************
// SERVE
// *****************************************************************************************************************
gulp.task('serve', () => {
	runSequence(['clean'], ['views', 'styles'], () => {
		browserSync.init({
			notify: false,
			ghostMode: false,
			server: {
				baseDir: ['.tmp', 'app'],
				routes: {
					'/bower_components': 'bower_components',
					'/script_libs': 'script_libs'
				}
			}
		});

		gulp.watch([
			'app/*.html',
			'app/images/**/*',
			'.tmp/fonts/**/*'
		]).on('change', reload);

		gulp.watch('app/**/*.pug', ['views']);
		gulp.watch('app/styles/**/*.scss', ['styles']);
	});
});

// *****************************************************************************************************************
// build
// *****************************************************************************************************************
gulp.task('build', () => {
	runSequence(['clean'], ['html', 'images', 'extras'], () => {
		gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
	});
	// return 
});