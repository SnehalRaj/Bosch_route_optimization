import numpy as np
from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS, cross_origin
import json
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def convertToFloatArrays(lol):
    for i1 in range(len(lol)):
        for i2 in range(len(lol[i1])):
            lol[i1][i2] = float(lol[i1][i2])
    return lol


@app.route('/hello', methods=['GET', 'POST'])
@cross_origin()
def hello():

    # POST request
    if request.method == 'POST':
        print('Incoming..')
        x = request.json
        numJS = {}
        numJS['data'] = convertToFloatArrays(x['rows'])
        with open('coords.json') as json_file:
            json.dump(numJS, json_file)
        command1 = "./get_clusters" # directly execute the compiled file
        os.system(command1)
        clstr = []
        with open('cluster.json') as clstrf:
            clstr=json.load(clstrf)
        dst = getDistancesInClusters(clstr)
        with open('clusterdist.json') as json_file:
            json.dump(dst, json_file)
        command2 = "./send_dist" # directly execute the compiled file
        os.system(command2)
        foutput = []
        with open('send.json') as clstrf:
            foutput=json.load(clstrf)
        
        # return jsonify(numJS)
        return jsonify({"suck": foutput})


    # GET request
    else:
        message = {'greeting':'Hello from Flask!'}
        return jsonify(message)  # serialize and use JSON headers

# from flask import Flask, render_template, request, jsonify
 
# app = Flask(__name__)
 
#@app.route('/')
#def index():
#	return render_template('demo.html')

@app.route('/temp/<path:path>')
@cross_origin()
def send_temp(path):
    return send_from_directory('templates', path) 
@app.route('/<path:path>')
@cross_origin()
def send_cd(path):
    return send_from_directory('./', path)
# @app.route('/square/', methods=['POST'])
# def square():
# 	num = float(request.form.get('number', 0))
# 	square = num ** 2
# 	data = {'square': square}
# 	data = jsonify(data)
# 	return data
 
# if __name__ == '__main__':
# 	app.run(debug=True)
