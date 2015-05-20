$(document).ready(function() {


$('.with-tooltip')
  .popup({
    inline   : true,
    hoverable: true,
    delay: {
      show: 100,
      hide: 10
    }
  });

  $('.that-is-always-visible').dimmer({
  	opacity: 0.10
  }).dimmer('show');

})