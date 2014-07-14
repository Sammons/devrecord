function load_dependency(url, finished_cb) {
    console.log('loading',url)
    var headTag = document.getElementsByTagName("head")[0];
    var newTag = document.createElement('script');
    newTag.type = 'text/javascript';
    newTag.src = url;
    newTag.onload = finished_cb;
    headTag.appendChild(newTag);
}

function begin() {
	load_dependency('http://stream.devrecord.com/jsmpg.js',initialize_camera_view)
	function initialize_camera_view() {
		console.log('loading camera stuff')
		var $showcase = $('.showcase');
		stop_cam('press me to see the livestream...');
		var paused = true;
		$showcase.mouseenter(
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
					var page = [];
					var same_count = 0;
					player.nothing_changing_check = setInterval(function(){
						if (!paused) {
								var canvas = $('#videoCanv')[0];
								if (!canvas) return;
								var context = canvas.getContext('2d');
								var data = context.getImageData(0,0,canvas.width, canvas.height);
								for (var i = 0; i < data.data.length; i++) {
									if (page.data && page.data[i] != data.data[i]) {
										same_count++;
										page = data;
										break; 
									}else if (!page.data) {
										page = data
										break;
									} else if (same_count > 10) {
										nothing_to_see = true;
										same_count = 0;
										stop_cam('Nothing seems to be going on on the camera right now...');
										page = [];
									}
								}
						} else {
						}
					},1000)
				} else {
					$showcase.css({
						'background-color':'rgba(0,0,0,0)'
					}).children().remove();
					if (client) client.close();
					delete player;
					stop_cam('press me to see the livestream...');
				}
				paused = !paused;
			})
		var page = [];

		setInterval(function(){
			if (!paused) {
				client.close();
				client = new WebSocket( 'ws://stream.devrecord.com:8084' );
				player = new jsmpeg( client, { canvas : canvas } );
			}
		}, 60*1000*5)
	}

	function stop_cam( t ) {
		var $showcase = $('.showcase');

		$showcase.css({
			width: '320px',
			height: '240px',
			'background-color':'black'
		});
		var text = $('<div id="showcase-text">'+t+'</div>')
			.css({
				width: '320px',
				 color: 'rgb(200,200,200)',
				opacity: '0.5',
				'font-size':'36px',
				'text-align':'center',
				'padding-top':'60px',
				'text-decoration':'none',
				'cursor':'pointer'
			})
		$showcase.html(text);

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