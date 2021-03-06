/*
* PACKAGES
*/
import path from 'path';
import express from 'express';
import http from 'http';
import socket from 'socket.io';
import Twig from 'twig';
import uniqid from 'uniqid';

// server
const expressServer = express();
const server = http.createServer(expressServer);


expressServer.use(express.static(path.join(__dirname, '/../public')));

// expressServer.set('view engine', 'twig');

expressServer.get('/', function(req, res){
    res.render('index.twig');
});

// socket.io
const io = socket.listen(server);

const users = [];

io.on('connection', socket => {
    socket.on('newUser', pseudo => {

        if (pseudo === null || pseudo === ""){pseudo = `Anon${uniqid()}`}
        socket.pseudo = pseudo;
        socket.emit('info', `Bienvenue ${socket.pseudo}`);
        socket.broadcast.emit('info', `${socket.pseudo} vient de se connecter`);
        users.push(socket.pseudo);
        io.emit('users', users);
        console.log(`New user : ${socket.pseudo}`);
    });

    socket.on('msg', msg => {
        socket.emit('selfMsg', msg);
        socket.broadcast.emit('userMsg', {
            msg : msg,
            pseudo : socket.pseudo
        });
        console.log(`${socket.pseudo} says : ${msg}`);
    });

    socket.on('typing', msg => {
        socket.broadcast.emit('info', `${socket.pseudo} est en train d'écrire...`);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('info', `${socket.pseudo} vient de se déconnecter`);
        let index = users.indexOf(socket.pseudo);
        if(index !== -1){
            users.splice(index, 1);
        }
        io.emit('users', users);
        console.log(`${socket.pseudo} disconnected`)
    });

});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log('Connected on port ' + port + ' ! '));
