const http = require('http');
const app = require('./api');
const io = require("socket.io");
const sockets = require("./sockets");



const httpServer = http.createServer(app);

const port = process.env.PORT || 8000;
const socketServer = io(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
sockets.listen(socketServer);