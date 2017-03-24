import gulp from 'gulp';
import sass from 'gulp-sass';
import importOnce from 'node-sass-import-once';
import autoprefixer from 'gulp-autoprefixer';
import livereload from 'gulp-livereload';
import config from '../config';

function build() {
    return gulp.src(config.globs.scss)
        .pipe(sass({
            importer: importOnce,
            importOnce: {
                index: false,
                css: false,
                bower: false
            }
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: false
        }));
}

gulp.task('sass', ['clean'], () => {
    return build()
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task('sass:watch', () => {
    return build()
        .pipe(gulp.dest(config.paths.dist))
        .pipe(livereload());
});
