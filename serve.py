import http.server
import socketserver
import os

port = int(os.environ.get('PORT', 8080))
directory = os.path.dirname(os.path.abspath(__file__))
os.chdir(directory)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

with socketserver.TCPServer(("", port), Handler) as httpd:
    print(f"Serving Alapa Finance on port {port}")
    httpd.serve_forever()
