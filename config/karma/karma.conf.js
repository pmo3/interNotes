// module.exports = function(config) {
//   config.set({
//     frameworks: ['jasmine'],
//     reporters: ['spec'],
//     browsers: ['Chrome'],
//     files: [
//       '../../src/js/jquery-2.1.1.min.js',
//       '../../src/js/listItem.js',
//       '../../src/js/UIGen.js',
//       '../../src/js/jasmine/spec/**/*.js'
//     ]
//   });
// };

module.exports = function(config) {
  config.set({
    autoWatch: true,
    basePath: "../../",
    browserify: {
      configure: function(bundler) {
        bundler.once("prebundle", function() {
          bundler.transform("babelify", { presets: ["es2015"] });
        });
      },
      debug: true
    },
    browsers: ["Chrome"],
    captureTimeout: 60000,
    colors: true,
    exclude: [],
    frameworks: ["browserify", "jasmine"],
    logLevel: config.LOG_INFO,
    plugins: [
      "karma-browserify",
      "karma-jasmine",
      "karma-chrome-launcher",
    ],
    port: 9876,
    preprocessors: {
      "src/js/**/*.js": ["browserify"]
      // "test/**/*.js": ["browserify"]
    },
    reporters: ["dots"],
    runnerPort: 9100,
    singleRun: false,
    files: [
      // 'src/js/jquery-2.1.1.min.js',
      // 'src/js/listItem.js',
      // 'src/js/UIGen.js',
      'src/js/jasmine/spec/**/*.js'
    ]
  });
};
