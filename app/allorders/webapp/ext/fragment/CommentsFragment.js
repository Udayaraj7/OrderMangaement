sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Avatar",
    "sap/m/ScrollContainer",
    
], function (MessageToast, Dialog, Text, Button, VBox, HBox, Avatar, ScrollContainer) {
    "use strict";

    return {
onLoadComments: async function (oEvent) {
    debugger;
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

    let aComments = [];

    try {
        const sUrl = `/odata/v4/order-issue/Comments?$filter=issueId eq '${sIssueId}'&$orderby=createdAt desc`;

        const oResponse = await $.ajax({
            method: "GET",
            url: sUrl,
            dataType: "json"
        });

        aComments = oResponse.value || [];
    } catch (err) {
        MessageToast.show("Failed to load comments");
        console.error(err);
        return;
    }

    // Create dialog once
    if (!this._commentsDialog) {
        this._commentsVBox = new sap.m.VBox({ width: "100%" }).addStyleClass("sapUiSmallMargin");

        this._commentsDialog = new sap.m.Dialog({
            title: "Comments",
            contentWidth: "700px",
            contentHeight: "350px",
            verticalScrolling: true,
            horizontalScrolling: false,
            content: this._commentsVBox,
            endButton: new sap.m.Button({
                text: "Close",
                press: () => this._commentsDialog.close()
            })
        });

        this.getView().addDependent(this._commentsDialog);
    }

    // Clear previous content
    this._commentsVBox.removeAllItems();

    if (!aComments.length) {
        this._commentsVBox.addItem(
            new sap.m.Text({ text: "No comments yet." }).addStyleClass("sapUiSmallMargin")
        );
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
}

    }
});



