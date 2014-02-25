var fs = require('fs');
var path = require('path');
var minimist = require('minimist');
var argv = minimist(process.argv.slice(2));
var equal = require('deep-equal');
var request = require('request');

var p = argv.p || 'pool';

var pool = readPool(p);
var size = pool.length;
fs.watch(p, function (w) {
    pool = readPool(p);
    size = pool.length;
})

// fs.watch don't emit on new sockets
setInterval(function () {
    var _pool = readPool(p);
    if ( ! equal(pool, _pool)) {
        console.log(_pool);
        pool = _pool;
        size = pool.length;
    }
}, 500);

function readPool(p) {
    var pool = fs.readdirSync(p);
    pool = pool.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
        return fs.statSync(file).isSocket();
    });
    
    return pool;
}

var i = 0;
ping();
function ping() {
    i++;
    i = (size > 0) ? ((i < size) ? i : 0) : -1;
    
    if (~i) {
        request.get('unix://'+ path.resolve(process.cwd(), pool[i]), function (error, response, body) {
            if (error) return;
            console.log(body);
        });
    }
    
    setTimeout(ping, 250);
}

