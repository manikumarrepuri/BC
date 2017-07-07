angular.module('commonFilters', ['underscoreService'])
.filter("createdAt", function() {
  return function(items, from, to) {
    var result = [];
    for (var i=0; i<items.length; i++){
      var date = new Date(items[i].createdAt);
      if (date > from && date < to)  {
        result.push(items[i]);
      }
    }
    return result;
  };
})
.filter('customFilter', ['$filter', '_', function ($filter, _) {
var filterFilter = $filter('filter');
var standardComparator = function standardComparator(obj, text) {
    text = ('' + text).toLowerCase();
    return ('' + obj).toLowerCase().indexOf(text) > -1;
};
return function customFilter(array, expression) {
    function customComparator(actual, expected) {

        var isBeforeActivated = expected.before;
        var isAfterActivated = expected.after;
        var isLower = expected.lower;
        var isHigher = expected.higher;
        var isEqual = expected.equal;
        var higherLimit;
        var lowerLimit;
        var equalLimit;
        var itemDate;
        var queryDate;

        if (angular.isObject(expected)) {
            //date range
            if (expected.before || expected.after) {
                try {
                    if (isBeforeActivated) {
                        higherLimit = expected.before;

                        itemDate = new Date(actual);
                        queryDate = new Date(higherLimit);

                        if (itemDate > queryDate) {
                            return false;
                        }
                    }

                    if (isAfterActivated) {
                        lowerLimit = expected.after;


                        itemDate = new Date(actual);
                        queryDate = new Date(lowerLimit);

                        if (itemDate < queryDate) {
                            return false;
                        }
                    }

                    return true;
                } catch (e) {
                    return false;
                }

            } else if (isLower || isHigher || isEqual) {
                //number range
                if (isLower) {
                    higherLimit = expected.lower;
                    if (actual > higherLimit) {
                        return false;
                    }
                }

                if (isHigher) {
                    lowerLimit = expected.higher;
                    if (actual < lowerLimit) {
                        return false;
                    }
                }

                if (isEqual) {
                    equalLimit = expected.equal;
                    if (actual != equalLimit) {
                        return false;
                    }
                }

                return true;
            }
            //etc

            return true;

        }
        return standardComparator(actual, expected);
    }
    function createFilterFromExpression(){
      for(key in expression) {
        if(expression.hasOwnProperty(key)) {
            // key: the name of the object key
            // index: the ordinal position of the key within the object 
            // Make two sets, one for && and one for single
            //createdAt is an object holding after and before values, it's always a single value. No need to split by (&&)
            if(key == "createdAt"){
              if(expression[key].after || expression[key].before){
                allExpressionIndividualValues.push({[key]:expression[key]});
              }
            }else{
              var spiltResult = expression[key].toString().split("(&&)");
              if(spiltResult.length>1){
                for (var i = 0, length = spiltResult.length; i < length; i++) {
                  allExpressionConditionValues.push({[key]:spiltResult[i]});
                }
              }else{
                for (var i = 0, length = spiltResult.length; i < length; i++) {
                  allExpressionIndividualValues.push({[key]:spiltResult[i]});
                }
              }
            }
          }
      }
    }
    function getResultFromCombination(){
      var lastKeyName;
      var isMorethanOne = false;
      _.each(allExpressionConditionValues, function(superObj) {
          var lastIndex = allExpressionConditionValues.indexOf(superObj)-1;
          var keyName = Object.keys(superObj)[0];
          //Below condition is to get the finalResult object once it is moved to next unique key
          if(lastKeyName && lastKeyName != keyName){
            isMorethanOne = true;
          }
          //if the combination filter is with more than one unique key, then the output should be based on finalResult
          if(finalResult.length > 0 && lastKeyName != keyName && isMorethanOne){
            firstUniqueResult = finalResult;
            isMorethanOne =false;
          }
          if(firstUniqueResult && firstUniqueResult.length>0){
            output = filterFilter(((typeof firstUniqueResult !== 'undefined' && firstUniqueResult.length > 0)?firstUniqueResult:array), superObj, customComparator);
            isOutputexecuted = true;
          }else{
            output = filterFilter(((typeof resultedArray !== 'undefined' && (resultedArray.length > 0 || isResultedArrayExecuted))?resultedArray:array), superObj, customComparator);
            isOutputexecuted = true;
          }
          
          if((output.length > 0 || isOutputexecuted) &&
            (finalResult.length > 0 || isfinalResultConsider) &&
            (keyName != lastKeyName || ((superObj[keyName].charAt(0) == "!" && allExpressionConditionValues[lastIndex][keyName].charAt(0) == "!") ||
            (superObj[keyName].charAt(0) == "!" && allExpressionConditionValues[lastIndex][keyName].charAt(0) != "!") ||
            (superObj[keyName].charAt(0) != "!" && allExpressionConditionValues[lastIndex][keyName].charAt(0) == "!"))))
          {
            finalResult = _.intersection(output,finalResult);
            isfinalResultConsider = true;
          }else{
            finalResult = _.union(output,finalResult);
            isfinalResultConsider = true;
          }
          lastKeyName = keyName;
          if(allExpressionConditionValues.indexOf(superObj) + 1 == allExpressionConditionValues.length) {
              isAllDone = true;
          }
        });
    }
    //AND, OR filter : start
    //Get the string delimited by (&&)
    var resultedArray = [];
    var finalResult = [];
    var firstUniqueResult = [];
    var allExpressionConditionValues = [];
    var allExpressionIndividualValues = [];
    var output;
    var isfinalResultConsider = false;
    var isOutputexecuted = false;
    var isResultedArrayExecuted = false;
    var isAllDone = false;
    //Get all the expression conditions in key:value format to an Array
    createFilterFromExpression();
    //Loop through the allExpressionKeyValues and filter the data with all possible combinations and union/intersect the data
    //Build the unique combination [expression] and filter the data
        if(allExpressionIndividualValues && allExpressionIndividualValues.length >0)
        {
          _.each(allExpressionIndividualValues, function(superObj) {
              output = filterFilter(output || array, superObj, customComparator);
              resultedArray = output;
              isResultedArrayExecuted = true;
              if(allExpressionIndividualValues.indexOf(superObj) + 1 == allExpressionIndividualValues.length) {
                  if(allExpressionConditionValues && allExpressionConditionValues.length >0){
                    getResultFromCombination();
              }else{
                isAllDone = true;
              }
            }
          });
        }else{
              if(allExpressionConditionValues && allExpressionConditionValues.length >0){
                getResultFromCombination();
              }else{
                output = filterFilter(array, expression, customComparator);
                finalResult = output;
                isAllDone = true;
              }
        }
      if(isAllDone){
          return ((typeof finalResult !== 'undefined' && (finalResult.length > 0 || isfinalResultConsider))?finalResult:resultedArray)
      }  
  };
}])

