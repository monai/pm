var fs = require('fs');
var path = require('path');
var http = require('http');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var argv = require('minimist')(process.argv.slice(2));

var _ = argv._;
var p = argv.p || 'pool';
var l = argv.p || 'lock';

mkdirp.sync(p);
mkdirp.sync(l);

// var port = _[0] + _[1];
var pid = process.pid;

var pidfile = path.join(l, pid +'.pid');
var sockfile = path.join(p, pid +'.sock');

fs.writeFileSync(pidfile, '');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('pong from '+ pid);
}).listen(sockfile);

console.log('listen on', sockfile);

process.on('SIGINT', term);
process.on('SIGTERM', term);

function term() {
    rimraf.sync(pidfile);
    rimraf.sync(sockfile);
    process.exit(0);
}
