
  YUI.add('transactionView', function(Y) {

	  TransactionView = Y.TransactionView = Y.Base.create("transactionView", Y.View, [], {
      
      template: Y.one('#transaction-template').getHTML(),

      render: function() {
        var container = this.get('container');
        container.setHTML(Y.Lang.sub(this.template));
        return this;
      },

    });
    
  }, '0.0.1', { requires: ['view', 'app']});

  