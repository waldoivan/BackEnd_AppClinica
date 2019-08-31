var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CentroSaludSchema = new Schema({
    rutcentro: { type: String, required: [true, 'Rut del Centro de Salud es obligatorio'] },
    nombrefantasia: { type: String, required: [true, 'Nombre del Centro de Salud es obligatorio'] },
    razonsocial: { type: String, required: [true, 'La Razón Social del Centro de salud es obligatoria'] },
    direccion: { type: String, required: [true, 'La Dirección del Centro es necesaria'] },
    email: { type: String, unique: true, required: [true, 'El E.Mail de contacto es necesario'] },
    estatal: { type: Boolean, default: false, required: [true, 'Especificar si Centro de Salud es Estatal'] },
    img: { type: String, required: false },
    fk_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false }
}, { collection: 'centros_salud' });

module.exports = mongoose.model('CentroSalud', CentroSaludSchema);