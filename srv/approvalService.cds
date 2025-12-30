using db from '../db/schema';

service ApprovalService {
  entity Issues as projection on db.Issues ;
  entity Comments as projection on db.Comments;
  entity Attachments as projection on db.Attachments;

   function  waitforApproval(processId:String,status:String)
        returns String;
}


