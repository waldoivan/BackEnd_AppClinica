// ========================================================================
// Requires (Importación de Librerías propias o de Terceros)
// ========================================================================
var express = require('express');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var bodyParser = require('body-parser');
var colors = require('colors'); // activa uso de colores en consola de Node


// ========================================================================
// Inicializa Variables
// ========================================================================
var app = express();


// ========================================================================
// Body Parser parse application/x-www-form-urlencoded
// ========================================================================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// ========================================================================
// Importar Rutas
// ========================================================================
var appRoutes = require('./routes/app.routes');
var usuarioRoutes = require('./routes/usuario.routes');
var loginRoutes = require('./routes/login.routes');


// ========================================================================
// Usar Rutas (importación con Middleware)
// ========================================================================
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// ========================================================================
// Escuchar Peticiones
// ========================================================================
app.listen(3000, () => {
    console.log('Express Server Puerto 3000: ', 'online'.green);
});

// Conexion a la Base de Datos
mongoose.connect('mongodb://localhost:27017/DB_AppClinica', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos AppClinica: ', 'online'.green);
});