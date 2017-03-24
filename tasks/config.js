const base = 'src';
const assets = `${base}/assets`;

const ports = {
    dev: 8080,
    e2e: 3333
};

const paths = {
    app: `${base}/app`,
    assets: assets,
    dist: 'dist',
    fonts: `${assets}/fonts`,
    i18n: `${assets}/i18n`,
    images: `${assets}/images`,
    index: `${base}/index.html`,
    bowerComponents: `${base}/bower_components`
};

const globs = {
    fonts: `${paths.fonts}/**/*`,
    html: `${paths.app}/**/*.html`,
    i18n: `${paths.i18n}/**/*`,
    images: `${paths.images}/**/*`,
    js: [
        `${base}/**/*.js`,
        `!${paths.bowerComponents}/**/*`
    ],
    scss: [
        `${base}/**/*.scss`,
        `!${paths.bowerComponents}/**/*`,
        `!${paths.app}/common/styles/_icons.scss`
    ]
};

module.exports = {
    base: base,
    globs: globs,
    paths: paths,
    ports: ports
};
