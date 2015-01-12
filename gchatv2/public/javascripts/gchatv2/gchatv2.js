$.fn.initChatBox = function(chl, usr)
{
    var chatUI;
    var msgNotify;
    var msgChat;

    var socket;
    /* User Information */
    var uid, uname, avatar, detail, acode;
    /* Channel Information */
    var chid, chname;
    /* Date Params */
    var dt;
    var btnname, txtname, txtctrl, inputctrl, gchatdiv;
    var ud;
    var notify='';

    dt          = new Date();

    //socket      = io.connect('http://54.169.67.100:3000');
    socket      = io.connect('http://localhost:3000');

    /* Checking if templates are properly loaded
        alert(chatUI);
        alert(msgNotify);
        alert(msgChat);
    */;


    if (typeof chl.id == 'undefined' && typeof chl.title == 'undefined') {
        chid = '1';
        chname = 'Chat Room ' + chid;
    } else {
        chid = chl.id;
        chname = chl.title;
    }

    chatUI      = $('#chatui').html().replace(/{cid}/ig,chid);
    msgNotify   = $('#gchatnotify').html().replace(/{cid}/ig,chid);
    msgChat     = $('#chatms').html().replace(/{cid}/ig,chid);

    if (usr.user_id && usr.access_code) {
        uid         = usr.user_id;
        uname       = usr.username;
        avatar      = usr.links.avatar;
        detail      = usr.links.detail;
        acode       = usr.access_code;
    } else {
        uid         = dt.getMonth() +''+ dt.getDay() +''+ dt.getFullYear() +''+ dt.getHours() +''+ dt.getMinutes() +''+ dt.getSeconds();
        uname       = 'Guest'+ uid;
        avatar      = '/assets/images/gchat-anoni-user.png';
        detail      = 'none';
        acode       = uid;
    }

    gchatdiv        = '#'+this.attr('id');
    btnname         = '#btn-'+chid;
    txtname         = '#msgs-'+chid;

    $(window).resize(function(){
        $( gchatdiv ).css('height','100% !important');
    });

    $(window).on('user_logged_in', function(){
        location.reload(5);
    });

    $(gchatdiv).on("click", btnname, function(){
        txtctrl = '#msgs-'+chid;
        ud = {
            userid        : uid,
            username      : uname,
            uavatar       : avatar,
            udetail       : detail,
            access_code   : acode,
            cid           : chid,
            cname         : chl.title,
            msg           : $(txtctrl).val()
         };
        /* 12-12-2014 : Added condition if user tries to send empty message to chat  */
        if ($(txtctrl).val().length > 0) {
            socket.emit('send-gm', ud);
            $(txtctrl).val('');
            $(txtctrl).focus();
        }
    });

    $(gchatdiv).on("keypress", txtname, function(evt){
        if (evt.which == 13) {
            txtctrl = '#msgs-'+chid;
            ud = {
                userid        : uid,
                username      : uname,
                uavatar       : avatar,
                udetail       : detail,
                access_code   : acode,
                cid           : chid,
                cname         : chl.title,
                msg           : $(txtctrl).val()
             };
            /* 12-12-2014 : Added condition if user tries to send empty message to chat  */
            if ($(txtctrl).val().length > 0) {
                socket.emit('send-gm', ud);
                $(txtctrl).val('');
                $(txtctrl).focus();
            }
        }
    });

    socket.on('connect', function()
    {
        ud = {
                userid        : uid,
                username      : uname,
                uavatar       : avatar,
                udetail       : detail,
                access_code   : acode,
                cid           : chid,
                cname         : chl.title
            };
        socket.emit('auth_user',ud);
    });

    socket.on('allow-chat-input', function(sd){
        if(sd.allow === false){
            $('#chatinputs-'+ sd.cid).css({display: 'none', zIndex: -1});
            //$('#notifylogin-'+sd.cid).css({'display':'block', 'color':'black', 'font-weight':'bolder'});
            $('#notifylogin-'+sd.cid).css({display: 'block', zIndex: 1});
        } else {
            $('#chatinputs-'+ sd.cid).css({display: 'block', zIndex: 1});
            $('#notifylogin-'+sd.cid).css({display: 'none', zIndex: -1});
        }
        console.log('Chat allow status : ' + sd.allow.toString());
    });

    socket.on('update-ui', function(sd){

        var today   = new Date();
        var tinmins;
        var timesent, elem;
        
        if (sd.cid == chl.id) {
            if (sd.msgtype == 'notification') {
                msgbox      = '#tblchatmsgs-' + sd.cid;
                $(msgbox).append(msgNotify.replace(/{gchat-message}/ig,sd.msg));
            }
            else {
                
                /* 12-12-2014 : Added condition if user sends empty message  */
                if (sd.msg.length > 0) {
                    if (today.getMinutes() < 10) {
                        tinmins = '0' + today.getMinutes()
                    } else {
                        tinmins = today.getMinutes();
                    }

                    msgbox      = '#tblchatmsgs-' + sd.cid;
                    if (today.getHours() > 11) {
                        timesent = today.getHours() + ':' + tinmins + 'PM';
                    }
                    else {
                        timesent = today.getHours() + ':' + tinmins + 'AM';
                    }
                    
                    /*
                        12-23-2014 : Added function when user inputs continious text that would cause
                        the chat UI to break
                        
                        01-05-2015 : Change the string length to check where to cut and will make the chat message
                                     fit to the chat box.
                     */
                    
                    var chatmsg = [];
                    var hasContiniousText = false;
                    var newstring = '';
                    
                    chatmsg = sd.msg.split(' ');
                    for (var i = 0; i < chatmsg.length; i++){
                        if (chatmsg[i].length >= 35) {
                            hasContiniousText = true;
                            console.log(chatmsg[i] + ' : true');
                        } else {
                            console.log(chatmsg[i] + ' : false');
                        }
                    }
                    
                    if (hasContiniousText) {
                        if (sd.msg.length >= 35) {
                            for(var i = 0; i < sd.msg.length; i += 35) {
                                newstring = newstring + sd.msg.substring(i, i + 35) + '\n';
                            }
                        } else {
                            //console.log('Something\'s wrong');
                            newstring = sd.msg;
                        }                        
                    }
                    else {
                        newstring = sd.msg;
                    }
                    
                    

                    
                    $(msgbox).append(msgChat.replace(/{message}/ig,newstring).replace(/{username}/ig, sd.user).replace(/{avatar}/ig, sd.uavatar).replace(/{timesent}/ig, 'Sent on ' + timesent));    
                    //$(msgbox).append(msgChat.replace(/{message}/ig,sd.msg).replace(/{username}/ig, sd.user).replace(/{avatar}/ig, sd.uavatar).replace(/{timesent}/ig, 'Sent on ' + timesent));
                }
            }

           x = elem = document.getElementById('chcontainer-'+sd.cid);
           elem.scrollTop = elem.scrollHeight;
        }
    });

    socket.on('createroom', function(user, newchannel){
        socket.emit('newroom',{username: user, channel: newchannel})
    });

    socket.on('leaveroom', function(user){
        socket.emit('leaveroom',{username : user})
    });

    this.append(chatUI);
    return false;
};
