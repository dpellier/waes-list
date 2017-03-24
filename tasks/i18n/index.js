import gulp from 'gulp';
import livereload from 'gulp-livereload';
import config from '../config';

gulp.task('i18n', ['clean'], () => {
    return gulp.src(config.globs.i18n)
        .pipe(gulp.dest(`${config.paths.dist}/assets/i18n`));
});

gulp.task('i18n:watch', () => {
    return gulp.src(config.globs.i18n)
        .pipe(gulp.dest(`${config.paths.dist}/assets/i18n`))
        .pipe(livereload());
});
