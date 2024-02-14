const { User, validateUser } = require('../models/users.model');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { chalkLogErr } = require('../utils/chalk');

async function registerUser(req, res) {
  try {
    // validate user's input
    const error = validateUser(req.body, req.method);
    if (error) {
      chalkLogErr(error);
      res.status(400).json({ error });
      return;
    }

    // validate system
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).send('User already registered');
      return;
    }

    if (!req.body.image.url) {
      req.body.image.url =
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
    }

    if (!req.body.image.alt) {
      req.body.image.alt = 'user image';
    }

    // process
    const newUser = new User({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 12),
    });

    await newUser.save();

    // response
    res.json(_.pick(newUser, ['_id', 'name', 'email']));
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;

    // Can't use authRoles middleware generator, because the user can also get their own details
    // without being an admin
    if (!req.user.isAdmin && req.user._id !== id) {
      res.status(400).send('The user is not allowed to access other users');
      return;
    }

    const user = await User.findById(id).select('-password');
    res.json(user);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function editUser(req, res) {
  try {
    // validate user's input
    const error = validateUser(req.body, req.method);
    if (error) {
      chalkLogErr(error);
      res.status(400).json({ error });
      return;
    }

    // validate system & process
    if (req.user._id !== req.params.id) {
      res.status(400).send('The user is not allowed to access other users');
      return;
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400).send('The user with the given ID was not found');
      return;
    }

    //   if (card.user_id !== req.user._id && !req.user.isAdmin) {
    //     res.status(400).send('Only admin or user allowed to edit.');
    //     return;
    //   }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      {
        new: true,
      }
    ).select('-password');

    // response
    res.json(updatedUser);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('server error: ' + error.message);
  }
}

async function changeIsBusinessStatus(req, res) {
  try {
    // validate user's input
    // const error = validateUser(req.body);
    // if (error) {
    //   console.log(error);
    //   res.status(400).json({ error });
    //   return;
    // }

    // validate system & process
    if (req.user._id !== req.params.id) {
      res.status(400).send('The user is not allowed to access other users');
      return;
    }
    let user = await User.findById(req.params.id);
    user = await User.findByIdAndUpdate(
      //   req.params.id,
      { _id: req.params.id, user_id: req.user._id },
      { isBusiness: !user.isBusiness },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(400).send('The user with the given ID was not found');
      return;
    }

    // response
    res.json(user);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function deleteUser(req, res) {
  try {
    // Can't use authRoles middleware generator, because the user can also get their own details
    // without being an admin
    if (!req.user.isAdmin && req.user._id !== req.params.id) {
      res.status(400).send('The user is not allowed to access other users');
      return;
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(400).send('The user with the given ID was not found');
      return;
    }

    res.json(user);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  editUser,
  changeIsBusinessStatus,
  deleteUser,
};
