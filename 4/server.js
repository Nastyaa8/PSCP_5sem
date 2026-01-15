const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./db');

const app = express();
const db = new DB();

app.use(bodyParser.json());


db.on('GET', (rows) => {
    console.log('Событие GET: все строки запрошены');
    console.table(rows);
});

db.on('POST', (row) => {
    console.log('Событие POST: добавлена новая запись');
    console.table(row);
});

db.on('PUT', (row) => {
    console.log('Событие PUT: обновлена запись');
    console.table(row); 
});

db.on('DELETE', (row) => {
    console.log('Событие DELETE: удалена запись');
    console.table(row);
});


app.get('/api/db', async (req, res) => {
    const rows = await db.select();
    res.json(rows);
});

app.post('/api/db', async (req, res) => {
    try {
        const newRow = await db.insert(req.body);
        res.json(newRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/db', async (req, res) => {
    try {
        const updatedRow = await db.update(req.body);
        res.json(updatedRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/db', async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        if (isNaN(id)) throw new Error('Invalid id');
        const deletedRow = await db.delete(id);
        res.json(deletedRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(5000, () => {
    console.log('http://localhost:5000');
});
