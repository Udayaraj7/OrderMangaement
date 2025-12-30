using ApprovalService as service from '../../srv/approvalService';
annotate service.Issues with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : issueId,
            },
            {
                $Type : 'UI.DataField',
                Value : orderId,
            },
            {
                $Type : 'UI.DataField',
                Value : issueStatus,
            },
            {
                $Type : 'UI.DataField',
                Value : issueType_code,
            },
            {
                $Type : 'UI.DataField',
                Value : requestType_code,
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
            Label : 'User Comments',
            ID : 'UserComments',
            Target : 'IssuesToComments/@UI.LineItem#UserComments',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'User Attachments',
            ID : 'UserAttachments',
            Target : 'IssuesToAttachments/@UI.LineItem#UserAttachments1',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : orderId,
        },
        {
            $Type : 'UI.DataField',
            Value : issueId,
        },
        {
            $Type : 'UI.DataField',
            Value : issueStatus,
        },
        {
            $Type : 'UI.DataField',
            Value : issueType_code,
        },
        {
            $Type : 'UI.DataField',
            Value : requestType_code,
        },
    ],
);

annotate service.Comments with @(
    UI.LineItem #UserComments : [
        {
            $Type : 'UI.DataField',
            Value : issueId,
            Label : 'Issue Id',
        },
        {
            $Type : 'UI.DataField',
            Value : description,
            Label : 'Comment',
        },
        {
            $Type : 'UI.DataField',
            Value : createdAt,
        },
    ]
);

annotate service.Attachments with @(
    UI.LineItem #UserAttachments : [
        {
            $Type : 'UI.DataField',
            Value : issueId,
            Label : 'issueId',
        },
        {
            $Type : 'UI.DataField',
            Value : mediaType,
            Label : 'mediaType',
        },
        {
            $Type : 'UI.DataField',
            Value : size,
            Label : 'size',
        },
        {
            $Type : 'UI.DataField',
            Value : url,
            Label : 'url',
        },
    ],
    UI.LineItem #UserAttachments1 : [
            {
        $Type : 'UI.DataFieldWithUrl',
        Label : 'File Name',          
        Value : fileName,             
        Url   : content,  
        @HTML5.CssDefaults : { width: '15rem' } ,                
    },
        {
            $Type : 'UI.DataField',
            Value : issueId,
            Label : 'Issue Id',
             @HTML5.CssDefaults : { width: '10rem' }  ,
        },
        {
            $Type : 'UI.DataField',
            Value : size,
            Label : 'size',
             @HTML5.CssDefaults : { width: '10rem' }
        },
        {
            $Type : 'UI.DataField',
            Value : mediaType,
            Label : 'Media Type',
        },
        {
            $Type : 'UI.DataField',
            Value : createdAt,
        },
    ],
    UI.SelectionPresentationVariant #UserAttachments1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#UserAttachments1',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
    },
);

