#!/bin/bash

ffmpeg -loop 1 -i ~/Desktop/bild.jpg -f mpegts udp://239.0.1.1:1234