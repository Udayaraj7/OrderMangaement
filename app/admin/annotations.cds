using myservice as service from '../../srv/service';
annotate service.Customer with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Customer Id',
                Value : customerId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Customer Name',
                Value : customerName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Email',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Phone Number',
                Value : phoneNumber,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Address',
                Value : address,
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
            Label : 'Orders',
            ID : 'Orders',
            Target : 'CustomerToOrders/@UI.LineItem#Orders',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Customer Id',
            Value : customerId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Customer Name',
            Value : customerName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Email',
            Value : email,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Phone Number',
            Value : phoneNumber,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Address',
            Value : address,
        },
    ],
);

annotate service.Orders with @(
    UI.LineItem #Orders : [
        {
            $Type : 'UI.DataField',
            Value : customerId,
            Label : 'Customer Id',
        },
        {
            $Type : 'UI.DataField',
            Value : orderId,
            Label : 'Order Id',
        },
        {
            $Type : 'UI.DataField',
            Value : totalAmount,
            Label : 'Total Amount',
        },
        {
            $Type : 'UI.DataField',
            Value : Status,
            Label : 'Status',
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
                Value : createdAt,
            },
            {
                $Type : 'UI.DataField',
                Value : createdBy,
            },
            {
                $Type : 'UI.DataField',
                Value : customerId,
                Label : 'Customer Id',
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedAt,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedBy,
            },
            {
                $Type : 'UI.DataField',
                Value : orderId,
                Label : 'Order Id',
            },
            {
                $Type : 'UI.DataField',
                Value : totalAmount,
                Label : 'Total Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : Status,
                Label : 'Status',
            },
        ],
    },
    UI.SelectionPresentationVariant #Orders : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#Orders',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
    },
);

annotate service.Issues with @(
    UI.LineItem #Issues : [
        {
            $Type : 'UI.DataField',
            Value : approvercommentBox,
            Label : 'approvercommentBox',
        },
        {
            $Type : 'UI.DataField',
            Value : issueId,
            Label : 'issueId',
        },
        {
            $Type : 'UI.DataField',
            Value : issueStatus,
            Label : 'issueStatus',
        },
        {
            $Type : 'UI.DataField',
            Value : issueType,
            Label : 'issueType',
        },
        {
            $Type : 'UI.DataField',
            Value : requestType,
            Label : 'requestType',
        },
        {
            $Type : 'UI.DataField',
            Value : orderId,
            Label : 'orderId',
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
            Value : createdBy,
        },
        {
            $Type : 'UI.DataField',
            Value : createdAt,
        },
    ]
);

annotate service.Orders with {
    totalAmount @Common.FieldControl : #Mandatory
};

