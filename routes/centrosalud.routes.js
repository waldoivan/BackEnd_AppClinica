// ========================================================================
// Importaciones Requeridas
// ========================================================================
var express = require('express');
var app = express();

// Importación Verificación por Token
var mdAutenticacion = require('../middlewares/autenticacion');

// Importación Modelo de Datos
var CentroSalud = require('../schemas/CentroSalud.schema');

// ====================================================================
// GET: OBTENER todos los Centros de Salud  ,'rut_centro nombre_fantasia direccion razon_social email img fk_usuario'
// ====================================================================
app.get('/', (req, res) => {

    var desdeRegistro = req.query.desdeRegistro || 0;
    desdeRegistro = Number(desdeRegistro);

    CentroSalud.find({})
        .populate('fk_usuario', 'nombre appaterno appmaterno email')
        .skip(desdeRegistro)
        .limit(5)
        .exec((err, centros) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Datos de Centros',
                    errors: err
                });
            }
            CentroSalud.countDocuments({}, (err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en conteo Total de Centros de Salud',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'Get de Centros de Salud',
                    centrossalud: centros,
                    totalRegistros: conteo
                });
            });

        });
});


// ====================================================================
// GET: OBTENER UN centro de salud  ,'rut_centro nombre_fantasia direccion razon_social email img fk_usuario'
// ====================================================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    CentroSalud.findById(id)
        .populate('fk_usuario', 'nombre appaterno apmaterno email')
        .exec((err, centro) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Buscando Centro de Salud',
                    errors: err
                });
            }
            if (!centro) {
                return this.response.status(400).json({
                    ok: false,
                    mensaje: 'El Centro de Salud con id ' + id + 'no existe.',
                    errors: { message: 'NO existe un centro de salud con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Centro de Salud encontrado',
                centrosalud: centro
            });
        });
});



// ====================================================================
// PUT: ACTUALIZAR Centro de Salud
// ====================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    CentroSalud.findById(id, (err, centro) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar Centro de Salud',
                errors: err
            });
        }
        if (!centro) {
            return res.status(400).json({
                ok: false,
                mensaje: `El Centro de Salud con el ID {id} no existe.`,
                errors: { message: 'No existe Centro de Salud con ese ID' }
            });
        }
        centro.rutcentro = body.rutcentro;
        centro.nombrefantasia = body.nombrefantasia;
        centro.razonsocial = body.razonsocial;
        centro.direccion = body.direccion;

        centro.save((err, centroGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar Centro de Salud',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Centro de Salud Actualizado Correctamente',
                centrosalud: centroGuardado
            });
        });
    });
});

// ======================================================================================
// POST: CREAR Centro de Salud (verificaToken NO es  llamado con parentesis en los parámetros) 
// ======================================================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    // Falta función para validar si vienen datos en los campos correspondientes
    // sobre todo en la Contraseña para poder encriptarla.
    var nuevoCentroSalud = new CentroSalud({
        rutcentro: body.rutcentro,
        nombrefantasia: body.nombrefantasia,
        razonsocial: body.razonsocial,
        direccion: body.direccion,
        email: body.email,
        estatal: body.estatal,
        img: body.img,
        id_usuario: req.usuario._id
    });
    nuevoCentroSalud.save((err, centroGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Crear Centro de Salud',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Centro creado Exitosamente',
            centrosalud: centroGuardado
        });
    });
});


// ====================================================================
// ELIMINAR Centro de Salud por el ID
// ====================================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    CentroSalud.findByIdAndRemove(id, (err, centroBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Eliminar el Centro de Salud',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Centro de Salud Eliminado con Éxito',
            centrosalud: centroBorrado
        });
    });
});


module.exports = app;