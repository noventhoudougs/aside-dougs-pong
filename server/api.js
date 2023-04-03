const express = require('express');
const path = require('path');
const cors = require('cors')
const { Pool } = require('pg');

const api = express();
api.use(cors());
api.use(express.json())
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

api.use(express.static(path.join(__dirname, 'public')));

api.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});
api.get('/pong', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pong.html'))
});

module.exports = api;