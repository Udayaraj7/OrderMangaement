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
            debugger
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

    console.log("Issue ID:", sIssueId);

    let aComments = [];

    try {
        const sFilter = `issueId eq '${encodeURIComponent(sIssueId)}'`;
        const sUrl = `/odata/v4/order-issue/Comments?$filter=${sFilter}&$orderby=createdAt desc`;

        const oResponse = await $.ajax({
            method: "GET",
            url: sUrl,
            dataType: "json"
        });

        aComments = oResponse.value || [];
        console.log("Loaded comments:", aComments);
    } catch (err) {
        MessageToast.show("Failed to load comments");
        console.error("Error loading comments:", err);
        return;
    }

    if (aComments.length === 0) {
     MessageToast.show("No comments");
    return
}

    // Preserve controller reference
    const that = this;

    // Create dialog only once
    if (!this._commentsDialog) {
        this._commentsVBox = new sap.m.VBox({
            width: "100%"
        }).addStyleClass("sapUiSmallMargin");

       const oScrollContainer = new sap.m.ScrollContainer({
    height: "300px",  // fixed height
    vertical: true,
    horizontal: false,
    content: [this._commentsVBox]
});

this._commentsDialog = new sap.m.Dialog({
    title: "Comments",
    contentWidth: "450px",
    contentHeight: "350px", 
    content: oScrollContainer,
    endButton: new sap.m.Button({
        text: "Close",
        press: function () {
            that._commentsDialog.close();
        }
    })
});

       
        const oView = oSource.getParent() && oSource.getParent().getParent() 
                    || sap.ui.getCore().byId("__xmlview0") 
                    || this.getOwnerComponent()?.getRootControl(); 

        // Better and most reliable way: traverse up from the button
        let oCurrent = oSource;
        let oFoundView = null;
        while (oCurrent && !oFoundView) {
            if (oCurrent.getMetadata().getName() === "sap.ui.core.mvc.View") {
                oFoundView = oCurrent;
                break;
            }
            oCurrent = oCurrent.getParent();
        }

        if (oFoundView) {
            oFoundView.addDependent(this._commentsDialog);
        } else {
            console.warn("View not found for addDependent – dialog may leak");
           
        }
    }

    // Clear previous content
    this._commentsVBox.removeAllItems();

    if (aComments.length === 0) {
        this._commentsVBox.addItem(
            new sap.m.Text({ text: "No comments yet." }).addStyleClass("sapUiSmallMargin")
        );
    } else {
        aComments.forEach(function (oComment) {

    
    const oCommentPanel = new sap.m.Panel({
    expandable: false,     
    width: "100%",           
    
}).addStyleClass("sapUiSmallMarginBottom");

    // Layout inside panel
    const oHBox = new sap.m.HBox({
        alignItems: "Start"
    });

    // Avatar
    oHBox.addItem(
        new sap.m.Avatar({
            icon: "sap-icon://person-placeholder",
            displaySize: "S"
        }).addStyleClass("sapUiTinyMarginEnd")
    );

    // Text container
    const oTextVBox = new sap.m.VBox();

    // Created By
    oTextVBox.addItem(
        new sap.m.Text({
            text: oComment.createdBy || "Unknown",
            design: "Bold"
        }).addStyleClass("sapUiTinyMarginBottom")
    );

    // Date
    oTextVBox.addItem(
        new sap.m.Text({
            text: oComment.createdAt
                ? new Date(oComment.createdAt).toLocaleString()
                : ""
        }).addStyleClass("sapUiTinyMarginBottom")
    );

    // Description
    oTextVBox.addItem(
        new sap.m.Text({
            text: oComment.description || "",
            wrapping: true
        })
    );

    oHBox.addItem(oTextVBox);

    // Add HBox to Panel
    oCommentPanel.addContent(oHBox);

    // Add Panel to main VBox
    this._commentsVBox.addItem(oCommentPanel);

}.bind(this));

    }

    // Open dialog
    this._commentsDialog.open();
}

    }
});



