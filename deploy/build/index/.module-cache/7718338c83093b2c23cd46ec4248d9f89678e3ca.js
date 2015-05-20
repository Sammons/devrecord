var React = require('react');

var Header = React.createClass({displayName: "Header",
	getInitialState: function() {
		return {};
	},
	render: function() {
		React.createElement("div", null, "Welcome")
	}
});

React.render(
	React.createElement(Header, null),
	document.getElementById('header')
	); 