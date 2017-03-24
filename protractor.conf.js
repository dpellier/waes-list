exports.config = {
    directConnect: true,
    framework: 'jasmine2',

    firefoxPath: null,

    specs: ['test/e2e/**/*.js'],

    multiCapabilities: [
        {
            browserName: 'firefox',
            name: 'Firefox e2e tests',
            specs: ['test/e2e/**/*.js'],
            exclude: []
        }
    ],
    onPrepare: () => {
        require('babel-core/register');

        // Extend the screen size to prevent elements to be hidden on CI
        setTimeout(() => {
            browser.driver.executeScript(() => {
                return {
                    width: window.screen.availWidth,
                    height: window.screen.availHeight
                };
            }).then((result) => {
                browser.driver.manage().window().setSize(result.width, result.height);
            });
        });
    }
};
