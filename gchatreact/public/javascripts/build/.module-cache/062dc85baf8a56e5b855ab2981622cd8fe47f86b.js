/*** @jsx React.DOM */

React.render(
     React.createElement("p", null, " Channel Info "),
     document.getElementById('chlinfo')
);

React.render(
    React.createElement("table", {id: "tblmsg"}),
    document.getElementById('chatholder')
);

React.render(
    React.createElement("div", null, 
        React.createElement("input", {type: "text"}), 
        React.createElement("button", null, " Send ")
    ),
    document.getElementById('chatdata')
);