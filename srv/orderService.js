const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');


module.exports = cds.service.impl(function (srv) {

  console.log("Service name:-->", srv.name);
   


    const { Comments } = this.entities;

    //Insert in to Patient table
    this.on('addComment', async function (req) {
        debugger;
        console.log("req", req)
        const comment = {
       commentId: req.data.commentId,
                description: req.data.text,
                issueId:req.data.issueId,
    };
        const result = await INSERT.into(Comments).entries(comment);
        console.log(result);
        const inserted = result.results.changes;
        console.log(typeof inserted)

        return JSON.stringify(inserted);

    });


      const { Issues } = this.entities;
 this.before('CREATE', Issues.drafts, (req) => {
        debugger;
        
         const id = Date.now();
        req.data.issueId = `Is${id}`;
        

        console.log('draft Generated Issue id', req.data.issueId);
    });



    //draft comment
    this.on('commentsDraft', async function (req) {
        debugger;
        console.log("req", req)

        const { uuid } = cds.utils;
        const draftId = uuid();

         const result2 = await INSERT.into('DRAFT.DraftAdministrativeData').entries({
            DraftUUID: draftId,
            CreationDateTime: new Date().toISOString(),
            CreatedByUser: req.user.id,
            LastChangeDateTime: new Date().toISOString(),
            LastChangedByUser: req.user.id,
            InProcessByUser: req.user.id,
            DraftIsCreatedByMe: true,
            DraftIsProcessedByMe: true
        });

        const result = await INSERT.into(Comments.drafts).entries({
            description: req.data.description,
            issueId: req.data.issueId,
            

            
            DraftAdministrativeData_DraftUUID: draftId,

        });
        console.log(result);
        const draftResult = result.results.changes;

       

        console.log(result2);
        const draftAdminResult = result2.results.changes;

        return {
            "commentdraft": draftResult,
            "draftAdmin": draftAdminResult
        }

    });


    

});







   





  







