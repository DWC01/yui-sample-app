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