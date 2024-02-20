const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: new mongoose.Schema({
        first: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 256,
        },
        middle: {
          type: String,
          maxlength: 256,
        },
        last: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 256,
        },
      }),
      required: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 9,
      maxlength: 11,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 256,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    image: {
      type: new mongoose.Schema({
        url: {
          type: String,
          default:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        },
        alt: {
          type: String,
          maxlength: 256,
          default: 'user image',
        },
      }),
    },
    address: {
      type: new mongoose.Schema({
        state: {
          type: String,
          maxlength: 256,
        },
        country: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 256,
        },
        city: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 256,
        },
        street: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 256,
        },
        houseNumber: {
          type: Number,
          required: true,
          minlength: 1,
          maxlength: 256,
        },
        zip: {
          type: Number,
          required: true,
          minlength: 1,
          maxlength: 256,
          default: 0,
        },
      }),
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBusiness: {
      type: Boolean,
      default: false,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    methods: {
      generateAuthToken() {
        return jwt.sign(
          { _id: this._id, isBusiness: this.isBusiness, isAdmin: this.isAdmin },
          process.env.JWT_SECRET
        );
      },
    },
  }
);

const User = mongoose.model('User', userSchema, 'users');

function validateUser(user, requestMethod) {
  const schema = Joi.object({
    // name
    name: Joi.object({
      first: Joi.string().min(2).max(256).required(),
      middle: Joi.string().min(2).max(256).allow(''),
      last: Joi.string().min(2).max(256).required(),
    }).required(),
    phone: Joi.string()
      .min(9)
      .max(11)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    email: Joi.string()
      .min(5)
      .max(256)
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string()
      .min(8)
      .max(20)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&*-]{8,}$/
      )
      .message(
        'the password must be at least 8 characters long and contain at least one uppercase letter, one lower case letter, at least 4 numbers and at least one of the following characters !@#$%^&*-_'
      )
      .when(requestMethod, {
        is: 'POST',
        then: Joi.required(),
      }),
    // address
    address: Joi.object({
      state: Joi.string().min(2).max(256).allow(''),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().min(1).max(256).required(),
      zip: Joi.number().min(1).max(256).required(),
    }).required(),
    // image
    image: Joi.object({
      url: Joi.string().min(14).uri().allow(''),
      alt: Joi.string().min(2).max(256).allow(''),
    }).required(),
    isAdmin: Joi.boolean(),
    isBusiness: Joi.boolean().required(),
  }).required();

  const { error } = schema.validate(user, { abortEarly: false });

  if (!error) {
    return null;
  }

  const firstError = error.details[0];
  const errors = {
    [firstError.path[0]]: firstError.message,
  };

  return errors;
}

module.exports = {
  User,
  validateUser,
};
