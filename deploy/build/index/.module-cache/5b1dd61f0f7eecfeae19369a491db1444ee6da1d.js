$(document).ready(function() {

	$('.cards .image').dimmer({
	  opacity: 0.10
	})
	.dimmer('show');

$('.tipped')
  .popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 100,
      hide: 10
    }
  })

})