var Hapi = require('hapi'),
    Path = require('path'),
    sockets = require('socket.io'),
    ctf = require('ctf'),
    fs = require('fs'),
    io,
    settings,
    server;

settings = {
    // Since this is opened once on startup,
    // doing this synchronously is not a major problem.
    map: JSON.parse(fs.readFileSync(
        Path.join(__dirname, 'public/maps/star.json')
    )).tiles
};

server = new Hapi.Server();

server.connection({ port: 8000, labels: ['game'] });

io = sockets(server.select('game').listener);

io.on('connection', function (socket) {
    'use strict';
    ctf(socket, settings);
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: Path.join(__dirname, 'public')
        }
    }
});

server.start();
