// ========================================================================
// Importaciones Requeridas
// ========================================================================
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');


// Importación Verificación por Token
var mdAutenticacion = require('../middlewares/autenticacion');

// Importación Modelo de Datos
var Usuario = require('../schemas/Usuario.schema');


// ====================================================================
// GET: OBTENER todos los Usuarios
// ====================================================================
app.get('/', (req, res) => {

    var desdeRegistro = req.query.desdeRegistro || 0;
    desdeRegistro = Number(desdeRegistro);

    Usuario.find({}, 'nombre appaterno apmaterno email img role google')
        .skip(desdeRegistro)
        .limit(5)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Datos de Usuario',
                    errors: err
                });
            }
            Usuario.countDocuments({}, (err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en Conteo Total de Registros de Usuario',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'Get de Usuarios',
                    usuarios: usuarios,
                    totalRegistros: conteo
                });
            });
        });
});


// ====================================================================
// GET: OBTENER UN usuario
// ====================================================================
app.get('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findOne({ _id: id }, 'nombre appaterno apmaterno email img role')
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Buscando al Usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Usuario encontrado',
                usuario: usuario
            });
        });
});


// ====================================================================
// PUT: ACTUALIZAR Usuario
// ====================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Buscar Usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el ID {id} no existe.`,
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar Usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Usuario Actualizado Correctamente',
                usuario: usuarioGuardado
            });
        });
    });
});


// ======================================================================================
// POST: CREAR un Nuevo Usuario
// sacamos el mdAutenticacion.verificaToken, para conectar el frontend
// ver si es necesario incluirlo despues
// ======================================================================================
app.post('/', (req, res) => {

    var body = req.body;
    // Falta función para validar si vienen datos en los campos correspondientes
    // sobre todo en la Contraseña para poder encriptarla.
    var nuevoUsuario = new Usuario({
        nombre: body.nombre,
        appaterno: body.appaterno,
        apmaterno: body.apmaterno,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    nuevoUsuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Crear Usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Usuario creado Exitosamente',
            usuario: usuarioGuardado
        });
    });
});


// ====================================================================
// ELIMINAR Usuario por el ID
// ====================================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Eliminar el Usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario Eliminado con Éxito',
            usuario: usuarioBorrado
        });
    });
});


module.exports = app;