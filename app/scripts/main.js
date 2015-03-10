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

    // Page Header
    Y.WF2.GlobalHeader.getGlobalHeader({
      appname: 'Global Wires'    
    }).render();

    // Instantiate Grid Layout
    new Y.WF2.GridsManager({
      gridsContainer: '#grids'
    });



    // Setup App Details / Render
    var app = new TransactionApp({container: '#app-flow'});
    app.route('/', function(req) {
      app.showView('transaction');
      
      var formFields = {};
      
      formFields.email = new Y.WF2.FORM.FieldTextInput({
          labelText   : "Email Address",
          hint        : "E.G. foo@bar.com",
          controlName : "email",
          validators  : [ "isEmailAddr", "isRequired" ] //array of validators
      });
      
      formFields.desc = new Y.WF2.FORM.FieldTextArea({
          labelText   : "Description",
          counterMax  : 20,
          placeholder : "stay brief",
          controlName : "desc"
      });

      var form = new Y.WF2.FORM.Form({
          formAction  : "http://wnl-svr167.wellsfargo.com:8020/echorequest/",
          subfields   : formFields
      }).render("#transactionForm");
      
      Y.Object.each( formFields, function(subfieldWidget,subfieldRole){
          subfieldWidget.render( form.get('controlNode') );
      });
      
    });
    app.render().dispatch();

});