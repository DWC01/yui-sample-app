 // -- Form Widget ----------------------------------
YUI.add('transactionForm', function(Y) {


  TransactionForm = Y.TransactionForm = Y.Base.create('transactionForm', Y.Widget, [], {
    destructor: function () {
      this.get('contentBox').remove(true); 
    },
    
    initializer: function() {
      this.transactions = new TransactionList();
    },
    
    renderUI: function() {
      this.get('contentBox')
        .append(Y.one('#form-template').getHTML());
    },

    bindUI: function() {
      this.get('contentBox').on('submit', Y.bind(function(e) {
          e.preventDefault();
          this.createTransaction();
      }, 
      this));
    },

    syncUI: function() {

    },

    // Private Methods

    createTransaction: function (e) {
      var bankName       = Y.one('.bank-name');
      var transferAmount = Y.one('.transfer-amount');

      bankName       = Y.Lang.trim(bankName.get('value'));
      transferAmount = Y.Lang.trim(transferAmount.get('value'));

      this.transactions.create({
        bankName: bankName, 
        transferAmount: transferAmount
      });

      Y.fire('transaction:created', this.transactions);
      this.destroy();
    }
    
  });

}, '0.0.0', {requires: ['widget']});