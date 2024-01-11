const db = require('../index');
const {DataTypes} = require("sequelize");

const Notation = db.sequelize.define('Notation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    note: {
        type: DataTypes.INTEGER,
    },
    comment: {
        type: DataTypes.STRING,
    },

    recetteId: { // Assurez-vous que le nom de cette colonne est correct
        type: DataTypes.INTEGER,
        references: {
            model: 'Recettes', // Assurez-vous que le nom de la table parente est correct
            key: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },

    userId: {
         type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Assurez-vous que c'est le nom correct de votre table utilisateur
            key: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            },
        },
    },
})

module.exports = {Notation}