sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('allorders.ext.controller.Issue', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {


			onInit: function () {
				// Wait for the view to render, then attach to the Apply button
				const oView = this.getView();  // or this.base.getView()
				oView.addEventDelegate({
					onAfterRendering: function () {
						debugger;

						let oApplyButton = sap.ui.core.Element.getElementById("allorders::Orders_OrdersToIssuesObjectPage--fe::FooterBar::StandardAction::Apply");


						if (oApplyButton) {
							oApplyButton.attachPress(async function () {
								debugger;
								console.log("Apply button clicked on Issues sub-page - custom logic triggered!");
								let issueid = sap.ui.core.Element.getElementById("allorders::Orders_OrdersToIssuesObjectPage--fe::FormContainer::GeneralInformation::FormElement::DataField::issueId::Field-display");

								if (issueid) {
									issueid = issueid.getText();
								}
								console.log("--->>>>>" + issueid);

								let comment = sap.ui.core.Element.getElementById("allorders::Orders_OrdersToIssuesObjectPage--fe::CustomSubSection::CommentsFragment--commentsFragment-CommentTextArea")

								if (comment) {

									comment = comment.getValue()
									if (!comment) {
										console.log("--->>>>>comment is empty" );
										// setTimeout(function () {
    									// sap.m.MessageBox.error("no comments enter the comment")
										// 		}, 3000);
										//return;
											
									}

									console.log("--->>>>>" + comment);
								}

								try {
								let oModel = sap.ui.core.Element.getElementById("allorders::Orders_OrdersToIssuesObjectPage--fe::FormContainer::GeneralInformation::FormElement::DataField::issueId::Field-display").getModel();
								let oFunc = oModel.bindContext(`/commentsDraft(...)`);
								oFunc.setParameter("issueId", issueid)
								oFunc.setParameter("description", comment)
								await oFunc.execute();
								const result = oFunc.getBoundContext().getObject();
								//get result
								console.log("result === >>>", result)
								}
								catch (oError) {
                   // sap.m.MessageBox.error(oError.message );
                }

							});
						} else {
							console.warn("Apply button not found.");
						}
					}
				});
			},
			routing: {
				onAfterBinding: async function (oContext) {
					debugger;

					var oModel = await this.base.getExtensionAPI().getModel();
					let IssueObject = await oContext.requestObject();



					let issueid = IssueObject.issueId;
					console.log("issue id =", issueid);



					let aComments = [];

					try {
						const sFilter = `issueId eq '${encodeURIComponent(issueid)}'`;
						const sUrl = `/odata/v4/order-issue/Comments?$filter=${sFilter}&$orderby=createdAt desc`;

						const oResponse = await $.ajax({
							method: "GET",
							url: sUrl,
							dataType: "json"
						});

						aComments = oResponse.value || [];
						console.log("Loaded comments:", aComments, aComments.length);
					} catch (err) {
						MessageToast.show("Failed to load comments");
						console.error("Error loading comments:", err);
						return;
					}

					let textArea = sap.ui.core.Element.getElementById("allorders::Orders_OrdersToIssuesObjectPage--fe::CustomSubSection::CommentsFragment--commentsFragment-CommentTextArea");
					if (textArea) {


						console.log(textArea.getEnabled());
						if (textArea.getEnabled() === false && aComments.length > 0) {
							textArea.setValue(aComments[0].description)
						}
					 else if (textArea.getEnabled() === false && aComments.length == 0) {
						textArea.setValue("No previous comments")
					}
				}

				}

			}
		

	}
	});
});
