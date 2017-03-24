import gulp from 'gulp';
import ngAnnotate from 'gulp-ng-annotate';
import config from '../config';

gulp.task('ngAnnotate', ['clean', '6to5'], () => {
    return gulp.src(`${config.paths.dist}/app.js`)
        .pipe(ngAnnotate())
        .pipe(gulp.dest(config.paths.dist));
});
