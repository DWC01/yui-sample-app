YUI.add('transactionApp', function(Y) {

  TransactionApp = Y.TransactionApp = Y.Base.create("transactionApp", Y.App, [], {

    serverRouting: true,
    transistions: true,
    container: '#app-flow',
    
    views: {
      transaction: {
        type: "TransactionView",
        preserve: true
      }
    }
  });

}, '0.0.1', { requires: []});
