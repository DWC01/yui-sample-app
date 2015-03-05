#!/usr/bin/env node

var express = require('express'),
	app = express();


// GET /static/style.css etc.
app.use('/app', express.static(__dirname + '/app'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Handles all other requests by redirecting the browser back to the root path
// and tacking on URL's path as the fragment; e.g. "/foo/" => "/#/foo/".
app.get('*', function (req, res) {
    res.redirect('/#' + req.url);
});

app.listen(3000);

console.log("  Listening on : 3000")