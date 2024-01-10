const express = require('express');
const router = express.Router();
const {
    createRecipe,
    searchRecipe,
    generateIngredients,
    getRecipeWithRecommendations,
    updateRecipeNotationCommentary
    } = require('../controller/recetteController')

router.post('/create', createRecipe);
router.get('/search-recette', searchRecipe);
router.get('/generer-liste-de-course/:id', generateIngredients);
router.get('/:id', getRecipeWithRecommendations);
router.put('/:id/notation-commentary', updateRecipeNotationCommentary);




module.exports = router;