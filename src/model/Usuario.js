const mongoose = require('mongoose');

const UserModel = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    contato: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('usuarios', UserModel);