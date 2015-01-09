/** @jsk React.DOM */
var React = require("react");

var ChatBox = React.createClass({displayName: 'ChatBox',
    render: function() {
        return React.createElement("div", null, " This is my first React element ");    
    }
});

var ChannelTitle = React.createClass({displayName: 'ChannelTitle',
    
});

React.renderComponent(React.createElement(ChatBox, null), document.body);