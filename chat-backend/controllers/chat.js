const mysql = require('mysql');
var auth = require('../middleware/auth');

module.exports = {};

module.exports.addContact = function(req, res) {
  var userID = 0;
  auth.existingUser(req.body.username).then(exist => {
    if (exist) res.status(404).json({
      MESSAGE: "User doesn't exist"
    })
    else {
      auth.getUserID(req.body.username).then(userId => {
        userID = userId;
        if (userId = 0) res.status(400).json({
          MESSAGE: "UserId didn't found"
        })
        else {
          auth.existingChat(req.user.id, userID).then(exist => {
            if (exist) res.status(409).json({
              MESSAGE: "Already has in contacts"
            })
            else {
              db.query("INSERT INTO Chats (ReceiverID, SenderID, SentTime) VALUES ('" + userID + "','" + req.user.id + "',sysdate())",
                function(err, result) {
                  if (err) throw err;
                  else res.send(JSON.stringify(userID));
                })
            }
          })
        }
      })
    }
  })
}

module.exports.contacts = function(req, res) {
  db.query("SELECT s.UserID as SenderId, s.UserName as SenderUserName, r.UserID as ReceiverId, r.UserName as ReceiverUserName from Users s, Users r, Chats c where c.ReceiverID=r.UserID AND c.SenderID=s.UserID AND (c.SenderID='" + req.user.id + "' OR c.ReceiverID='" + req.user.id + "') ORDER BY ChatID DESC",
    function(err, result) {
      var contacts = [];
      for (var i = 0; i < result.length; i++) {
        var contact = new Object();
        if (result[i].SenderId == req.user.id) {
          contact.contactId = result[i].ReceiverId;
          contact.contactUserName = result[i].ReceiverUserName;
        }
        if (result[i].ReceiverId == req.user.id) {
          contact.contactId = result[i].SenderId;
          contact.contactUserName = result[i].SenderUserName;
        }
        contacts.push(contact);
      }
      if (err) throw err;
      res.send(JSON.stringify({
        'contacts': contacts,
        'currentuser': req.user.id
      }));
    })
}
