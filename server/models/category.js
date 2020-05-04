const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let Category = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    user: {
        type: String,
        ref: 'User'
    }
});

//Se utiliza el mongoose-unique-validator para generar la misma estructura de mensaje de error
Category.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Category', Category);