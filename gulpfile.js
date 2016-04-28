'use strict';

var gulp = require('gulp'),
  config = require('./config.js'),
  cdn = require('gulp-cdn-replace'),
  $ = require('gulp-load-plugins')();

/* DEV */

gulp.task('jade', function() {
  return gulp.src(config.app+'/jade/pages/*.jade')
    .pipe($.data(function(file) {
      return require(config.app+'/jade/data/site.json');
    }))
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest(config.app))
});

gulp.task('compass', function() {
  return gulp.src(config.app+'/sass/*.scss')
    .pipe($.plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe($.compass({
      css: config.app+'/css',
      sass: config.app+'/sass',
      image: config.app+'/img',
      generated_images_path: config.app+'/img',
      comments: true,
      force: false
    }))
    .on('error', function(err) {
      console.log(err)
    })
    .pipe($.autoprefixer())
    //.pipe(gulp.dest('./.tmp'));
    //.pipe($.minifyCss())
    //.pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(config.app+'/css'));
});

gulp.task('scripts', function () {
  var dependencies = require('wiredep')();

  return gulp.src((dependencies.js || []).concat([
      config.app+'/js/modules/*.js',
    ]))
    .pipe($.plumber())
    .pipe($.concat('main.js'))
    .pipe(gulp.dest(config.app+'/js'))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(config.app+'/js'))
    .pipe($.size({showFiles: true}));
});

gulp.task('connect', ['compass','jade'], function() {
  return $.connect.server({
    root: config.app,
    port: config.port,
    livereload: config.livereload/*,
    middleware: function() {
      return [
        modRewrite([
          '^/lawbreakers/announcement/(.*)$ http://localhost:'+config.port+'/$1 [P]',
          '^/all/(.*)$ http://nxcache.nexon.net/all/$1 [P]',
          '^/www/(.*)$ http://nxcache.nexon.net/www/$1 [P]'
        ])
      ];
    }*/
  });
});

gulp.task('htmlhint', function () {
  return gulp.src(config.app+'/*.html')
    .pipe($.htmlhint())
});

gulp.task('jshint', function () {
  return gulp.src(config.app+'/js/**/*.js')
    .pipe($.jshint())
});

gulp.task('watch', function () {
  $.livereload.listen();

  gulp.watch([
    config.app+'/js/**/*',
    config.app+'/css/*',
    config.app+'/*.html'
  ], function (file) {
    return $.livereload.changed(file.path);
  });

  //gulp.watch([config.app+'/js/**/*.js'], ['scripts','jshint']);
  //gulp.watch([config.app+'/*.html'], ['htmlhint']);
  gulp.watch([config.app+'/sass/**/*'], ['compass']);
  gulp.watch([config.app+'/jade/**/*'], ['jade']);
});

/* BUILD */

gulp.task('cleanBuild', function () {
  return gulp.src(config.dist)
    .pipe($.rimraf());
});

gulp.task('cleanTemp', function () {
  return gulp.src(config.temp)
    .pipe($.rimraf());
});

gulp.task('copy', ['cleanBuild','compass','jade'], function () {

    // Copy html
    gulp.src(config.paths.html, {cwd: config.app, base: config.app})
      .pipe(gulp.dest(config.dist));

    // Copy styles
    gulp.src(config.paths.styles, {cwd: config.app, base: config.app})
      .pipe(gulp.dest(config.dist));

    // Copy scripts
    gulp.src(config.paths.scripts, {cwd: config.app, base: config.app})
      .pipe(gulp.dest(config.dist));

    // Copy images
    gulp.src(config.paths.images, {cwd: config.app, base: config.app})
      .pipe(gulp.dest(config.dist));

    // Copy extra files
    gulp.src(config.paths.extras, {cwd: config.app, base: config.app})
      .pipe(gulp.dest(config.dist));

    // Copy lib scripts
    gulp.src(config.paths.libs, {cwd: config.app, base: config.app})
      .pipe(gulp.dest(config.dist));
});

gulp.task('useminPrepareCss', ['cleanTemp','compass'], function () {
  return gulp.src(config.paths.styles, {cwd: config.app});
});

gulp.task('useminPrepareJs', ['cleanTemp'], function () {
  return gulp.src(config.paths.scripts, {cwd: config.app});
});

gulp.task('usemin', ['cleanBuild','cleanTemp','useminPrepareCss','useminPrepareJs','jade'], function() {
  return gulp.src(config.app+'/**/*.html')
    .pipe($.usemin({
      css: [ $.csso() ],
      js: [ $.uglify() ],
      //html: [ $.htmlmin({collapseWhitespace: true}) ],
    }))
    .pipe(gulp.dest(config.dist));
});

gulp.task('cdnReplace', ['usemin'], function() {
    gulp.src(config.dist+'/*.html')
        .pipe(cdn({
            dir: config.dist,
            root: {
                js: config.cdn + "/" + config.cdnBase,
                css: config.cdn + "/" + config.cdnBase
            }
        }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('connectBuild', ['compass','jade','usemin'], function() {
  return $.connect.server({
    root: config.dist,
    port: config.port,
    livereload: false
  });
});

/* RUN */

gulp.task('default', [
  'jade',
  'compass',
  //'scripts',
  //'htmlhint',
  //'jshint',
  'connect',
  'watch'
]);

gulp.task('build', [
  'jade',
  'compass',
  'copy',
  'usemin',
  'cdnReplace',
  'connectBuild'
]);

module.exports = gulp;
