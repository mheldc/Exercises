/*** @jsx React.DOM */

React.render(
  React.createElement("h1", null, "Hello, world!"),
  document.getElementById('example')
);

React.render(
    React.createElement("div", {id: "channelId"}, " Channel A "),
    document.getElementById('chlinfo')
);

React.render(
    React.createElement("div", {id: "chatdisp"}, 
        React.createElement("table", {id: "tblmsgs"})
    )
);