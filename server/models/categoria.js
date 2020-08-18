
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;

const categoriaSchema = new Schema({

    usuario: {
        type: Schema.ObjectId, ref: 'Usuario'
    },
    descripcion: {
        type: String,
        unique: true,
        required: [ true, 'La descripción es obligatoria' ]
    }

});

categoriaSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único' } );

module.exports = mongoose.model('Categoria', categoriaSchema);