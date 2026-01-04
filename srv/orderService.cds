using db from '../db/schema';

service OrderIssueService {

  @odata.draft.enabled
    entity Orders as projection on db.Orders ;
  entity Issues as projection on db.Issues ;
  entity Comments as projection on db.Comments;
  entity Attachments as projection on db.Attachments;
   entity Approvers as projection on db.Approvers ;
   entity ApprovalHistory as projection on db.ApprovalHistory ;
   
  entity IssueTypes as projection on db.IssueTypes;
  entity RequestTypes as projection on db.RequestTypes;

 

  
  function addComment(commentId:String,issueId:String,text:String)
        returns String;

 function commentsDraft(issueId:String,description:String)
        returns String;


        function  triggerBpaProcess(issueId:String,orderId:String)
        returns String;


       
        
}


annotate OrderIssueService.Orders with
  @Capabilities.InsertRestrictions: {
    Insertable: false
  };
  

  annotate OrderIssueService.Orders with
  @Capabilities.DeleteRestrictions: {
    Deletable: false
  };

 




