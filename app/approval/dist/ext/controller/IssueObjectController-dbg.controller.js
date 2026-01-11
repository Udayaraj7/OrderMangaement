sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('approval.ext.controller.IssueObjectController', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf approval.ext.controller.IssueObjectController
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			routing: {
				onAfterBinding: async function (oContext) {
					debugger;

					var oModel = await this.base.getExtensionAPI().getModel();
					let IssueObject = await oContext.requestObject();



					let processInstanceId = IssueObject.processInstanceId;
					console.log("processInstanceId id =", processInstanceId);


						if(processInstanceId===null || processInstanceId==='')
						{
							sap.ui.core.Element.getElementById("approval::IssuesObjectPage--fe::FooterBar::_fc").setVisible(false);
						}
						else{
							sap.ui.core.Element.getElementById("approval::IssuesObjectPage--fe::FooterBar::_fc").setVisible(true);
						}
					
				
				}
			}
		}
	});
});
