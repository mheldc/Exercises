var app     = require('express')();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

var mydb    = require('mysql');


var mycn;
mycn    = mydb.createConnection({
    host        : 'localhost',
    user        : 'gchatadmin',
    password    : 'gchatadmin'
});

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
});

app.get('/', function(req, res){
    res.sendfile(__dirname + '/public/client.html');
});

io.sockets.on('connection', function(socket){
    socket.on('')  
    
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
