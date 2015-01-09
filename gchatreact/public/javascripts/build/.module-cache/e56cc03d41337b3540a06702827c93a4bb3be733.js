/*** jsx React.DOM */

var channelinfo = {channelid: "cid001", channelname: "Channel 1"};
var userinfo    = '{"access_code":"c4dd0719e446d58ba4b9b31ff51f90d4e70e99d0", "links":{   "avatar":"http://community.gamers.tm/zh/data/avatars/m/0/18.jpg?1417708907","detail":"http://community.gamers.tm/zh/api/index.php?users/18/"},"user_id":18,"username":"admin234"}' ;
var ud;

//var socket = io.connect('http://54.169.67.100:3000');
var socket = io.connect('http://localhost:2000');
var messages = [];

var GChatBoxUI = React.createClass({displayName: "GChatBoxUI",
    getInitialState: function() {
        return{ allowChat   : false,
                channelId   : '',
                channelName : 'Default Channel',
                userid      : '',
                username    : '',
                avatar      : '',
                lmessage    : '',
                timesent    : '',
                msgtype     : 'none',
                msgvisible  : false,
                noMessage   : true,
                data        : []
        }
    },
    componentDidMount: function() {
        socket.on('connect', this.ConnectToChat);
        socket.on('allow-chat-input', this.ChangeChatState);
        socket.on('update-ui', this.displayMessage);
    },
    ConnectToChat: function() {
        console.log('ConnectToChat');
        var obj = JSON.parse(this.props.udata);
        var cdata = this.props.channel;
        
        if (typeof obj.user_id !== 'undefined' && typeof obj.access_code !== 'undefined') {
                ud = {  uid     : obj.user_id,
                        uname   : obj.username,
                        avatar  : obj.links.avatar,
                        detail  : obj.links.detail,
                        acode   : obj.access_code,
                        cid     : cdata.channelid,
                        cname   : cdata.channelname,
                        message : ''
                    }
                        
                this.setState({
                    allowChat   : false,
                    channelId   : ud.cid,
                    channelName : ud.cname,
                    userid      : ud.uid,
                    username    : ud.uname,
                    avatar      : ud.avatar,
                    lmessage    : ud.message,
                    timesent    : '',
                    msgtype     : 'none',
                    msgvisible  : false,
                    noMessage   : true,
                    data        : []    
                });
                
                socket.emit('auth_user', ud);                
        }
    },
    ChangeChatState: function(data) {
        console.log('ChangeChatState');
        this.setState({allowChat: data.allow});
        this.render();
    },
    sendMessageViaKeyPress: function(e) {
        if (e.which === 13 && e.target.value.length > 0 ) {
            /* Sending message here */
            ud.message = e.target.value;
            socket.emit('send-gm', ud);
            e.target.value = '';
        }
    },
    sendMessageViaButton: function(e) {
        /* Sending message here */
        if (document.getElementById('chatdata').value.length > 0) {
            ud.message = document.getElementById('chatdata').value;
            socket.emit('send-gm', ud);
            document.getElementById('chatdata').value = ''
        } else {
            document.getElementById('chatdata').focus();
        }
    },
    displayMessage: function(sd){
        console.log('Display Message');
        if (typeof sd.msgtype !== 'undefined') {
            var today           = new Date();
            var months          = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            
            var tMonth  = months[today.getMonth()];
            var tDate, tHours, tMins, tSecs;
            
            tDate   = today.getDate();
            tHours  = today.getHours();
            tMins   = today.getMinutes();
            tSecs   = today.getSeconds();
            
            if (tDate.toString().length === 1) {
                tDate = '0' + tDate.toString();
            }
            
            if (tHours.toString().length === 1) {
                tHours = '0' + tHours.toString();
            }
            
            if (tMins.toString().length === 1) {
                tMins = '0' + tMins.toString();
            }
            
            if (tSecs.toString().length === 1) {
                tSecs = '0' + tSecs.toString();
            }
            
            var sendtime        = 'Sent on : ' +  months[today.getMonth()] + ' ' + tDate + ', ' + today.getFullYear() + ' ' + tHours + ':' + tMins + ':' + tSecs;
            
            this.state.data.push({username: sd.uname, avatar: sd.avatar, message: sd.message, timesent: sendtime , msgtype: sd.msgtype, msgvisible: true});
            this.setState({});
        }
        this.render();
    },
    render: function() {
        var chatui          = {height: 'inherit', width: 'inherit'};
        var channelinfo     = {height: '1px !important', textAlign: 'center', verticalAlign: 'middle', borderBottom: '1px solid Black'};
        var channelname     = {fontSize: '24px', padding: '0', margin: '0'};
        var chatbox         = {height: '70%', verticalAlign: 'top'};
        var chatmsgholder   = {height: '100%', overflowY:'auto'};
        var chatmsgs        = {padding: '0', listStyleType: 'none'};
        var chatdata;       
        var signin;         
        var textarea        = {height: '100%', width: '80%'};
        var button          = {fontFamily: 'Calibri', fontSize: '16px', height: '110%', width: '17%', right: '0', verticalAlign: 'top', marginLeft: '2px'};
        var td1and2         = {borderBottom: '1px solid Silver'};

        
        if (this.state.allowChat) {
            chatdata        = {height: '46px', verticalAlign: 'middle', visibility: 'visible'};
            signin          = {height: '46px', verticalAlign: 'middle', visibility: 'hidden', display:'none'};
        }
        else {
            chatdata        = {height: '46px', verticalAlign: 'middle', visibility: 'hidden', display:'none'};
            signin          = {height: '46px', verticalAlign: 'middle', visibility: 'visible'};
        }
        
        return (
                React.createElement("table", {style: chatui}, 
                    React.createElement("tr", {style: channelinfo}, 
                        React.createElement("td", {style: td1and2}, 
                            React.createElement("p", {style: channelname}, this.state.channelName)
                        )
                    ), 
                    React.createElement("tr", {style: chatbox}, 
                        React.createElement("td", {style: td1and2}, 
                            React.createElement("div", {style: chatmsgholder}, 
                                React.createElement("ul", {style: chatmsgs}, 
                                    React.createElement(ChatList, {data: this.state.data})
                                )
                            )
                        )
                    ), 
                    React.createElement("tr", {style: chatdata}, 
                        React.createElement("td", null, 
                            React.createElement("input", {type: "text", id: "chatdata", placeholder: "Type a message", style: textarea, onKeyPress: this.sendMessageViaKeyPress}), 
                            React.createElement("button", {id: "btnsend", style: button, onClick: this.sendMessageViaButton}, "Send")
                        )
                    ), 
                    React.createElement("tr", {style: signin}, 
                        React.createElement("td", null, 
                            "Please Sign in to use chat."
                        )
                    )
                )    
        )    
    } 
});

