$(document).ready(function() {

$('.special.cards .image').dimmer({
  opacity: 0.10
})
.on('hover',function(){ $(this).child('.dimmer').dimmer('hide') })
.dimmer('show');

})