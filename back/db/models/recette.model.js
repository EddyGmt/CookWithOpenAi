const db = require('../index');
const {DataTypes} = require("sequelize");
const {Notation} = require("./notation.model");

const Recette = db.sequelize.define('Recette', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
    },
    nb_personnes: {
        type: DataTypes.INTEGER,
    },
    ingredients: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    quantites: {
        type: DataTypes.ARRAY(DataTypes.BIGINT)
    },
});

Recette.hasMany(Notation, {
    foreignKey: {
        name: 'notationId'
    }
})