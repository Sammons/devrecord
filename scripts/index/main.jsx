var React = require('react');

var Header = React.createClass({
	getInitialState: function() {

	},
	render: function() {
		<div>Welcome</div>
	}
});

React.render(
	<Header/>,
	document.getElementById('header')
	);