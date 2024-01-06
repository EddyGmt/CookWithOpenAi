const asyncHandler = require('express-async-handler')
const {Recette} = require('../db/models/recette.model');
const openai = require('openai')
const {Sequelize} = require("sequelize");
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


const searchRecipe = asyncHandler(async (req, res) => {
    const query = req.query.query;
    //Requete pour trouver des recettes dans la base de données
    const recipesFromDB = await Recette.findAll({
        where: {
            [Sequelize.Op.or]: [
                {nom: {[Sequelize.Op.iLike]: `%${query}%`}},
                {img: {[Sequelize.Op.iLike]: `%${query}%`}},
                {nb_personnes: {[Sequelize.Op.eq]: query}}, // Utiliser [Sequelize.Op.eq] pour une égalité stricte
                {ingredients: {[Sequelize.Op.iLike]: `%${query}%`}},
                {quantites: {[Sequelize.Op.iLike]: `%${query}%`}},
                {etapes: {[Sequelize.Op.iLike]: `%${query}%`}},
            ]
        }
    });
    const multipleResults = [...recipesFromDB];

    try {
        const openaiResponse = await openaiClient.completions.create({
            engine: 'text-davinci-003',
            prompt: `Recette de cuisine: ${query}`,
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

const generateIngredients = asyncHandler(async(req, res) =>{
    const recetteId = req.params.id;
    const recette = Recette.findByPk(recetteId)
    try{
        const prompt = `Générer une liste de course pour la recette ${recette.nom}`
        const openAiResponse = await openaiClient.completions.create({
            engine: 'text-davinci-002',
            prompt,
            max_tokens: 150,
        });

        // Récupérez et renvoyez le texte généré
        const listeDeCourse = openAiResponse.choices[0].text.trim();
        return listeDeCourse;

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erreur interne du serveur'})
    }
})

const generateAccompagnement = asyncHandler(async(req, res)=>{
    const recetteId = req.params.id;
    const recette = Recette.findByPk(recetteId)
    try{
        const prompt = `Peux-tu me donner un accompagnement qui irait bien avec la recette: ${recette.nom}`;
        const openAiResponse = await openaiClient.completions.create({
            engine:'text-davinci-002',
            prompt,
            max_tokens:150

            //TODO Méthode a finir et à tester pour la génération d'accompagnement
        })
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erreur interne du serveur'});
    }
})

module.exports = {createRecipe, searchRecipe, generateIngredients}