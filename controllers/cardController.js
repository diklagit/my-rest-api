const {
  validateCard,
  Card,
  isValidId,
  generateBizNumber,
} = require('../models/cards.model');
const { chalkLogErr } = require('../utils/chalk');

async function getAllCards(req, res) {
  try {
    const cards = await Card.find();

    if (!cards) {
      res.status(400).send('No cards found');
      return;
    }

    res.json(cards);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function getUserCards(req, res) {
  try {
    const cards = await Card.find({
      user_id: req.user._id,
    });

    if (!cards) {
      res.status(400).send('The card with the given ID was not found');
      return;
    }

    res.json(cards);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function getCardById(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).send(`${req.params.id} is not a valid ID`);
    }

    const card = await Card.findOne({
      _id: req.params.id,
    });

    if (!card) {
      res.status(400).send('The card with the given ID was not found');
      return;
    }

    res.json(card);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function createNewCard(req, res) {
  try {
    // validate user's input
    const error = validateCard(req.body);
    if (error) {
      chalkLogErr(error);
      res.status(400).json({ error });
      return;
    }

    // process
    const card = new Card({
      ...req.body,
      image: {
        url:
          req.body.image.url ??
          'https://cdn.pixabay.com/photo/2024/01/31/19/56/tulips-8544741_1280.jpg',
        alt: req.body.image.alt ?? 'image description',
      },
      bizNumber: await generateBizNumber(),
      user_id: req.user._id,
    });

    await card.save();

    // response
    res.json(card);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function editCard(req, res) {
  try {
    // validate user's input
    const error = validateCard(req.body);
    if (error) {
      chalkLogErr(error);
      res.status(400).json({ error });
      return;
    }
    const card = await Card.findById(req.params.id);

    if (!card) {
      res.status(400).send('The card with the given ID was not found');
      return;
    }
    if (card.user_id.toString() !== req.user._id.toString()) {
      res.status(400).send("you can't access to other user's cards");
      return;
    }

    // validate system & process
    const updatedCard = await Card.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user._id,
      },
      req.body,
      { new: true }
    );

    // response
    res.json(updatedCard);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function likeCard(req, res) {
  try {
    // get card from db
    const card = await Card.findOne({ _id: req.params.id });
    if (!card) {
      res.status(400).send('The card with the given ID was not found');
      return;
    }

    // if likes has id, pull id from card.likes
    if (card.likes.includes(req.user._id)) {
      card.likes.pull(req.user._id);
    } else {
      card.likes.push(req.user._id);
    }

    // carry out update
    card.save();

    // response
    res.json(card);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

async function deleteCard(req, res) {
  try {
    const cardToDelete = await Card.findById(req.params.id);

    if (!cardToDelete) {
      res.status(400).send("Card doesn't exists");
      return;
    }
    if (
      req.user._id.toString() !== cardToDelete.user_id.toString() &&
      !req.user.isAdmin
    ) {
      res
        .status(400)
        .send('The user is not allowed to delete other user`s cards');
      return;
    }

    const deletedCard = await Card.findOneAndDelete({
      _id: req.params.id,
    });

    res.json(deletedCard);
  } catch (error) {
    chalkLogErr(error);
    res.status(500).send('error: ' + error.message);
  }
}

module.exports = {
  getAllCards,
  getUserCards,
  getCardById,
  createNewCard,
  editCard,
  likeCard,
  deleteCard,
};
