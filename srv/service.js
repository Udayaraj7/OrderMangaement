const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');


module.exports = cds.service.impl(function (srv) {

  
   const { Customer,Orders } = this.entities;
 this.before('CREATE', Customer.drafts, (req) => {
        debugger;
        
         const id = Date.now();
        req.data.customerId = `C0${id}`;
        

        console.log('draft Generated customer is:', req.data.customerId);
    });

     this.before('CREATE', Orders.drafts, (req) => {
        debugger;
        
         const id = Date.now();
        req.data.orderId = `Odr${id}`;
        

        console.log('draft Generated customer is:', req.data.orderId);
    });



   

});







   





  







