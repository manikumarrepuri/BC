angular.module('itheonApp').factory(
  "traceService",
  function() {
    return({
      parse: ErrorStackParser.parse,
      parseV8OrIE: ErrorStackParser.parseV8OrIE,
      extractLocation: ErrorStackParser.extractLocation
    });
  }
);
