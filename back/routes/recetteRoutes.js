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
const {protect} = require('../middleware/authMiddleware')
const {ContreIndication} = require("../db/models");
const User = require('../db/models/user.model')


const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = new openai({key: openaiApiKey});

router.post('/create', createRecipe);
router.post('/search-recette', searchRecipe);
router.get('/generer-liste-de-course/:id', generateIngredients);
router.get('/:id', protect, generateRecipeRecommendations);
router.put('/:id/notation-commentary', protect, updateRecipeNotationCommentary);

router.get('/generer-accompagnements/:id', generateAccompagnement);
router.get('/all-notations-commentaires/:id', getAllNotationAndComments);


router.post('/search', protect, async (req, res) => {
    const {nom} = req.body;
    const userId = req.user.id; // Utilisez req.user.id pour obtenir directement l'ID de l'utilisateur

    try {
        console.log('Recherche de recettes avec le nom :', nom);

        // Récupération des contre-indications
        const user = await User.findByPk(userId, {
            include: [{
                model: ContreIndication,
                attributes: ['type']
            }]
        });

        if (!user) {
            return res.status(404).json({message: "Utilisateur non trouvé."});
        }

        // Vérifiez si l'utilisateur a des contre-indications
        const contreIndications = await ContreIndication.findAll({
            where: {
                userId: userId
            }
        });

// Mapper uniquement si des contre-indications existent
        const contreIndicationsString = contreIndications.length > 0
            ? contreIndications.map(contreIndication => `${contreIndication.type}]`).join(', ')
            : "aucune contre-indication";

        console.log('Contre indication', contreIndications)

        // Récupération des recettes basées sur le nom
        const recettes = await Recette.findAll();

        // Créez une liste des détails de toutes les recettes
        const allRecipeListString = recettes.map(recette => `Nom: ${recette.nom}, Ingrédients: ${recette.ingredients.join(', ')}, Nb Personnes: ${recette.nb_personnes}`).join('\n');
        console.log("LISTE DE TOUTES LES RECETTES", allRecipeListString);

        // Créez le prompt en incluant les détails des recettes
        const prompt = `Bonjour, je veux tes réponses en objet JSON et uniquement en objet JSON. Je veux des idées de recettes pour un plat comme ça : ${nom}. Voici la liste des recettes de votre base de données :\n${allRecipeListString}
                                et fais attention à mes ${contreIndicationsString}`;

        // Appel à l'API OpenAI
        const openAiResponse = await openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: "Tu es un moteur de recherche de recettes. Tu dois renvoyer les recettes " +
                        "uniquement en objet JSON et au format {id, img, nom, nb de personnes}. Réponds aux " +
                        "requêtes des utilisateurs en donnant une liste de recettes qui corresponde à leurs " +
                        "recherches en fonction des recettes que tu as stockées en base de données." +
                        `De plus, prend bien en compte mes ${contreIndicationsString} si j'en ai`
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        // Extraction des idées de la réponse OpenAI
        const ideas = openAiResponse.choices.map((choice) => choice.message.content);
        console.log('Ideas:', ideas);

        // Ajoutez ici la logique pour personnaliser les résultats en fonction des contre-indications

        res.json({ideas});
        return ideas;
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Erreur interne du serveur'});
    }
});


module.exports = router;