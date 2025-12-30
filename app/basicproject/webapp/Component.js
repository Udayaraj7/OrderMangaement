sap.ui.define([
    "sap/ui/core/UIComponent",
    "basicproject/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("basicproject.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

       

    sap.ui.getCore().applyTheme("sap_fiori_3");
    jQuery.sap.includeStyleSheet(
        sap.ui.require.toUrl("basicproject/css/style.css"));


        }
    });
});