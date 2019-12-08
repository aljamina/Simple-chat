const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bcryptComplexity = 10;
var auth = require('../middleware/auth');
var jwt = require('jsonwebtoken');
module.exports = {};

module.exports.register = function(req, res) {
  let secret = 'some_secret';
  bcrypt.hash(req.body.password, bcryptComplexity, function(err, hash) {
    auth.existingUser(req.body.username).then(exist => {
      if (!exist) res.status(404).json({
        MESSAGE: "Username exist"
      })
      else {
        auth.existingEmail(req.body.email).then(exist1 => {
          if (!exist1) res.status(409).json({
            MESSAGE: "Email exist"
          })
          else {
            db.query("INSERT INTO Users (Email,UserName,Password) VALUES ('" + req.body.email + "','" + req.body.username + "','" + hash + "');",
              function(err, result) {
                if (err) throw err;
                else {
                  var userData = {
                    "id": result.insertId,
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
      }
    })
  });
}
