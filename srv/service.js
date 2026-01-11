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

    
    this.before("CREATE", Customer, req => {
        debugger;
        const id = Date.now();
        req.data.customerId = `C0${id}`;
        
        if (!req.data.customerName) {
            req.error(400, "Name is required");
        }
        else {
            let patientName = req.data.customerName
            if (patientName.length > 5) {
                req.error(400, "Name length should be less than 6");
            }
        }

        if (!req.data.phoneNumber) {
            req.error(400, "phno is required");
        }
        else {
            let phno = req.data.phoneNumber
            if (phno.length!==10) {
                req.error(400, "phno should be exactly 10 digits");
            }

            if (!req.data.email) {
            req.error(400, "email is required");
                  }

             if (!req.data.address) {
            req.error(400, "address is required");
                 }

        }  
    });

   




   

});







   





  







