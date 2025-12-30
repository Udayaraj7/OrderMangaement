sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"approval/test/integration/pages/IssuesList",
	"approval/test/integration/pages/IssuesObjectPage",
	"approval/test/integration/pages/CommentsObjectPage"
], function (JourneyRunner, IssuesList, IssuesObjectPage, CommentsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('approval') + '/test/flp.html#app-preview',
        pages: {
			onTheIssuesList: IssuesList,
			onTheIssuesObjectPage: IssuesObjectPage,
			onTheCommentsObjectPage: CommentsObjectPage
        },
        async: true
    });

    return runner;
});

