# import numpy as np
# from flask import Flask, jsonify, request, render_template
# app = Flask(__name__)

# def readcsv():
#     print("read csv")
#     mat = np.ones((2,2))
#     return mat


# @app.route('/hello', methods=['GET', 'POST'])
# def hello():

#     # POST request
#     if request.method == 'POST':
#         mat = readcsv()
#         print('Incoming..')
#         print(request.get_json())  # parse as JSON
#         return mat

#     # GET request
#     else:
#         message = {'greeting':'Hello from Flask!'}
#         return jsonify(message)  # serialize and use JSON headers

from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)
 
@app.route('/')
def index():
	return render_template('index.html')
 
@app.route('/square/', methods=['POST'])
def square():
	x = request.json
	x = json.loads(x)
	print(x)
	return jsonify(x)
	# num = float(request.form.get('number', 0))
	# square = num ** 2
	# data = {'square': square}
	# data = jsonify(data)
	# return data
 
if __name__ == '__main__':
	app.run(debug=True)