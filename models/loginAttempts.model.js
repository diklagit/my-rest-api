const mongoose = require('mongoose');

const loginUsers = new mongoose.Schema({
  email: {
    type: String,
  },
  loginAttempts: {
    type: Number,
  },
  blockEndDate: {
    type: Date,
  },
});

const LoginAttemptsUser = mongoose.model(
  'LoginAttemptsUser',
  loginUsers,
  'LoginAttemptsUsers'
);

module.exports = {
  LoginAttemptsUser,
};
