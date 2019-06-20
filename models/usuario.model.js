var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido. NOTA: el Rol debe estar escrito en Mayúsculas y debe ser un rol permitido.'
};

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El Nombre es necesario'] },
    appaterno: { type: String, required: [true, 'El Apellido Paterno es necesario'] },
    apmaterno: { type: String, required: [true, 'El Apellido Materno es necesario'] },
    email: { type: String, unique: true, required: [true, 'El E.Mail es necesario'] },
    password: { type: String, required: [true, 'La Contrasena es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);