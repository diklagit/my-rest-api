// const router = require('express').Router();
// const { User } = require('../models/users.model');
// const bcrypt = require('bcrypt');
// const Joi = require('joi');
// const { chalkLogErr } = require('../utils/chalk');

// //login user
// router.post('/', async (req, res) => {
//   try {
//     // validate user's input
//     const { error } = validateLogin(req.body);
//     if (error) {
//       res.status(400).send(error.details[0].message);
//       return;
//     }

//     // validate system
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       res.status(400).send('Invalid email or password');
//       return;
//     }

//     // Check if user is blocked
//     if (user.blockEndDate && user.blockEndDate > Date.now()) {
//       return res.status(401).send('User is blocked. Try again later.');
//     }

//     const validPassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );

//     if (!validPassword) {
//       // Increment login attempts
//       user.loginAttempts = (user.loginAttempts || 0) + 1;

//       // If login attempts exceed 3, block user for 24 hours
//       if (user.loginAttempts >= 3) {
//         user.blockEndDate = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//         await user.save();
//         return res
//           .status(401)
//           .send(
//             "You excide log in attempts, your'e account is temporarily locked for 24 hours"
//           );
//       } else {
//         await user.save();
//         res.status(400).send('Invalid email or password');
//         return;
//       }
//     }

//     // Reset login attempts on successful login
//     user.loginAttempts = 0;
//     user.blockEndDate = null;
//     await user.save();

//     // process
//     const token = user.generateAuthToken();

//     // response
//     res.json({
//       token,
//     });
//   } catch (error) {
//     chalkLogErr(error);
//     res.status(500).send('error: ' + error.message);
//   }
// });

// function validateLogin(user) {
//   const schema = Joi.object({
//     email: Joi.string().min(6).max(255).required(),
//     password: Joi.string().min(6).max(1024).required(),
//   }).required();

//   return schema.validate(user);
// }

// module.exports = router;
