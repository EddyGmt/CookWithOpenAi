require('dotenv').config();
const { Sequelize } = require('sequelize');
//Initialisation de sequelize avec notre base de données PostgreSql
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    sslmode: 'require',
});

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

testDbConnection();
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;

