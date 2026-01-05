

const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');
const axios = require('axios')



module.exports = cds.service.impl(function (srv) {

    console.log("Service name:-->", srv.name);



    const { Comments, Approvers } = this.entities;

    //Insert in to Patient table
    this.on('addComment', async function (req) {
        debugger;
        console.log("req", req)
        const comment = {
            commentId: req.data.commentId,
            description: req.data.text,
            issueId: req.data.issueId,
        };
        const result = await INSERT.into(Comments).entries(comment);
        console.log(result);
        const inserted = result.results.changes;
        console.log(typeof inserted)

        return JSON.stringify(inserted);

    });


    const { Issues,ApprovalHistory } = this.entities;
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
            commentBy: 'User',




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

    //validation
    this.before('commentsDraft', req => {
        debugger;
        console.log("---comment-----")
        if (!req.data.description) {
            req.reject(400, "Comment cannot be EMPTY");
        }
    });







    this.on('triggerBpaProcess', async function (req) {
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


            //const totalApprovers = (await SELECT.from(Approvers).columns('count(*) as total'))[0].total;
            const maxLevel = (await SELECT.from(Approvers).columns('max(approverLevel) as maxLevel'))[0]?.maxLevel ?? 0;

            const approvers = await SELECT.from(Approvers);

            var body = JSON.parse(JSON.stringify(
        {
    "definitionId": "us10.17d1f7fatrial.approvalprocess.issueApproval",
    "context": {
        "issuid":req.data.issueId,
        "levels": maxLevel,
        "level": 1,
        "approverslist":approvers,
        "orderId": req.data.orderId
    }
}));
            console.log(body);
            var response11 = await axios.post(`https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances`, body,
                {
                    headers: {
                        'Authorization': 'Bearer ' + response1.data.access_token,
                    }
                });

            let instanceId = response11.data.id;
            let issueid = req.data.issueId;
            let orderid = req.data.orderId;
            console.log("instance id", instanceId);

            await UPDATE(Issues)
                .set({ processInstanceId: instanceId })
                .where({ issueId: issueid });

            await UPDATE(Issues.drafts)
                .set({ processInstanceId: instanceId })
                .where({ issueId: issueid });


            //process history

            const level = 1;

            const levelApprovers = await SELECT
                .from('Approvers')
                .columns('approverName', 'approverEmail')
                .where({ approverLevel: level });

            const historyEntries = levelApprovers.map(a => ({
                orderId: orderid,
                issueId: issueid,
                processInstanceId: instanceId,
                level: level,
                approverName: a.approverName,
                approverEmail: a.approverEmail,
                status: "Pending"
            }));

            await INSERT.into(ApprovalHistory).entries(historyEntries);








        } catch (error) {
            console.log(error)
        }

    });







});





















