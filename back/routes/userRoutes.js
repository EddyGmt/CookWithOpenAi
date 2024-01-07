const express = require('express');
const router = express.Router();

const {
    addToFavorites,
    removeFromFavorites,
   } = require('../controller/userController')

router.post('/addFavorite', addToFavorites);
router.post('/removeFavorite', removeFromFavorites);

module.exports = router;