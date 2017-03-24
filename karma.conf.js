
module.exports = function(config) {
    config.set({
        basePath: __dirname,
        frameworks: ['browserify', 'jasmine', 'es6-shim'],
        files: [
            // Following files are automatically added when you launch the tests
            // bower:js
            'src/bower_components/angular/angular.js',
            'src/bower_components/angular-ui-router/release/angular-ui-router.js',
            'src/bower_components/babel-polyfill/browser-polyfill.js',
            'src/bower_components/angular-mocks/angular-mocks.js',
            // endbower
            'src/app.js',
            'dist/templates.js',
            'src/app/**/*.js',
            'test/specs/**/*.js'
        ],
        preprocessors: {
            'src/app.js': ['browserify'],
            'src/app/**/*.js': ['browserify'],
            'test/specs/**/*.js': ['browserify']
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage'
        },
        exclude: [],
        port: 8080,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        browserNoActivityTimeout: 15000,
        browserDisconnectTolerance: 3,
        singleRun: true,
        browserify: {
            debug: true,
            transform: [require('browserify-istanbul')({
                instrumenter: require('isparta'),
                ignore: ['**/spec/**']
            }), 'babelify']
        }
    });
};
