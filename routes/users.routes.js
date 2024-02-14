const router = require('express').Router();
const { authorize, authRoles } = require('../middleware/auth.mw');
const { registerUser, getAllUsers, getUserById, editUser, changeIsBusinessStatus, deleteUser } = require('../controllers/userController');

//register user
router.post('/', registerUser);

//get all users
router.get('/', authRoles(true), getAllUsers);

//get user by id
router.get('/:id', authorize, getUserById);

//edit user
router.put('/:id', authorize, editUser);

//change isBusiness status
router.patch('/:id', authorize, changeIsBusinessStatus);

//delete user
router.delete('/:id', authorize, deleteUser);

module.exports = router;
