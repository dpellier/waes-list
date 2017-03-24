import gulp from 'gulp';
import ngConstant from 'gulp-ng-constant';
import config from '../config';
import myConfig from './config.json';
const envConfig = myConfig[process.env.NODE_ENV || 'development'];

gulp.task('ngConstant', ['clean'], () => {
    return ngConstant({
        name: 'environmentConfig',
        constants: envConfig,
        stream: true
    }).pipe(gulp.dest(config.paths.dist));
});
