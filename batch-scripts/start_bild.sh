#!/bin/bash

/usr/bin/ffmpeg -loop 1 -i /home/streamere04/Desktop/bild.jpg -f mpegts udp://239.0.1.1:1234
