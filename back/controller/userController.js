const asyncHandler = require('express-async-handler');
const { User, Recette, UserRecette } = require('../db/models');

const addToFavorites = asyncHandler(async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    const recette = await Recette.findByPk(recipeId);
    if (!recette) {
      return res.status(404).json({ success: false, error: 'Recette non trouvée' });
    }

    await user.addFavoris(recette);

    res.status(200).json({ success: true, message: 'Recette ajoutée aux favoris' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

const removeFromFavorites = asyncHandler(async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    const recette = await Recette.findByPk(recipeId);
    if (!recette) {
      return res.status(404).json({ success: false, error: 'Recette non trouvée' });
    }

    await user.removeFavoris(recette);

    res.status(200).json({ success: true, message: 'Recette retirée des favoris' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

module.exports = { addToFavorites, removeFromFavorites };