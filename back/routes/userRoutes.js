const express = require('express');
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {
    addToFavorites,
    deleteFavorie,
    loginUser,
    getAllUserFavoris,
    addContreIndication
   } = require('../controller/userController')


router.post('/addFavorite/:id', protect, addToFavorites);
router.delete('/deleteFavorie/:id', protect, deleteFavorie);
router.post('/login', loginUser);
router.post('/add-contre-indication', protect, addContreIndication);
router.get('/getAllUserFavoris', protect, getAllUserFavoris);


module.exports = router;