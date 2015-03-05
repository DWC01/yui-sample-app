
  YUI.add('transactionView', function(Y) {

	  TransactionView = Y.TransactionView = Y.Base.create("transactionView", Y.View, [], {
	    
	    events: {
	      '.all-transactions': {
	        click: 'transactions'
	      }
	    },

	    template: Y.one('#transaction-template').getHTML(),

	    confirmTransaction: function() {
	      app.navigate('/send');
	    },

	    transactions: function() {
	      app.navigate('/transactions');
	    }

	  });
    

  }, '0.0.1', { requires: ['view', 'app']});

  