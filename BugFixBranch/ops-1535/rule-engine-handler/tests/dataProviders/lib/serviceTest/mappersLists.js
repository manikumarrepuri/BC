
var invalidVariableMessage = 'Invalid list of mappers passed. MapperName => MapperObject list expected';
var emptyListMessage = 'Invalid list of mappers passed. Non-empty list expected';
var invalidNameMessage = 'Invalid mapper name passed: "0". a-zA-Z pattern expected';
var invalidInstanceOfMapper = 'Invalid instance of mapper passed for mapper name: "ok"';

module.exports.invalidConstructorMappersList = [
  ['string', invalidVariableMessage],
  [12, invalidVariableMessage],
  [[], emptyListMessage],
  [{}, emptyListMessage],
  [['xxx'], invalidNameMessage],
  [{0:'xxx'}, invalidNameMessage],
  [{ok:'xxx'}, invalidInstanceOfMapper],
  [{ok:12}, invalidInstanceOfMapper],
  [{ok:{}}, invalidInstanceOfMapper],
  [{ok:null}, invalidInstanceOfMapper]
];

module.exports.invalidSetMappersList = [
  ['string', invalidVariableMessage],
  [12, invalidVariableMessage],
  [null, invalidVariableMessage],
  [[], emptyListMessage],
  [{}, emptyListMessage],
  [['xxx'], invalidNameMessage],
  [{0:'xxx'}, invalidNameMessage],
  [{ok:'xxx'}, invalidInstanceOfMapper],
  [{ok:12}, invalidInstanceOfMapper],
  [{ok:{}}, invalidInstanceOfMapper],
  [{ok:null}, invalidInstanceOfMapper]
];
