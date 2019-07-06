var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var uniqueValidator = require('mongoose-unique-validator');

// var rolesValidos = {
//     values: ['ADMIN_ROLE', 'USER_ROLE'],
//     message: '{VALUE} no es un rol permitido. NOTA: el Rol debe estar escrito en Mayúsculas y debe ser un rol permitido.'
// };

var PacienteSchema = new Schema({

    rut_paciente: { type: String, required: [true, 'El Nombre es necesario'] },
    nombre: { type: String, required: [true, 'El Nombre es necesario'] },
    appaterno: { type: String, required: [true, 'El Apellido Paterno es necesario'] },
    apmaterno: { type: String, required: [true, 'El Apellido Materno es necesario'] },
    email: { type: String, unique: true, required: [true, 'El E.Mail es necesario'] },
    img: { type: String, required: false },
    fk_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El Id del usuario es un campo obligatorio'] },
    fk_centro: { type: Schema.Types.ObjectId, ref: 'CentroSalud', required: [true, 'El Id del Centro de Salud es un campo obligatorio'] }
}, { collection: 'pacientes' });

//PacienteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Paciente', PacienteSchema);