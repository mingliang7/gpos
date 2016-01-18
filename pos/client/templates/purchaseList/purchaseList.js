var posPurchaseUpdate = Template.pos_purchaseUpdate;

Template.pos_purchaseList.helpers({
    selector: function () {
        return {branchId: Session.get('currentBranch')}
    }
});
Template.pos_purchaseList.onRendered(function () {
    createNewAlertify(['purchaseShow']);
    createNewAlertify(['purchaseUpdate']);
});
Template.pos_purchaseList.events({
    'click .insert': function (e, t) {
        FlowRouter.go('pos.purchase');
    },
    'click .update': function (e, t) {
        var id = this._id;
        Meteor.call('findOneRecord', 'Pos.Collection.Purchases', {_id: id}, {}, function (error, purchase) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (purchase.status != "Unsaved") {
                    alertify.purchaseUpdate(fa('pencil', 'Update Existing Purchase'), renderTemplate(posPurchaseUpdate, purchase));
                } else {
                    FlowRouter.go('pos.purchase', {purchaseId: id});
                }
            }

        });
    },
    'click .remove': function (e, t) {
        var id = this._id;
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    var arr = [
                        {collection: 'Pos.Collection.PurchasePayments', selector: {purchaseId: id}}
                    ];
                    Meteor.call('isRelationExist', arr, function (error, result) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            if (result) {
                                alertify.warning("Data has been used. Can't remove.");
                            } else {
                                Pos.Collection.Purchases.remove(id, function (err) {
                                    if (err) {
                                        alertify.error(err.message);
                                    } else {
                                        alertify.success("Success");
                                    }
                                });
                            }
                        }
                    });
                },
                title: '<i class="fa fa-remove"></i> Delete Purchase'
            });
    },
    'click .show': function (e, t) {
        //var purchase = Pos.Collection.Purchases.findOne(this._id);
        var self = this;
        self.pDate = moment(this.purchaseDate).format("YYYY-MM-DD HH:mm:ss");
        //this.saleDetails = Pos.Collection.PurchaseDetails.find({purchaseId: this._id});
        self.retail = this.isRetail ? "Retail" : "Wholesale";
        Meteor.call('findRecords', 'Pos.Collection.PurchaseDetails', {purchaseId: this._id}, {},
            function (error, purchaseDetails) {
                if (purchaseDetails) {
                    self.purchaseDetails = purchaseDetails;
                    alertify.purchaseShow(fa('eye', 'Purchase Detail'),
                        renderTemplate(Template.pos_purchaseShow, self));
                }

            })

    }
});

AutoForm.hooks({
    pos_purchaseUpdate: {
        onSuccess: function (formType, result) {
            alertify.purchaseUpdate().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
