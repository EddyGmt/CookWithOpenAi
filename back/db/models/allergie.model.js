const db = require('../index');
const {DataTypes} = require("sequelize");

const Allergie = db.sequelize.define('Allergie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type_allergie: {
        type: DataTypes.STRING,
    },
})

module.exports = Allergie