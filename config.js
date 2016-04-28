
/*
 * Config
 */
var config = {
    cdn: '',
    cdnBase: '',
    app: './src',
    port: 8888,
    livereload: true,
    dist: './build',
    temp: './.tmp',
    paths: {
        scripts: ['js/**/*.js'],
        libs: ['lib/**/*'],
        styles: ['css/**/*.css'],
        html: ['**/*.html'],
        images: ['img/**/*'],
        extras: [
            'favicon.ico'
        ]
    }
};

module.exports = config;
