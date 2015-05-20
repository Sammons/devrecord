var React = require('react');

var Header = React.createClass({displayName: "Header",
	getInitialState: function() {
		return {title: ''};
	},
	render: function() {
		return (
		React.createElement("div", null, this.props.title)
		
		);
	}
});

React.render(
	React.createElement(Header, {title: "Devrecord"}),
	document.getElementById('header')
	); 