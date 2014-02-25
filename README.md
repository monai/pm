# pm

Nodejs process manager POC.

## Spawn some processes
`node m.js -n 4 -- app.js 8000`

What happens:

- Created `lock` and `pool` directories.
- `lock` stores process pid files.
- `pool` stores unix sockets created by spawned processes.

## Run load balancer
`node balancer.js`

What happens:

- Requests are made in roun-robin manner to all sockets in `pool`.
- `pool` is watched for changes: new sockets will be added to and missing will be removed from the queue.

## Kill all processes
`node m.js -k`

What happens:

- Processes are killed, pid files and sockets are removed.
- Check for zombie processes: `ps aux | grep node`.
