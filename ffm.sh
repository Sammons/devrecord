./ffmpeg -s 320x240 -f video4linux2 -i /dev/video0 -f mpeg1video -b:v 700k -r 30 http://162.243.151.153:8082/pass/320/240/
