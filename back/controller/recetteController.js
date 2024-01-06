const asyncHandler = require('express-async-handler')
const {Recette} = require('../db/models/recette.model');
const openai = require('openai')

//Clé API POUR OpenAi

const openaiApiKey = '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';
const openaiClient = new openai.OpenAIAPI({ key: openaiApiKey });

//Création d'une recette de cuisine
const createRecipe = asyncHandler(async (req, res) => {
    const {img, nom, nb_personnes, ingredients, quantites} = req.body;

    // const recipeData = {
    //     img,
    //     nom,
    //     nb_personnes,
    //     ingredients,
    //     quantites
    // }
    try {
        const recipe = await Recette.create({
            img,
            nom,
            nb_personnes,
            ingredients,
            quantites
        })

        if (recipe) {
            res.status(201).json({
                id: recipe.id,
                img: recipe.img,
                nom: recipe.nom,
                nb_personnes: recipe.nb_personnes,
                ingredients: recipe.ingredients,
                quantites: recipe.quantites
            })
        } else {
            res.status(400);
            throw new Error('Données invalide')
        }
    } catch (error) {
        console.error('Erreur lors de la création de votre recette', error);
        res.status(500).json({error: 'Erreur lors de la création de votre recette'})
    }
})

const searchRecipe = asyncHandler(async (req, res) => {
    const query = req.query.query;
    try{
        const response = await openaiClient.completions.create({
            engine: 'text-davinci-003',
            prompt: `Trouver une recette de cuisine pour ${query}`,
            max_tokens: 150
        });

        res.json({
           dbResu
        })


    }catch(error){
        console.error(error);
        res.status(500).json({error:'Erreur interne du serveur'})
    }
})

module.exports = {createRecipe, searchRecipe}