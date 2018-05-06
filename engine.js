var SourceObject;

function sortByProp (rules, sortProp, orderBy){        
    return rules.sort(function(a, b) {
    var x = a[sortProp]; var y = b[sortProp];
        if(orderBy == 'asc')
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}


function isStatusActive (rule) {
    return rule.status.toLowerCase() == "active";
}

var run = function (sourceObj, customRules) {   
    SourceObject =  sourceObj;       
    var resultAction = customRules.defaultAction,
    sortProp = 'priority',
    activeRules = customRules.rulesList.filter(isStatusActive);
    const sortedRules = sortByProp(activeRules, sortProp);
    
    sortedRules.some((element, index) => {
       if(ProcessRule(element.conditionJson))
       {
             resultAction = element.actionJson.action;
             return true; //break 'some' if true is found
       }
       return false;
    })
    return resultAction; 
};

function ProcessRule (Conditions){
    var ruleResult, ruleConditions;

    if(Conditions.all)
    {
        ruleConditions = Conditions.all;
        ruleResult = ProcessAllCondition(ruleConditions);
    }
    else if(Conditions.any)
    {
        ruleConditions = Conditions.any;
        ruleResult = ProcessAnyCondition(ruleConditions);
    }
    else
        return false;

    return ruleResult;
}

function ProcessAllCondition(Conditions) {
        
    var ruleConditions = Conditions,
    allOfResult = null;
    
    for(var i = 0; i< ruleConditions.length; i++)
    {
        var Condition = ruleConditions[i];
        //if its nested 
        if(Condition.all){
            allOfResult = ProcessAllCondition(Condition.all);
        }
        else if(Condition.any){
            allOfResult = ProcessAnyCondition(Condition.any)
        }

        else
        {
            if(allOfResult ==  null)  //for 1st time execution
                allOfResult = ProcessCondition(ruleConditions[i])
            else
                allOfResult = allOfResult && ProcessCondition(ruleConditions[i])  //for 1st time execution
          
            if(allOfResult === false)
            {
                return false;
            }
        }
    
    }
     return allOfResult;
};

function ProcessAnyCondition(Conditions){

    var ruleConditions = Conditions,
    anyOfResult = null;

    for(var i = 0; i< ruleConditions.length; i++)
    {
        var Condition = ruleConditions[i];
        //if its nested 
        if(Condition.all){
            anyOfResult = ProcessAllCondition(Condition.all);
        }
        else if(Condition.any){
            anyOfResult = ProcessAnyCondition(Condition.any)
        }

        else
        {
            if(anyOfResult ==  null) //for 1st time execution
                anyOfResult = ProcessCondition(ruleConditions[i])
            else //subsequent exections
                anyOfResult = anyOfResult || ProcessCondition(ruleConditions[i])

            if(anyOfResult === true)
            {
                return true;
            }
        }
    
    }
     return anyOfResult;

};



function ProcessCondition(condition) {
    
    var factName = (condition.fact ||  condition.field);
        factType = (condition.dataType || typeof (condition.value));
    var factValueFromSource = getFactValueFromSource(factName),
        result;
    
    if(factValueFromSource  ==  null)
        return false;

    Array.isArray(factValueFromSource) || (factValueFromSource = [factValueFromSource]);

    for(let i=0 ;i < factValueFromSource.length; i++)
    {
        
        switch (factType.toLowerCase()) {
            case 'string':
                result = ProcessStringOperation(condition.value, factValueFromSource[i], condition.operator)
                break;
            case 'number' :
                result = ProcessNumberOperation(parseInt(condition.value), parseInt(factValueFromSource[i]), condition.operator)
                break;
            default:
                logError('Unsupported Data-Type found :' + factType.toString());
                break;
        }

        if(result)
            return true;
    }

    return result;

}

function logError (message) {
    console.log('\x1b[31m', message, 'Stopping the Execution of Engine');
    throw new Crash_Engine();

}
function Crash_Engine()
{
     Error.apply(this, arguments);
     this.name = "Engine_Crash"; 
}

Crash_Engine.prototype = Object.create(Error.prototype);


function getFactValueFromSource(factName) {
    var factNameSplit = factName.split('.');    
    var factObjFromSource = SourceObject[factNameSplit[0]];

        for(var i = 1; i< factNameSplit.length; i++)
        {
            factObjFromSource = factObjFromSource[factNameSplit[i]];

            if(factObjFromSource === undefined)
            {
                return null;
            }
        }

    return factObjFromSource || null;       
}

function ProcessStringOperation(source, target, operationType) {

    switch (operationType.toLowerCase()) {

        case 'equal':
                return source.toLowerCase() === target.toLowerCase();
            break;
        case 'notequal' :
            return source.toLowerCase() !== target.toLowerCase();
            break;
        case 'contains' :
             return target.toLowerCase().indexOf(source.toLowerCase()) > -1
            break;
        default:
             logError('Invalid Operation for Data-Type : String found. Invalid operation name :' + operationType.toString());
            return false;
            break;
    }
    
}

function ProcessNumberOperation(source, target, operationType) {
    
        switch (operationType.toLowerCase()) {
            case 'equal':
                    return source.valueOf() === target.valueOf();
                break;
            case 'notequal' :
                return source.valueOf() !== target.valueOf();
                break;
            case 'greaterthan' :
                 return target.valueOf() > source.valueOf()
                break;
            case 'lessthan' :
                return target.valueOf() < source.valueOf()
            break;
            default:
                logError('Invalid Operation for Data-Type : Number found. Invalid operation name :' + operationType.toString());
                return false;
                break;
        }

        
}
exports.RunEngine = run;