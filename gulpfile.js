/*

REQUIRED STUFF
==============
*/

var gulp        = require('gulp');
var sass        = require('gulp-sass');
// var sourcemaps  = require('gulp-sourcemaps');
var notify      = require('gulp-notify');
var prefix      = require('gulp-autoprefixer');
var minifycss   = require('gulp-clean-css');
var uglify      = require('gulp-uglify');
var cache       = require('gulp-cache');
var concat      = require('gulp-concat');
var util        = require('gulp-util');
var header      = require('gulp-header');
var pixrem      = require('gulp-pixrem');
// var exec        = require('child_process').exec;
var eslint      = require('gulp-eslint');
var del         = require('del');
var cleanhtml   = require('gulp-cleanhtml');
var scsslint    = require('gulp-scss-lint');
var karma       = require('karma');
var babelify    = require('babelify');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');

/*

FILE PATHS
==========
*/

var srcDir = './src';
var sassSrc = srcDir + '/assets/stylesheets/**/*.{sass,scss}';
var sassFile = srcDir + '/assets/stylesheets/internotes.scss';
var buildDir = './build'
var cssDest = buildDir + '/assets/stylesheets/';
var jsSrc = srcDir + '/js/**/*.js';
var jsDest = buildDir + '/js';
var jsDestFile = buildDir + "/internotes.js";
var imgSrc = srcDir + '/assets/images/**/*.{jpg,jpeg,png}';
var imgDest = buildDir + '/assets/images';
var fontSrc = srcDir + '/assets/fonts/**/*.{eot,svg,ttf,woff,woff2,otf}';
var fontDest = buildDir + '/fonts';
/*

ERROR HANDLING
==============
*/

var handleError = function(task) {
  return function(err) {

      notify.onError({
        message: task + ' failed, check the logs..'
      })(err);

    util.log(util.colors.bgRed(task + ' error:'), util.colors.red(err));
  };
};

/*
STYLES
======
*/

gulp.task('build:css', ['build:clean', 'lint:scss'], function() {

  return gulp.src(sassFile)
    .pipe(sass({
      compass: false,
      bundleExec: true,
      sourcemap: false,
      style: 'compressed',
      debugInfo: true,
      lineNumbers: true,
      errLogToConsole: true,
      includePaths: [
        'node_modules/',
      ],
    }))
    .on('error', handleError('styles'))
    .pipe(prefix('last 3 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')) // Adds browser prefixes (eg. -webkit, -moz, etc.)
    .pipe(pixrem())
    .pipe(minifycss({
      advanced: true,
      keepBreaks: false,
      keepSpecialComments: 0,
      mediaMerging: true,
      sourceMap: true,
      debug: true
    }, function(details) {
        console.log('[clean-css] Original size: ' + details.stats.originalSize + ' bytes');
        console.log('[clean-css] Minified size: ' + details.stats.minifiedSize + ' bytes');
        console.log('[clean-css] Time spent on minification: ' + details.stats.timeSpent + ' ms');
        console.log('[clean-css] Compression efficiency: ' + details.stats.efficiency * 100 + ' %');
    }))
    .pipe(gulp.dest(cssDest))
});

gulp.task('lint:scss', function() {
  gulp.src([sassSrc, '!'+ srcDir + '/assets/stylesheets/font_awesome/**'])
  .pipe(scsslint());
});

/*

SCRIPTS
=======
*/

var currentDate   = util.date(new Date(), 'dd-mm-yyyy HH:ss');
var pkg       = require('./package.json');
var banner      = '/*! <%= pkg.name %> <%= currentDate %> - <%= pkg.author %> */\n';

// Build all the things!
gulp.task("build", ["build:copy", "build:css", "build:html", "build:js"]);

// Clean build directory
gulp.task("build:clean", function() {
  return del(["build/*", "dist/*"]);
});

// Copy files that don't require any build process
gulp.task("build:copy", ["build:clean"], function() {
  gulp.src([imgSrc]).
    pipe(gulp.dest(imgDest));
  gulp.src([fontSrc]).
  pipe(gulp.dest(fontDest));
  return gulp.src(srcDir + "/manifest.json").
    pipe(gulp.dest(buildDir));
});

gulp.task('lint:js', function() {
  return gulp.src(jsSrc)
  // .pipe(cache("linting"))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});

// Copy and compress HTML files
gulp.task("build:html", ["build:clean"], function() {
  return gulp.src(srcDir + "/**/*.html").
    pipe(cleanhtml()).
    pipe(gulp.dest(buildDir));
});

gulp.task("test:chrome", ['lint:js'], function(done) {
  var opts = {
    autoWatch: true,
    browsers: ["Chrome"],
    configFile: __dirname + "/config/karma/karma.conf.js"
  };
  new karma.Server.start(opts, done);
});

// Build the browserify bundle including the app
gulp.task("build:js", ["lint:js", "build:clean"], function(done) {
  function basename(filePath) {
    var components = filePath.split(/\//);
    return components[components.length - 1];
  }

  function bundleEntry(entryFile) {
    var bundle = browserify({
      debug: true,
      entries: entryFile
    });

    return bundle.
      transform("babelify", { presets: ["es2015"] }).
      bundle().
      pipe(source(basename(entryFile))).
      on("error", function(err) {
        gutil.log(err);
        this.emit("end");
      })
      .pipe(buffer())
      .pipe(concat('internotes.js'))
      .pipe(uglify({preserveComments: false, compress: true, mangle: true}).on('error',function(e){console.log('\x07',e.message);return this.end();}))
      .pipe(header(banner, {pkg: pkg, currentDate: currentDate}))
      .pipe(gulp.dest(jsDest));
  }
  gulp.src([srcDir + '/js/jquery-2.1.1.min.js'])
  .pipe(gulp.dest(jsDest));

  bundleEntry(srcDir + '/js/entry.js');
});

/*

WATCH
=====

*/

gulp.task('watch', function() {

  gulp.watch(sassSrc, ['lint:scss']);
  gulp.watch(jsSrc, ['lint:js']);

});
