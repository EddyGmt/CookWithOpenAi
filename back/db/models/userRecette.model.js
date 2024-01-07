const db = require('../index');
const { DataTypes } = require('sequelize');

const UserRecette = db.sequelize.define('UserRecette', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = UserRecette;