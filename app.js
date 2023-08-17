var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
var usernames = {};
io.sockets.on('connection', function (socket) {
    // Send File
    socket.on('other file', function (data) {
        socket.broadcast.emit('otherformat', socket.username, data);
    });

    // Send Image

    socket.on('user image', function (data) {
        socket.broadcast.emit('addimage', socket.username, data);
    });

    // Send Message
    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });

    // Add New User
    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'SERVER', `Wellcome ${username} you have joined`);
        socket.broadcast.emit('updatechat', 'SERVER', `${username}  has joined the chat`);
        io.sockets.emit('updateusers', usernames);
    });

    // Disconnect User
    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER', `${[socket.username]} has left the chat`);
    });

});

// Server Port
var port = 7575;
server.listen(port);
console.log(`Server is running on port: ${port}`);