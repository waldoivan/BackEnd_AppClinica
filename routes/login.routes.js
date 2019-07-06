// ========================================================================
// Importaciones Requeridas
// ========================================================================
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Importación de CONSTANTES
var SEED = require('../config/config').SEED;

// Importación Modelo de Datos
var Usuario = require('../schemas/Usuario.schema');

app.post('/', (req, res, next) => {

    var body = req.body;

    // Validación Correo único (sirve para el Rut)
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar usuario',
                errors: err
            });
        }

        // Validar si existe el correo electronico
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales Incorrectas - Email',
                errors: err
            });
        }

        // Verificar Contraseña con función bcrypt.compareSync
        // que compara 1 string con otro que ya fue encriptado
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales Incorrectas - Password',
                errors: err
            });
        }
        // CREAR TOKEN
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 14400 son 4 horas
        res.status(200).json({
            ok: true,
            mensaje: 'Login Correcto',
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    });

});

module.exports = app;