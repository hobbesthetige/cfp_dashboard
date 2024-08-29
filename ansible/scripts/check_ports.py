import socket
import json
import sys

ports = sys.argv[1:]
results = {}

for port in ports:
    port = int(port)
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)
    result = s.connect_ex(('localhost', port))
    results[port] = 'open' if result == 0 else 'closed'
    s.close()

print(json.dumps(results))
