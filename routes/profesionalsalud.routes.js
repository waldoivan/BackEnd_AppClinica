// ========================================================================
// Importaciones Requeridas
// ========================================================================
var express = require('express');
var app = express();

// Importación Verificación por Token
var mdAutenticacion = require('../middlewares/autenticacion');

// Importación Modelo de Datos
var ProfesionalSalud = require('../schemas/ProfesionalSalud.schema');

// ====================================================================
// GET: OBTENER todos los Profesionales de Salud
// ====================================================================
app.get('/', (req, res) => {

    var desdeRegistro = req.query.desdeRegistro || 0;
    desdeRegistro = Number(desdeRegistro);

    ProfesionalSalud.find({}, 'rut nombre appaterno apmaterno email img fk_usuario fk_centro')
        .populate('fk_usuario', 'nombre appaterno apmaterno email')
        .populate('fk_centro', 'rut_centro nombre_fantasia direccion')
        .skip(desdeRegistro)
        .limit(5)
        .exec((err, profesionalessalud) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Datos del Profesional de Salud',
                    errors: err
                });
            }
            ProfesionalSalud.countDocuments({}, (err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en conteo Total de Registros de Profesionales',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'Get de Profesionales de Salud',
                    profesionalessalud: profesionalessalud,
                    totalRegistros: conteo
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