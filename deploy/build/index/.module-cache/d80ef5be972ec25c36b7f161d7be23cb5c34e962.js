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
	React.createElement("div", null, 
	React.createElement(Header, {title: "Devrecord"}), 
	React.createElement(Header, {title: "what?"})
	),
	document.getElementById('header')
	); 