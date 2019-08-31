// ==============================================
// Importaciones Requeridas
// ==============================================
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Importación de CONSTANTES
var SEED = require('../config/config').SEED;

// Importación Schema de Datos
var Usuario = require('../schemas/Usuario.schema');

//GOOGLE
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);



// ==============================================
// Autenticación de GOOGLE
// ==============================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token NO Válido'
            });
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar Usuario en la base de datos',
                error: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Su atenticación en el sistema es Normal, favor ingrese su Nombre de Usuario y Contraseña - No usar autenticación de Google: '
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });
                res.status(200).json({
                    ok: true,
                    mensaje: 'Login con Cuenta Google realizado con Éxito',
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            }
        } else {
            // El Usuario NO existe, hay que crearlo
            // DEPURAR: recibir el nombre completo y descomponerlo
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.appaterno = googleUser.nombre;
            usuario.apmaterno = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al Grabar Usuario de Google en la base de datos',
                        error: err
                    });
                } else {
                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Usuario de Google creado con éxito en la BD y Login Correcto',
                        usuario: usuarioDB,
                        token: token,
                        id: usuarioDB._id
                    });
                }
            });
        }
    });
});


// ==============================================
// Autenticación Normal
// ==============================================
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
                mensaje: 'Credenciales Incorrectas - Email no existe',
                errors: err
            });
        }

        // Verificar Contraseña con función bcrypt.compareSync
        // que compara 1 string con otro que ya fue encriptado
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales Incorrectas - Password no coincide',
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