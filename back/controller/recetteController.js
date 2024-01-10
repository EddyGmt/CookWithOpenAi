const asyncHandler = require('express-async-handler')
const Recette = require('../db/models/recette.model');
const Notation = require('../db/models/notation.model');

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
            quantites,
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

const generateRecipeRecommendations = async (recipe) => {
    try {
        console.log('Recipe details:', recipe);

        const prompt = `Proposez des recettes similaires à : "${recipe.nom}". Ingrédients : ${recipe.ingredients.join(', ')}.`;
        console.log('Prompt:', prompt);

        const openAiResponse = await openaiClient.completions.create({
            engine: 'text-davinci-003',
            prompt,
            max_tokens: 150,
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

module.exports = {createRecipe, searchRecipe, generateIngredients, getRecipeWithRecommendations, updateRecipeNotationCommentary}