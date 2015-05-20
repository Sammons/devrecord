$(document).ready(function() {

	$('.cards .image').dimmer({
	  opacity: 0.10
	})
	.dimmer('show');

$('.tipped')
  .popup({
    inline   : true,
    hoverable: true,
    position : 'right',
    delay: {
      show: 100,
      hide: 10
    }
  })

})