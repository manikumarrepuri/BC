angular.module('itheonApp').factory(
  "traceService",
  function() {
    return({
      extractLocation: ErrorStackParser.extractLocation,
      parse: ErrorStackParser.parse,
      parseFFOrSafari: ErrorStackParser.parseFFOrSafari,
      parseOpera: ErrorStackParser.parseOpera,
      parseOpera9: ErrorStackParser.parseOpera9,
      parseOpera10: ErrorStackParser.parseOpera10,
      parseOpera11: ErrorStackParser.parseOpera11,
      parseV8OrIE: ErrorStackParser.parseV8OrIE
    });
  }
);