var ChatMessage = React.createClass({displayName: "ChatMessage",
    render: function () {
        console.log(this.props.username);
        console.log(this.props.avatar);
        console.log(this.props.message);
        console.log(this.props.timesent);
        
        var msgcontainer    = {border: '1px solid black', height: 'auto', position: 'relative', marginTop: '5px', display: 'flex'};
        var avatarholder    = {float: 'left', marginRight: '3px'};   
        var avatarimg       = {marginLeft: '3px', marginTop: '3px',borderRadius: '5px 5px 5px 5px', border:'1px solid Silver'};
        var msgcontainer2   = {float: 'left', width: '85%', right: '0'};
        var message         = {marginLeft: '3px', textAlign: 'justify'};
        var dtmsgsent       = {fontFamily: 'Calibri', float: 'right', marginRight:'3px'};
        var userholder      = {marginLeft: '3px'};
        var msgline;
        
        var newmsg = '';
        
        if (this.props.msgvisible) {
            msgline = {visibility:'visible'};
            
            if (this.props.message.length > 39) {
                for(var i = 0; i < this.props.message.length; i += 39) {
                    newmsg = newmsg + this.props.message.substring(i, i + 39) + '\n';
                }
            }
            else{
                newmsg = this.props.message;
            }
        }
        else {
            //msgline = {visibility:'hidden', display:'none'};
            return null;
        }
        
        return (
                React.createElement("li", {style: msgline}, 
                    React.createElement("div", {style: msgcontainer}, 
                        React.createElement("div", {style: avatarholder}, 
                          React.createElement("img", {style: avatarimg, alt: "User-Avatar", height: "46px", width: "46px", src: this.props.avatar})
                        ), 
                        React.createElement("div", {style: msgcontainer2}, 
                            React.createElement("label", {style: userholder}, this.props.username), 
                            React.createElement("p", {style: message}, 
                                newmsg
                            ), 
                            React.createElement("label", {style: dtmsgsent}, this.props.timesent)
                        )
                    )
                )
                ) 

    }    
});

var NotifyChat = React.createClass({displayName: "NotifyChat",
    getInitialState: function() {
        return({showMessage: false, messageType: 'none', channelId: '', channelName: '', userid: '', username: ''})  
    },
    render: function() {
        var notifyContainer     = {border: '1px solid black', height: 'auto', position: 'relative', marginTop: '5px', display: 'flex'}
        var notifyContainer2    = {border: '1px solid gray', float: 'left', width: '100%', right: '0'}
        var message             = {textAlign: 'center'} 
        var msgline;
        
        if (this.state.showMessage) {
            msgline = {visibility:'visible'};
        }
        else {
            msgline = {visibility:'hidden', display:'none'};
        }
        
        return(
            React.createElement("li", {style: msgline}, 
                React.createElement("div", {style: notifyContainer}, 
                    React.createElement("div", {id: "chat-message", style: notifyContainer2}, 
                        React.createElement("p", {id: "imsg-{this.props.cid}", style: message}, 
                            "Welcome to ", this.props.channelName, " user ", this.props.userName
                        )
                    )
                )
            )
        )
    }
});

var ChatList = React.createClass({displayName: "ChatList",
    render: function() {
        //console.log(this.props.data);
        return (React.createElement("div", null, 
                    this.props.data.map(function(c) {
                        return React.createElement(ChatMessage, {message: c.message, avatar: c.avatar, username: c.username, timesent: c.timesent, msgvisible: c.msgvisible});
                    })
                ))
    }
});


React.render(React.createElement(GChatBoxUI, {channel: channelinfo, udata: userinfo}), document.getElementById('chatbox'));


