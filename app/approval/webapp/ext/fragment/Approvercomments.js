sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (MessageToast, MessageBox) {
    'use strict';

    return {
        /**
         * Generated event handler.
         *
         * @param oEvent the event object provided by the event provider.
         */
        onApprovePress: async function (oEvent) {
            debugger
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext();

            if (!oContext) {
                MessageBox.error("No Issue context found");
                return;
            }

            const sIssueId = oContext.getProperty("issueId");
            const sorderId = oContext.getProperty("orderId");

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
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext();

            if (!oContext) {
                MessageBox.error("No Issue context found");
                return;
            }

            const sIssueId = oContext.getProperty("issueId");
            const sorderId = oContext.getProperty("orderId");


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

        onLoadComments: async function (oEvent) {
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext();

            if (!oContext) {
                MessageToast.show("No Issue context found");
                return;
            }

            const sIssueId = oContext.getProperty("issueId");
            if (!sIssueId) {
                MessageToast.show("Invalid Issue ID");
                return;
            }

            try {
                const sFilter = `issueId eq '${encodeURIComponent(sIssueId)}'`;
                const sUrl = `/odata/v4/approval/Comments?$filter=${sFilter}&$orderby=createdAt desc`;
                const oResponse = await $.ajax({ method: "GET", url: sUrl, dataType: "json" });
                const aComments = oResponse.value || [];

                if (!this._commentsDialog) {
                    const that = this;
                    this._commentsVBox = new sap.m.VBox({ width: "100%" }).addStyleClass("sapUiSmallMargin");
                    const oScrollContainer = new sap.m.ScrollContainer({
                        height: "300px",
                        vertical: true,
                        horizontal: false,
                        content: [this._commentsVBox]
                    });

                    this._commentsDialog = new sap.m.Dialog({
                        title: "Comments",
                        contentWidth: "700px",
                        contentHeight: "350px",
                        content: oScrollContainer,
                        endButton: new sap.m.Button({
                            text: "Close",
                            press: function () { that._commentsDialog.close(); }
                        })
                    });

                    const oView = oSource.getParent() && oSource.getParent().getParent()
                        || sap.ui.getCore().byId("__xmlview0")
                        || this.getOwnerComponent()?.getRootControl();

                    let oCurrent = oSource;
                    let oFoundView = null;
                    while (oCurrent && !oFoundView) {
                        if (oCurrent.getMetadata().getName() === "sap.ui.core.mvc.View") {
                            oFoundView = oCurrent;
                        }
                        oCurrent = oCurrent.getParent();
                    }

                    if (oFoundView) oFoundView.addDependent(this._commentsDialog);
                }

                // Clear previous content
                this._commentsVBox.removeAllItems();

                if (aComments.length === 0) {
                    this._commentsVBox.addItem(new sap.m.Text({ text: "No comments yet." }).addStyleClass("sapUiSmallMargin"));
                } else {
                    aComments.forEach(oComment => {
                        const firstVBox = new sap.m.VBox({ width: "100%" })
                            .addStyleClass("sapUiSmallMarginBegin");


                        const oHBox = new sap.m.HBox({ alignItems: "Start", justifyContent: "Start", width: "100%" });
                        const oAvatar = new sap.m.Avatar({ icon: "sap-icon://person-placeholder", displaySize: "S" }).addStyleClass("sapUiTinyMarginEnd");
                        const oContentVBox = new sap.m.VBox({ width: "100%" });

                        // const oAuthorText = new sap.m.Text({
                        //     text: (oComment.createdBy || "Unknown") + (oComment.commentBy ? ` < ${oComment.commentBy} >` : ""),
                        //     design: "Bold"
                        // });

                        const oAuthorText = new sap.m.FormattedText({
                            htmlText:
                                `<strong>${oComment.createdBy || "Unknown"}</strong>` +
                                (oComment.commentBy
                                    ? ` <span style="color:#0a6ed1;">&lt; ${oComment.commentBy} &gt;</span>`
                                    : "")
                        });



                        const oDateText = new sap.m.Text({
                            text: oComment.createdAt ? new Date(oComment.createdAt).toLocaleString() : "",
                            wrapping: false
                        }).addStyleClass("sapUiTinyMarginBottom");

                        const oDescText = new sap.m.Text({ text: oComment.description || "", wrapping: true });

                        oContentVBox.addItem(oAuthorText);
                        oContentVBox.addItem(oDateText);


                        oHBox.addItem(oAvatar);
                        oHBox.addItem(oContentVBox);
                        firstVBox.addItem(oHBox);
                        firstVBox.addItem(oDescText);

                        const oCard = new sap.f.Card({
                            width: "95%",
                            content: new sap.m.VBox({ width: "100%", items: [firstVBox] })
                        }).addStyleClass("sapUiSmallMarginBottom commentBorder");

                        this._commentsVBox.addItem(oCard);
                    });
                }

                this._commentsDialog.open();

            } catch (err) {
                MessageToast.show("Failed to load comments");
                console.error("Error loading comments:", err);
            }
        }
    };
});
