
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("basicpage2.controller.View1", {
        onInit: function() {
            var oModel = new JSONModel({
                customerId: "",
                customerName: "",
                email: "",
                phoneNumber: "",
                address: "",
                totalAmount: 0,
                orderId:"",
                status:"pending"
            });
            this.getView().setModel(oModel, "checkout");
        },

        // Optional: Validate steps before moving next
        onNextStep: function(oEvent) {
            var oWizard = this.byId("checkoutWizard");
            var oCurrentStep = oWizard.getCurrentStep();
            // Add custom validation if needed
        },

        onWizardComplete: function() {
            // Here you would typically create the entities via OData V4 or V2 service (CAP exposed)
            var oData = this.getView().getModel("checkout").getData();
            MessageToast.show("Checkout completed!\n" +
                "Customer: " + oData.customerName + "\n" +
                "Total: " + oData.totalAmount + "\n" +
                "In a real app, this would create Customer and Orders entities via your CAP service.");
            
            // Reset for demo
            this.getView().getModel("checkout").setData({
                customerId: "",
                customerName: "",
                email: "",
                phoneNumber: "",
                address: "",
                totalAmount: 0
            });
            this.byId("checkoutWizard").discardProgress(this.byId("stepCustomer"));
        }
    });
});