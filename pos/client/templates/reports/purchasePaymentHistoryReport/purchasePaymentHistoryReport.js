Session.set('branchIds', null);
Template.pos_purchasePaymentHistoryReport.onRendered(function () {
});
Template.pos_purchasePaymentHistoryReport.events({
});

Template.pos_purchasePaymentHistoryReportGen.helpers({
    options: function () {
        return {
            //fontSize: 'bg',
            paper: 'a4',
            orientation: 'portrait'
        };
    },
    data: function () {
        // Get query params
        //FlowRouter.watchPathChange();
        var q = FlowRouter.current().queryParams;
        var callId = JSON.stringify(q);
        var call = Meteor.callAsync(callId, 'posPurchasePaymentHistoryReport', q);
        if (!call.ready()) {
            return false;
        }
        return call.result();
    }
});



