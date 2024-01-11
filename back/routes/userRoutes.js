const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')

const {
    addToFavorites,
    removeFromFavorites,
    loginUser
   } = require('../controller/userController')

router.post('/addFavorite/:id', protect, addToFavorites);
router.post('/removeFavorite', removeFromFavorites);
router.post('/login', loginUser)

module.exports = router;