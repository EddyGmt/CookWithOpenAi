const express = require('express');
const router = express.Router();
const {
    createRecipe,
    searchRecipe,
    generateIngredients,
    getRecipeWithRecommendations,
    updateRecipeNotationCommentary,
    generateAccompagnement,
    getAllNotationAndComments
} = require('../controller/recetteController')
const {Recette} = require("../db/models/recette.model");
const openai = require("openai");
const {Sequelize} = require("sequelize");
const {protect} = require('../middleware/authMiddleware')


const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = new openai({key: openaiApiKey});

router.post('/create', createRecipe);
router.post('/search-recette', searchRecipe);
router.get('/generer-liste-de-course/:id', generateIngredients);
router.get('/:id', getRecipeWithRecommendations);
router.put('/:id/notation-commentary', protect, updateRecipeNotationCommentary);

router.get('/generer-accompagnements/:id', generateAccompagnement);
router.get('/all-notations-commentaires/:id', getAllNotationAndComments);


router.post('/search', async (req, res) => {
        const {nom} = req.body;

        try {
            // 1. Récupération des données depuis la base de données
            const recipesFromDB = await Recette.findAll();
            const recipeListString = recipesFromDB.map((recette) => {
                return `${recette.nom} :  ${recette.ingredients.join(', ')}`;
            });
            const formattedList = recipeListString.join('\n');

            const prompt = 'Bonjour je veux des idées de recettes qui correspondent à ce plat et autour de ce plat : ' + nom;


// 2. Appel à OpenAI GPT-3.5-turbo
            const completions = await openaiClient.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content:
                            `Tu es un moteur de recherche de recettes. Réponds aux requêtes des utilisateurs en donnant des idées de 
                        recettes qui correspondent à la recherche et à celle stockée dans ta base de données ${formattedList}. À partir de
                         maintenant, dès que tu recevras une requête, tu renverras un objet json au format 
                         {"img": , "nom": , "nb_personnes": , "ingredients":[]}.`,
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });
            const ideasFromGPT = completions.choices.map((choice) => choice.message);
            const filteredIdeas = ideasFromGPT.filter((idea) => {
                // Vérifier si l'idée générée par GPT-3.5-turbo contient le nom d'une recette de la base de données
                return recipeListString
            });

            console.log('Idées générées par GPT-3.5-turbo :', ideasFromGPT);
            console.log('Idées filtrées :', filteredIdeas);

            res.json({ideas: filteredIdeas});


        } catch
            (error) {
            console.error('Erreur lors de la recherche :', error);
            res.status(500).json({error: 'Erreur lors de la recherche'});
        }
    }
)
;

module.exports = router;