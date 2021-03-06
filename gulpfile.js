/* eslint-disable camelcase */
/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2019 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.10.11-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */

const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifyCss = require('gulp-clean-css');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const src_folder = './src/';
const src_assets_folder = src_folder + 'assets/';
const docs_folder = './docs/';
const docs_assets_folder = docs_folder + 'assets/';
const node_modules_folder = './node_modules/';
const docs_node_modules_folder = docs_folder + 'node_modules/';

const node_dependencies = Object.keys(
	require('./package.json').dependencies || {}
);

gulp.task('clear', () => del([docs_folder]));

gulp.task('html', () => {
	return gulp
		.src([src_folder + '**/*.html'], {
			base: src_folder,
			since: gulp.lastRun('html'),
		})
		.pipe(gulp.dest(docs_folder))
		.pipe(browserSync.stream());
});

gulp.task('sass', () => {
	return gulp
		.src(
			[
				// src_assets_folder + 'sass/**/*.sass',
				src_assets_folder + 'scss/**/*.scss',
			],
			{ since: gulp.lastRun('sass') }
		)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(minifyCss())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(docs_assets_folder + 'css'))
		.pipe(browserSync.stream());
});

gulp.task('modernizr', () => {
	return gulp
		.src(`${src_assets_folder}/js/modernizr.custom.js`)
		.pipe(gulp.dest(docs_assets_folder + 'js'));
});

gulp.task('js', () => {
	return gulp
		.src([src_assets_folder + 'js/**/*.js'], { since: gulp.lastRun('js') })
		.pipe(plumber())
		.pipe(
			webpack({
				mode: 'production',
			})
		)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(docs_assets_folder + 'js'))
		.pipe(browserSync.stream());
});

gulp.task('images', () => {
	return gulp
		.src([src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)'], {
			since: gulp.lastRun('images'),
		})
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest(docs_assets_folder + 'images'))
		.pipe(browserSync.stream());
});

gulp.task('vendor', () => {
	if (node_dependencies.length === 0) {
		return new Promise(resolve => {
			console.log('No dependencies specified');
			resolve();
		});
	}

	return gulp
		.src(
			node_dependencies.map(
				dependency => node_modules_folder + dependency + '/**/*.*'
			),
			{
				base: node_modules_folder,
				since: gulp.lastRun('vendor'),
			}
		)
		.pipe(gulp.dest(docs_node_modules_folder))
		.pipe(browserSync.stream());
});

gulp.task(
	'build',
	gulp.series('clear', 'html', 'sass', 'modernizr', 'js', 'images', 'vendor')
);

gulp.task('dev', gulp.series('html', 'sass', 'js'));

gulp.task('serve', () => {
	return browserSync.init({
		server: './docs',
		startPath: '/index.html', // After it browser running
		browser: 'chrome',
		host: 'localhost',
		tunnel: true,
		port: 3000,
		open: false,
	});
});

gulp.task('watch', () => {
	const watchImages = [
		src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)',
	];

	const watchVendor = [];

	node_dependencies.forEach(dependency => {
		watchVendor.push(node_modules_folder + dependency + '/**/*.*');
	});

	const watch = [
		src_folder + '**/*.html',
		src_assets_folder + 'scss/**/*.scss',
		src_assets_folder + 'js/**/*.js',
	];

	gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
	gulp
		.watch(watchImages, gulp.series('images'))
		.on('change', browserSync.reload);
	gulp
		.watch(watchVendor, gulp.series('vendor'))
		.on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
