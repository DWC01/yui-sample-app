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