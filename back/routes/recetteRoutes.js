const express = require('express');
const router = express.Router();
const {
    createRecipe,
    searchRecipe,
    generateIngredients,
    getRecipeWithRecommendations,
    updateRecipeNotationCommentary
    } = require('../controller/recetteController')
    generateIngredients,
    generateAccompagnement
} = require('../controller/recetteController')
const {Recette} = require("../db/models/recette.model");
const openai = require("openai");
const {Sequelize} = require("sequelize");

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = new openai({key: openaiApiKey});

router.post('/create', createRecipe);
router.post('/search-recette', searchRecipe);
router.get('/generer-liste-de-course/:id', generateIngredients);
router.get('/:id', getRecipeWithRecommendations);
router.put('/:id/notation-commentary', updateRecipeNotationCommentary);



router.get('/generer-accompagnements/:id', generateAccompagnement);

router.post('/search', async (req, res) => {
    const { nom } = req.body;

    try {
        // 1. Récupération des données depuis la base de données
        const recipes = await Recette.findAll({
            where: {
                nom: {
                    [Sequelize.Op.iLike]: `%${nom}%`,
            },
        },
    });

        // 1. Formatage de la requête pour OpenAI GPT-3.5-turbo
        const prompt = 'Bonjour je veux des idées de recettes qui correspondent à ce plat et autour de ce plat : ${nom}';

        // 2. Appel à OpenAI GPT-3.5-turbo
        const completions = await openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        "Tu es un moteur de recherche de recettes. Réponds aux requêtes des utilisateurs en donnant des idées de recettes qui correspondent à la recherche et à celle stockée en base de données. À partir de maintenant, dès que tu recevras une requête, tu renverras du texte dans lequel tu donneras des idées de recettes qui correspondent à la recherche avec les détails de ces recettes. Tu peux dire bonjour quand on te dit bonjour sinon pas besoin de faire des phrases de courtoisies.",
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });


        // 3. Traitement des réponses de OpenAI GPT-3.5-turbo
        const ideas = completions.choices.map((choice) => choice.message.content);

        res.json({ ideas });
    } catch (error) {
        console.error('Erreur lors de la recherche :', error);
        res.status(500).json({ error: 'Erreur lors de la recherche' });
    }
});

module.exports = router;