const db = require('../index');
const {DataTypes} = require("sequelize");
const {Allergie} = require("./allergie.model");

const User = db.sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    img:{
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    },
    IsAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

User.hasMany(Allergie,{
    foreignKey:{
        name:'allergieId'
    }
})