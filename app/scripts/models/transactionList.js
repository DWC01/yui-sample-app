	
	YUI.add('transactionList',function(Y) {

		TransactionList = Y.TransactionList = Y.Base.create('transactionList', Y.ModelList, [], {

	      model: Y.TransactionModel,

	      sync: Y.LocalStorageSync('transaction'),

	      all: function() {
	        return this.toArray();
	      },

	      last: function() {
	        var list = this.toArray();
	        var lastIndex = list.length -1;
	        
	        return list[lastIndex];
	      }
	  });

	}, '0.0.1', { requires: ['transactionModel', 'localStorageSync']});