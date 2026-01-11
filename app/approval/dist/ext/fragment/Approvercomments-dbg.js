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
