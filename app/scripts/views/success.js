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