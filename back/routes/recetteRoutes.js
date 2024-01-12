const express = require('express');
const router = express.Router();
const {
    createRecipe,
    searchRecipe,
    generateIngredients,
    generateRecipeRecommendations,
    updateRecipeNotationCommentary,
    generateAccompagnement,
    getAllNotationAndComments
} = require('../controller/recetteController')
const {Recette} = require("../db/models/recette.model");
const openai = require("openai");
const {Sequelize} = require("sequelize");
const { protect } = require('../middleware/authMiddleware')


const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = new openai({key: openaiApiKey});

router.post('/create', createRecipe);
router.post('/search-recette', searchRecipe);
router.get('/generer-liste-de-course/:id', generateIngredients);
router.get('/:id', protect, generateRecipeRecommendations);
router.put('/:id/notation-commentary', protect, updateRecipeNotationCommentary);

router.get('/generer-accompagnements/:id', generateAccompagnement);
router.get('/all-notations-commentaires/:id', getAllNotationAndComments);


router.post('/search', async (req, res) => {
    const {nom} = req.body;

    try {
        console.log('Recherche de recettes avec le nom:', nom);
        
        const allRecettes = await Recette.findAll();

        // Créez une liste des détails de toutes les recettes
        const allRecipeListString = allRecettes.map(recette => `Nom: ${recette.nom}, Ingrédients: ${recette.ingredients.join(', ')}, Nb Personnes: ${recette.nb_personnes}`).join('\n');
        console.log("LISTE DE TOUTES LES RECETTES", allRecipeListString);


        const recetteName = await Recette.findAll({
            where: {
                nom: {
                    [Sequelize.Op.iLike]: `%${nom}%`,
                },
            },
        });




                // Créez le prompt en incluant les détails des recettes
        const prompt = `Bonjour, je veux des idées de recettes pour un plats comme ça : ${nom}. Voici la liste des recettes de votre base de données :\n${allRecipeListString}`;
        
        
        const openAiResponse = await openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        "Tu es un moteur de recherche de recettes. Réponds aux requêtes des utilisateurs en donnant une liste de recettes qui corresponde à leurs recherche en fonctions des recettes que tu as stockée en base de données. À partir de maintenant, dès que tu recevras une requête, tu renverras du texte dans lequel tu donneras des idées de recettes qui correspondent à la recherche avec les détails de ces recettes. Tu peux dire bonjour quand on te dit bonjour sinon pas besoin de faire des phrases de courtoisies.",
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });


        const ideas = openAiResponse.choices.map((choice) => choice.message.content);
        console.log('Ideas:', ideas);
        res.json({ideas})
        return ideas;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la génération de idées');
    }
});

module.exports = router;