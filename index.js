const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const roomList = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/teachers', (req, res) => {
  res.sendFile(__dirname + '/teachers.html');
});
app.get('/students', (req, res) => {
  res.sendFile(__dirname + '/students.html');
});
app.get('/room/', (req, res) => {
  var name = req.query.name;
  res.render(path.join(__dirname, '/','rooms.html'),{rooms: name});
});

const adminNameSpace = io.of('/admin');
adminNameSpace.on('connect', (socket) => {
    // console.log('a user connected');
    socket.on('join',(data)=>{
      socket.join(data.room);
      adminNameSpace.in(data.room).emit('chat message',`New Person joined the ${data.room} room`);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (data) => {
        console.log('message: ' + data.msg);
        adminNameSpace.in(data.room).emit('chat message',data.msg);
        // adminNameSpace.emit('chat message', msg);
      });

      socket.on('share message', (data) => {
        console.log('message: ' + data.msg);
        // adminNameSpace.in('Teachers').in('Students').emit('chat message',data.msg);
        adminNameSpace.emit('chat message', data.msg);
      });
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});