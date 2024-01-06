const express = require('express');
const router = express.Router();
const {
    createRecipe,
    searchRecipe,
    generateIngredients} = require('../controller/recetteController')

router.post('/create', createRecipe);
router.get('/search-recette', searchRecipe);
router.get('/generer-liste-de-course/:id', generateIngredients);

module.exports = router;