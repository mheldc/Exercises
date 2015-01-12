var notifierTpl, chatMsgTpl;

$.fn.initChatBox = function(chl, usr){
    this.load('/javascripts/gchatv2/templates.html', function(content){
        var user = $.parseJSON(usr);
        var channel = $.parseJSON(chl);
        ProcessChat(channel, user, content);
    });
    
    $.get('/javascripts/gchatv2/chatmsg.html', function (content){
        getChatTemplate(content);
    });
    
    $.get('/javascripts/gchatv2/chatnotifier.html', function(content){
        getNotifierTemplate(content);
    });
};

function ProcessChat(channel, user, htmlContent) {
    
    
    // Initializing the socket.io
    var socket      = io.connect();
    /* User Information */
    var uid, uname, avatar, detail, acode;
    
    uid         = user.user_id;
    uname       = user.username;
    avatar      = user.links.avatar;
    detail      = user.links.detail;
    acode       = user.access_code;
    
    alert(uid + '\n' + uname + '\n' + avatar + '\n' + detail + '\n' + acode);
    
    
    /* Channel Information */
    var channelid = channel.id;
    var channelname = channel.title;
    
    alert(channelid + '\n' + channelname);
        
    if (channel.length == 0) {
        channel = 'Chat Room';
    }
        
    var htmlObj;
    
    var divhead     = $(htmlContent).filter('div').eq(0).attr('id');
        $('#' + divhead).html(channelname);
        
    var divcontent  = $(htmlContent).filter('div').eq(1).attr('id');
    var divsender   = $(htmlContent).filter('div').eq(2).attr('id');  
        
    htmlObj         = $('#' + divsender).html();
    var btnsender   = $(htmlObj).filter('button').attr('id');
    var txtmessage  = $(htmlObj).filter('textarea').attr('id');
    
    $('#' + btnsender).on('click', function(){
        var message = $('#' + txtmessage).val();
        //postChatMessage('','useriii', message, chatMsgTpl);        
        socket.emit('sendchat',{usr:user, uavtr:avatar, msg:message});
        $('#' + txtmessage).val('');
        $('#' + txtmessage).focus();
       
    });
    
    /* Event Trigger for text area when ENTER key is pressed.*/
    $('#' + txtmessage).on('keypress', function(evt){
        if (evt.which == 13) {
        var message = $('#' + txtmessage).val();
        socket.emit('sendchat',{usr:user, uavtr:avatar, msg:message});
            $('#' + txtmessage).val('');
            $('#' + txtmessage).focus(); 
        }
    });
    
    
    socket.on('connect', function(){
        socket.emit('validateuser',{userid   : uid, accesscd : acode});
    });
    
    socket.on('uservalidated', function(data){
        socket.emit('adduser',{userid   : uid,
                                   usernm   : uname,
                                   uavatar  : avatar,
                                   udetail  : detail,
                                   accesscd : acode,
                                   chid     : channelid,
                                   chname   : channelname
                                   });
        /*
        if (data.validated == 'true') {
            socket.emit('adduser',{userid   : uid,
                                   usernm   : uname,
                                   uavatar  : avatar,
                                   udetail  : detail,
                                   accesscd : acode,
                                   chid     : channelid,
                                   chname   : channelname
                                   });              
        } else {
            $('#' + txtmessage).attr('readonly','readonly');
            $('#' + btnsender).attr('disabled','disabled');
        }
        */
    });
    
    socket.on('userauthenticated', function(){
        socket.emit('adduser',{username:uname, uavatar:avatar, chid:channelid});
    });
    
    socket.on('createroom', function(user, newchannel){
        socket.emit('newroom',{username: user, channel: newchannel})
    }); 
    
    socket.on('leaveroom', function(user){  
        socket.emit('leaveroom',{username : user})
    });

    socket.on('updatechat', function(username, data){
        if (username == 'SERVER') {
            postNotifierMessage(data, notifierTpl);
        } else {
            alert(data.uavatar+ '\n' + data.message);
            postChatMessage(data.uavatar,username,data.message,chatMsgTpl);
        }
    });
};

function getNotifierTemplate(htmlTemplate) {
    notifierTpl = htmlTemplate;
};

function getChatTemplate(htmlTemplate) {
    chatMsgTpl = htmlTemplate;
};

function postChatMessage(avatar, username, message, usedtemplate) {
    if (message.length > 0) {
        var today = new Date();
        var timesent;
        
        if (today.getHours() > 12) {
            timesent = today.getHours() + ':' + today.getMinutes() + 'PM';
        } else {
            timesent = today.getHours() + ':' + today.getMinutes() + 'AM';
        }
            
        alert(avatar);
        
        var newtpl = usedtemplate.replace('{avatar}',avatar);
            newtpl = newtpl.replace('{username}',username);
            newtpl = newtpl.replace('{message}',message);
            newtpl = newtpl.replace('{timesent}','Sent on ' + timesent);
        $('#tblchatmsgs').append(newtpl);
        
        window.setInterval(function() {
            var elem = document.getElementById('chcontainer');
            elem.scrollTop = elem.scrollHeight;
        }, 2000);      
    } else {
        window.setInterval(function() {
            var elem = document.getElementById('chcontainer');
            elem.scrollTop = elem.scrollHeight;
        }, 2000);         
    }
};

function postNotifierMessage(message, usedtemplate) {
    var tmpl = usedtemplate.replace('{message}', message);
    $('#tblchatmsgs').append(tmpl);
    window.setInterval(function() {
        var elem = document.getElementById('chcontainer');
        elem.scrollTop = elem.scrollHeight;
    }, 2000);   
};




