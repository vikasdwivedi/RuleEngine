# RuleEngine
A Rule Engine written in Javascript. 

There are two rule engines in the repository :

1. Higly optimized version of rule engine named : engine.js
2. Slow but readable version of rule engine named, this version can be easily extended : engine_read.js

# Operations Details :

Engine has two parts :

<b>1. Grouping of conditions</b> : This way you can club multiple conditions for logical evaluations. Engine supports two types of grouping using 'anyOf' and 'allOf' property. Eg.
    
        [Array]anyOf : [{Condition 1, Condition 2, Condition 3}]
        This is evaluated as true when atleast one condtion is met. 

        [Array]allOf : [{Condition 1, Condition 2, Condition 3}], 
        This is evaluated as true only if all condtions are met successfully.


<b>2. Evaluation of Conditions</b>: Engine evaluates conditions individually. Currently engine supports only string and number based operations. This can be easily extended to other datatypes as well. 

    String Operations Supported : equal, notequal, contains

    Number Operations Supported : equal, notequal, greaterthan, lessthan

A typical condition structure looks like this : 


       {
            "field": "Type.Skills",
            "value": "Distribution",
            "operator": "contains",                                                                                    
            "dataType": "string"                                    
        }

        

# Inputs : 

1. Source Object on which engine is supposed to run.
2. Rulesets defining the set of rules which engine is supposed to run against Source object.

# Output :

It outputs the action of the matching rule from the ruleset.

See test1.js in test folder for a sample run.

