  YUI.add('transactionApp', function(Y) {
  
    TransactionApp = Y.TransactionApp = Y.Base.create('transactionApp', Y.App, [], {
      serverRouting: true,
      transistions: true,
      container: '.app-flow',
      
      views: {
        transaction: {
          type: "TransactionView",
          preserve: true
        },
        send: {
          type: "SendView",
          parent: 'transaction'
        },
        success: {
          type: "SuccessView",
          parent: 'transaction'
        },
        list: {
          type: "ListView",
          parent: 'transaction'
        }
      }
    }
    });

  }, '0.0.1', { requires: []});