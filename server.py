from flask import Flask, request, make_response,render_template, send_from_directory
import os
import base64
from os import listdir
from os.path import isfile, join
from cStringIO import StringIO
import numpy as np
from functools import partial
import json
import PIL.Image
#from skimage import data
from scipy.ndimage import map_coordinates
from scipy.ndimage import geometric_transform 
import scipy.ndimage as nd 
import random

app = Flask(__name__)

@app.route("/")
def display_canvas():
  return render_template('index.html')

#@app.route("/faces")
#def faces():
#  return makeGallery("./faces")
#
#@app.route('/faces/<path:path>')
#def faces_send(path):
#    return send_from_directory('faces', path)

latest_camera_picture = None
latest_projection_image = None


#@app.route("/get_projection_image")
#def get_image():
#  global store
#  image_binary = store.get()
#  if not image_binary:
#    return ""
#  response = make_response(image_binary)
#  response.headers['Content-Type'] = 'image/jpeg'
#  return response
#
@app.route("/camera_image")
def get_image():
  global latest_camera_picture 
  if latest_camera_picture == None: return ""

  image_binary = StringIO()
  PIL.Image.fromarray(latest_camera_picture).save(image_binary, format='jpeg')
  
  filename = 'latest_later.jpg' 
  print "Saving: ", filename
  open(filename, "wb").write(image_binary.getvalue());
  
  response = make_response(image_binary.getvalue())
  response.headers['Content-Type'] = 'image/jpeg'
  return response

@app.route("/camera_image", methods=['POST'])
def post_image():
  global latest_camera_picture 
  #print dir(request)
  #print request.data
  #print request.form
  #tag = request.form['tag']
  #crop = request.form['crop']
  data_json = json.loads(request.data) 
  prefix = "data:image/jpeg;base64,"
  base64str = data_json["img"]
  if base64str.startswith(prefix): base64str = base64str[len(prefix):]
  img_buffer = base64.b64decode(base64str)
  print "Received: ", len(img_buffer), " bytes"
  img = np.uint8(PIL.Image.open(StringIO(img_buffer)))
  latest_camera_picture  = np.copy(img)
  PIL.Image.fromarray(img).save('latest.jpg', 'jpeg')
  return "" 


if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0", port=8000)


