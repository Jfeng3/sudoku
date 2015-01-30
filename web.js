var express = require('express');
var logfmt = require('logfmt');
var lessMiddleware = require('less-middleware');

var app = express();
app.use(logfmt.requestLogger());
app.use('/public', lessMiddleware(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));

//top level "generates" a board and opens up the client, initialized with this board
app.get('/', function(req, res) {
    return res.render('pages/sudoku.jade', {
        //In real life, you'd generate a board
        GENERATED_BOARD: [[5,3,0,0,7,0,0,0,0],
                          [6,0,0,1,9,5,0,0,0],
                          [0,9,8,0,0,0,0,6,0],
                          [8,0,0,0,6,0,0,0,3],
                          [4,0,0,8,0,3,0,0,1],
                          [7,0,0,0,2,0,0,0,6],
                          [0,6,0,0,0,0,2,8,0],
                          [0,0,0,4,1,9,0,0,5],
                          [0,0,0,0,8,0,0,7,9]]
    });
});

//redirect everything else to the top-level
app.get('*', function(req, res) {
    return res.redirect('/');
});

var port = 8080; //default to 8080. TODO use an environment var
app.listen(port, function() {
    console.log('Listening on ' + port);
});