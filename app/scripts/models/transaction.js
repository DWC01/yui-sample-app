
	YUI.add('transactionModel',function(Y) {

		TransactionModel = Y.TransactionModel = Y.Base.create('transactionModel', Y.Model, [], {
	    sync: Y.LocalStorageSync('transaction'),

	    }, {
	      ATTRS: {
	        bankName: {value: ''},
	        transferAmount:  {value: ''}
	      }
	  	}
	  );

	}, '0.0.1', { requires: ['localStorageSync']});
