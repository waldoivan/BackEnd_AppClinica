var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CentroSaludSchema = new Schema({
    rut_centro: { type: String, required: [true, 'Rut del Centro de Salud es obligatorio'] },
    nombre_fantasia: { type: String, required: [true, 'Nombre del Centro de Salud es obligatorio'] },
    direccion: { type: String, required: [true, 'La Dirección del Centro es necesaria'] },
    razon_social: { type: String, required: [true, 'La Razón Social del Centro de salud es obligatoria'] },
    email: { type: String, unique: true, required: [true, 'El E.Mail de contacto es necesario'] },
    img: { type: String, required: false },
    fk_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false }
}, { collection: 'centros_salud' });

module.exports = mongoose.model('CentroSalud', CentroSaludSchema);