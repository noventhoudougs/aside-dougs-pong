const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const httpServer = require('./server');
const io = require('socket.io')(httpServer);

const api = express();
api.use(cors());
api.use(express.json());
const pool = new Pool({
    user: 'dougs',
    host: 'localhost',
    database: 'dougs-aside-pong',
    password: '',
    port: 5432,
  });

api.get('/users', async (req, res) => {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users order by score desc');
    const results = { 'results': (result) ? result.rows : null};
    res.send(results);
    client.release();
});

api.post('/users', async (req, res) => {
    const client = await pool.connect();
    const email1 = req.query.email1;
    const email2 = req.query.email2;

    const result1 = await client.query(`SELECT score FROM users WHERE email = '${email1}'`);
    const result2 = await client.query(`SELECT score FROM users WHERE email = '${email2}'`);

    const updatingWinningScore = result1.rows[0].score + 10;
    const updatingLosingScore = result2.rows[0].score - 20;

    const resultWinning = await client.query(`UPDATE users SET score = '${updatingWinningScore}' WHERE email = '${email1}'`);
    const resultLosing = await client.query(`UPDATE users SET score = '${updatingLosingScore}' WHERE email = '${email2}'`);

    res.send({resultWinning, resultLosing});
    client.release();
});

api.post('/login', async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        res.send();
    } else {
        res.status(403);
    }
});
api.get('/newGame', (req, res) => {
    const namespaceId = Math.random().toString(36).substring(7);
    console.log(namespaceId);
    const pongNamespace = io.of(`/${namespaceId}`);

    pongNamespace.on('connection', (socket) => {
        let room;
        let readyPlayerCount = 0;

        console.log('a user connected', socket.id);

        // Événement 'ready' : lorsque le joueur est prêt à jouer
        socket.on('ready', () => {
            room = 'room' + Math.floor(readyPlayerCount / 2);
            socket.join(room);

            console.log('Player ready', socket.id, room);

            readyPlayerCount++;

            if (readyPlayerCount % 2 === 0) {
                pongNamespace.in(room).emit('startGame', socket.id);
            }
        });

        socket.on('paddleMove', (paddleData) => {
            socket.to(room).emit('paddleMove', paddleData);
        });

        socket.on('ballMove', (ballData) => {
            socket.to(room).emit('ballMove', ballData);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`);
            socket.leave(room);
        });
    });
    res.send(namespaceId);
});

api.use(express.static(path.join(__dirname, 'public')));

api.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});
api.get('/pong', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pong.html'))
});

module.exports = api;