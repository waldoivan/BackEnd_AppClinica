// ========================================================================
// Importaciones Requeridas
// ========================================================================
var express = require('express');
var app = express();

// Importación Verificación por Token
var mdAutenticacion = require('../middlewares/autenticacion');

// Importación Modelo de Datos
var Paciente = require('../schemas/Paciente.schema');

// ====================================================================
// GET: OBTENER todos los Pacientes
// ====================================================================
app.get('/', (req, res) => {

    Paciente.find({}, 'rut_paciente nombre appaterno apmaterno email img fk_centro')
        .populate('fk_usuario', 'nombre appaterno apmaterno email')
        .exec((err, pacientes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Datos de Pacientes',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Get de Pacientes',
                pacientes: pacientes
            });
        });
});


// ====================================================================
// GET: OBTENER UN Paciente
// ====================================================================
app.get('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Paciente.findOne({ _id: id }, 'rut_paciente nombre appaterno apmaterno email img fk_centro')
        .populate('fk_usuario', 'nombre appaterno apmaterno email')
        .exec((err, paciente) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Buscando Paciente',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Paciente encontrado',
                paciente: paciente
            });
        });
});



// ====================================================================
// PUT: ACTUALIZAR Paciente
// ====================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Paciente.findById(id, (err, paciente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar Paciente',
                errors: err
            });
        }
        if (!paciente) {
            return res.status(400).json({
                ok: false,
                mensaje: `El Paciente con el ID {id} no existe.`,
                errors: { message: 'No existe Paciente con ese ID' }
            });
        }
        paciente.rut_paciente = body.rut_paciente;
        paciente.nombre = body.nombre;
        paciente.appaterno = body.appaterno;
        paciente.apmaterno = body.apmaterno;
        paciente.fk_centro = body.fk_centro;

        paciente.save((err, pacienteGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar Paciente',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Paciente Actualizado Correctamente',
                paciente: pacienteGuardado
            });
        });
    });
});

// ======================================================================================
// POST: CREAR Paciente (verificaToken NO es  llamado con parentesis en los parámetros) 
// ======================================================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    // Falta función para validar si vienen datos en los campos correspondientes
    // sobre todo en la Contraseña para poder encriptarla.
    var nuevoPaciente = new Paciente({
        rut_paciente: body.rut_paciente,
        nombre: body.nombre,
        appaterno: body.appaterno,
        apmaterno: body.apmaterno,
        email: body.email,
        img: body.img,
        fk_centro: body.fk_centro
    });
    nuevoPaciente.save((err, pacienteGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al grabar Paciente',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Paciente creado Exitosamente',
            paciente: pacienteGuardado
        });
    });
});


// ====================================================================
// ELIMINAR Paciente por el ID
// ====================================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Paciente.findByIdAndRemove(id, (err, pacienteBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Eliminar el Paciente',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Paciente Eliminado con Éxito',
            paciente: pacienteBorrado
        });
    });
});


module.exports = app;