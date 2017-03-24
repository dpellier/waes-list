import gulp from 'gulp';

gulp.task('build:dev', [
    'clean',
    'html2js',
    'sass',
    'i18n',
    'fonts',
    'image:dev',
    'ngConstant',
    'bower',
    '6to5'
]);

gulp.task('build:dist', [
    'clean',
    'html2js',
    'sass',
    'fonts',
    'i18n',
    'image:dist',
    'ngAnnotate',
    'ngConstant',
    'bower',
    '6to5',
    'usemin',
    'clean:generated'
]);
