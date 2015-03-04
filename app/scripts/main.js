// -- Form Widget ----------------------------------
YUI.add('transactionForm', function(Y) {


  Y.TransactionForm = Y.Base.create('transactionForm', Y.Widget, [], {
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

}, '0.0.0', {requires: ['base-build', 'widget']});

// Setup YUI 

YUI().use('app', 'event-focus', 'json', 'model', 'model-list', 'view', 
          'handlebars', 'node-base','transactionForm', function(Y) {
  
  // -- Model ----------------------------------------------------------------

  TransactionModel = Y.TransactionModel = Y.Base.create('transactionModel', Y.Model, [], {
    sync: LocalStorageSync('transaction'),

    }, {
      ATTRS: {
        bankName: {value: ''},
        transferAmount:  {value: ''}
      }
  });

  // -- ModelList ----------------------------------------------------------------

  TransactionList = Y.TransactionList = Y.Base.create('transactionList', Y.ModelList, [], {

      model: TransactionModel,

      sync: LocalStorageSync('transaction'),

      all: function() {
        return this.toArray();
      },

      last: function() {
        var list = this.toArray();
        var lastIndex = list.length -1;
        
        return list[lastIndex];
      }
  });

  
  // -- Views ----------------------------------------------------------------  

  HomeView = Y.HomeView = Y.Base.create("homeView", Y.View, [], {
    
    events: {
      '.all-transactions': {
        click: 'transactions'
      }
    },

    template: Y.one('#home-template').getHTML(),

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
          transferAmount: Y.Lang.trim(transferAmount.get('value'))
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
      this.transactionList = new Y.TransactionList();
    },

    render: function() {
      var container = this.get('container');
      
      container.setHTML(Y.Lang.sub(this.template, {
        id: this.transactionList.displayLast()['id'],
        bankName: this.transactionList.displayLast()['bankName'],
        transferAmount: this.transactionList.displayLast()['transferAmount']
      }));

      return this;
    },

    newTransfer: function(){
      app.navigate('/');
    }

  });

  Y.ListView = Y.Base.create("listView", Y.View, [], {
    
    events: {
      ".new-transfer": {
        click: 'newTransfer'
      },
      ".clear-list": {
        click: 'clearList'
      }
    },

    initializer: function () {
      this.transactionList = new Y.TransactionList();
    },

    render: function() {
      var container = this.get('container');

      // Extract the template string and compile it into a reusable function.
      var source   = Y.one('#list-template').getHTML(),
          template = Y.Handlebars.compile(source),
          html;

      html = template(this.transactionList.displayAll());
      
      container.setHTML(Y.Lang.sub(html));

      return this;
    },

    clearList: function (e) {
      Y.log(this.transactionList.load());
    },

    newTransfer: function() {
      app.navigate('/');
    }

  });

  // -- Create App ---------------------------------------------------------------- 

  var app = new Y.App({
    serverRouting: true,
    transistions: true,
    container: '.app-flow',
    
    views: {
      home: {
        type: "HomeView",
        preserve: true
      },
      send: {
        type: "SendView",
        parent: 'home'
      },
      success: {
        type: "SuccessView",
        parent: 'home'
      },
      list: {
        type: "ListView",
        parent: 'home'
      }
    }

  });

  Y.on('transaction:created', function(transactions) {
    app.set('transactions', transactions);
    app.navigate('/send');
  });

  // Routes

  app.route('/', function(req) {
    Y.one('.title').set('text', "YUI3 Example App - home" );
    app.showView('home');
    
    var t = new Y.TransactionForm(); 
    t.set('transactions', transactions);
    t.render('.app-flow');
  });

  app.route('/send', function(req) {
    Y.one('h2').set('text', 'YUI3 Example App - ' + req.path.replace("/", ""));
    app.showView('send');
      
    if (Y.one('.yui3-transactionform')) {
      Y.one('.yui3-transactionform').remove();
    }

  });

  app.route('/success', function(req) {
    Y.one('h2').set('text', 'YUI3 Example App - ' + req.path.replace("/", ""));
    this.showView('success');
  });

  app.route('/list', function(req) {
    Y.one('h2').set('text', 'YUI3 Example App - ' + req.path.replace("/", ""));
    this.showView('list');
  });

  
  // ------------------------------------------------------------------  
  // ------------------------------------------------------------------  
  // -- Local Storage Sync -------------------------------------------- 
  // ------------------------------------------------------------------  
  // ------------------------------------------------------------------  

  function LocalStorageSync(key) {
    var localStorage;

    if (!key) {
      Y.error('No storage key specified.');
    }

    if (Y.config.win.localStorage) {
      localStorage = Y.config.win.localStorage;
    }

    // Try to retrieve existing data from localStorage, if there is any.
    // Otherwise, initialize 'data' to an empty object.
    var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

    // Delete a model with the specified id.
    function destroy(id) {
      var modelHash;

      if ((modelHash = data[id])) {
        delete data[id];
        save();
      }

      return modelHash;
    }

    // Generate a unique id to assign to a newly-created model.
    function generateId() {
      var id = '',
          i  = 4;

      while (i--) {
        id += (((1 + Math.random()) * 0x10000) | 0)
                .toString(16).substring(1);
      }

      return id;
    }

    // Loads a model with the specified id. This method is a little tricky,
    // since it handles loading for both individual models and for an entire
    // model list.
    //
    // If an id is specified, then it loads a single model. If no id is
    // specified then it loads an array of all models. This allows the same sync
    // layer to be used for both the TodoModel and TransactionModel classes.
    function get(id) { 
      return id ? data[id] : Y.Object.values(data);
    }

    // Saves the entire `data` object to localStorage.
    function save() {
      localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
    }

    // Sets the id attribute of the specified model (generating a new id if
    // necessary), then saves it to localStorage.
    function set(model) {
      var hash        = model.toJSON(),
        idAttribute = model.idAttribute;

      if (!Y.Lang.isValue(hash[idAttribute])) {
        hash[idAttribute] = generateId();
      }

      data[hash[idAttribute]] = hash;
      save();

      return hash;
    }

    // Returns a `sync()` function that can be used with either a Model or a
    // ModelList instance.
    return function (action, options, callback) {
      // `this` refers to the Model or ModelList instance to which this sync
      // method is attached.
      var isModel = Y.Model && this instanceof Y.Model;

      switch (action) {
      case 'create': // intentional fallthru
      case 'update':
        callback(null, set(this));
        return;

      case 'read':
        callback(null, get(isModel && this.get('id')));
        return;

      case 'delete':
        callback(null, destroy(isModel && this.get('id')));
        return;
      }
    };
  }

  var transactions = new TransactionList();
  transactions.load();
  app.set('transactions', transactions);
  app.render().dispatch();

});