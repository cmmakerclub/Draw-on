#!/usr/bin/python

from Adafruit_Thermal import *
from PIL import Image
import PIL.ImageOps
import sys
import urllib, cStringIO
from Pubnub import Pubnub

pubnub = Pubnub(publish_key="demo", subscribe_key="demo")
def _callback(message, channel):

  printer = Adafruit_Thermal(sys.argv[1], 19200, timeout=5)
  printer.begin(heatTime=180)

  printer.println(message["text"])

  printer.feed(3)

  printer.sleep()      # Tell printer to sleep
  printer.wake()       # Call wake() before printing again, even if reset
  printer.setDefault() # Restore printer to defaults

def _error(message):
  print(message)

pubnub.subscribe(channels="astatus", callback=_callback, error=_error)
