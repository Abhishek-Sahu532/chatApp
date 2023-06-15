const exp = require('constants');
const express = require('express');
const http  = require('http');
const {Server} = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const usernames = {};
const rooms =[
    {name : 'globalChat', creator: 'anonymous'},
    {name : 'chess', creator: 'anonymous'},
    {name : 'javascript', creator: 'anonymous'},

];

//WHENEVER WE SETUP THE CONNECTION WE NEED TO UPDATE THE VARIABLE FOR THE CURRENT USER
//on backend part, all the code goes under the below function
io.on('connection', (socket)=>{
    console.log('User connected to the server')
socket.on('createUser', function(username){ //name == myUsername received from frontend
socket.username = username; // SOCKET IS THE OBJECT, WE ARE JUST EXTENDING THE SOCKET OBJECT
usernames[username] = username;
socket.currentRoom = 'globalChat';

socket.join('globalChat') //USED FOR JOINING THE CHAT ROOOM
socket.emit('updateChat', 'INFO', 'You have joined globalChat')//THIS INFO OR PARAMETER WILL GO FOR THE FRONTEND   
} );

socket.on('sendMessage', (data)=>{
io.sockets.to(socket.currentRoom).emit('updateChat', socket.username, data)// with this, if a user send a message the other use will able to see or receive the same, with same chat room
});

socket.on('updateRooms', (room)=>{
    socket.broadcast //BROADCAST METHOD WILL TELL ALL THE USER, IF SOMEONE CHANGE THE ROOM
    .to(socket.currentRoom)
    .emit('updateChat', 'INFO', socket.username + ' left room');

    socket.leave(socket.currentRoom)//if user leave the current chat room
    socket.currentRoom = room
    socket.join(room) // joining the room what frontend has send
    socket.emit('updateChat', "INFO", 'You have joined '+ room);

    socket.broadcast //BROADCAST METHOD WILL TELL ALL THE USER, IF SOMEONE join THE ROOM
    .to(socket.currentRoom)
    .emit('updateChat', 'INFO', socket.username + ' has joined');

})


})


app.use(express.static('public'));

server.listen(4000, ()=>{
    console.log('Server is running at port 4000')
})