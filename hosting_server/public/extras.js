function load_dependency(url, finished_cb) {
    var headTag = document.getElementsByTagName("head")[0];
    var newTag = document.createElement('script');
    newTag.type = 'text/javascript';
    newTag.src = url;
    newTag.onload = finished_cb;
    headTag.appendChild(newTag);
}

function begin() {
	$(document).ready(function(){
		//dependencies
		load_dependency('http://stream.devrecord.com/jsmpg.js',initialize_camera_view)
	});

	function initialize_camera_view() {
		var $showcase = $('.showcase');
		$showcase.append( $('<canvas id="videoCanv" width=240 height=360></canvas>') );
		var canvas = $('#videoCanv')[0];
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgba(0,0,0,0)';
		ctx.fillRect(0,0,canvas.width, canvas.height);
		var client = new WebSocket( 'ws://stream.devrecord.com:8084' );
		var player = new jsmpeg( client, { canvas : canvas } );
		setInterval(function(){
			client = new WebSocket( 'ws://stream.devrecord.com:8084' );
			player = new jsmpeg( client, { canvas : canvas } );
		}, 30*60*1000)
	}
}


if(typeof jQuery=='undefined') {
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = "//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js";
    jqTag.onload = begin;
    headTag.appendChild(jqTag);
} else {
     begin();
}