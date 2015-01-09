/*** @jsx React.DOM */

React.render(
     <p> Channel Info </p>,
     document.getElementById('chlinfo')
);

React.render(
    <table id="tblmsg"></table>,
    document.getElementById('chatholder')
);

React.render(
    <div>
        <input type="text" />
        <button> Send </button>
    </div>,
    document.getElementById('chatdata')
);