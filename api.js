const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const api = express();
const pool = new Pool({
    user: 'dougs',
    host: 'localhost',
    database: 'dougs-aside-pong',
    password: '',
    port: 5432,
  });

api.get('/users', async (req, res) => {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const results = { 'results': (result) ? result.rows : null};
    res.send(results);
    client.release();
});

api.post('/users', async (req, res) => {
    const client = await pool.connect();
    const email = req.query.email;
    const score = Number(req.query.score);
    const results = await client.query(`SELECT score FROM users WHERE email = '${email}'`);
    const updatingScore = results.rows[0].score + score;
    const result = await client.query(`UPDATE users SET score = '${updatingScore}' WHERE email = '${email}'`);
    res.send(result);
    client.release();
});

api.use(express.static(path.join(__dirname, 'public')));

api.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

module.exports = api;