/** @jsk React.DOM */
var React = require("react");

var ChatBox = React.createClass({displayName: 'ChatBox',
    render: function() {
        return React.createElement("div", null, " This is my first React element ");    
    }
});

var ChannelTitle = React.createClass({displayName: 'ChannelTitle',
   remder: function() {
        return React.createElement("div", null, " Channel Id 1 ") 
   } 
});

React.renderComponent(React.createElement(ChatBox, null), document.body);