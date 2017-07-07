"use strict";

var _ = require("underscore");

_.mixin({
  instanceOf: function (object, constructor) {
    if (object instanceof constructor) {
      return true;
    }

    if (object.constructor.name == constructor.name) {
      return true;
    }

    while (object = Object.getPrototypeOf(object)) {
      if (object && object.constructor) {
        if (object.constructor.name == constructor.name) {
          return true;
        }
      }
    }

    return false;
  },

  camelize: function (string, decapitalize) {
    string = string.replace(/(?:^|[-_\s])(\w)/g, function (_, c) {
      return c ? c.toUpperCase() : '';
    });

    if (decapitalize === true) {
      return string.charAt(0).toLowerCase() + string.substring(1);
    }

    return string;
  },

  capitalize: function (string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  },

  dasherize: function (str) {
    return str.replace(/[A-Z]/g, function(char, index) {
      return (index !== 0 ? '-' : '') + char.toLowerCase();
    }).replace(/[-_\s]+/g, '-');
  },

  humanize: function(str) {
    return str.toString().toLowerCase().replace(/[_-]/g, ' ').replace(/(?:^|\s)\S/g, function(a) {
      return a.toUpperCase();
    });
  },

  alphanumSort: function (array, caseInsensitive) {
    for (var z = 0, t; t = array[z]; z++) {
      array[z] = new Array();
      var x = 0,
        y = -1,
        n = 0,
        i, j;

      while (i = (j = t.charAt(x++)).charCodeAt(0)) {
        var m = (i == 46 || (i >= 48 && i <= 57));
        if (m !== n) {
          array[z][++y] = "";
          n = m;
        }
        array[z][y] += j;
      }
    }

    array.sort(function (a, b) {
      for (var x = 0, aa, bb;
        (aa = a[x]) && (bb = b[x]); x++) {
        if (caseInsensitive) {
          aa = aa.toLowerCase();
          bb = bb.toLowerCase();
        }
        if (aa !== bb) {
          var c = Number(aa),
            d = Number(bb);
          if (c == aa && d == bb) {
            return c - d;
          } else return (aa > bb) ? 1 : -1;
        }
      }
      return a.length - b.length;
    });

    for (var z = 0; z < array.length; z++) {
      array[z] = array[z].join("");
    }
    return array;
  }
});

module.exports = _;
