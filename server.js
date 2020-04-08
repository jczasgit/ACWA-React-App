const express = require('express');
const app = express();
const port = 3001;
const Datastore = require('nedb');
const database = new Datastore('database.db');
database.loadDatabase();
//app.use(express.static('./client/build'));
app.use(express.json());

app.get('/api/get/assignments', (req, res) => {
    database.find({}, (err, data) => {
        if(err) res.end();
        res.json(data);
    })
    console.log(`get request from ${req.connection}`);
});

app.post('/api/add', (req, res) => {
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    console.log(data);
    database.insert(data);
    res.json({status: "success", timestamp: timestamp});
});

app.listen(port, () => console.log(`Listening@${port}`));