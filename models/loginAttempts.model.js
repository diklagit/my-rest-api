const mongoose = require('mongoose');

const loginUsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
  blockEndDate: {
    type: Date,
  },
});

const LoginAttemptsUser = mongoose.model(
  'LoginAttemptsUser',
  loginUsersSchema,
  'loginAttemptsUsers'
);

module.exports = {
  LoginAttemptsUser,
};
