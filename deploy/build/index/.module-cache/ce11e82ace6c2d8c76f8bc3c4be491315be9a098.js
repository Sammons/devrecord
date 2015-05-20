$(document).ready(function() {

	$('.cards .image').dimmer({
	  opacity: 0.10
	})
	.dimmer('show');

$('.with-tooltip')
  .popup({
    inline   : true,
    hoverable: true,
    position : 'bottom right',
    delay: {
      show: 100,
      hide: 10
    }
  });

  $('.that-is-always-visible').dimmer({
  	opacity: 0.9
  }).dimmer('show');

})