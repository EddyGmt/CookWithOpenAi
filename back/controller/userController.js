const asyncHandler = require('express-async-handler');
const {Recette, UserRecette} = require('../db/models');
const ContreIndication = require('../db/models/contreIndications.model')
const {User} = require('../db/models')
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

const addContreIndication = asyncHandler(async (req, res) =>{
    const userId = req.user;
    const {type} = req.body;
    try{
        const user = await User.findByPk(userId.id);
        if (!user) {
            return res.status(404).json({success: false, error: 'Utilisateur non trouvé'});
        }
        let contreIndication = await ContreIndication.findOne({
            where: {
                userId: userId.id,  // Utilisez 'userId' au lieu de 'UserId'
                type: [type],
            },
        });
        if (contreIndication) {
            contreIndication.type.push(type);
            await contreIndication.save();
        } else {
            contreIndication = await ContreIndication.create({
                UserId: userId,
                type: [type],
            });
        }

        res.status(201).json({
            userId: userId.id,
            type:[type]
        });

    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
    }
})

const addToFavorites = asyncHandler(async (req, res) => {
    const recipeId  = req.params;
    const userId  = req.user;

    console.log('userId', userId);

    try {
        const user = await User.findByPk(userId.id);
        if (!user) {
            return res.status(404).json({success: false, error: 'Utilisateur non trouvé'});
        }

        const recette = await Recette.findByPk(recipeId.id);
        if (!recette) {
            return res.status(404).json({ success: false, error: 'Recette non trouvée' });
        }

        // Assurez-vous que vous utilisez la variable correcte pour l'utilisateur
        await userId.addFavoris(recette);

        res.status(200).json({ success: true, message: 'Recette ajoutée aux favoris' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
    }
});

const getAllUserFavoris= asyncHandler(async (req, res) => {
  const userId = req.user;

  console.log("userId", userId);
  try {
    const user = await User.findByPk(userId.id, {
      include: [{
        model: Recette,
        as: 'favoris',
        through: UserRecette,
      }],
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    const favoris = user.favoris;

    return res.status(200).json({ success: true, data: favoris });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Erreur lors de la récupération des favoris' });
  }
});



const deleteFavorie = asyncHandler(async (req, res) => {
    const  recetteId  = req.params;
    const  userId  = req.user;

    try {
        const user = await User.findByPk(userId.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
        }

        const recette = await Recette.findByPk(recetteId.id);
        if (!recette) {
            return res.status(404).json({ success: false, error: 'Recette non trouvée' });
        }

        await userId.removeFavoris(recette);

        res.status(200).json({ success: true, message: 'Recette supprimée des favoris' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
    }
});

module.exports = deleteFavorie;


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {addToFavorites, deleteFavorie, loginUser, getAllUserFavoris, addContreIndication};