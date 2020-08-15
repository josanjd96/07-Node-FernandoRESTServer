
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    message: '{VALUE} no es un rol válido'
}



const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La password es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },

});

userSchema.methods.toJSON = function () {

    let usuario = this;
    let userObject = usuario.toObject();
    delete  userObject.password;

    return userObject;

}

userSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único' } );

module.exports = mongoose.model('Usuario', userSchema );