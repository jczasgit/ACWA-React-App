const express = require('express');
const app = express();
const socketIo = require('socket.io');

const secretKey = 'loverose4ever!';

// listen
const port = 3001; // change to 80 when deployed
const server = app.listen(port, () => console.log(`Listening@${port}`));
const io = socketIo(server);
io.set('origins', '*:*');

//app.use(express.static(__dirname + '/client/build', {dotfiles: 'allow'}));
app.use(express.json());


// socket.io
io.on('connection', (socket) => {
    console.log('new connection');
    socket.on('disconnect', () => {
        console.log('user disconnected.');
    });
});



// Third libraries
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');
const mime = require('mime-types');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const assignmentId = req.params.assignmentId;
        const dir = `${__dirname}/uploads/${assignmentId}`;
        if(!fs.existsSync(dir)) {
            return fs.mkdir(dir, (err) => cb(err, dir))
        }
        return cb(null, dir)
    },
    filename: function(req, file, cb) {
        const ofilename = file.originalname;
        const trimfilename = ofilename.replace(/\s+/g, '');
        cb(null, trimfilename);
    }
});
const upload = multer({storage});


//Database config...
const Datastore = require('nedb');
const database = new Datastore({filename:'database.db', autoload: true});
const usrdb = new Datastore({filename: 'usrdb.db', autoload: true});
const logindb = new Datastore({filename: 'logindb.db', autoload: true});

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
        if(err) res.status(403).json({msg: 'forbidden'});
        else {
            res.status(200).json({msg: 'valid', userId: authData.user.userId});
        }
    });
})

// User register
app.post('/api/usr/register', (req, res) =>{
    const data = req.body;
    data.createdDate = Date.now();
    data.firstLogin = true;
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
                                        res.json({token, userId: searchResult[0].userId});
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
// Removing topic from ownership
app.post('/api/topicremove/:holderId/:topicId', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if(err) res.status(403).json({msg: 'forbidden'});
        else {
            const holderId = req.params.holderId;
            const topicId = req.params.topicId;
            var assignmentId = '';
            usrdb.find({userId: holderId}, (err, result) =>{
                if(err) res.status(400).json({msg: 'db error'});
                else {
                    if(result.length<1) res.status(400).json({msg: 'not found'});
                    else {
                        const ar = result[0].assignmentTaken.filter(assignment => assignment.topicId !== topicId);
                        result[0].assignmentTaken.forEach(assignment => {
                            if(assignment.topicId === topicId) {
                                assignmentId = assignment.assignmentId;
                            }
                        });
                        usrdb.update({userId: holderId}, {$set: {assignmentTaken: ar}}, (err, numOfUpdates) => console.log('topic removed from user data.'));
                        database.find({id: assignmentId}, (err, dbResult) => {
                            if(err) res.status(400).json({msg: 'database error'});
                            else {
                                if(dbResult.length<1) res.status(400).json({msg: 'not found'});
                                else {
                                    const tar = [];
                                    dbResult[0].topics.forEach(topic => {
                                        if(topic.id === topicId) {
                                            topic.taken = false;
                                            topic.holder = 'Not taken, yet';
                                            topic.holderId = '';
                                            tar.push(topic);
                                        } else {
                                            tar.push(topic);
                                        }
                                    });
                                    database.update({id: assignmentId}, {$set: {topics: tar}}, (err, numOfUpdates) => {
                                        console.log('topic updated from database');
                                        sendNewData();
                                        res.status(200).json({validMsg: 'successful'});
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    });
});

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
            let owned = false;

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
                                if(topic.taken) {
                                    topicsArray.push(topic);
                                    owned = true;
                                }
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
                                if(owned) {
                                    io.emit('newData', data.sort((a,b)=>b.timestamp-a.timestamp));
                                    res.json({msg: 'taken'});
                                } else {
                                    io.emit('newData', data.sort((a,b)=>b.timestamp-a.timestamp));
                                    res.json({msg: 'success'});
                                }
                            });
                        });
                    }
                });
            });
        }
    });
});

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

// download attached files
app.get('/api/download/:assignmentId/:filename', (req, res) => {
    const assignmentId = req.params.assignmentId;
    const filename = req.params.filename;
    const file = `${__dirname}/uploads/${assignmentId}/${filename}`;
    const mimeType = mime.lookup(file);
    res.setHeader('Content-Type', mimeType);
    res.download(file, filename);
});

// add paths for attachedfiles
function addAttachedFilePaths(assignmentId) {
    const path = `${__dirname}/uploads/${assignmentId}`;
    const paths = new Array();
    fs.readdirSync(path).forEach(file => {
        const tempPath = `/uploads/${assignmentId}/${file}`;
        paths.push({path: tempPath});
    });
    console.log(assignmentId);
    console.log(paths);
    setTimeout(() => {
        database.find({id: assignmentId}, (err, result) => {
            if(err) console.log(err);
            else {
                if(result.length<1) console.log('not found');
                else {
                    database.update({id: assignmentId}, {$set: {attachedFilePaths: paths}}, (err, numOfUpdates) => {
                        console.log(numOfUpdates + ' paths added.');
                    })
                }
            }
        });
        clearTimeout();
    }, 1500);
} 

// Uploading attached files
app.post('/api/uploads/:assignmentId', upload.array('attachedFile', 20), (req, res, next) => {
    addAttachedFilePaths(req.params.assignmentId);
    res.status(200).json({validMsg: 'success'});
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
                    if(hits.length<1) return;
                    else{
                        const AR = hits[0].assignmentOwned;
                        AR.push({id: data.id});
                        usrdb.update({userId: hits[0].userId}, {$set: {assignmentOwned: AR}}, (err, numOfUpdates) => console.log(numOfUpdates));
                        data.owner = hits[0].name;
                    }
                }
            });
            data.attachedFilePaths = [];
            database.insert(data);
            sendNewData();
            res.json({msg: "success", timestamp});
        }
    });
});

function sendNewData() {
    database.find({}).exec((err, dataArray) => {
        if(err) console.error(err);
        dataArray.sort((a,b) => b.timestamp-a.timestamp);
        io.emit('newData', dataArray);
    });
}