const express = require("express");
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser')
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require('cookie-parser')
const {
    notFound,
    errorHandler,
    unauthorizedError
} = require('./middleware/errorMiddleware')
const PORT = process.env.PORT || 3000;
// const operationRoutes = require('./routes/operationRoutes');
// const users = require('./routes/api/users');
const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    exposeHeaders: ["Authorization"]
}
const db = require('./db');
const app = express();
const server = app.listen(PORT, () => {
    console.log("App listening on port 3000!");
});
app.use(express.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

db.sequelize.sync().then(() => {
    console.log('synced db.');
}).catch((err) => {
    console.log('Failed to sync db: ' + err.message);
})

// Cors Middleware
app.use(cors(corsOptions));

// Setting up the static directory
app.use('/public', express.static('public'))

app.use(cookieParser());

app.get('/', (req, res) => res.send('Projet en cours'));

app.use(notFound);
app.use(unauthorizedError);
app.use(errorHandler);

