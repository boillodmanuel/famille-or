import SimpleHTTPServer
import SocketServer
import sys

PORT = 9000 if len(sys.argv) <= 1 else int(sys.argv[1]);

class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    pass

Handler.extensions_map['.mp4'] = 'video/mp4'
Handler.extensions_map['.avi']= 'video/x-msvideo'
Handler.extensions_map['.mpeg']= 'video/mpeg'

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
print "OPEN http://localhost:" + str(PORT)
httpd.serve_forever()
