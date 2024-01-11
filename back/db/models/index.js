const db = require('../index');
const User = require('./user.model');
const {Recette} = require('./recette.model');
const UserRecette = require('./userRecette.model');
const {Notation} = require('./notation.model');
const ContreIndication = require('./contreIndications.model');




User.belongsToMany(Recette, { through: UserRecette, as: 'favoris' });
Recette.belongsToMany(User, { through: UserRecette, as: 'favoris' });

Recette.hasMany(Notation, {
    foreignKey: 'recetteId', // Assurez-vous que le nom de la colonne est correct
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});


User.hasMany(ContreIndication, {
    foreignKey: {
        name: 'ContreIndicationId'
    }
});


module.exports = {
    User,
    Recette,
    UserRecette,
    Notation,
    ContreIndication,
};
