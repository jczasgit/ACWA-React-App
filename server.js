const express = require('express');
const app = express();
const port = 3001; // change to 80 when deployed
const Datastore = require('nedb');
const database = new Datastore({filename:'database.db', autoload: true});
// app.use(express.static('./client/build')); --> for deployment usage.
app.use(express.json());

    //  /api/get/assignments/:limit
    // Add limit functionality...

app.get('/api/topicselect/:cellId/:topicId', (req, res) => {
    const cellId = req.params.cellId.substring(1);
    const topicId = req.params.topicId.substring(1);
    const topicsArray = [];
    database.find({id: cellId}, (err,data) => {
        if(err) console.error(err);
        data[0].topics.forEach(topic => {
            if(topic.id !== topicId) topicsArray.push(topic);
            else {
                topic.taken = true;
                topicsArray.push(topic);
            }
        });
    });
    database.update({id: cellId}, {$set: {topics: topicsArray}}, {}, (err, numOfUpdates) => {
        if(err) console.error(err);
        console.log(numOfUpdates);
    });
    database.loadDatabase();
    database.find({}, (err, data) => {
        if(err) console.error(err);
        res.json(data.sort((a,b) => b.timestamp-a.timestamp));
    })
});

app.get('/api/get/assignments/all', (req, res) => {
    database.find({}).exec((err, dataArray) => {
        if(err) console.error(err);
        dataArray.sort((a,b) => b.timestamp-a.timestamp);
        res.json(dataArray);
    })
    //console.log(`get request from ${req.connection}`);
});

app.post('/api/add', (req, res) => {
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    res.json({status: "success", timestamp});
});

app.listen(port, () => console.log(`Listening@${port}`));