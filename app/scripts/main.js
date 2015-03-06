  YUI.GlobalConfig = {
    modules: {
      transactionForm: {
        fullpath: './app/scripts/widgets/form.js',
        requires: ['widget']
      },
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
      transactionEditView: {
        fullpath: './app/scripts/views/transactionEdit.js',
        requires: ['transactionApp']
      },
      transactionApp: {
        fullpath: './app/scripts/transactionApp.js',
        requires: []
      },
      appRouter: {
        fullpath: './app/scripts/routes.js',
        requires: ['router', 'transactionForm']
      }
    }
  };


  YUI().use('app', 'handlebars', 'node-base', 'transactionForm', 'transactionModel', 'transactionList', 
      'localStorageSync', 'json', 'wf2-button', 'wf2-form', 'wf2-global-header', 'wf2-gridsmanager', function(Y) {

    Y.WF2.GlobalHeader.getGlobalHeader({
      appname: 'Global Wires'    
    }).render();

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

    SendView = Y.SendView = Y.Base.create("sendView", Y.View, [], {

      events: {
        '.send-payment': {
          click: 'sendPayment'
        },
        '.static-value-wrap': {
          click: 'edit',
          focus: 'edit'
        },
        '.input-value-wrap': {
          blur: 'static',
          keypress: 'save'
        }
      },

      template: Y.one('#send-template').getHTML(),

      initializer: function () {
        var transactions = this.transactions = app.get('transactions');
        this.transaction = this.transactions.last();
        this.transaction.after('change', this.render, this);
      },

      render: function() {
        var container = this.get('container');

        var source   = Y.one('#send-template').getHTML(),
            template = Y.Handlebars.compile(source),
            html;

        var attrsJson = Y.JSON.stringify(this.transaction.getAttrs());
        html = template(Y.JSON.parse(attrsJson));
        container.setHTML(Y.Lang.sub(html));
        return this;
      },

      sendPayment: function(){
        app.navigate('/success');
      },

      edit: function(e) {
        Y.one(e.currentTarget).addClass('editing');
        Y.one(e.currentTarget._node.nextElementSibling).addClass('editing');
        Y.one(e.currentTarget._node.nextElementSibling.firstElementChild).focus();
      },
      
      static: function(e) {
        Y.one(e.currentTarget).removeClass('editing');
        Y.one(e.currentTarget._node.previousElementSibling).removeClass('editing');
      },

      save: function(e) {
        if (e.keyCode === 13) { // enter key
          Y.one(e.currentTarget).removeClass('editing');
          Y.one(e.currentTarget._node.previousElementSibling).removeClass('editing');

          var bankName       = Y.one('.bank-name');
          var transferAmount = Y.one('.transfer-amount');

          this.transaction.setAttrs({
            bankName: Y.Lang.trim(bankName.get('value')),
            transferAmount: Y.Lang.trim(transferAmount.get('value')),
            type: 'edit'
          });

          this.transaction.save(function (err, response) {
            if (!err) {
              Y.log("Succuess!!");
            } else {
              Y.log("err Error!!");
            }
          });
          
        }
      }

    });

    SuccessView = Y.SuccessView = Y.Base.create("successView", Y.View, [], {
        
        events: {
          button: {
            click: 'newTransfer'
          }
        },

        template: Y.one('#success-template').getHTML(),

        initializer: function () {
          Y.log('Inside initializer/send');
          this.transactions = app.get('transactions');

          Y.log(this.transactions);

          this.transaction = this.transactions.last();
          this.transaction.after('change', this.render, this);
        },

        render: function() {
         var container = this.get('container');

        container.setHTML(Y.Lang.sub(this.template, {
          id: this.transaction.get('id'),
          bankName: this.transaction.get('bankName'),
          transferAmount: this.transaction.get('transferAmount')
        }));

        return this;
        },

        newTransfer: function(){
          app.navigate('/');
        }

    });
    
    var app = new Y.App({
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

    });


    app.route('/', function(req) {
      app.showView('home');

      var form = new Y.TransactionForm(); 
      form.render('.app-flow');
    });

    app.route('/send', function(req) {
      
      app.showView('send');
        
      // var form = new Y.TransactionForm(); 
      // form.set('type', 'edit');
      // form.render('.app-flow');

      // if (Y.one('.yui3-transactionform')) {
      //   Y.one('.yui3-transactionform').remove();
      // }
    });

    app.route('/success', function(req) {
      this.showView('success');
      // if (Y.one('.yui3-transactionform')) {
      //   Y.one('.yui3-transactionform').remove();
      // }
    });

    app.route('/list', function(req) {
      this.showView('list');
    });
  
    Y.on('transaction:created', function(transactions) {
      app.set('transactions', transactions);
      app.navigate('/send');
    });

    var transactions = new TransactionList();
    transactions.load();
    app.set('transactions', transactions);
    app.render().dispatch();
});