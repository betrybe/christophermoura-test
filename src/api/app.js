const express = require('express');
const bodyParser = require('body-parser');
const user = require('../controller/routes/userRoutes');
const { handleError } = require('../middlware/handleError');

const app = express();

app.use(bodyParser.json());

app.use('/users', user.router);

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use(handleError);

module.exports = app;
