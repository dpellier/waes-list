import gulp from 'gulp';
import gulpProtractor from 'gulp-protractor';
import connect from 'gulp-connect';
const protractor = gulpProtractor.protractor;
import config from '../config';

function runTest() {
    return gulp.src(['test/e2e/**/*.js'])
        .pipe(protractor({
            configFile: 'protractor.conf.js',
            args: ['--baseUrl', `http://127.0.0.1:${config.ports.e2e}`]
        }))
        .on('error', (e) => {
            throw e;
        })
        .on('end', () => {
            connect.serverClose();
        });
}

gulp.task('test:e2e:dist', ['connect:e2e:dist'], () => {
    return runTest();
});

gulp.task('test:e2e', ['connect:e2e'], () => {
    return runTest();
});
