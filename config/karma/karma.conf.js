module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['Chrome'],
    files: [
      '../../src/js/jquery-2.1.1.min.js',
      '../../src/js/listItem.js',
      '../../src/js/UIGen.js',
      '../../src/js/jasmine/spec/**/*.js'
    ]
  });
};
