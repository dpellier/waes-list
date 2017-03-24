import gulp from 'gulp';
import livereload from 'gulp-livereload';
import config from '../config';

gulp.task('watch', ['connect:dev'], () => {
    livereload.listen();
    gulp.watch(config.globs.html, ['html2js:watch']);
    gulp.watch(config.globs.js, ['6to5:watch']);
    gulp.watch(config.globs.scss, ['sass:watch']);
    gulp.watch(config.globs.i18n, ['i18n:watch']);
});
