const router = require('express').Router();

const { getAllCards, getUserCards, getCardById, createNewCard, editCard, likeCard, deleteCard } = require('../controllers/cardController');
const { authorize, authRoles } = require('../middleware/auth.mw');

//get all cards
router.get('/', getAllCards);

//get user cards
router.get('/my-cards', authorize, getUserCards);

//get card by id
router.get('/:id', getCardById);

//create new card
router.post('/', authRoles(false, true), createNewCard);

//edit card
router.put('/:id', authorize, editCard);

//like card
router.patch('/:id', authorize, likeCard);

//delete card
router.delete('/:id', authorize, deleteCard);

module.exports = router;
