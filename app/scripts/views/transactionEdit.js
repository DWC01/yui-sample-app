  YUI.add('transactionEditView', function(Y) {

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

  }, '0.0.1', { requires: ['view', 'app']});


