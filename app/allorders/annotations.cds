using OrderIssueService as service from '../../srv/orderService';
annotate service.Orders with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : orderId,
                Label : 'Order Id',
            },
            {
                $Type : 'UI.DataField',
                Label : 'Customer Id',
                Value : customerId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Total Amount',
                Value : totalAmount,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Issues',
            ID : 'Issues',
            Target : 'OrdersToIssues/@UI.LineItem#Issues',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : orderId,
            Label : 'Order Id',
        },
        {
            $Type : 'UI.DataField',
            Label : 'Customer Id',
            Value : customerId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Total Amount',
            Value : totalAmount,
        },
    ],
);

annotate service.Issues with @(
    UI.LineItem #Issues : [
        {
            $Type : 'UI.DataField',
            Value : issueId,
            Label : 'Issue Id',
        },
        {
            $Type : 'UI.DataField',
            Value : issueStatus,
            Label : 'Issue Status',
        },
        {
            $Type : 'UI.DataField',
            Value : orderId,
            Label : 'Order Id',
        },
        {
            $Type : 'UI.DataField',
            Value : issueType_code,
            Label : 'Issue Type',
            @UI.Importance : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : requestType_code,
            Label : 'Request Type',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            ID : 'GeneralInformation',
            Target : '@UI.FieldGroup#GeneralInformation',
        },
    ],
    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : requestType_code,
            },
            {
                $Type : 'UI.DataField',
                Value : orderId,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedBy,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedAt,
            },
            {
                $Type : 'UI.DataField',
                Value : issueType_code,
            },
            {
                $Type : 'UI.DataField',
                Value : issueStatus,
            },
            {
                $Type : 'UI.DataField',
                Value : issueId,
            },
            {
                $Type : 'UI.DataField',
                Value : createdBy,
            },
            {
                $Type : 'UI.DataField',
                Value : createdAt,
            },
        ],
    },
);

annotate service.Issues with {
    requestType @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'RequestTypes',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : requestType_code,
                    ValueListProperty : 'code',
                },
            ],
            Label : 'requestType',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.Issues with {
    issueType @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'IssueTypes',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : issueType_code,
                    ValueListProperty : 'code',
                },
            ],
            Label : 'issueType',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.Orders with {
    orderId @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    customerId @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    totalAmount @Common.FieldControl : #ReadOnly
};

