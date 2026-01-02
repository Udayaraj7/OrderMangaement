using ApproversService as service from '../../srv/approvers';
annotate service.Approvers with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'approverId',
                Value : approverId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'approverName',
                Value : approverName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'approverEmail',
                Value : approverEmail,
            },
            {
                $Type : 'UI.DataField',
                Label : 'approverLevel',
                Value : approverLevel,
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
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'approverId',
            Value : approverId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'approverName',
            Value : approverName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'approverEmail',
            Value : approverEmail,
        },
        {
            $Type : 'UI.DataField',
            Label : 'approverLevel',
            Value : approverLevel,
        },
    ],
);

