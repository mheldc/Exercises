/*** @jsx React.DOM */

//React.render(
//  <h1>Hello, world!</h1>,
//  document.getElementById('example')
//);

React.render(
    React.createElement("div", {id: "channelId", style: "border: 1px solid gray;"}, " Channel A "),
    document.getElementById('chlinfo')
);

React.render(
    React.createElement("div", {id: "chatdisp"}, 
        React.createElement("table", {id: "tblmsgs"})
    ),
    document.getElementById('chatholder')
);