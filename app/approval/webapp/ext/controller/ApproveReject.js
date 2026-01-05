sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(MessageToast,MessageBox) {
    'use strict';

    return {
        /**
         * Generated event handler.
         *
         * @param oContext the context of the page on which the event was fired. `undefined` for list report page.
         * @param aSelectedContexts the selected contexts of the table rows.
         */
         onApprovePress: async function (oEvent) {
            debugger
           

            const sIssueId = sap.ui.core.Element.getElementById("approval::IssuesObjectPage--fe::FormContainer::GeneratedFacet1::FormElement::DataField::issueId::Field-display").getText();
            const sorderId = sap.ui.core.Element.getElementById("approval::IssuesObjectPage--fe::FormContainer::GeneratedFacet1::FormElement::DataField::orderId::Field-display").getText();

            if (!sIssueId && !sorderId) {
                MessageBox.error("Invalid Issue id or order id");
                return;
            }

            let response = await $.ajax({
                url: `/odata/v4/approval/Issues?$filter=issueId eq '${sIssueId}'`,
                method: "GET"
            });
            console.log(response);

            const instanceId = response.value[0].processInstanceId;


            if (!instanceId) {
                MessageBox.error("instance id is null ");
                return;
            }

            console.log("Issue ID:", sIssueId, sorderId);

            let sComment = sap.ui.core.Element.getElementById("approval::IssuesObjectPage--fe::CustomSubSection::Approvercomments--commentsFragment-CommentTextArea");
            let commentValue = sComment.getValue();


            if (!commentValue) {
                MessageBox.error("Comment cannot be empty");
                return;
            }

            let oModel = sap.ui.core.Element.getElementById("approval::IssuesObjectPage--fe::FormContainer::GeneratedFacet1").getModel();
            let oFunc = oModel.bindContext(`/waitforApproval(...)`);
            oFunc.setParameter("processId", instanceId);
            oFunc.setParameter("status", "Approved");

            await oFunc.execute();
            const result = oFunc.getBoundContext().getObject();

            

            const cUrl = `/odata/v4/approval/Comments`;


            $.ajax({
                url: cUrl,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    description: commentValue,
                    issueId: sIssueId,
                    commentBy: "Approver"
                }),
                success: function (oResponse) {
                    console.log("Comment created under order:", oResponse);
                }
            });



            const sUrl = `/odata/v4/approval/Issues(issueId='${sIssueId}',orderId='${sorderId}')`;

            const oUpdatedData = {
                issueStatus: "Approved"

            };

            try {
                const oResponse = await $.ajax({
                    method: "PATCH",
                    url: sUrl,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(oUpdatedData),
                    headers: {
                        "Prefer": "return=representation"
                    }
                });

                console.log("Comment updated successfully:", oResponse);
                sComment.setValue("");
                sap.m.MessageBox.success("Approved successfully");

            } catch (error) {
                console.error("Error updating comment:", error);
            }
        },
        onRejectPress: async function (oEvent) {
            debugger
          const sIssueId = sap.ui.core.Element.getElementById("approval::IssuesObjectPage--fe::FormContainer::GeneratedFacet1::FormElement::DataField::issueId::Field-display").getText();
            const sorderId = sap.ui.core.Element.getElementById("approval::IssuesObjectPage--fe::FormContainer::GeneratedFacet1::FormElement::DataField::orderId::Field-display").getText();


            let response = await $.ajax({
                url: `/odata/v4/approval/Issues?$filter=issueId eq '${sIssueId}'`,
                method: "GET"
            });
            console.log(response);

            const instanceId = response.value[0].processInstanceId;


            if (!sIssueId && !sorderId) {
                MessageBox.error("Invalid Issue id or order id");
                return;
            }

            if (!instanceId) {
                MessageBox.error("instance id is null ");
                return;
            }

            console.log("Issue ID:", sIssueId, sorderId);

            

            let oModel = sap.ui.core.Element.getElementById("approval::IssuesObjectPage--fe::FormContainer::GeneratedFacet1").getModel();
            let oFunc = oModel.bindContext(`/waitforApproval(...)`);
            oFunc.setParameter("processId", instanceId);
            oFunc.setParameter("status", "Rejected");

            await oFunc.execute();
            const result = oFunc.getBoundContext().getObject();


            const sUrl = `/odata/v4/approval/Issues(issueId='${sIssueId}',orderId='${sorderId}')`;

            const oUpdatedData = {
                issueStatus: "Rejected"
            };

            try {
                const oResponse = await $.ajax({
                    method: "PATCH",
                    url: sUrl,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(oUpdatedData),
                    headers: {
                        "Prefer": "return=representation"
                    }
                });

                sap.m.MessageBox.error("Issue rejected");

            } catch (error) {
                console.error("Error updating comment:", error);
            }
        },
    };
});
