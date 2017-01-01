import urlRegex from '../../url_regex.js';

// this is really just a quick sanity check on the regex, as it is maintained and tested elsewhere: https://mathiasbynens.be/demo/url-regex

describe('urlRegex', function() {
  it('should detect a url with http protocol', function() {
    expect(urlRegex.test('http://www.google.com/')).toBe(true)
  });
  it('should detect a url with https protocol', function() {
    expect(urlRegex.test('https://www.google.com/')).toBe(true)
  });
  it('should detect a url with no protocol', function() {
    expect(urlRegex.test('www.google.com/')).toBe(true)
  });
  it('should detect a url with query parameters', function() {
    expect(urlRegex.test('https://www.google.com/search?q=http+protocol')).toBe(true)
  });
})
