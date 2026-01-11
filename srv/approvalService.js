const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');
const axios = require('axios')

//to calculate days
  function getDayDiff(dateTime1, dateTime2) {
    debugger;
    const d1 = new Date(dateTime1);
    const d2 = new Date(dateTime2);

    
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    const diffDays = Math.abs((d2 - d1) / (1000 * 60 * 60 * 24));

    
    return diffDays === 0 ? '1 Day' : diffDays+1+' Days';
}


module.exports = cds.service.impl(function (srv) {
    console.log("Service name:-->", srv.name);

    const { Approvers, ApprovalHistory ,Issues} = this.entities;


    this.on('waitforApproval', async function (req) {
        debugger
        try {
            console.log("process trigger");
            var client = 'sb-b2ea7fb0-c226-4102-9236-5ab259e61df0!b577464|xsuaa!b49390';
                       var secret = 'c646891e-7b5f-4cac-b1bb-47aaff6bc4f4$eQfCsLlp7xlRirz0OckLmYTnW7M-Yh0HxhEhgtb7HiA=';
                       var auth1 = Buffer.from(client + ':' + secret, 'utf-8').toString('base64');
                       var response1 = await axios.request('https://5b792c81trial.authentication.us10.hana.ondemand.com/oauth/token?grant_type=client_credentials', {
                           method: 'POST',
                           headers: {
                               'Authorization': 'Basic ' + auth1
                           }
                       });
                       console.log(response1);


            var currentResponse = await axios.get(`https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances/${req.data.processId}/context`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + response1.data.access_token,
                    }
                });
            console.log(currentResponse)

            let currentlevel = currentResponse.data.custom.currentlevel;
            currentlevel = Math.floor(currentlevel);

            let totalapproversAtlevel = await SELECT.from('Approvers')
                .columns('approverName', 'approverEmail')
                .where({ approverLevel: currentlevel });

            console.log("--****", totalapproversAtlevel);
            let approversAtLevel = totalapproversAtlevel[0];




            var body = JSON.parse(JSON.stringify({
                "executionId": req.data.processId,
                "inputs": {
                    "approvalstatus": req.data.status,
                    "currentapprovallevel": currentlevel,
                    "approvername": approversAtLevel.approverName,
                    "approveremail": approversAtLevel.approverEmail
                }
            }));
            console.log(body);
            var response11 = await axios.post(`https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/unified/v1/triggers/api/us10.17d1f7fatrial.approvalprocess.l2`, body,
                {
                    headers: {
                        'Authorization': 'Bearer ' + response1.data.access_token,
                        'irpa-api-key': "vhOORGYjuYkMeUobrvoW7sxlqkaVSUoX"
                    }
                });

            console.log("final response", response11)

            await new Promise(resolve => setTimeout(resolve, 3000));



            var approveResponse = await axios.get(`https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances/${req.data.processId}/context`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + response1.data.access_token,
                    }
                });
            console.log("-------------------", approveResponse.data.custom)
            let custom = approveResponse.data.custom;

            //update 
            await UPDATE(ApprovalHistory)
                .set({
                    status: custom.status,
                    startedOn: custom.startedoncopy,
                    completedOn: custom.timetaken,
                    timeTaken:getDayDiff(custom.startedoncopy,custom.timetaken)
                })
                .where({
                    level: custom.clevel,
                    processInstanceId: custom.processid
                });

            if (custom.status !== "Approved" && custom.clevel < approveResponse.data.startEvent.levels) {
                
                let nextlevel=custom.clevel+1;
                for(let i=nextlevel ;i<=approveResponse.data.startEvent.levels;i++)
                {
                     await UPDATE(ApprovalHistory)
                .set({
                    status: custom.status,
                    startedOn: custom.startedoncopy,
                    completedOn: custom.timetaken,
                    timeTaken:getDayDiff(custom.startedoncopy,custom.timetaken)
                })
                .where({
                    level: i,
                    processInstanceId: custom.processid
                });
                }  
            }

          
        //setting process id null
            if (custom.workflowcompleted==="Completed") {

                await UPDATE(Issues)
                    .set({ processInstanceId: null })
                    .where({ issueId: approveResponse.data.startEvent.issuid });

            }



        } catch (error) {
            console.log(error)
        }

    });
  



});