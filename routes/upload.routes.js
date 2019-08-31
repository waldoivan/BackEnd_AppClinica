// ============================================
// Importaciones Requeridas
// ============================================
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();


//Default Options (Middleware)
app.use(fileUpload());


// Importacion Schemas
var CentrosSalud = require('../schemas/CentroSalud.schema');
var ProfesionalesSalud = require('../schemas/ProfesionalSalud.schema');
var Usuarios = require('../schemas/Usuario.schema');



app.put('/:tipo/:id', (req, res, next) => {

    var tipoArchivo = req.params.tipo;
    var id = req.params.id;

    // Colecciones Permitidas
    var coleccionesPermitidas = ['profesionalessalud', 'centrossalud', 'usuarios'];

    if (coleccionesPermitidas.indexOf(tipoArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Clasificación NO Válida',
            errors: { message: 'Las Clasificaciones permitidas son: ' + coleccionesPermitidas.join(', ') + '.' }
        });
    }

    // Valida la existencia de archivo a subir
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No hay archivos para subir',
            errors: { message: 'Debe seleccionar una Imagen' }
        });
    }

    // Obtener nombre del Archivo
    var archivo = req.files.imagen;
    var nombreSplit = archivo.name.split('.');
    var extensionArchivo = nombreSplit[nombreSplit.length - 1];

    // Extensiones Permitidas
    var extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesPermitidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión No Válida',
            errors: { message: 'Las Extensiones Permitidas son: ' + extensionesPermitidas.join(', ') + '.' }
        });
    }

    // Nombre de Archivo Personalizado
    var nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extensionArchivo}`;

    // Mover archivo de Carpeta Temporal a un Path
    var path = `./uploads/${tipoArchivo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el Archivo',
                errors: err
            });
        }
        subirPorColeccion(tipoArchivo, id, nombreArchivo, res);
    });
});

// ======================================
// Funciones
// ======================================
function subirPorColeccion(tipoArchivo, id, nombreArchivo, res) {

    if (tipoArchivo === 'usuarios') {

        Usuarios.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario NO existe',
                    errors: { message: 'Usuario No existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            //Si existe archivo, elimina imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al Actualizar Imagen de Usuario',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Usuario Actualizada Correctamente',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipoArchivo === 'profesionalessalud') {

        ProfesionalesSalud.findById(id, (err, profesionalsalud) => {

            if (!profesionalsalud) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Médico NO existe',
                    errors: { message: 'Profesional de Salud No existe' }
                });
            }

            var pathViejo = './uploads/profesionalsalud/' + profesionalessalud.img;

            //Si existe archivo, elimina imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            profesionalsalud.img = nombreArchivo;

            profesionalsalud.save((err, profesionalSaludActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al Actualizar Imagen del Profesional de Salud',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Médico Actualizada Correctamente',
                    profesionalsalud: profesionalSaludActualizado
                });
            });
        });
    }

    if (tipoArchivo === 'centrossalud') {

        CentrosSalud.findById(id, (err, centrosalud) => {

            if (!centrosalud) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Centro de Salud NO existe',
                    errors: { message: 'Centro de Salud No existe' }
                });
            } else {
                var pathViejo = './uploads/centrossalud/' + centrosalud.img;

                //Si existe archivo, elimina imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                centrosalud.img = nombreArchivo;
                centrosalud.save((err, centroSaludActualizado) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al Actualizar Imagen de Centro de Salud',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de Centro de Salud Actualizada Correctamente',
                        centro: centroSaludActualizado
                    });
                });
            }
        });
    }
}

module.exports = app;