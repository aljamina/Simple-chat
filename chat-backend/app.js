const express = require('express')
const path = require('path')
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors')

var chat = require('./controllers/chat');
var users = require('./controllers/users');
const bcrypt = require('bcryptjs');
const bcryptComplexity = 10;
const jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');

app.set('port', (process.env.PORT || 5000));

var moment = require('moment');


let secret = 'some_secret';
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

app.use(expressJWT({
    secret: secret
  })
  .unless({
    path: [
      '/token/sign',
      '/register'
    ]
  }));



const mysql = require('mysql');

var db = mysql.createConnection({
  host: 'sql7.freemysqlhosting.net',
  user: 'sql7314030',
  password: 'PTJ4ygyuCU',
  database: 'sql7314030',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});
global.db = db;
global.chat_id = 0;



app.post('/token/sign', (req, res) => {
  let secret = 'some_secret';
  db.query("SELECT UserID,Password FROM Users WHERE UserName='" + req.body.username + "'", function(err, result) {
    if (err) res.status(404).json({
      MESSAGE: "User does not exist"
    })
    else if (result.length == 0) res.status(404).json({
      MESSAGE: "User does not exist"
    })
    else {
      var hash = result[0].Password;
      bcrypt.compare(req.body.password, hash, function(err, result1) {
        if (!result1) res.status(400).json({
          MESSAGE: "Wrong user name"
        });
        else {
          var userData = {
            "id": result[0].UserID,
            "name": req.body.username
          }
          let token = jwt.sign(userData, secret, {
            expiresIn: '120s'
          })
          res.status(200).json({
            "token": token
          });
        }
      })
    }
  })
})

app.post('/newContact', chat.addContact);
app.get('/contacts', chat.contacts);
app.post('/register', users.register);


//listen on every connection
io.on('connection', (socket) => {

  var rezultat;
  socket.on('subscribe', function(data) {
    db.query("SELECT ChatID FROM Chats WHERE (ReceiverID='" + data.id1 + "' AND SenderID='" + data.id2 + "') OR (ReceiverID='" + data.id2 + "' AND SenderID='" + data.id1 + "')", function(err, result) {
      if (typeof(result[0]) != 'object') {
        db.query("INSERT INTO Chats(ReceiverID,SenderID) VALUES('" + data.id1 + "','" + data.id2 + "')", function(err2, result2) {
          socket.join(result2.insertId);
          socket.id = result2.insertId;
        })
      } else {
        db.query("SELECT Content,MessageID,SentTime,SenderID,ChatID FROM Messages WHERE  ChatID='" + result[0].ChatID + "' ORDER BY MessageID DESC ", function(err1, result1) {
          socket.join(result[0].ChatID);
          socket.id = result[0].ChatID;
          io.sockets.in(result[0].ChatID).emit('inital_messages', result1);
        })
      }
    })
  })


  //listen on new_message
  socket.on('new_message', (data) => {
    var mysqlTimestamp = moment(Date.now() + 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss');
    db.query("INSERT INTO Messages (SenderID,ChatID,SentTime,Content,Image) VALUES('" + data.currentUser + "','" + socket.id + "','" + mysqlTimestamp + "','" + data.content + "',null)", function(err, result) {
      db.query("SELECT Content,MessageID,SentTime,ChatID,SenderID FROM Messages WHERE MessageID='" + result.insertId + "'", function(err1, result1) {
        io.sockets.in(result1[0].ChatID).emit('new_message', {
          Content: result1[0].Content,
          SenderID: result1[0].SenderID,
          SentTime: result1[0].SentTime,
          MessageID: result.insertId
        });
      })
    })
  })

  socket.on('disconnect', () => {
    console.log("socket disconnected");
  })

})
http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
