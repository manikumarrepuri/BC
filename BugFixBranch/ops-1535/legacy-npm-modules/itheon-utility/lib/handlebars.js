"use strict";

var Handlebars = require("handlebars");
var helpers = require('handlebars-helpers')({
  handlebars: Handlebars
});

/**
 * Render a block when a comparison of the first and third
 * arguments returns true. The second argument is
 * the [arithemetic operator][operators] to use. You may also
 * optionally specify an inverse block to render when falsy.
 *
 * @param `a`
 * @param `operator` The operator to use. Operators must be enclosed in quotes: `">"`, `"="`, `"<="`, and so on.
 * @param `b`
 * @param {Object} `options` Handlebars provided options object
 * @return {String} Block, or if specified the inverse block is rendered if falsey.
 * @block
 * @api public
 *
 * Example usage for a single condition
 * ```handlebars
 * {{#xif aaa '==' 'a'}}
 *     <span>true</span>
 * {{else}}
 *     <span>false</span>
 * {{/xif}}
* ```
* Example usage for multiple conditions
* ```handlebars
* {{#xif (xif aaa '==' 'a') "&&" (xif bbb '==' 'b')}}
*     <span>true</span>
* {{else}}
*     <span>false</span>
* {{/xif}}
* ```
*/
Handlebars.registerHelper('xif', function (v1, operator, v2, options) {
    if (!options.fn ) {
        options.fn = function () {
            return true;
        };
        options.inverse = function () {
            return false;
        }
    }
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        case 'typeof':
            return (typeof v1 == v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

module.exports = Handlebars;
