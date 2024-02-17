const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');

const cardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
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
  },
  web: {
    type: String,
    required: true,
    minlength: 14,
    maxlength: 256,
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
        default: 'image card',
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
      },
      zip: {
        type: Number,
        required: true,
        minlength: 1,
        default: 0,
      },
    }),
    required: true,
  },
  bizNumber: {
    type: Number,
    required: true,
    minlength: 3,
    maxlength: 12,
    unique: true,
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    required: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Card = mongoose.model('Card', cardsSchema, 'cards');

function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
    subtitle: Joi.string().min(2).max(256),
    description: Joi.string().min(2).max(1024).required(),
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
    web: Joi.string().min(14).max(256).allow(''),
    //image
    image: Joi.object({
      url: Joi.string().min(14).allow(''),
      alt: Joi.string().min(2).max(256).allow(''),
    }).required(),
    //address
    address: Joi.object({
      state: Joi.string().min(2).max(256).allow(''),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().min(1).required(),
      zip: Joi.number().min(1).allow(''),
    }).required(),
  }).required();

  const { error } = schema.validate(card, { abortEarly: false });

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

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

async function generateBizNumber() {
  while (true) {
    const randomNumber = _.random(100, 999_999_999_999);
    const card = await Card.findOne({ bizNumber: randomNumber });
    if (!card) {
      return String(randomNumber);
    }
  }
}

module.exports = {
  Card,
  validateCard,
  isValidId,
  generateBizNumber,
};
