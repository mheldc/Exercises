/*** @jsx React.DOM */

var React = require("react");

//React.render(
//  <h1>Hello, world!</h1>,
//  document.getElementById('example')
//);

React.render(
    React.createElement("div", {id: "channelId", style: "border: 1px solid gray;"}, " Channel A "),
    document.getElementById('chlinfo')
);
