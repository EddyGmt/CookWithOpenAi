const express = require('express');
const router = express.Router();

const {
    addToFavorites,
    removeFromFavorites,
    loginUser
   } = require('../controller/userController')

router.post('/addFavorite', addToFavorites);
router.post('/removeFavorite', removeFromFavorites);
router.post('/login', loginUser)

module.exports = router;