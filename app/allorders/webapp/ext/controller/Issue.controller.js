sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('allorders.ext.controller.Issue', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			onInit: function () {
				this._bApplyAttached = false;

				// Wait for the view to render, then attach to the Apply button
				const oView = this.getView();  // or this.base.getView()
				oView.addEventDelegate({
					onAfterRendering: function () {
						debugger;

						if (this._bApplyAttached) {
							return;
						}

						let oApplyButton = sap.ui.core.Element.getElementById("allorders::Orders_OrdersToIssuesObjectPage--fe::FooterBar::StandardAction::Apply");


						if (oApplyButton) {
							oApplyButton.attachPress(async function () {
								debugger;  // Your breakpoint
								this._bApplyAttached = true;
								console.log("Apply button clicked on Issues sub-page - custom logic triggered!");
								let issueid = sap.ui.core.Element.getElementById("allorders::Orders_OrdersToIssuesObjectPage--fe::FormContainer::GeneralInformation::FormElement::DataField::issueId::Field-display");

								if (issueid) {
									issueid = issueid.getText();
								}
								console.log("--->>>>>" + issueid);

								let comment = sap.ui.core.Element.getElementById("allorders::Orders_OrdersToIssuesObjectPage--fe::CustomSubSection::CommentsFragment--commentsFragment-CommentTextArea")

								if (comment) {

									comment = comment.getValue()
									sap.m.MessageToast.show(comment);
								}

								let oModel = sap.ui.core.Element.getElementById("allorders::Orders_OrdersToIssuesObjectPage--fe::FormContainer::GeneralInformation::FormElement::DataField::issueId::Field-display").getModel();
								let oFunc = oModel.bindContext(`/commentsDraft(...)`);
								oFunc.setParameter("issueId", issueid)
								oFunc.setParameter("description", comment)
								await oFunc.execute();
								const result = oFunc.getBoundContext().getObject();
								//get result
								console.log("----//////>>>." + result)



								// Add your custom code here:
								// - Validation
								// - Additional backend calls
								// - Prevent default if needed (advanced - may require rejecting a promise or custom handling)
							}.bind(this));
						} else {
							console.warn("Apply button not found. Check the exact ID in browser dev tools.");
						}
					}
				});
			},

		}
	});
});
