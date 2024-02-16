const mongoose = require('mongoose');

const blockLoginUser = new mongoose.Schema({
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

const BlockedUser = mongoose.model(
  'BlockedUser',
  blockLoginUser,
  'blockedUsers'
);

module.exports = {
  BlockedUser,
};
