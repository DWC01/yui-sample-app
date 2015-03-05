	YUI.add('appRouter', function(Y) {

		Y.CustomRouter = Y.Base.create('customRouter', Y.Router, [], {
		  // Default route handlers inherited by all CustomRouter instances.
		  index: function (req) {
		     Y.one('.title').set('text', "YUI3 Example App - home" );
			    app.showView('home');
			    
			    var t = new Y.TransactionForm(); 
			    t.set('transactions', transactions);
			    t.render('.app-flow');
		  },

		}, {
		  ATTRS: {
		    root: {
		      value: '/'
		    },
		    // Share these default routes with all CustomRouter instances.
		    routes: {
		      value: [
		        {path: '/',    callbacks: 'index'},
		      ]
		    },
		  }
		});
		
  }, '0.0.1', { requires: ['router', 'transactionForm', 'app']});

	  // app.route('/', function(req) {
	  //   Y.one('.title').set('text', "YUI3 Example App - home" );
	  //   app.showView('home');
	    
	  //   var t = new Y.TransactionForm(); 
	  //   t.set('transactions', transactions);
	  //   t.render('.app-flow');
	  // });

	  // app.route('/send', function(req) {
	  //   Y.one('h2').set('text', 'YUI3 Example App - ' + req.path.replace("/", ""));
	  //   app.showView('send');
	      
	  //   if (Y.one('.yui3-transactionform')) {
	  //     Y.one('.yui3-transactionform').remove();
	  //   }

	  // });

	  // app.route('/success', function(req) {
	  //   Y.one('h2').set('text', 'YUI3 Example App - ' + req.path.replace("/", ""));
	  //   this.showView('success');
	  // });

	  // app.route('/list', function(req) {
	  //   Y.one('h2').set('text', 'YUI3 Example App - ' + req.path.replace("/", ""));
	  //   this.showView('list');
	  // });



