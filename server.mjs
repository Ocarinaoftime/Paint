import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from "socket.io"
import session from "express-session";
import * as crypto from "node:crypto";

const app = express();
const server = createServer(app);
const io = new Server(server);

const sessionMiddleware = session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
})

app.use(sessionMiddleware);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/Player1', (req, res) => {
  res.sendFile(join(__dirname, 'Player1.html'));
});

app.get('/Player2', (req, res) => {
  res.sendFile(join(__dirname, 'Player2.html'));
});

app.get('/main.js', (req, res) => {
  res.sendFile(join(__dirname, 'main.js'));
});

app.get('/main.ts', (req, res) => {
  res.sendFile(join(__dirname, 'main.ts'));
});

app.get('/socket.io.js', (req, res) => {
  res.sendFile(join(__dirname, 'socket.io.js'));
});

app.post("/incr", (req, res) => {
  const session = req.session;
  session.count = (session.count || 0) + 1;
  res.status(200).end("" + session.count);
});

let numOfPeople = 0;
let p1Session;
let p2Session;
io.engine.use(sessionMiddleware);
io.on('connection', (socket) => {
  numOfPeople++;
  console.log(numOfPeople, 'user(s) connected');
  let room1Size = io.sockets.adapter.rooms.get("room1")?.size != undefined ? io.sockets.adapter.rooms.get("room1").size : 0;
  let room2Size = io.sockets.adapter.rooms.get("room2")?.size != undefined ? io.sockets.adapter.rooms.get("room2").size : 0;
  let currentPerson;
  if (room1Size == 1 && (room2Size == 0 || room2Size == 1)) {
    socket.join("room2");
    socket.emit("currRoom", 2);
    currentPerson = 2;
  } else if (room2Size == 1 && (room1Size == 0 || room1Size == 1)) {
    socket.join("room1");
    socket.emit("currRoom", 1);
    currentPerson = 1;
  } else if (room1Size == 0 && room2Size == 0) {
    socket.join("room1");
    socket.emit("currRoom", 1);
    currentPerson = 1
  } else {
    socket.emit("Error", "Only two people are allowed!");
    socket.client.conn.close();
  }
  console.log("Room 1 size:", room1Size, "\nRoom 2 size: ", room2Size);
  socket.on('dot', ({whom, x, y, size}) => {
    io.to(`room${whom}`).emit("dot", {x, y, size});
  })
  socket.on('disconnect', () => {
    numOfPeople--;
    console.log('A user disconnected.', numOfPeople, 'user(s) currently.');
  });
});

server.listen(3000, "::", () => {
  console.log('Server running at http://0.0.0.0:3000');
});