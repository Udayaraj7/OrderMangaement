namespace db;

using { cuid,managed} from '@sap/cds/common';



entity Customer {
    @title : 'customerId'
    @readonly
    key customerId : String;
    customerNo     : Integer;
    customerName : String;
    email : String;
    phoneNumber : String(10) @assert.format: '^[0-9]{10}$';
    address : String;
    CustomerToOrders : Composition of many Orders on CustomerToOrders.OrdersToCustomer = $self;
}

entity Orders : managed {
    @title : 'OrderId'
    @readonly
    key orderId : String ;
    @readonly
   key  customerId : String ;
    totalAmount : Integer;
    Status :  String default 'Pending';

    OrdersToCustomer : Association to one Customer
        on OrdersToCustomer.customerId = customerId;

    OrdersToIssues : Composition of many Issues
        on OrdersToIssues.IssuesToOrders = $self;

        OrdersToApprovalHistory:Composition of  many ApprovalHistory on OrdersToApprovalHistory.ApprovalHistoryToOrders=$self;
}


entity IssueTypes {
  key code : String(30);
  text     : String(100);   
}


entity RequestTypes {
  key code : String(30);
  text     : String(100);  
}

entity Issues : managed {

    @title : 'Issue ID'
    @readonly
    key issueId : String;


    @title : 'Order ID' 
    @readonly
    key orderId : String;

    @title : 'Issue Type'
    issueType   : Association to IssueTypes;

    @title : 'Request Type'
    requestType : Association to RequestTypes; 

    @title : 'Issue Status'
    issueStatus :  String default 'Pending';


    processInstanceId:String;

    
    IssuesToOrders : Association to one Orders
        on IssuesToOrders.orderId = orderId;

    IssuesToComments : Composition of many Comments
        on IssuesToComments.CommentsToIssues = $self;

    
    IssuesToAttachments : Composition of many Attachments
        on IssuesToAttachments.AttachmentsToIssues = $self;

        IssuesToApprovalHistory : Composition of many ApprovalHistory
        on IssuesToApprovalHistory.ApprovalHistoryToIssues = $self;
}


entity Comments : cuid,managed {
     
    description : String;
    issueId : String;
    commentBy:String;

    CommentsToIssues : Association to one Issues on CommentsToIssues.issueId = issueId;
}

entity Attachments :cuid, managed {
     
 issueId : String;

    @Core.MediaType : mediaType
    content : LargeBinary;

    @Core.IsMediaType : true
    mediaType : String;

    fileName : String;
    size : Integer;
    url : String;

    AttachmentsToIssues : Association to one Issues on AttachmentsToIssues.issueId = issueId;
}


entity Approvers{
    @readonly
    key approverId:String;
    approverName:String;
    approverEmail:String;
    approverLevel:Integer;   
}

entity ApprovalHistory:cuid {
    key issueId : String;
    key orderId:String;
    processInstanceId: String;
    level            : Integer;
    approverName        : String ;
    approverEmail       : String ;
    status           : String ;
    startedOn       : DateTime;
    completedOn:DateTime;
    timeTaken:String;

     ApprovalHistoryToIssues : Association to one Issues on ApprovalHistoryToIssues.issueId = issueId;
     ApprovalHistoryToOrders : Association to one Orders on ApprovalHistoryToOrders.orderId = orderId;
   
}
