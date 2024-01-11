const express = require('express');
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");

const {
    addToFavorites,
    removeFromFavorites,
    loginUser,
    getAllUserFavoris
   } = require('../controller/userController')

router.post('/addFavorite/:id', protect, addToFavorites);
router.post('/removeFavorite', removeFromFavorites);
router.post('/login', loginUser)
router.get('/getAllUserFavoris', protect, getAllUserFavoris);


module.exports = router;