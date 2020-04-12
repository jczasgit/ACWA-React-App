const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const port = 3001; // change to 80 when deployed
const Datastore = require('nedb');
const secretKey = 'loverose4ever';
const database = new Datastore({filename:'database.db', autoload: true});
const usrdb = new Datastore({filename: 'usrdb.db', autoload: true});
const logindb = new Datastore({filename: 'logindb.db', autoload: true});
// app.use(express.static(__dirname + '/client/build', {dotfiles: 'allow'})); --> for deployment usage.
app.use(express.json());

// token format:
// authorization: blackpink4ever <token>

//Verify token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else{
        res.status(403).json({msg: 'forbidden'}); //forbidden status
    }
}

// User register
app.post('/api/usr/register', (req, res) =>{
    const data = req.body;
    data.createdDate = Date.now();
    data.firstLogin = true;
    data.name = data.username;
    usrdb.insert(data);
    res.json({register: 'register'});
});

// First Setup
app.post('/api/usr/firstsetup', (req, res) => {
    const {username, password, userId} = req.body;
    if(userId.length < 1) {
        res.status(400).json({invalidMsg: 'alert'});
    } else {
        usrdb.find({userId}, (err, result) => {
            if(err) res.status(400).json({invalidMsg: 'something went wrong...'});
            if(result.length < 1) {
                res.status(400).json({invalidMsg: 'UserId not found. Please contact Juan.'});
            } else {
                if(result[0].userId === userId && result[0].firstLogin) 
                {
                    usrdb.update({userId: result[0].userId}, {$set: {username, password, firstLogin: false}}, (err, numOfUpdates) => console.log(numOfUpdates));
                    usrdb.loadDatabase(); // reload updated db
                    res.json({validMsg: 'reset complete'});
                }else {
                    res.status(400).json({invalidMsg: 'something went wrong...'});
                }
            }
        });
    }
});

// User login
app.post('/api/usr/login', (req, res) =>{
    const data = req.body;
    usrdb.find({username: data.username}, (err, searchResult) => {
        if(err) res.status(400).json({invalidMsg: 'something went wrong in the database...'})
        else {
            if(searchResult.length < 1) {
                res.json({invalidMsg: 'username not in database'});
            } else {
                if(searchResult[0].username === data.username) {
                    if(searchResult[0].firstLogin) { // if it is the first time login
                        res.status(200).json({firsttime: true, userId: searchResult[0].userId});
                    } else { // if it is not first time login...
                        if(searchResult[0].password === data.password) { // if the passwords matched
                            const tokenValue = {username: searchResult[0].username, loginTime: Date.now()}
                            logindb.find({userId: searchResult[0].userId}, (err, logResult) =>{
                                if(err) console.log(err);
                                else {
                                    if(logResult.length < 1) {
                                        logindb.insert({userId: searchResult[0].userId, loginTime: tokenValue.loginTime});
                                        logindb.loadDatabase();
                                    } else {
                                        logindb.update({userId: searchResult[0].userId}, {$set: {loginTime: tokenValue.loginTime}});
                                        logindb.loadDatabase();
                                    }
                                }
                            });
                            jwt.sign({user: tokenValue}, secretKey, {expiresIn: '7d'},(err, token) =>{
                                res.json({token});
                            });
                        } else {
                            res.status(400).json({invalidMsg: 'invalid password'});
                        }
                    }
                } else {
                    res.status(400).json({invalidMsg: 'invalid username'});
                }
            }
        } // .find error handling
    }); // usrdb.find()
});
    

    //  /api/get/assignments/:limit
    // Add limit functionality...

// Update DB when user chooses a topic.
app.post('/api/topicselect/:cellId/:topicId', verifyToken,(req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if(err) res.status(403).json({msg: 'forbidden'})
        else {
            const cellId = req.params.cellId;
            const topicId = req.params.topicId;
            const topicsArray = [];
            const {username, userId} = authData.user;
            const name = [];
            usrdb.find({username}, (err, result) => {
                if(err) console.error(err);
                if(result.length < 1) {
                    console.log('not found');
                } else {
                    name.push(result[0].name);
                }
            })
            // finding the right assignment.
            database.find({id: cellId}, (err,data) => {
                if(err) console.error(err);
                data[0].topics.forEach(topic => {
                    if(topic.id !== topicId) topicsArray.push(topic);
                    else {
                        topic.taken = true;
                        topic.holder = name[0];// updating topics[i].taken
                        topic.holderId = userId;
                        topicsArray.push(topic);
                    }
                });
            });

            // updating assignment data.
            database.update({id: cellId}, {$set: {topics: topicsArray}}, {}, (err, numOfUpdates) => {
                if(err) console.error(err);
                console.log(numOfUpdates);
            });

            database.loadDatabase();  // reload db, just in case.
            
            // sending back new data.
            database.find({}, (err, data) => {
                if(err) console.error(err);
                res.json(data.sort((a,b) => b.timestamp-a.timestamp));
            });
        }
    });
});

// First fetch of all the assignments.
app.post('/api/get/assignments/all', verifyToken,(req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if(err) res.status(403).json({msg: 'forbidden'});
        else {
            database.find({}).exec((err, dataArray) => {
                if(err) console.error(err);
                dataArray.sort((a,b) => b.timestamp-a.timestamp);
                res.json(dataArray);
            });
        }
    });
});


// Inserting asignment data uploaded by user.
app.post('/api/add', verifyToken,(req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if(err) res.status(403).json({msg: 'forbidden'});
        else {
            const data = req.body;
            const timestamp = Date.now();
            data.timestamp = timestamp;
            data.by = authData.username;
            database.insert(data);
            res.json({msg: "success", timestamp});
        }
    });
});


// listen
app.listen(port, () => console.log(`Listening@${port}`));