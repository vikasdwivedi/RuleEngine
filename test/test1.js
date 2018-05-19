const Engine =  require('../engine');

console.log(Engine.RunEngine({
    "TenderDetails" : {
        "Organizations" : [ 
            "Simple Corp.",
            "Radiance Companies",
            "Orange Labs"
        ]
    },
    "Type" : {
        "Skills" : [ 
            "Hardware Manufacturing", 
            "Distribution",
            "Vendor Management"
        ]
    },
    "EmployeeCount":300,
},
{
    "defaultAction" : "No Tender Given",
    rulesList: [{
                    "conditionJson": {
                                    "all": [{
                                                    "field": "TenderDetails.Organizations",
                                                    "value": "Orange Labs",
                                                    "operator": "equal",
                                                    "dataType": "string"
                                    },
                                    {
                                                    "all": [{
                                                                    "any": [{
                                                                                    "field": "Type.Skills",
                                                                                    "value": "Distribution",
                                                                                    "operator": "contains",
                                                                                    "dataType": "string"
                                                                    }
                                                                    ,{
                                                                        "field": "Type.Skills",
                                                                        "value": "Central Operation",
                                                                        "operator": "equal",
                                                                        "dataType": "string"
                                                                    }
                                                                ]
                                                    },
                                                    {
                                                        "field": "EmployeeCount",
                                                        "value": 150,
                                                        "operator": "lessthan",
                                                        "dataType": "Number"
                                                    }]
                                    }]
                    },
                    "actionJson": {
                                    "action": "Tender Passed. Orange Labs"
                    },
                    "priority": 2,
                    "ruleId": 1,
                    "status" : "active"
    },
    {
        "conditionJson": {
                        "all": [{
                                        "field": "TenderDetails.Organizations",
                                        "value": "Simple Corp.",
                                        "operator": "equal",
                                        "dataType": "string"
                        },
                        {
                                        "all": [{
                                                        "any": [{
                                                                        "field": "Type.Skills",
                                                                        "value": "Distribution",
                                                                        "operator": "contains",
                                                                        "dataType": "string"
                                                        }
                                                        ,{
                                                            "field": "Type.Skills",
                                                            "value": "Central Operation",
                                                            "operator": "equal",
                                                            "dataType": "string"
                                                        }
                                                    ]
                                        },
                                        {
                                            "field": "EmployeeCount",
                                            "value": 100,
                                            "operator": "greaterthan",
                                            "dataType": "Number"
                                        }]
                        }]
        },
        "actionJson": {
                        "action": "Tender Passed. Simple Corp."
        },
        "priority": 1,
        "ruleId": 2,
        "status" : "active"
}]
}
));
