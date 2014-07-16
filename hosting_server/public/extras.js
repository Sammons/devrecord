function load_dependency(url, finished_cb) {
    console.log('loading',url)
    var headTag = document.getElementsByTagName("head")[0];
    var newTag = document.createElement('script');
    newTag.type = 'text/javascript';
    newTag.src = url;
    newTag.onload = finished_cb;
    headTag.appendChild(newTag);
}

var initialize_camera_view = function() {
	var $cam_view = this.$this = $(this);
	$cam_view.canvas = document.createElement('canvas');
	$cam_view.canvas.width = 320;
	$cam_view.canvas.height = 240;
	$cam_view.css('padding-top','20px')
	var width = '320px';
	var height = '240px';
	$cam_view.width(width).height(height)
	$cam_view.context = $cam_view.canvas.getContext('2d');
	$cam_view.append($cam_view.canvas)
	$cam_view.cam_on = false;

	$cam_view.mouseenter(
			function(){
				$cam_view.children('.showcase_msg').animate({
				opacity: '1'
				}, 300 )
			})
			.mouseleave(
			function(){
				$cam_view.children('.showcase_msg').animate({
					opacity: '0.5'
				},300)
			}).click(
			function(e){
				if ($cam_view.cam_on) $cam_view.stop_camera();
				else $cam_view.begin_camera();
			})

	$cam_view.begin_camera = function() {
		$cam_view.cam_on = true;
		$($cam_view.canvas).show();
		$($cam_view).css('background-color','transparent').css('color','black');
		if ($cam_view.msg) { $($cam_view).children('.showcase_msg').remove();  delete $cam_view.msg}
		if (!$cam_view.socket) $cam_view.socket = new WebSocket( 'ws://stream.devrecord.com:8084' );
		if (!$cam_view.jsmpg) $cam_view.jsmpg = new jsmpeg( $cam_view.socket, {canvas: $cam_view.canvas})
	}

	$cam_view.stop_camera = function() {
		$cam_view.cam_on = false;
		if ($cam_view.socket) $cam_view.socket.close();
		if ($cam_view.jsmpg) delete $cam_view.jsmpg;
		if (!$cam_view.msg) {
			$($cam_view).css('background-color','black').css('color','white')
			$($cam_view.canvas).hide();
			$cam_view.context.fillStyle = 'rgba(0,0,0,0)';
			$cam_view.context.fillRect(0,0,$cam_view.canvas.width, $cam_view.canvas.height);
			$cam_view.msg = $('<div class="showcase_msg">press me to see the spark livestream...</div>')
						.css({
							width: '320px',
							color: 'rgb(200,200,200)',
							opacity: '0.5',
							'font-size':'36px',
							'text-align':'center',
							'padding-top':'30px',
							'text-decoration':'none',
							'cursor':'pointer'
						})
			$($cam_view).append($cam_view.msg);
		}
	}
	$cam_view.toggle_cam = function() {
		if ($cam_view.cam_on) return $cam_view.stop_camera();
		return $cam_view.begin_camera();
	}
	$cam_view.stop_camera();
}

var initialize_camera_views = function() {
	$('.camera-stream').each(function() {
		var element = this;
		initialize_camera_view.call(element);
	})
}

function begin() {
	load_dependency('http://stream.devrecord.com/jsmpg.js',
		function() {
			initialize_camera_views();	
		})
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