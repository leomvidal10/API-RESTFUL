const express = require('express');
const consign = require('consign');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//Conectar Banco de dados
mongoose.connect('mongodb://localhost:27017/api').then(() => { 
    console.log('BD conectado')
}).catch((error) => {
    console.log('Erro ao conectar ao BD')
});
mongoose.Promise = global.Promise;

//Configurar Express
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
consign().include('controllers').into(app);

app.listen(3000, () => console.log('servidor rodando na porta 3000'));