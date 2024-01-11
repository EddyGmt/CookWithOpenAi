const asyncHandler = require('express-async-handler')
const {Recette} = require('../db/models/recette.model');
const openai = require('openai')
const {Sequelize} = require("sequelize");
const {Notation} = require("../db/models");
require('dotenv').config();

//Clé API POUR OpenAi
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = new openai({key: openaiApiKey});

//Création d'une recette de cuisine
const createRecipe = asyncHandler(async (req, res) => {
    const {img, nom, nb_personnes, ingredients, quantites} = req.body;
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
                quantites: recipe.quantites,
                etapes: recipe.etapes
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

const updateRecipeNotationCommentary = asyncHandler(async (req, res) => {

    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Utilisateur non authentifié' });
    }

    const recetteId = req.params.id;
    const userId = req.user.id;



    const { note, comment } = req.body;

    try {
        const recette = await Recette.findByPk(recetteId);

        if (!recette) {
            return res.status(404).json({ success: false, error: 'Recette non trouvée' });
        }

        let notation = await Notation.findOne({ where: { recetteId, userId } });

        if (notation) {
            // Mise à jour de la notation existante
            await notation.update({ note, comment });
        } else {
            // Création d'une nouvelle notation
            notation = await Notation.create({ recetteId, userId, note, comment });
        }

        return res.status(200).json({ success: true, data: notation });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la notation', error);
        return res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de la notation' });
    }
});



const searchRecipe = asyncHandler(async (req, res) => {
    const {recherhce} = req.body;

    if (query === undefined || query === null) {
        // Gérer le cas où query n'est pas défini
        res.status(400).json({error: 'Query non défini'});
        return;
    }
    //Requete pour trouver des recettes dans la base de données
    const recipesFromDB = await Recette.findAll({
        where: {
            [Sequelize.Op.or]: [
                {nom: {[Sequelize.Op.iLike]: `%${query}%`}},
                {img: {[Sequelize.Op.iLike]: `%${query}%`}},
                {nb_personnes: {[Sequelize.Op.eq]: query}}, // Utiliser [Sequelize.Op.eq] pour une égalité stricte
                {ingredients: {[Sequelize.Op.iLike]: `%${query}%`}},
                {quantites: {[Sequelize.Op.contains]: [BigInt(query)]}},
                {etapes: {[Sequelize.Op.iLike]: `%${query}%`}},
            ]
        }
    });
    const multipleResults = [...recipesFromDB];

    try {
        const openaiResponse = await openaiClient.completions.create({
            engine: 'text-davinci-003',
            prompt: `Recette de cuisine: ${recherhce}`,
            max_tokens: 150
        });

        // Renvoyer une réponse JSON avec les résultats combinés
        res.json({
            dbResults: multipleResults,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Erreur interne du serveur'})
    }
})

const generateIngredients = asyncHandler(async (req, res) => {
    const recetteId = req.params.id;
    const recette = await Recette.findByPk(recetteId);

    try {
        if (!recette) {
            res.status(404).json({error: 'Recette introuvable'});
            return;
        }

        const prompt = `Générer une liste de course pour la recette ${recette.nom}`;
        const openAiResponse = await openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        "Tu es un moteur de recherche de recettes. Réponds aux requêtes des utilisateurs en donnant la liste des ingrédients pour la recette donnée. Tu peux dire bonjour quand on te dit bonjour sinon pas besoin de faire des phrases de courtoisies.",
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        // Récupérez et renvoyez le texte généré
        const listeDeCourse = openAiResponse.choices.map((choice) => choice.message.content);
        res.json({listeDeCourse});

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Erreur interne du serveur'});
    }
});


const generateAccompagnement = asyncHandler(async (req, res) => {
    const recetteId = req.params.id;
    const recette = await Recette.findByPk(recetteId)
    try {
        const prompt = `Peux-tu me donner un accompagnement qui irait bien avec la recette: ${recette.nom}`;
        const openAiResponse = await openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        "Tu es un moteur de recherche de recettes. Réponds aux requêtes des utilisateurs en donnant la liste des accompagnements pour la recette donnée. Tu peux dire bonjour quand on te dit bonjour sinon pas besoin de faire des phrases de courtoisies.",
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });
        const listeAccompagnements = openAiResponse.choices.map((choice) => choice.message.content);
        res.json({listeAccompagnements});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Erreur interne du serveur'});
    }
})

const generateRecipeRecommendations = async (recetteId) => {
    const recipe = Recette.findByPk(recetteId)
    try {
        console.log('Recipe details:', recipe);

        const prompt = `Proposez des recettes similaires à : "${recipe.nom}".`;
        console.log('Prompt:', prompt);

        const openAiResponse = await openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                    "Propose moi des recettes en fonctions de la recette que je consulte et de mes recettes favorites"  
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const recommendations = openAiResponse.choices[0].text.trim();
        console.log('Recommendations:', recommendations);

        return recommendations;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la génération de recommandations');
    }
};

const getRecipeWithRecommendations = asyncHandler(async (req, res) => {
    const recetteId = req.params.id;
    const recette = await Recette.findByPk(recetteId);

    const recommendations = await generateRecipeRecommendations(recette);

if (recommendations) {
    return res.status(200).json({ success: true, data: recette, recommendations });
} else {
    return res.status(500).json({ success: false, error: 'Erreur lors de la génération de recommandations' });
}
});

module.exports = {createRecipe, searchRecipe, generateIngredients, getRecipeWithRecommendations, updateRecipeNotationCommentary, generateAccompagnement}