const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const port = 3001; // change to 80 when deployed
const Datastore = require('nedb');
const secretKey = 'loverose4ever';
const database = new Datastore({filename:'database.db', autoload: true});
const usrdb = new Datastore({filename: 'usrdb.db', autoload: true});
const logindb = new Datastore({filename: 'logindb.db', autoload: true});
//app.use(express.static(__dirname + '/client/build', {dotfiles: 'allow'}));
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

// validation of token
app.post('/api/validation', verifyToken,(req, res) => {
    jwt.verify(req.token, secretKey, (err, authData)=> {

    });
})

// User register
app.post('/api/usr/register', (req, res) =>{
    const data = req.body;
    data.createdDate = Date.now();
    data.firstLogin = true;
    data.name = data.username;
    data.assignmentTaken = [];
    data.assignmentOwned = [];
    data.isTeacher = false;
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
                {   usrdb.find({username}, (err, hits) => {
                    if(hits.length >= 1) {
                        res.status(400).json({invalidMsg: 'Please set a new username.'});
                    } else if(hits.length < 1){
                        const pwdCombination = password + 'roseismywife';
                        bcrypt.hash(pwdCombination, 10, (err, hashedPassword) => {
                            usrdb.update({userId: result[0].userId}, {$set: {username, password: hashedPassword, firstLogin: false}}, (err, numOfUpdates) => console.log(numOfUpdates));
                            usrdb.loadDatabase(); // reload updated db
                            res.json({validMsg: 'reset complete'});
                        });
                    }
                })
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
                        const pwdCombination = data.password + 'roseismywife';
                        bcrypt.compare(pwdCombination, searchResult[0].password, (err, matched) => {
                            if(err) {res.status(400).json({invalidMsg: 'something went wrong...'})}
                            else {
                                if(matched) {
                                    const tokenValue = {username: searchResult[0].username, userId: searchResult[0].userId,loginTime: Date.now()}
                                    logindb.find({userId: searchResult[0].userId}, (err, logResult) => {
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
                                        res.json({token, username: searchResult[0].username});
                                    });
                                } else {
                                    res.status(400).json({invalidMsg: 'invalid password'});
                                }
                            }
                        })
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
            const {username} = authData.user;
            const userDetails = [];

            // finding the right assignment.
            database.find({id: cellId}, (err,data) => {
                if(err) console.error(err);

                // updating user assignment details.
                usrdb.find({username}, (err, result) => {
                    if(err) console.error(err);
                    if(result.length < 1) {
                        console.log('not found');
                    } else {
                        userDetails.push({name: result[0].name, userId: result[0].userId});
                        data[0].topics.forEach(topic => {
                            if(topic.id !== topicId) topicsArray.push(topic);
                            else {
                                if(topic.taken) topicsArray.push(topic);
                                else {
                                    topic.taken = true;
                                    topic.holder = userDetails[0].name;// updating topics[i].taken
                                    topic.holderId = userDetails[0].userId;
                                    topicsArray.push(topic);
                                    const assignmentDetails = result[0].assignmentTaken;
                                    assignmentDetails.push({assignmentId: cellId, topicId, obtainedAt: Date.now()})
                                    usrdb.update({username}, {$set: {assignmentTaken: assignmentDetails}}, (err, numOfUpdates) => console.log(numOfUpdates));
                                }
                            }
                        });

                        // updating assignment data.
                        database.update({id: cellId}, {$set: {topics: topicsArray}}, {}, (err, numOfUpdates) => {
                            if(err) console.error(err);
                            console.log(numOfUpdates);
                            // sending back new data.
                            database.find({}, (err, data) => {
                                if(err) console.error(err);
                                res.json(data.sort((a,b) => b.timestamp-a.timestamp));
                            });
                        });
                    }
                });
            });
        }
    });
});

// Handle Refresh data
app.get('/api/get/refresh', verifyToken, (req, res) => [
    
]);

// Get user assignment details
app.get('/api/get/userdetails/assignments', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if(err) res.status(400).json({invalidMsg: 'forbidden'});
        else {
            const {user} = authData;
            usrdb.find({userId: user.userId}, (err, result) => {
                if(err) res.status(400).json({invalidMsg: 'error'});
                else {
                    if(result.length < 1) res.status(400).json({invalidMsg: 'not found.'});
                    else {
                        const {assignmentTaken} = result[0];
                        if(assignmentTaken.length < 1) res.json({assignmentTaken: []})
                        else if(assignmentTaken === 'undefined') res.status(400).json({assignmentTaken: []});
                        else {
                            res.json({assignmentTaken})
                        }
                    }
                }
            });
        }
    })
});

// First fetch of all the assignments.
app.get('/api/get/assignments/all', verifyToken,(req, res) => {
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

// Uploading attached files
app.post('/api/uploads/:assignmentId', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if(req.files === null) res.status(400).json({msg: 'forbidden'});
        else {
            console.log(req);
            res.status(200);
        }
        /* if(err) res.status.json({msg: 'forbidden'});
        else {
            const assignmentId = req.params.assignmentId;
            if(req.files === null) {
                return res.status(400).json({invalidMsg: 'empty files.'});
            }else {
                fs.mkdir(`${__dirname}/uploads/${assignmentId}/`, {recursive: true}, (err) => {
                    if(err) throw err;
                });
                const attachedFile = req.files.attachedFile;

                attachedFile.mv(`${__dirname}/uploads/${assignmentId}/${attachedFile.name}`, (err) => {
                    if(err) {
                        console.error(err);
                        return res.status(500).json({invalidMsg: `${err}`});
                    } else { 
                        res.json({validMsg: 'files uploaded.'});
                    }
                });
            }
        } */
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
            usrdb.find({userId: authData.user.userId}, (err, hits)=>
            {
                if(err) res.status(400).json({msg: 'forbidden'});
                else {
                    const AR = hits[0].assignmentOwned;
                    AR.push({id: data.id});
                    usrdb.update({userId: hits[0].userId}, {$set: {assignmentOwned: AR}}, (err, numOfUpdates) => console.log(numOfUpdates));
                    data.owner = hits[0].name;
                }
            });
            data.attachedFilePaths = [];
            database.insert(data);
            res.json({msg: "success", timestamp});
        }
    });
});


// listen
app.listen(port, () => console.log(`Listening@${port}`));