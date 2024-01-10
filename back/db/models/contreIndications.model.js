const db = require('../index');
const {DataTypes} = require("sequelize");

const ContreIndication = db.sequelize.define('ContreIndication', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
})

module.exports = ContreIndication