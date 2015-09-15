import path from 'path';
import browserify from 'browserify';
import watchify from 'watchify';
import extend from 'xtend';
import buffer from 'vinyl-buffer';
import through from 'through2';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';

var _bundles = {};
const isWatching = ~process.argv.indexOf('watch') || ~process.argv.indexOf('--watch');
const production = ~process.argv.indexOf('--production');
const dest = './out';

gulp.task('js', () => {
	return gulp.src('./js/**/*.js', {base: './', read: false})
	.pipe(js({standalone: true}))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(dest));
});

gulp.task('html', () => {
	return gulp.src(['./*.html', './test/**/*.html'], {base: './', buffer: false})
	.pipe(gulp.dest(dest));
});

gulp.task('watch', ['build'], () => {
	gulp.watch('./js/**/*.js', ['js']);
	gulp.watch(['./*.html', './test/**/*.html'], ['html']);
});

gulp.task('build', ['js', 'html']);
gulp.task('default', ['build']);

//////////////////////////////

function js(options) {
	return through.obj(function(file, enc, next) {
		file.contents = jsBundle(file, options);
		next(null, file);
	});
}

function jsBundle(file, options={}) {
	if (!_bundles[file.path]) {
		options = extend({
			debug: true,
			detectGlobals: false,
			transform: ['babelify']
		}, options);

		if (options.standalone === true) {
			options.standalone = path.basename(file.path)
				.replace(/\.\w+/, '')
				.replace(/\-(\w)/g, (str, c) => c.toUpperCase());
		}

		if (isWatching) {
			options = extend(options, watchify.args);
		}

		var b = browserify(file.path, options);
		if (isWatching) {
			b = watchify(b);
		}
		_bundles[file.path] = b;
	}

	return _bundles[file.path].bundle();
}