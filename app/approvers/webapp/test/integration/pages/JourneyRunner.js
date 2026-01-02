sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"approvers/test/integration/pages/ApproversList",
	"approvers/test/integration/pages/ApproversObjectPage"
], function (JourneyRunner, ApproversList, ApproversObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('approvers') + '/test/flp.html#app-preview',
        pages: {
			onTheApproversList: ApproversList,
			onTheApproversObjectPage: ApproversObjectPage
        },
        async: true
    });

    return runner;
});

