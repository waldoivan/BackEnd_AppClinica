var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Reservar UniqueValidator para ver si sirve a los Profesionales para su Loggin
// var uniqueValidator = require('mongoose-unique-validator');
// PROPIEDADES DEL SCHEMA password: { type: String, required: [true, 'La Contrasena es necesaria'] }, role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos 

var MedicosSchema = new Schema({
    rut_medico: { type: String, required: [true, 'El Rut del Profesional es Obligatorio'] },
    nombre: { type: String, required: [true, 'El Nombre es necesario'] },
    appaterno: { type: String, required: [true, 'El Apellido Paterno es necesario'] },
    apmaterno: { type: String, required: [true, 'El Apellido Materno es necesario'] },
    email: { type: String, unique: true, required: [true, 'El E.Mail es necesario'] },
    img: { type: String, required: false },
    fk_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El Id del usuario es un campo obligatorio'] },
    fk_centro: { type: Schema.Types.ObjectId, ref: 'CentroSalud', required: [true, 'El Id del Centro de Salud es un campo obligatorio'] }
}, { collection: 'medicos' });

// MedicosSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Medicos', MedicosSchema);