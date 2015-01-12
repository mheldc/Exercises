var express     = require('express');
var app         = express();
var server      = require('http').createServer(app);
var io          = require('socket.io')(server);
var http                                = require('http');

app.set('port',process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

// routing
app.get('/', function (req, res) {
// Authentication
console.log(res.statusCode);
  res.sendfile(__dirname + '/public/client.html');
});

io.sockets.on('connection', function(socket)
{
    socket.on('auth_user', function(ud){
        console.log(ud);
        var options =   {
                            host:'54.255.176.250',
                            path:'http://54.255.176.250/authenticate?access='+ud.acode+'&user='+ud.uid
                        };
        
        http.get(options, function(res){
            res.statusCode;
            res.setEncoding('utf8');
            res.on('data', function(chunk){
                var JSONobj = JSON.parse(chunk);
                    console.log('User ' + ud.uname + ' joins in channel ' + ud.cid);
                    socket.join(ud.cid);
                    
                    //if(JSONobj['status'] == 200 && JSONobj['code'] == 'user_authenticated'){
                    if(res.statusCode === 200  && JSONobj['code'] == 'user_authenticated') {                           
                                    socket.emit('allow-chat-input',{allow: true, cid: ud.cid});
                    } else {
                                    socket.emit('allow-chat-input',{allow: true, cid: ud.cid});
                    }
            });
        }).on('error', function(e){
            console.log('Got an error : ' + e.message);
        });
       
    });

    socket.on('send-gm', function(ud){
        console.log(ud.username + ' is sending a message : [' + ud.msg + '] in channel ' + ud.cid);
        io.in(ud.cid).emit('update-ui', {msgtype: 'chatmessage', user: ud.username, msg: ud.msg, uavatar: ud.uavatar, cid:ud.cid});
    });
    
    socket.on('send-pm', function(ud){
       
    });
    
    socket.on('leave-room', function(ud){
        
    });
    
    socket.on('disconnect', function(ud){
        socket.broadcast.emit('update-ui', 'SERVER', socket.uname + ' leaves the chatroom');
        socket.leave(ud.cid);
    });
	
});

server.listen(app.get('port'), function(){
    console.log('Application is listening'); 
});
