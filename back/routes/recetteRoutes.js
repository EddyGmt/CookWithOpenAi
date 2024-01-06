const express = require('express');
const router = express.Router();
const {createRecipe, searchRecipe} = require('../controller/recetteController')

router.post('recette/create', createRecipe);
router.get('recette/get-recette', searchRecipe);