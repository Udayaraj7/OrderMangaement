using db from '../db/schema';

service ApproversService {
@odata.draft.enabled
  entity Approvers as projection on db.Approvers ;
 
}


