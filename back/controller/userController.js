const asyncHandler = require('express-async-handler');
const {User, Recette, UserRecette} = require('../db/models');
const jwt = require('jsonwebtoken')

const loginUser = asyncHandler(async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({message: "Username et mot de passe sont requis"});
    }

    try {
        // Chercher l'utilisateur dans la table User
        const user = await User.findOne({where: {username: username}});

        // Vérifier la présence de l'utilisateur
        if (!user) {
            return res.status(404).json({message: "Utilisateur non trouvé"});
        }

        // Vérifier le mot de passe
        // const isMatch = await bcrypt.compare(Password, user.Password);
        const isMatch = await User.findOne({where: {password: password}});

        if (!isMatch) {
            return res.status(401).json({message: "Email ou mot de passe invalides"});
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


const addToFavorites = asyncHandler(async (req, res) => {
    const {userId, recipeId} = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({success: false, error: 'Utilisateur non trouvé'});
        }

        const recette = await Recette.findByPk(recipeId);
        if (!recette) {
            return res.status(404).json({success: false, error: 'Recette non trouvée'});
        }

        await user.addFavoris(recette);

        res.status(200).json({success: true, message: 'Recette ajoutée aux favoris'});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Erreur interne du serveur'});
    }
});

const removeFromFavorites = asyncHandler(async (req, res) => {
    const {userId, recipeId} = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({success: false, error: 'Utilisateur non trouvé'});
        }

        const recette = await Recette.findByPk(recipeId);
        if (!recette) {
            return res.status(404).json({success: false, error: 'Recette non trouvée'});
        }

        await user.removeFavoris(recette);

        res.status(200).json({success: true, message: 'Recette retirée des favoris'});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Erreur interne du serveur'});
    }
});

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {addToFavorites, removeFromFavorites, loginUser};