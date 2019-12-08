var Promise = require('promise');

module.exports = {};

module.exports.existingUser = function(username) {
  return new Promise((resolve, reject) => {
    db.query("SELECT UserID FROM Users WHERE UserName='" + username + "'", function(err, result) {
      if (result[0]) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports.existingEmail = function(email) {
  return new Promise((resolve, reject) => {
    db.query("SELECT UserID FROM Users WHERE Email='" + email + "'", function(err, result) {
      if (result[0]) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports.getUserID = function(username) {
  return new Promise((resolve, reject) => {
    db.query("SELECT UserID FROM Users WHERE UserName='" + username + "'", function(err, result) {
      if (result[0]) {
        resolve(result[0].UserID);
      } else {
        resolve(0);
      }
    });
  });
};

module.exports.existingChat = function(currentUserId, contactId) {
  return new Promise((resolve, reject) => {
    db.query("SELECT ChatID FROM Chats WHERE (ReceiverID='" + currentUserId + "'AND SenderID='" + contactId + "') OR (ReceiverID='" + contactId + "'AND SenderID='" + currentUserId + "') ", function(err, result) {
      if (result[0]) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
