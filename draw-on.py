#!/usr/bin/python

from Adafruit_Thermal import *
from PIL import Image
import PIL.ImageOps
import sys

printer = Adafruit_Thermal("/dev/tty.usbserial", 19200, timeout=5)
printer.begin(heatTime=180)
printer.printImage(Image.open(sys.argv[1]), True)
printer.feed(3)

printer.sleep()      # Tell printer to sleep
printer.wake()       # Call wake() before printing again, even if reset
printer.setDefault() # Restore printer to defaults
