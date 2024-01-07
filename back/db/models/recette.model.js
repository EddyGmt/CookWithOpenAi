const db = require('../index');
const {DataTypes} = require("sequelize");
const {Notation} = require("./notation.model");
const {UserRecette} = require('./userRecette.model'); 


const Recette = db.sequelize.define('Recette', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    img:{
        type: DataTypes.STRING,
        allowNull: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nb_personnes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ingredients: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    quantites: {
        type: DataTypes.ARRAY(DataTypes.BIGINT),
        allowNull: false
    },
    etapes:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    tags:{
        type: DataTypes.ARRAY(DataTypes.STRING)
    }
});

Recette.belongsToMany(User, { through: UserRecette, as: 'favoris' }); 

Recette.hasMany(Notation, {
    foreignKey: {
        name: 'notationId'
    }
})