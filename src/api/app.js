const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const user = require('../controller/routes/userRoutes');
const login = require('../controller/routes/loginRoutes');
const recipe = require('../controller/routes/recipeRoutes');
const { handleError } = require('../middlware/handleError');

const app = express();

app.use(bodyParser.json());

const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/images', express.static(uploadsPath));
app.use('/users', user.router);
app.use('/login', login.router);
app.use('/recipes', recipe.router);

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use(handleError);

module.exports = app;
