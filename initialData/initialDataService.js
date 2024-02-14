const { users, cards } = require('./initialData.json');
const { User } = require('../models/users.model');
const { Card } = require('../models/cards.model');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { chalkLogErr, chalkLogComplete } = require('../utils/chalk');

if (require.main === module) {
  const args = {
    fullReset: ['--full-reset', '-fr'].includes(process.arg[2]),
  };
  require('../configs/loadEnvs');

  require('../db/dbService')
    .connect()
    .then(() => seed({ fullReset: args.fullReset }));
}

async function seed({ fullReset = false } = {}) {
  try {
    const existingUsersCount = await User.countDocuments();
    const existingCardsCount = await Card.countDocuments();

    if (existingUsersCount > 0 || existingCardsCount > 0) {
      return;
    }

    if (fullReset) {
      await Promise.all([User.deleteMany({}), Card.deleteMany({})]);
    }
    await generateUsers();

    const businessUser = await User.findOne({ isBusiness: true });
  
    await generateCards(businessUser._id.toString());

    chalkLogComplete('initial users and cards are seeded');
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function generateUsers() {
  const Ps = [];
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    const newUser = await new User(user).save();
    Ps.push(newUser);
  }

  return await Promise.all(Ps);
}
async function generateCards(user_id) {
  const Ps = [];
  for (const card of cards) {
    card.user_id = user_id;
    const newCard = await new Card(card).save();
    Ps.push(newCard);
  }

  return await Promise.all(Ps);
}
module.exports = { seed };
