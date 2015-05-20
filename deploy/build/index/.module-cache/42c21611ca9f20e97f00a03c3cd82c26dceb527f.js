$(document).ready(function() {

$('.special.cards .image').dimmer({
  opacity: 0.10
})
.on('mouseenter',function(){ $(this).dimmer('hide') })
.dimmer('show');

})