const asyncHandler = require('express-async-handler')
const {Recette} = require('../db/models/recette.model');
const {User} = require('../db/models');
const { Op } = require('sequelize');
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
    const recetteId = req.params.id;
    const userId = req.user.id;
    const { note, comment } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Utilisateur non authentifié' });
        }

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

const generateRecipeRecommendations = asyncHandler(async (req, res) => {
    const recetteId = req.params.id;
    const  userId  = req.user;
    try {
        console.log('Recipe details:', recetteId);

        const user = await User.findByPk(userId.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
        }

        const recette = await Recette.findByPk(recetteId);
        if (!recette) {
            return res.status(404).json({ success: false, error: 'Recette non trouvée' });
        }

         // Récupérez les recettes en base de données (ajustez cela selon votre modèle)
         const otherRecettes = await Recette.findAll({
            where: {
                id: { [Op.not]: recetteId }, 
            },
           
        });
        
        const otherRecettesFormatted = otherRecettes.map((recette) => {
          return `${recette.nom} : Ingrédients - ${recette.ingredients.join(', ')}.`;
            });

        const formattedRecettesList = otherRecettesFormatted.join('\n');

        const prompt = `Proposez des recettes similaires à : "${recette.nom}". Voici la liste des recettes en base de données :\n${formattedRecettesList}`;


        const openAiResponse = await openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Vous allez recevoir une demande de recommandation de recette de la part d'un utilisateur. À partir de toutes les recettes de votre base de données et des préférences de l'utilisateur, 
                    vous devez recommander trois recettes pour l'utilisateur. Voici la liste des recettes de votre base de données `,
                    
                },                
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const recommendations = openAiResponse.choices.map((choice) => choice.message.content);
        console.log('Recommendations:', recommendations);
        res.json({recommendations})
        return recommendations;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la génération de recommandations');
    }
})

const getAllNotationAndComments = asyncHandler(async (req, res) => {
    const recetteId = req.params.id;
    const recette = await Recette.findByPk(recetteId) 
  
    try {
        if (!recette) {
            return res.status(404).json({ success: false, error: 'Recette non trouvée' });
          };
      
          const notationsAndComments = await Notation.findAll({
            where: { recetteId: recetteId }
          });
      
          return res.status(200).json({ success: true, data: notationsAndComments });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
        }
  });
  

module.exports = {createRecipe, generateIngredients, generateRecipeRecommendations, updateRecipeNotationCommentary, generateAccompagnement, getAllNotationAndComments}