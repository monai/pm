var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var minimist = require('minimist');
var rimraf = require('rimraf');

var spawn = cp.spawn;
var argv = minimist(process.argv.slice(2));

var k = argv.k;
var p = argv.p || 'pool';
var l = argv.p || 'lock';
var n = argv.n || 1;
var _ = argv._;

if (k) {
    killAll();
} else {
    doSpawn();
}

function killAll() {
    var pool = readPool(p);
    var pid, pidfile;
    
    pool.forEach(function (sockfile) {
        pid = path.basename(sockfile, '.sock');
        pidfile = path.join(l, pid +'.pid');
        console.log('kill', pid);
        
        try {
            rimraf.sync(pidfile);
            rimraf.sync(sockfile);
            process.kill(pid, 'SIGTERM');
        } catch (error) {
            console.log(error);
        }
    });
}

function readPool(p) {
    var pool = fs.readdirSync(p);
    pool = pool.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
        return fs.statSync(file).isSocket();
    });
    
    return pool;
}

function doSpawn() {
    var proc;
    var args;
    while (n--) {
        args = [];
        Array.prototype.push.apply(args, _);
        args.push(n);
        proc = spawn('node', args, {
            cwd: __dirname,
            detached: true,
            stdio: [ 'ignore', 'ignore', 'ignore' ]
        });
        
        proc.on('error', function (error) {
            console.log(error);
        });
        
        proc.unref();
        
        console.log('spawn', args);
    }
}

