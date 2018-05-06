var SourceObject, EngineOps, Utils;

var run = function (sourceObj, customRules) {   
    SourceObject =  sourceObj;       
    var resultAction = customRules.defaultAction, sortProp = 'priority',
    activeRules = customRules.rulesList.filter(Utils.isStatusActive),
    sortedRules = Utils.sortByProp(activeRules, sortProp);
    
    sortedRules.every((rule, index) => {
       let condType = rule.conditionJson.all ? 'all' : 'any';
       if(ProcessConditions(rule.conditionJson[condType], condType))
       {
             resultAction = rule.actionJson.action;
             return false; //to break every
       }
    })
    return resultAction; 
};

function ProcessConditions(conditions, conditionType) {
    var ruleConditions = conditions, result = null;  

    ruleConditions.every((condition) => {
        result = condition.all ? ProcessConditions(condition.all, 'all') : //check if 'all' is encountered
                 condition.any ? ProcessConditions(condition.any, 'any') : //check if 'any' is encountered
                 result == null ? ProcessCondition(condition) : //if we come here it means we have encoutered a condition for the first time in independed logic block
                 conditionType == 'all'? result && ProcessCondition(condition) : //if we come here it means, first evaluation is done, now apply 'and' 'or' logic with further evals  
                 result || ProcessCondition(condition);

       if(conditionType == 'all' && result === false) //AND GATE LOGIC
            return false; //all is false no need to evaluate further 'all' conditions, so breaking every
       if(conditionType == 'any' && result === true) //OR GATE LOGIC
            return false; //any is true no need to evaluate further 'any' conditions, so breaking every
    });

     return result;
}

function ProcessCondition(condition) {
    
    var result, factName = (condition.fact ||  condition.field);
        factType = (condition.dataType || typeof (condition.value)),
        srcFactVals = getFactValsFromSource(factName);    
    if(srcFactVals  ==  null)  return false; //return if no value found in source

    Array.isArray(srcFactVals) || (srcFactVals = [srcFactVals]); //convert src val to array if its not
    srcFactVals.every((factVal) => {
       result = Utils.getOperationFn(factType, condition.operator)(condition.value, factVal)
       if(result)
        return false; //we found the value, now get out of every fn
    });
    return result;
}

function getFactValsFromSource(factName) {
    var factVals = factName.split('.');
    var srcFactVal = SourceObject[factVals[0]];
    if(srcFactVal && factVals.length > 1)
    {
        factVals.shift();
        factVals.every((name) => {
             srcFactVal = srcFactVal[name];
             if(srcFactVal === undefined)
                return false;
        })
    }
    return srcFactVal || null;       
}

(function init() {
    EngineOps = {}, Utils = {};
    EngineOps.STRING_OPS = 
    {
        'equal' : (source, target) =>  source.toLowerCase() === target.toLowerCase(),
        'notequal' : (source, target) =>  source.toLowerCase() !== target.toLowerCase(),
        'contains' : (source, target) => target.toLowerCase().indexOf(source.toLowerCase()) > -1
    };

    EngineOps.NUMBER_OPS = 
    {
        'equal' : (source, target) =>  source.valueOf() === target.valueOf(),
        'notequal' : (source, target) => source.valueOf() !== target.valueOf(),
        'greaterthan' : (source, target) => target.valueOf() > source.valueOf(),
        'lessthan' : (source, target) => target.valueOf() > source.valueOf()
    };

    Utils.sortByProp = (list, sortProp, orderBy) => {        
        return list.sort(function(a, b) {
        var x = a[sortProp]; var y = b[sortProp];
            if(orderBy == 'asc')
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
    Utils.isStatusActive = (rule) => rule.status.toLowerCase() == "active";  
    Utils.getOperationFn = (dataType, operationType) => EngineOps[dataType.toUpperCase() + '_OPS'] [operationType];
})()

exports.RunEngine = run;