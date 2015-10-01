import buffer from 'vinyl-buffer';
import through from 'through2';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import minify from 'gulp-minify-css';
import uglify from 'gulp-uglify';
import jsBundle from './gulp-tasks/js-bundle';

const isWatching = ~process.argv.indexOf('watch') || ~process.argv.indexOf('--watch');
const production = ~process.argv.indexOf('--production');
const dest = './out';

gulp.task('js', () => {
	var stream;
	return stream = gulp.src('./js/*.js', {base: './', read: false})
	.pipe(jsBundle({standalone: true, watch: isWatching})).once('error', err => stream.emit('error', err))
	.pipe(buffer()).once('error', err => stream.emit('error', err))
	.pipe(production ? uglify() : through.obj())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(dest));
});

gulp.task('html', () => {
	return gulp.src(['./*.html', './test/**/*.html'], {base: './', buffer: false})
	.pipe(gulp.dest(dest));
});

gulp.task('css', () => {
	return gulp.src('./css/*.css', {base: './'})
	.pipe(sourcemaps.init())
	.pipe(postcss([
		require('postcss-import'),
		require('autoprefixer')({browsers: ['last 3 versions']})
	]))
	.pipe(production ? minify({processImport: false}) : through.obj())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(dest));
});

gulp.task('watch', ['build'], () => {
	gulp.watch('./js/**/*.js', ['js']);
	gulp.watch(['./*.html', './test/**/*.html'], ['html']);
	gulp.watch('./css/**', ['css']);
});

gulp.task('build', ['js', 'html', 'css']);
gulp.task('default', ['build']);