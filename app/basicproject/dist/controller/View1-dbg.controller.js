sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller,JSONModel) => {
    "use strict";

    return Controller.extend("basicproject.controller.View1", {
       onInit: function () {
          
        }
        ,onItemPress: function (oEvent) {
            debugger;
    const oItem = oEvent.getSource();
    const oContext = oItem.getBindingContext();
    const sCustomerId = oContext.getProperty("customerId");

    this.getOwnerComponent()
        .getRouter()
        .navTo("object", {
            customerId: sCustomerId
        });
}

    });
});