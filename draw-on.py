#!/usr/bin/python

from Adafruit_Thermal import *
from PIL import Image
import PIL.ImageOps
import sys
import urllib, cStringIO

file = cStringIO.StringIO(urllib.urlopen(sys.argv[2]).read())
img = Image.open(file)

printer = Adafruit_Thermal(sys.argv[1], 19200, timeout=5)
printer.begin(heatTime=180)
printer.printImage(img, True)
printer.feed(3)

printer.sleep()      # Tell printer to sleep
printer.wake()       # Call wake() before printing again, even if reset
printer.setDefault() # Restore printer to defaults
