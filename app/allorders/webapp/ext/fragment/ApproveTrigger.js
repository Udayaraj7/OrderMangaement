sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (MessageToast, MessageBox) {
    "use strict";

    return {
        onPress: function (oEvent) {
            const oButton = oEvent.getSource();
            const oRowContext = oButton.getBindingContext();
            const oRowData = oRowContext.getObject();

            const issueId = oRowData.issueId; // ✅ clicked row issueId

            MessageBox.confirm(
                "Are you sure you want to approve?",
                {
                    title: "Confirm Approval",
                    emphasizedAction: MessageBox.Action.YES,
                    actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                    onClose: async function (sAction) {
                        if (sAction === MessageBox.Action.YES) {

                            const oModel = oRowContext.getModel();

                            const oFunc = oModel.bindContext("/triggerBpaProcess(...)");
                            oFunc.setParameter("issueId", issueId);

                            await oFunc.execute();

                            const result = oFunc.getBoundContext().getObject();
                            console.log("Result:", result);

     


                            MessageToast.show("Approved successfully");
                        }
                    }
                }
            );
        }
    };
});
