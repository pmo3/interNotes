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
    },
    reporters: ["dots"],
    runnerPort: 9100,
    singleRun: false,
    files: [
      'src/js/jasmine/spec/**/*.js'
    ]
  });
};
