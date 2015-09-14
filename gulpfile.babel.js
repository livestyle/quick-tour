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
	.pipe(js())
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(dest));
});

gulp.task('watch', () => {
	gulp.watch('./js/**/*.js', ['js']);
});

gulp.task('default', ['js']);

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