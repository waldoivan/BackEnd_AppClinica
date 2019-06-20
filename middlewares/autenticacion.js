// ========================================================================
// Importaciones Requeridas
// ========================================================================
var jwt = require('jsonwebtoken');

// Importación de CONSTANTES
var SEED = require('../config/config').SEED;

// ====================================================================
// VERIFICAR TOKEN (se exportara funcion que recibira los 3 parametros)
// ====================================================================
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token No Válido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};