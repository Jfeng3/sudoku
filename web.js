var express = require('express');
var logfmt = require('logfmt');

var app = express();
app.use(logfmt.requestLogger());
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    return res.render('pages/sudoku.jade');
});

app.get('*', function(req, res) {
    return res.redirect('/');
});

var port = 8080; //default to 8080. TODO use an environment var
app.listen(port, function() {
    console.log('Listening on ' + port);
});