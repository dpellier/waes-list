import gulp from 'gulp';
import usemin from 'gulp-usemin';
import minifyCss from 'gulp-cssnano';
import uglify from 'gulp-uglify';
import rev from 'gulp-rev';
import config from '../config';
import htmlmin from 'gulp-htmlmin';

gulp.task('minify', ['clean', 'sass', 'bower', 'ngAnnotate'], () => {
    return gulp.src(`${config.paths.dist}/index.html`)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(usemin({
            cssVendor: [minifyCss({zindex: false}), rev()],
            cssApp: [minifyCss({zindex: false}), rev()],
            jsVendor: [uglify(), rev()],
            jsApp: [uglify(), rev]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('usemin', ['minify', 'clean:bigs']);
