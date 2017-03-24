import gulp from 'gulp';
import livereload from 'gulp-livereload';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babel from 'babelify';
import config from '../config';

function bundle(bundler) {
    return bundler
        .bundle()
        .on('error', function(err) {
            console.error(err);     // eslint-disable-line no-console
            this.emit('end');       // eslint-disable-line no-invalid-this
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.dist));
}

function build(watching) {
    let bundler = browserify(config.base + '/bootstrap.js', {
        debug: true
    }).transform(babel);

    if(watching) {
        bundler = watchify(bundler);
        bundler.on('update', () => {
            bundle(bundler);
        });
    }

    return bundle(bundler);
}

gulp.task('6to5', ['clean', 'bower', 'html2js'], () => {
    return build(false);
});

gulp.task('6to5:watch', () => {
    return build(true).pipe(livereload());
});
