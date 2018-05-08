const Engine =  require('../engine');

console.log(Engine.RunEngine({
    "subject" : {
        "role" : [ 
            "Florist",
            "Partner"
        ]
    },
    "resource" : {
        "siteIds" : [ 
            "FTD", 
            "PRO", 
            "IF"
        ]
    },
    "integer" : 12,
    'querys' : ['emp', 'emp2']
},
{
    "defaultAction" : "NO_ACCESS",
    rulesList: [{
                    "conditionJson": {
                                    "all": [{
                                                    "field": "subject.role",
                                                    "value": "Florist",
                                                    "operator": "equal",
                                                    "dataType": "string"
                                    },
                                    {
                                                    "all": [{
                                                                    "any": [{
                                                                                    "field": "resource.siteIds",
                                                                                    "value": "PRaO",
                                                                                    "operator": "equal",
                                                                                    "dataType": "string"
                                                                    }
                                                                    ,{
                                                                        "field": "resource.siteIds",
                                                                        "value": "FTDa",
                                                                        "operator": "equal",
                                                                        "dataType": "string"
                                                                    },
                                                                    {
                                                                        "field": "integer",
                                                                        "value": 13,
                                                                        "operator": "greaterthan",
                                                                        "dataType": "number"
                                                                    },
                                                                    {
                                                                        "field": "integer",
                                                                        "value": 1,
                                                                        "operator": "lessthan",
                                                                        "dataType": "number"
                                                                    },
                                                                    {
                                                                        "field": "resource.siteIds",
                                                                        "value": "FT",
                                                                        "operator": "contains",
                                                                        "dataType": "string"
                                                                    }
                                                                ]
                                                    },
                                                    {
                                                        "field": "subject.role",
                                                        "value": "Partner",
                                                        "operator": "equal",
                                                        "dataType": "string"
                                                    }]
                                    }]
                    },
                    "actionJson": {
                                    "action": 2.99
                    },
                    "priority": 90,
                    "ruleId": 12,
                    "status" : "active"
    }]
}
));
