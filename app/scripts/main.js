  YUI.GlobalConfig = {
    modules: {
      transactionModel: {
        fullpath: './app/scripts/models/transaction.js',
        requires: ['localStorageSync']
      },
      transactionList: {
        fullpath: './app/scripts/models/transactionList.js',
        requires: ['transactionModel','localStorageSync']
      },
      localStorageSync: {
        fullpath: './app/scripts/localStorageSync.js',
        requires: ['node']
      },
      transactionView: {
        fullpath: './app/scripts/views/transaction.js',
        requires: ['transactionApp']
      },
      transactionApp: {
        fullpath: './app/scripts/transactionApp.js',
        requires: []
      }
    }
  };


  YUI().use('app', 'handlebars', 'node', 'json',
            'transactionModel', 'transactionList', 'transactionApp', 'transactionView', 'localStorageSync',
            'wf2-button', 'wf2-form', 'wf2-global-header', 'wf2-gridsmanager', function(Y) {

    Y.WF2.GlobalHeader.getGlobalHeader({
      appname: 'Global Wires'    
    }).render();

    // Instantiate 'GridsManager' for auto height-adjustment.
    new Y.WF2.GridsManager({
      gridsContainer: '#grids'
    });

    var app = new TransactionApp();

    app.route('/', function(req) {
      app.showView('transaction');
    });

    app.render().dispatch();

});