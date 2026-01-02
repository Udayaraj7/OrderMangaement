const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');
const axios=require('axios')


module.exports = cds.service.impl(function (srv) {
      console.log("Service name:-->", srv.name);

      const {Approvers} = this.entities;


      this.on('waitforApproval', async function (req) {
              debugger
              try {
                  console.log("process trigger");
                  var client = 'sb-951593b7-8581-4dd7-92c3-5d3365b85829!b556490|xsuaa!b49390';
                  var secret = '9103527d-a7bd-43c1-8109-1a9a1d47b821$OqiNr-QeAWXjd-aPHHqPug8GK11Ub8QxIS-fPIBZhUM=';
                  var auth1 = Buffer.from(client + ':' + secret, 'utf-8').toString('base64');
                  var response1 = await axios.request('https://17d1f7fatrial.authentication.us10.hana.ondemand.com/oauth/token?grant_type=client_credentials', {
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

                                 let currentlevel =currentResponse.data.custom.currentlevel;
                                 currentlevel=Math.floor(currentlevel);

                                 let approversAtLevel = await SELECT.from('Approvers')
  .columns('approverName', 'approverEmail')  
  .where({ approverLevel: currentlevel });

console.log(approversAtLevel);
approversAtLevel=approversAtLevel[0];




                  var body = JSON.parse(JSON.stringify({
                    "executionId": req.data.processId,
                    "inputs": {
                        "approvalstatus": req.data.status,
                        "currentapprovallevel":currentlevel,
                        "approvername":approversAtLevel.approverName,
                        "approveremail":approversAtLevel.approverEmail
                    }
                    }));
                  console.log(body);
                  var response11 = await axios.post(`https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/unified/v1/triggers/api/us10.17d1f7fatrial.approvalprocess.l2`, body,
                      {
                          headers: {
                              'Authorization': 'Bearer ' + response1.data.access_token,
                              'irpa-api-key':"20FB-VNsEJ_zWRHrAiHI8VBervxQ2Lt-"
                          }
                      });

                      console.log("final response",response11)
      
                  
       
              } catch (error) {
                  console.log(error)
              }
        
          });
      

      });