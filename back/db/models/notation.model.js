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
})

module.exports = Notation