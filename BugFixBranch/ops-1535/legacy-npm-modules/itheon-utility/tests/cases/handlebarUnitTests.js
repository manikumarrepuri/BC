'use strict';

var assert = require("assert");
var handlebars = require("../../lib/handlebars");


describe('comparison', function() {
  describe('xif', function() {
    describe('errors', function() {
        it('should throw an error when args are invalid', function() {
            assert(function() {
                handlebars.compile('{{#xif}}{{/xif}}')();
            }, 'handlebars Helper {{xif}} expects 4 arguments');
            assert(function() {
                handlebars.compile('{{#xif a b}}{{/xif}}')();
            }, 'handlebars Helper {{xif}} expects 4 arguments');
        });

        it('should throw an error when the operator is invalid', function() {
            (function() {
                handlebars.compile('{{#xif a "~" b}}{{/xif}}')();
            }, 'helper {{xif}}: invalid operator: `~`');
        });
    });

    describe('operators', function() {
        describe('==', function() {
            var fn = handlebars.compile('{{#xif a "==" b}}A{{else}}B{{/xif}}');

            it('should render the first block if `a` equals `b`', function() {
                assert.equal(fn({
                    a: '0',
                    b: 0
                }), 'A');
            });
            it('should render the second block if false', function() {
                assert.equal(fn({
                    a: 'foo',
                    b: 0
                }), 'B');
            });
        });

        describe('===', function() {
            var fn = handlebars.compile('{{#xif a "===" b}}A{{else}}B{{/xif}}');

            it('should render the first block if `a` strictly equals `b`', function() {
                assert.equal(fn({
                    a: '1',
                    b: '1'
                }), 'A');
            });
            it('should render the second block if false', function() {
                assert.equal(fn({
                    a: '1',
                    b: 1
                }), 'B');
            });
        });

        describe('!=', function() {
            var fn = handlebars.compile('{{#xif a "!=" b}}A{{else}}B{{/xif}}');

            it('should render the first block if `a` does not equal `b`', function() {
                assert.equal(fn({
                    a: 10,
                    b: '11'
                }), 'A');
            });
            it('should render the second block if false', function() {
                assert.equal(fn({
                    a: 10,
                    b: '10'
                }), 'B');
            });
        });

        describe('!==', function() {
            var fn = handlebars.compile('{{#xif a "!==" b}}A{{else}}B{{/xif}}');

            it('should render the first block if `a` does not strictly equal `b`', function() {
                assert.equal(fn({
                    a: 10,
                    b: 11
                }), 'A');
            });
            it('should render the second block if false', function() {
                assert.equal(fn({
                    a: 10,
                    b: 10
                }), 'B');
            });
        });

        describe('>', function() {
            var fn = handlebars.compile('{{#xif a ">" b}}greater than or equal to 15{{else}}less than 15{{/xif}}');

            it('should render the first block if true.', function() {
                assert.equal(fn({
                    a: 20,
                    b: 15
                }), 'greater than or equal to 15');
            });

            it('should render the second block if false.', function() {
                assert.equal(fn({
                    a: 14,
                    b: 15
                }), 'less than 15');
            });
        });

        describe('<', function() {
            var fn = handlebars.compile('I knew it, {{#xif unicorns "<" ponies}}unicorns are just low-quality ponies!{{else}}unicorns are special!{{/xif}}');

            it('should render the first block if true.', function() {
                var res = fn({
                    unicorns: 5,
                    ponies: 6
                });
                assert.equal(res, 'I knew it, unicorns are just low-quality ponies!');
            });

            it('should render the second block if false.', function() {
                var res = fn({
                    unicorns: 7,
                    ponies: 6
                });
                assert.equal(res, 'I knew it, unicorns are special!');
            });
        });

        describe('>=', function() {
            var fn = handlebars.compile('{{#xif a ">=" b}}greater than or equal to 15{{else}}less than 15{{/xif}}');

            it('should render the first block if true.', function() {
                assert.equal(fn({
                    a: 20,
                    b: 15
                }), 'greater than or equal to 15');
            });

            it('should render the first block if equal.', function() {
                assert.equal(fn({
                    a: 15,
                    b: 15
                }), 'greater than or equal to 15');
            });

            it('should render the second block if false.', function() {
                assert.equal(fn({
                    a: 14,
                    b: 15
                }), 'less than 15');
            });
        });

        describe('<=', function() {
            var fn = handlebars.compile('{{#xif a "<=" b}}less than or equal to 10{{else}}greater than 10{{/xif}}');

            it('should render the first block if true.', function() {
                assert.equal(fn({
                    a: 10,
                    b: 15
                }), 'less than or equal to 10');
            });

            it('should render the second block if false.', function() {
                assert.equal(fn({
                    a: 20,
                    b: 15
                }), 'greater than 10');
            });
        });

        describe('&&', function() {
            var fn = handlebars.compile('{{#xif (xif aaa "==" a) "&&" (xif bbb "==" b)}}aaa == a and bbb == b{{else}}aaa != a || bbb != b{{/xif}}');

            it('should render the first block if true.', function() {
                assert.equal(fn({
                    a: 10,
                    aaa: 10,
                    b: 10,
                    bbb: 10
                }), 'aaa == a and bbb == b');
            });

            it('should render the second block if false.', function() {
                assert.equal(fn({
                  a: 10,
                  aaa: 15,
                  b: 10,
                  bbb: 10
                }), 'aaa != a || bbb != b');
            });

            it('should render the second block if false.', function() {
                assert.equal(fn({
                  a: 10,
                  aaa: 10,
                  b: 10,
                  bbb: 15
                }), 'aaa != a || bbb != b');
            });
        });

        describe('||', function() {
            var fn = handlebars.compile('{{#xif (xif aaa "==" a) "||" (xif bbb "==" b)}}aaa == a || bbb == b{{else}}aaa != a && bbb != b{{/xif}}');

            it('should render the first block if true.', function() {
                assert.equal(fn({
                    a: 10,
                    aaa: 10,
                    b: 10,
                    bbb: 10
                }), 'aaa == a || bbb == b');
            });

            it('should render the first block if true.', function() {
                assert.equal(fn({
                    a: 10,
                    aaa: 15,
                    b: 10,
                    bbb: 10
                }), 'aaa == a || bbb == b');
            });

            it('should render the second block if false.', function() {
                assert.equal(fn({
                  a: 10,
                  aaa: 15,
                  b: 10,
                  bbb: 15
                }), 'aaa != a && bbb != b');
            });
        });

        describe('typeof', function() {
            it('should render the first block if true', function() {
                var fn = handlebars.compile('{{#xif obj "typeof" "object"}}A{{else}}B{{/xif}}');
                assert.equal(fn({
                    obj: {}
                }), 'A');
            });
        });
    });
  });
});
