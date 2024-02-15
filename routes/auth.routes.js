const router = require('express').Router();
const { User } = require('../models/users.model');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { BlockedUser } = require('../models/loginAttempts');
const {
  chalkLogErr,
  chalkLogAttempts,
  chalkLogSignedUser,
} = require('../utils/chalk');

// Login user
router.post('/', async (req, res) => {
  try {
    // Validate user's input
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    // Check if user is blocked
    const loginUserTry = await BlockedUser.findOne({ email: req.body.email });
    if (
      loginUserTry &&
      loginUserTry.blockEndDate &&
      loginUserTry.blockEndDate > Date.now()
    ) {
      return res.status(401).send('User is blocked. Try again later.');
    }

    // Validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      // Increment login attempts and block user if exceeded
      if (loginUserTry) {
        loginUserTry.loginAttempts = (loginUserTry.loginAttempts || 0) + 1;
        if (loginUserTry.loginAttempts >= 3) {
          loginUserTry.blockEndDate = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
          await loginUserTry.save();
          logAttempts(req.body.email, loginUserTry.loginAttempts);
          return res
            .status(400)
            .send(
              'Your account is temporarily locked for 24 hours due to excessive login attempts'
            );
        } else {
          await loginUserTry.save();
          logAttempts(req.body.email, loginUserTry.loginAttempts);
          return res.status(400).send('Invalid email or password');
        }
      } else {
        const newBlockedUser = new BlockedUser({
          email: req.body.email,
          loginAttempts: 1,
        });
        await newBlockedUser.save();
        logAttempts(req.body.email, 1);
        return res.status(400).send('Invalid email or password');
      }
    }

    // Reset login attempts on successful login
    if (loginUserTry) {
      loginUserTry.loginAttempts = 0;
      loginUserTry.blockEndDate = null;
      await loginUserTry.save();
    }

    // Generate authentication token
    const token = user.generateAuthToken();

    // Send response
    chalkLogSignedUser('the user signed-in successfully!');
    res.json({ token });
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('Internal Server Error');
  }
});

// Validate login input
function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(user);
}

// Log login attempt
function logAttempts(email, attempts) {
  const logMessage = `[${new Date().toISOString()}] Login attempt for ${email}. Attempts: ${attempts}\n`;
  chalkLogAttempts(logMessage); // Replace with your logging mechanism (e.g., file logging)
}

module.exports = router;
