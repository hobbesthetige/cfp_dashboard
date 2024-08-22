from flask import Flask, request, jsonify
import subprocess
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/run_playbook', methods=['POST'])
def run_playbook():
    playbook = request.json.get('playbook')
    result = subprocess.run(['ansible-playbook', '-v', f'/etc/ansible/playbooks/{playbook}'], capture_output=True, text=True)
    
    if result.returncode != 0:
        return jsonify({
            'returncode': result.returncode,
            'stderr': result.stderr,
            'stdout': result.stdout
        }), 500

    output_file = '/etc/ansible/results/check_ports_results.json'
    
    if os.path.exists(output_file):
        with open(output_file, 'r') as file:
            output_data = json.load(file)
        os.remove(output_file)
    else:
        output_data = []

    return jsonify(output_data)

@app.route('/healthCheck', methods=['GET'])
def run_healthCheck():
    playbook = 'check_ports.yml'
    result = subprocess.run(['ansible-playbook', '-v', f'/etc/ansible/playbooks/{playbook}'], capture_output=True, text=True)
    
    if result.returncode != 0:
        return jsonify({
            'responses': [],
            'errors': [result.stderr]
        }), 500

    output_file = '/etc/ansible/results/check_ports_results.json'
    
    if os.path.exists(output_file):
        with open(output_file, 'r') as file:
            output_data = json.load(file)
        os.remove(output_file)
    else:
        output_data = []

    return jsonify({'responses': output_data, 'errors': []})
