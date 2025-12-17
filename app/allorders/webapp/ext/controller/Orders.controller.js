sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('allorders.ext.controller.Orders', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf allorders.ext.controller.Orders
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			editFlow: {
        onBeforeSave: function(mParameters) {
			debugger;
          console.log("apply button order page before save")
        },
        onAfterSave: function(mParameters) {
			debugger;
             console.log("apply button order page after save")
			 let comment = sap.ui.core.Element.getElementById("allorders::Orders_OrdersToIssuesObjectPage--fe::CustomSubSection::CommentsFragment--commentsFragment-CommentTextArea")

			 if(comment)
				comment.setValue("");
        }
    }
		}
	});
});
