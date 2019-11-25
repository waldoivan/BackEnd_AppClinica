// ========================================================================
// Importaciones Requeridas
// ========================================================================
var express = require('express');
var app = express();

///////////////////////
const router = express.Router();
const bodyparser = require('body-parser');
const oracledb = require('oracledb');
//Authoriser tous les requettes cors)
const cors = require('cors');
app.use(cors());

app.use(bodyparser.json());

///Pour changer le format de la requete 
app.use(bodyparser.urlencoded({
    extended: true
}));

var connAttrs = {
    user: "hr",
    password: "hr",
    connectString: "170.239.87.250:1521/xepdb1"
};

// Importación Verificación por Token
var mdAutenticacion = require('../middlewares/autenticacion');

// Importación Modelo de Datos
var ProfesionalSalud = require('../schemas/ProfesionalSalud.schema');

// ====================================================================
// GET: OBTENER todos los Profesionales de Salud
// ====================================================================
app.get('/', (req, res) => {

    /////Consulta Profesionales////// done
    app.get('/profesionales', function(req, res) {
        "use strict";

        oracledb.getConnection(connAttrs, function(err, connection) {
            if (err) {
                // Error connecting to DB
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error connecting to DB",
                    detailed_message: err.message
                }));
                return;
            }
            connection.execute("SELECT img, rut, appaterno, apmaterno, emaail FROM clin_profesionales", {}, {
                outFormat: oracledb.OBJECT // Return the result as Object
            }, function(err, result) {
                if (err) {
                    res.set('Content-Type', 'application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error getting the dba_tablespaces",
                        detailed_message: err.message
                    }));
                } else {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');
                    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                    res.contentType('application/json').status(200);
                    res.send(JSON.stringify(result.rows));

                }
                // Release the connection
                connection.release(
                    function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("GET /sendTablespace : Connection released");
                        }
                    });
            });
        });
    });


});


// ====================================================================
// GET: OBTENER UN Profesional de Salud
// ====================================================================
app.get('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    ProfesionalSalud.findOne({ _id: id }, 'rut nombre appaterno apmaterno email img fk_centro')
        .populate('fk_usuario', 'nombre appaterno apmaterno email')
        .populate('fk_centro', 'rut_centro nombre_fantasia direccion')
        .exec((err, profesionalsalud) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Buscando Profesional de Salud',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Profesional de Salud encontrado',
                profesionalsalud: profesionalsalud
            });
        });
});



// ====================================================================
// PUT: ACTUALIZAR Profesional de Salud
// ====================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    ProfesionalSalud.findById(id, (err, profesionalsalud) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar Profesional de Salud',
                errors: err
            });
        }
        if (!profesionalsalud) {
            return res.status(400).json({
                ok: false,
                mensaje: `El Profesional de Salud con el ID {id} no existe.`,
                errors: { message: 'No existe Profesional de Salud con ese ID' }
            });
        }
        profesionalsalud.rut = body.rut;
        profesionalsalud.nombre = body.nombre;
        profesionalsalud.appaterno = body.appaterno;
        profesionalsalud.appaterno = body.appaterno;
        profesionalsalud.apmaterno = body.apmaterno;
        profesionalsalud.fk_usuario = body.fk_usuario;
        profesionalsalud.fk_centro = body.fk_centro;

        profesionalsalud.save((err, profesionalSaludGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar el Profesional de Salud',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Profesional de Salud Actualizado Correctamente',
                profesionalsalud: profesionalSaludGuardado
            });
        });
    });
});

// ======================================================================================
// POST: CREAR Profesional de Salud (verificaToken NO es  llamado con parentesis en los parámetros) 
// ======================================================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    // Falta función para validar si vienen datos en los campos correspondientes
    // sobre todo en la Contraseña para poder encriptarla.
    var nuevoProfesionalSalud = new ProfesionalSalud({
        rut: body.rut,
        nombre: body.nombre,
        appaterno: body.appaterno,
        apmaterno: body.apmaterno,
        email: body.email,
        img: body.img,
        fk_usuario: body.fk_usuario,
        fk_centro: body.fk_centro
    });
    nuevoProfesionalSalud.save((err, profesionalSaludGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Crear Profesional de Salud',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Profesional de Salud creado Exitosamente',
            profesionalsalud: profesionalSaludGuardado
        });
    });
});


// ====================================================================
// ELIMINAR Profesional de Salud por el ID
// ====================================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    ProfesionalSalud.findByIdAndRemove(id, (err, profesionalSaludBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Eliminar Profesional de Salud',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Profesional de Salud Eliminado con Éxito',
            profesionalsalud: profesionalSaludBorrado
        });
    });
});


module.exports = app;