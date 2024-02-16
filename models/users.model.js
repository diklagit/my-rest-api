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
          maxlength: 1024,
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
          minlength: 2,
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
          minlength: 2,
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
      first: Joi.string().min(2).max(256).required().label('First Name'),
      middle: Joi.string().min(2).max(256).label('Middle Name').allow(''),
      last: Joi.string().min(2).max(256).required().label('Last Name'),
    }).required(),
    phone: Joi.string()
      .min(9)
      .max(11)
      .required()
      .regex(/^0[2-9]\d{7,8}$/)
      .label('Phone'),
    email: Joi.string()
      .min(5)
      .max(256)
      .required()
      .label('Email')
      .email({ tlds: { allow: false } }),
    password: Joi.string()
      .min(8)
      .max(1024)
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
      state: Joi.string().min(2).max(256).label('State').allow(''),
      country: Joi.string().min(2).max(256).required().label('Country'),
      city: Joi.string().min(2).max(256).required().label('City'),
      street: Joi.string().min(2).max(256).required().label('Street'),
      houseNumber: Joi.number()
        .min(1)
        .max(256)
        .required()
        .label('House Number'),
      zip: Joi.number().max(256).label('Zip Code'),
    }).required(),
    // image
    image: Joi.object({
      url: Joi.string().min(14).max(1024).label('Image url').allow(''),
      alt: Joi.string().min(2).max(256).label('Image description').allow(''),
    }).required(),
    isAdmin: Joi.boolean(),
    isBusiness: Joi.boolean().required(),
  }).required();

  const { error } = schema.validate(user, { abortEarly: false });

  if (!error) {
    return null;
  }

  const errors = {};
  for (const {
    path: [key],
    message,
  } of error.details) {
    errors[key] = message;
  }
  return errors;
}

module.exports = {
  User,
  validateUser,
};
