var child_process = require('child_process');
var child;
var stuff = [];

function restart() {
 if (child) child.kill();
 child = child_process.exec('./ffmpeg -s 320x240 -f video4linux2 -i /dev/video0 -f mpeg1video -b:v 700k -r 30 http://162.243.151.153:8082/'+process.env.PASSWORD+'/320/240/'
	,function(e,s,er) {
		console.log(e,s,er)
	})
}


setInterval(function(){
	try{
	restart();
	} catch(e){ console.log(e) }
},1000*60*5)
