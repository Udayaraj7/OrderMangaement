sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/Button"
], function (MessageBox, Button) {
    "use strict";

    return {

        onApprove: function () {
            debugger;
            MessageBox.confirm(
                "Are you sure you want to approve?", {
                title: "Confirm Approval",
                onClose: async function (sAction) {
                    debugger;
                    if (sAction === MessageBox.Action.YES) {

                        let oModel = sap.ui.core.Element.getElementById("allorders::OrdersObjectPage--fe::Form::GeneratedFacet1::Content").getModel();
                        let issueId = sap.ui.core.Element.getElementById("allorders::OrdersObjectPage--fe::table::OrdersToIssues::LineItem::Issues-innerTable").getItems()[0].getBindingContext().getObject().issueId;
                        let orderId = sap.ui.core.Element.getElementById("allorders::OrdersObjectPage--fe::table::OrdersToIssues::LineItem::Issues-innerTable").getItems()[0].getBindingContext().getObject().orderId;
                        let oFunc = oModel.bindContext(`/triggerBpaProcess(...)`);
                        oFunc.setParameter("issueId", issueId);
                        oFunc.setParameter("orderId", orderId);

                        await oFunc.execute();
                        const result = oFunc.getBoundContext().getObject();
                        console.log("result === >>>", result)

                        const oContext = sap.ui.core.Element.getElementById(
                            "allorders::OrdersObjectPage--fe::CustomSubSection::ProcessHistory--approvalHistoryTable"
                        ).getBindingContext();

                     oContext.requestSideEffects([{
                    $NavigationPropertyPath: "OrdersToApprovalHistory"
                }]);

                
                      



                    } else if (sAction === MessageBox.Action.CANCEL) {

                        sap.m.MessageToast.show("Approval cancelled.");
                    }
                }.bind(this),
                actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.YES
            }
            );
        }
    };
});