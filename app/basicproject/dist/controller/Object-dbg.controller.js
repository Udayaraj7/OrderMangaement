sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("basicproject.controller.Object", {

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("object").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            // const sCustomerId = oEvent.getParameter("arguments").customerId;
            // const sPath = `/Customer('${sCustomerId}')`;
            // this.getView().bindElement(sPath);

            const sCustomerId = oEvent.getParameter("arguments").customerId;

    // Bind customer data
    this.getView().bindElement(`/Customer('${sCustomerId}')`);

    // Filter Orders table
    const oTable = this.byId("ordersTable");

    oTable.bindItems({
        path: "/Orders",
        filters: [
            new sap.ui.model.Filter("customerId", "EQ", sCustomerId)
        ],
        template: oTable.getBindingInfo("items").template
    });
        },

        onNavBack: function () {
            history.go(-1);
        }
    });
});
