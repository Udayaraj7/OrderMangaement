sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"admin/test/integration/pages/CustomerList",
	"admin/test/integration/pages/CustomerObjectPage",
	"admin/test/integration/pages/OrdersObjectPage"
], function (JourneyRunner, CustomerList, CustomerObjectPage, OrdersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('admin') + '/test/flp.html#app-preview',
        pages: {
			onTheCustomerList: CustomerList,
			onTheCustomerObjectPage: CustomerObjectPage,
			onTheOrdersObjectPage: OrdersObjectPage
        },
        async: true
    });

    return runner;
});

