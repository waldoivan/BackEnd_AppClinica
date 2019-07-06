// ========================================================================
// Importaciones Requeridas
// ========================================================================
var express = require('express');
var app = express();

// Importación Verificación por Token
var mdAutenticacion = require('../middlewares/autenticacion');

// Importación Modelo de Datos
var Medico = require('../schemas/Medico.schema');

// ====================================================================
// GET: OBTENER todos los Medicos
// ====================================================================
app.get('/', (req, res) => {

    var desdeRegistro = req.query.desdeRegistro || 0;
    desdeRegistro = Number(desdeRegistro);

    Medico.find({}, 'rut_medico nombre appaterno apmaterno email img fk_usuario fk_centro')
        .populate('fk_usuario', 'nombre appaterno apmaterno email')
        .populate('fk_centro', 'rut_centro nombre_fantasia direccion')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Datos de Medicos',
                    errors: err
                });
            }
            Medico.countDocuments({}, (err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en conteo Total de Registros de Médicos',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'Get de Medicos',
                    medicos: medicos,
                    totalRegistros: conteo
                });
            });
        });
});


// ====================================================================
// GET: OBTENER UN Medico
// ====================================================================
app.get('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findOne({ _id: id }, 'rut_medico nombre appaterno apmaterno email img fk_centro')
        .populate('fk_usuario', 'nombre appaterno apmaterno email')
        .populate('fk_centro', 'rut_centro nombre_fantasia direccion')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Buscando Medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Medico encontrado',
                medico: medico
            });
        });
});



// ====================================================================
// PUT: ACTUALIZAR Medico
// ====================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar Medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: `El Medico con el ID {id} no existe.`,
                errors: { message: 'No existe Medico con ese ID' }
            });
        }
        medico.rut_medico = body.rut_medico;
        medico.nombre = body.nombre;
        medico.appaterno = body.appaterno;
        medico.appaterno = body.appaterno;
        medico.apmaterno = body.apmaterno;
        medico.fk_usuario = body.fk_usuario;
        medico.fk_centro = body.fk_centro;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar el Medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Medico Actualizado Correctamente',
                medico: medicoGuardado
            });
        });
    });
});

// ======================================================================================
// POST: CREAR Medico (verificaToken NO es  llamado con parentesis en los parámetros) 
// ======================================================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    // Falta función para validar si vienen datos en los campos correspondientes
    // sobre todo en la Contraseña para poder encriptarla.
    var nuevoMedico = new Medico({
        rut_medico: body.rut_medico,
        nombre: body.nombre,
        appaterno: body.appaterno,
        apmaterno: body.apmaterno,
        email: body.email,
        img: body.img,
        fk_usuario: body.fk_usuario,
        fk_centro: body.fk_centro
    });
    nuevoMedico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Crear Medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Medico creado Exitosamente',
            medico: medicoGuardado
        });
    });
});


// ====================================================================
// ELIMINAR Medico por el ID
// ====================================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Eliminar Medico',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Medico Eliminado con Éxito',
            medico: medicoBorrado
        });
    });
});


module.exports = app;