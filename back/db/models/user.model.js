const db = require('../index');
const {DataTypes} = require("sequelize");




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
    },
    favorites: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
      },
})


module.exports = User