using db from '../db/schema';

service myservice {
    @odata.draft.enabled
    entity Customer  as projection on db.Customer;
    entity Orders    as projection on db.Orders where Status='Pending';
}