.filter('stripNonNumeric', function() {
  return function(input) {
    return input.replace(/\D/g,'');
  };
})
.filter('abs', function () {
  return function(val) {
    return Math.abs(val);
  }
})
.filter('capitalize', function() {
  return function(str) {
    return (!!str) ? str.charAt(0).toUpperCase() + str.substr(1).toLowerCase() : '';
  }
})
.filter('camelize', function() {
  return function(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }
})
.filter("print", [ function() {
  return function(str){
      console.log("ch.filters.debug.print", str);
      return str;
    }
  }
])
/***  Boolean Filters *****/
.filter('isTruthy', function() {
  return function(input, property, value) {
    var out = {};

    angular.forEach(input, function(obj, key) {
      if (obj[property]) {
        if(!value) {
          out[key] = obj;
        }
        else if(value && obj[property] == value) {
          out[key] = obj;
        }
     }
    });

    return out;
  }
})
.filter('isFalsey', function() {
  return function(input, property, value) {
    var out = {};

    angular.forEach(input, function(obj, key) {
      if (!obj[property] ) {
        if(!value) {
          out[key] = obj;
        }
        else if(value && obj[property] != value) {
          out[key] = obj;
        }
     }
    });

    return out;
  }
})
.filter("YesNo", [ function() {
  return function(b){
      return b === true ? 'Yes' : 'No';
    }
  }
])
.filter("OkAlert", [ function() {
  return function(b){
      return b === true? 'Ok' : 'Alert';
    }
  }
])
/***  String Filters *****/
.filter("format", [ function() {
  return function(str){
      if (!str || arguments.length <=1 ) return str;
      var args = arguments;
      for (var i = 1; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
      }
      return str;
    }
  }
]).filter("html2string", [ function() {
  return function(str){
      if (!str) return str;
      return $('<div/>').html(str).text();
    }
  }
]).filter("shorten", [ function() {
  return function(str,length){
      if (!str || !length || str.length <= length) return (str || '');
      return  str.substr(0, length) + (length <= 3 ? '' : '...');
    }
  }
]).filter("lowercase", [ function() {
  return function(str){
      return (str || '').toLowerCase();
    }
  }
]).filter("uppercase", [ function() {
  return function(str){
      return (str || '').toUpperCase();
    }
  }
]).filter("trim", [ function(){
 return function(str){
    return (str || '').replace(/(^\s*|\s*$)/g, function(match, group) {
        return '';
    });
  }
 }
]).filter("trimstart", [ function(){
 return function(str){
   return (str || '').replace(/(^\s*)/g, function(match, group) {
        return '';
    });
  }
 }
]).filter("trimend", [ function(){
 return function(str){
    return (str || '').replace(/(\s*$)/g, function(match, group) {
        return '';
    });
  }
 }
]).filter("replace", [ function(){
 return function(str, pattern, replacement, global){
    global = (typeof global == 'undefined' ? true : global);
    try {
	  str = str ? (typeof global == 'string' ? str : str.toString()) : '';
      return str.replace(new RegExp(pattern,global ? "g": ""),function(match, group) {
        return replacement;
      });
    } catch(e) {
      console.error("error in string.replace", e);
      return (str || '');
    }
  }
 }
]).filter("max", [ function(){
 return function(arr){
    if (!arr) return arr;
    return Math.max.apply(null, arr);
  }
 }
]).filter("min", [ function(){
 return function(arr){
    if (!arr) return arr;
    return Math.min.apply(null, arr);
  }
 }
]).filter("join", [ function(){
 return function(arr,seperator){
    if (!arr) return arr;
    return arr.join(seperator || ',');
  }
 }
]).filter("reverse", [ function(){
 return function(arr){
    if (!arr) return arr;
    return arr.reverse();
  }
 }
]).filter('htmlToPlaintext', function() {
  return function(text) {
    return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
  };
}).filter('padLeft', [ function(){
 return function(str, len, pad){
   return Array(len-(str || "").length+1).join( pad ||" ")+(str || "");
 }
 }]).filter('padRight', [ function(){
 return function(str, len, pad){
   return (str || "")+Array(len-(str || "").length+1).join( pad ||" ");
 }
 }]);
