// ========================================================================
// Requires (Importación de Librerías propias o de Terceros)
// ========================================================================
var express = require('express');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var bodyParser = require('body-parser');
var colors = require('colors'); // activa uso de colores en consola de Node


// ========================================================================
// Inicializa Variables para la aplicación
// ========================================================================
var app = express();
var port = 3000;
var db = 'mongodb://localhost:27017/DB_AppClinica';


// ========================================================================
// Body Parser parse application/x-www-form-urlencoded
// ========================================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ========================================================================
// Importar Rutas
// ========================================================================
// var medicoRoutes = require('./routes/medico.routes');
var appRoutes = require('./routes/app.routes');
var usuarioRoutes = require('./routes/usuario.routes');
var loginRoutes = require('./routes/login.routes');
var centroSaludRoutes = require('./routes/centrosalud.routes');
var medicoRoutes = require('./routes/medico.routes');
var pacienteRoutes = require('./routes/paciente.routes');
var busquedaRoutes = require('./routes/busqueda.routes');
var uploadRoutes = require('./routes/upload.routes');
var downloadRoutes = require('./routes/download.routes');


// ========================================================================
// Conexion a la Base de Datos
// ========================================================================
mongoose.connect(db, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos AppClinica: ', 'online'.green);
});


// ========================================================================
// Usar Rutas (importación con Middleware)
// ========================================================================
app.use('/usuario', usuarioRoutes);
app.use('/centrosalud', centroSaludRoutes);
app.use('/medico', medicoRoutes);
app.use('/paciente', pacienteRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);
app.use('/', appRoutes);
// app.use('/persona', personaRoutes);
// app.use('/sesion', sesionRoutes);
// app.use('/diagnostico', diagnosticoRoutes);


// ========================================================================
// Escuchar Peticiones
// ========================================================================
app.listen(port, () => {
    console.log('Express Server Puerto 3000: ', 'online'.green);
});