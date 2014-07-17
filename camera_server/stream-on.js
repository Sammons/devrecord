var child_process = require('child_process');
var child;
var stuff = [];
var time_to_die = false;

function restart() {
 if (child) child.kill();

 child = child_process.exec('./ffmpeg -s 320x240 -f video4linux2 -i /dev/video0 -f mpeg1video -b:v 700k -r 30 http://162.243.151.153:8082/'+process.env.CAM_PASS+'/320/240/'
	,function(e,s,er) {
		if (!time_to_die) restart();
		console.log(e,s,er)
	})
}

restart();
setInterval(function(){

})
setInterval(function(){
	try{
	
	time_to_die = true;
	restart();
	time_to_die = false;

	} catch(e){ console.log(e) }
},1000*60*5)

