$(document).ready(function() {

	$('.cards .image').dimmer({
	  opacity: 0.10
	})
	.dimmer('show');

$('.example .menu .browse')
  .popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 300,
      hide: 800
    }
  })

})