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
		var client, player;

		$showcase.css({
			width: '320px',
			height: '240px',
			'background-color':'black'
		});
		var text = $('<div id="showcase-text"><a href="#showcase-text">press me to see the livestream...</a></div>').css({
			width: '320px',
			color: 'rgb(200,200,200)',
			opacity: '0.5',
			'font-size':'36px',
			'text-align':'center',
			'padding-top':'60px'
		})
		var paused = true;
		$showcase.html(text)
			.mouseenter(
			function(){
				$('#showcase-text').animate({
				opacity: '1'
				}, 300 )
			})
			.mouseleave(
			function(){
				$('#showcase-text').animate({
					opacity: '0.5'
				},300)
			}).click(
			function(e) {
				if (paused) {
					$showcase.css({
						'background-color':'rgba(0,0,0,0)'
					}).children().remove();
					$('.showcase').append( $('<canvas id="videoCanv" width=240 height=360></canvas>') );
					var canvas = $('#videoCanv')[0];
					var ctx = canvas.getContext('2d');
					ctx.fillStyle = 'rgba(0,0,0,0)';
					ctx.fillRect(0,0,canvas.width, canvas.height);
					client = new WebSocket( 'ws://stream.devrecord.com:8084' );
					player = new jsmpeg( client, { canvas : canvas } );
				} else {
					if (client) client.close();
					delete player;
				}
				paused = !paused;
			})
		setInterval(function(){
			if (!paused) {
				client = new WebSocket( 'ws://stream.devrecord.com:8084' );
				player = new jsmpeg( client, { canvas : canvas } );
			}
		}, 10*1000)
	}

	function start_cam( canvas ) {



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