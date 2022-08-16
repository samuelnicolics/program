#!/bin/bash

/usr/bin/ffmpeg -r 301/12 -rtsp_transport tcp -i rtsp://10.15.253.11/media/video1 -c:v mpeg4 -vb 7000k -f mpegts -vcodec mpeg2video -qmax 12 -acodec copy udp://239.0.1.1:1234?pkt_size=1316 -vsync 1 -async 1 -nostdin -loglevel quiet
