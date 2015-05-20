$(document).ready(function() {

$('.special.cards .image').dimmer({
  opacity: 0.10
})
.on('hover',function(){ $(this).dimmer('hide') })
.on('exit',function() { $(this).dimmer('show') })
.dimmer('show');

})